import dayjs from "dayjs";

export function formatDateRange(startDate: string, endDate?: string | null) {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!endDate) {
    return dateTimeFormat.format(dayjs(startDate).toDate());
  }

  return dateTimeFormat.formatRange(
    dayjs(startDate).toDate(),
    dayjs(endDate).toDate()
  );
}
