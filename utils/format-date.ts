import dayjs from "dayjs";

type FormatDateArgs = {
  date: Date;
  format?: "DD.MM.YY" | "DD.MM.YY HH:mm" | "DD.MM.YY HH:mm:ss" | "YYYY";
};

export default function formatDate({
  date,
  format = "DD.MM.YY",
}: FormatDateArgs) {
  return dayjs(new Date(date)).format(format);
}
