import prisma from '../config/db.js';
import { getReportDateRange, isPastSession } from '../utils/dateUtils.js';

export const getOverviewStats = async (req, res, next) => {
  try {
    const totalSports = await prisma.sport.count();
    const totalSessions = await prisma.sportSession.count();
    const totalUsers = await prisma.user.count();

    const allSessions = await prisma.sportSession.findMany({
      select: { date: true, startTime: true, status: true },
    });

    let upcomingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    allSessions.forEach((s) => {
      if (s.status === 'CANCELLED') {
        cancelledCount++;
      } else {
        const isPast = isPastSession(s.date, s.startTime);
        if (isPast) {
          completedCount++;
        } else {
          upcomingCount++;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSports,
        totalSessions,
        totalUsers,
        upcomingSessions: upcomingCount,
        completedSessions: completedCount,
        cancelledSessions: cancelledCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { period = '30d', customStart, customEnd } = req.query;
    const { startDate, endDate } = getReportDateRange(period, customStart, customEnd);

    // Fetch all sports to compute full popularity distribution
    const sports = await prisma.sport.findMany({
      select: { id: true, name: true, icon: true },
    });

    // Fetch sessions created within date filter
    const sessions = await prisma.sportSession.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        sport: { select: { id: true, name: true } },
      },
    });

    // Map popularity per sport
    const sportPopularityMap = {};
    sports.forEach((sp) => {
      sportPopularityMap[sp.name] = { name: sp.name, sessionCount: 0 };
    });

    sessions.forEach((s) => {
      if (s.sport && sportPopularityMap[s.sport.name]) {
        sportPopularityMap[s.sport.name].sessionCount += 1;
      }
    });

    const sportPopularity = Object.values(sportPopularityMap).sort(
      (a, b) => b.sessionCount - a.sessionCount
    );

    // Breakdown by session status within period
    const statusBreakdown = {
      OPEN: 0,
      FULL: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    };

    sessions.forEach((s) => {
      if (s.status === 'CANCELLED') {
        statusBreakdown.CANCELLED++;
      } else {
        const isPast = isPastSession(s.date, s.startTime);
        if (isPast) {
          statusBreakdown.COMPLETED++;
        } else if (s.status === 'FULL') {
          statusBreakdown.FULL++;
        } else {
          statusBreakdown.OPEN++;
        }
      }
    });

    const statusChartData = [
      { name: 'Open', value: statusBreakdown.OPEN, color: '#10B981' },
      { name: 'Full', value: statusBreakdown.FULL, color: '#F59E0B' },
      { name: 'Completed', value: statusBreakdown.COMPLETED, color: '#3B82F6' },
      { name: 'Cancelled', value: statusBreakdown.CANCELLED, color: '#EF4444' },
    ];

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
        totalSessionsInPeriod: sessions.length,
        sportPopularity,
        statusChartData,
      },
    });
  } catch (error) {
    next(error);
  }
};
