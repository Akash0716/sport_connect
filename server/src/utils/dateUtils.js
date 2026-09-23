/**
 * Date and Time utilities for SportConnect business rules
 */

/**
 * Parses date (YYYY-MM-DD) and startTime (HH:mm) into a JavaScript Date object
 */
export const parseSessionDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

/**
 * Checks if the given session date and time has passed compared to current server time
 */
export const isPastSession = (dateStr, timeStr) => {
  const sessionDate = parseSessionDateTime(dateStr, timeStr);
  if (!sessionDate) return true;
  return sessionDate.getTime() < Date.now();
};

/**
 * Formats a Date object to YYYY-MM-DD
 */
export const formatDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns date range filter (startDate, endDate) for given report period alias
 */
export const getReportDateRange = (period, customStart, customEnd) => {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  if (period === '7d') {
    startDate.setDate(now.getDate() - 7);
  } else if (period === '30d') {
    startDate.setDate(now.getDate() - 30);
  } else if (period === '3m') {
    startDate.setMonth(now.getMonth() - 3);
  } else if (period === 'custom' && customStart && customEnd) {
    startDate = new Date(customStart);
    endDate = new Date(customEnd);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Default to last 30 days
    startDate.setDate(now.getDate() - 30);
  }

  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};
