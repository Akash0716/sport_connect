import prisma from '../config/db.js';
import { isPastSession } from '../utils/dateUtils.js';

export const getSessions = async (req, res, next) => {
  try {
    const { search, sportId, date, status, sort = 'asc' } = req.query;

    const where = {};

    if (sportId) {
      where.sportId = sportId;
    }

    if (date) {
      where.date = date;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { venue: { contains: search } },
        { sport: { name: { contains: search } } },
      ];
    }

    const orderBy = [];
    if (sort === 'desc') {
      orderBy.push({ date: 'desc' }, { startTime: 'desc' });
    } else {
      orderBy.push({ date: 'asc' }, { startTime: 'asc' });
    }

    const sessions = await prisma.sportSession.findMany({
      where,
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy,
    });

    // Compute dynamic fields (isPast, remainingSlots)
    const formattedSessions = sessions.map((session) => {
      const isPast = isPastSession(session.date, session.startTime);
      const joinedCount = session.participants.length;
      const totalSlots = session.additionalPlayersNeeded + 1; // creator + needed
      const remainingSlots = Math.max(0, totalSlots - joinedCount);

      return {
        ...session,
        isPast,
        joinedCount,
        totalSlots,
        remainingSlots,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedSessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.sportSession.findUnique({
      where: { id },
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sport session not found.',
      });
    }

    const isPast = isPastSession(session.date, session.startTime);
    const joinedCount = session.participants.length;
    const totalSlots = session.additionalPlayersNeeded + 1;
    const remainingSlots = Math.max(0, totalSlots - joinedCount);

    res.status(200).json({
      success: true,
      data: {
        ...session,
        isPast,
        joinedCount,
        totalSlots,
        remainingSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const { sportId, date, startTime, venue, additionalPlayersNeeded } = req.body;
    const userId = req.user.id;

    // Rule 1: Check if date/time is in the past
    if (isPastSession(date, startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create a session in the past. Please select a future date and time.',
      });
    }

    // Rule 2: Verify sport exists
    const sport = await prisma.sport.findUnique({ where: { id: sportId } });
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Selected sport does not exist.',
      });
    }

    // Rule 3: Time collision check for creator
    const existingCollision = await prisma.sportSession.findFirst({
      where: {
        date,
        startTime,
        status: { not: 'CANCELLED' },
        participants: {
          some: { userId },
        },
      },
      include: { sport: true },
    });

    if (existingCollision) {
      return res.status(400).json({
        success: false,
        message: `Time Collision: You are already participating in a ${existingCollision.sport.name} session on ${date} at ${startTime}.`,
      });
    }

    // Create session and auto-join creator as participant
    const newSession = await prisma.sportSession.create({
      data: {
        sportId,
        createdBy: userId,
        date,
        startTime,
        venue,
        additionalPlayersNeeded: parseInt(additionalPlayersNeeded, 10),
        status: 'OPEN',
        participants: {
          create: {
            userId,
          },
        },
      },
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sport session created successfully!',
      data: newSession,
    });
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await prisma.sportSession.findUnique({
      where: { id },
      include: {
        sport: true,
        participants: true,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    // Check CANCELLED
    if (session.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot join a cancelled session.',
      });
    }

    // Check PAST
    if (isPastSession(session.date, session.startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot join a session that has already passed.',
      });
    }

    // Check DUPLICATE JOIN
    const alreadyJoined = session.participants.some((p) => p.userId === userId);
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this session.',
      });
    }

    // Check CAPACITY (total slots = additionalPlayersNeeded + 1)
    const totalSlots = session.additionalPlayersNeeded + 1;
    if (session.participants.length >= totalSlots || session.status === 'FULL') {
      return res.status(400).json({
        success: false,
        message: 'Session is full. No remaining slots available.',
      });
    }

    // Check TIME COLLISION
    const collision = await prisma.sportSession.findFirst({
      where: {
        date: session.date,
        startTime: session.startTime,
        status: { not: 'CANCELLED' },
        participants: {
          some: { userId },
        },
      },
      include: { sport: true },
    });

    if (collision) {
      return res.status(400).json({
        success: false,
        message: `Time Collision Guard: You are already joined in another ${collision.sport.name} session at ${session.date} ${session.startTime}.`,
      });
    }

    // Add participant
    await prisma.sessionParticipant.create({
      data: {
        sessionId: id,
        userId,
      },
    });

    // If new participant count equals total slots, update status to FULL
    const newParticipantCount = session.participants.length + 1;
    if (newParticipantCount >= totalSlots) {
      await prisma.sportSession.update({
        where: { id },
        data: { status: 'FULL' },
      });
    }

    const updatedSession = await prisma.sportSession.findUnique({
      where: { id },
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully joined the session!',
      data: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user.id;

    const session = await prisma.sportSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    // Only session creator can cancel it
    if (session.createdBy !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the creator of the session can cancel it.',
      });
    }

    if (session.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This session is already cancelled.',
      });
    }

    const updatedSession = await prisma.sportSession.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: cancellationReason.trim(),
      },
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Session has been cancelled successfully.',
      data: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await prisma.sportSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    if (session.createdBy !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this session.',
      });
    }

    await prisma.sportSession.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCreatedSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.sportSession.findMany({
      where: { createdBy: userId },
      include: {
        sport: true,
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    });

    const formatted = sessions.map((session) => {
      const isPast = isPastSession(session.date, session.startTime);
      const joinedCount = session.participants.length;
      const totalSlots = session.additionalPlayersNeeded + 1;
      return {
        ...session,
        isPast,
        joinedCount,
        totalSlots,
        remainingSlots: Math.max(0, totalSlots - joinedCount),
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJoinedSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const participations = await prisma.sessionParticipant.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            sport: true,
            creator: { select: { id: true, name: true, email: true } },
            participants: {
              include: { user: { select: { id: true, name: true, email: true } } },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const sessions = participations.map((p) => {
      const session = p.session;
      const isPast = isPastSession(session.date, session.startTime);
      const joinedCount = session.participants.length;
      const totalSlots = session.additionalPlayersNeeded + 1;
      return {
        ...session,
        isPast,
        joinedCount,
        totalSlots,
        remainingSlots: Math.max(0, totalSlots - joinedCount),
      };
    });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};
