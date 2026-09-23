import prisma from '../config/db.js';

export const getSports = async (req, res, next) => {
  try {
    const sports = await prisma.sport.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: sports,
    });
  } catch (error) {
    next(error);
  }
};

export const createSport = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const adminId = req.user.id;

    // Check duplicate sports name
    const allSports = await prisma.sport.findMany({
      select: { name: true },
    });

    const isDuplicate = allSports.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `A sport named "${name}" already exists.`,
      });
    }

    const sport = await prisma.sport.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        icon: icon || 'Trophy',
        createdBy: adminId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { sessions: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Sport "${sport.name}" created successfully.`,
      data: sport,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const existingSport = await prisma.sport.findUnique({
      where: { id },
    });

    if (!existingSport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found.',
      });
    }

    if (name && name.toLowerCase() !== existingSport.name.toLowerCase()) {
      const allSports = await prisma.sport.findMany({ select: { id: true, name: true } });
      const duplicate = allSports.some(
        (s) => s.id !== id && s.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Sport name "${name}" is already taken.`,
        });
      }
    }

    const updatedSport = await prisma.sport.update({
      where: { id },
      data: {
        name: name ? name.trim() : existingSport.name,
        description: description !== undefined ? description.trim() : existingSport.description,
        icon: icon || existingSport.icon,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { sessions: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Sport updated successfully.',
      data: updatedSport,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sport = await prisma.sport.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found.',
      });
    }

    if (sport._count.sessions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${sport.name}" because it has ${sport._count.sessions} associated session(s).`,
      });
    }

    await prisma.sport.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Sport "${sport.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
