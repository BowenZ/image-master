import dayjs from 'dayjs';

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: dayjs.ConfigType,
  format = DATE_TIME_FORMAT
): string {
  if (!date) {
    return '--';
  }
  return dayjs(date).isValid() ? dayjs(date).format(format) : '--';
}

export function formatToDate(
  date: dayjs.ConfigType,
  format = DATE_FORMAT
): string {
  if (!date) {
    return '--';
  }
  return dayjs(date).isValid() ? dayjs(date).format(format) : '--';
}

export function formatDateRange(array: string[]) {
  return array.map((item) => formatToDate(item));
}

export function formatDateToStartOfDay(date: string, format?: string): string {
  return dayjs(date).isValid()
    ? dayjs(date)
        .startOf('day')
        .format(format || DATE_TIME_FORMAT)
    : '-';
}

export function formatDateToEndOfDay(date: string, format?: string): string {
  return dayjs(date).isValid()
    ? dayjs(date)
        .endOf('day')
        .format(format || DATE_TIME_FORMAT)
    : '-';
}

export const dateUtil = dayjs;
