function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function differenceInDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  const diffInMs = end.getTime() - start.getTime();

  return Math.floor(diffInMs / 86400000);
}

module.exports = {
  toIsoDate,
  differenceInDays,
};
