import { useMantineTheme } from "@mantine/core";
import { DayModifiers } from "@mantine/dates";
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

export const useDayStyle = () => {
  const theme = useMantineTheme();

  return (date: Date, modifier: DayModifiers) =>
    dayjs(date).startOf("day").toISOString() ===
    dayjs(new Date()).startOf("day").toISOString()
      ? {
          backgroundColor:
            theme.colors.blue[modifier.inRange || modifier.selected ? 6 : 0],
        }
      : {};
};
