// Thin dayjs-backed shim that mimics the small subset of the date-fns
// API the app actually uses. Replaces date-fns (~75 kB raw) with dayjs
// (~7 kB raw + a few small plugins) without rewriting every call site.
//
// The wrapper translates date-fns format tokens (yyyy, dd, EEEE, …) to
// dayjs tokens (YYYY, DD, dddd, …) at the format() boundary so call
// sites can stay unchanged. Format-token coverage is intentionally
// limited to what's used; if you need a new token, add it to
// `toDayjsFormat` below rather than passing a dayjs token directly.

import dayjs from 'dayjs';
import isToday_ from 'dayjs/plugin/isToday';
import isYesterday_ from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isToday_);
dayjs.extend(isYesterday_);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

// Translate date-fns format tokens → dayjs tokens. Order matters:
// `dd` and `\bd\b` must be processed BEFORE `EEEE → dddd` so the
// weekday-d's aren't accidentally uppercased.
function toDayjsFormat(fmt) {
  return fmt
    .replace(/yyyy/g, 'YYYY')
    .replace(/dd/g, 'DD')
    .replace(/\bd\b/g, 'D')
    .replace(/EEEE/g, 'dddd')
    .replace(/EEE/g, 'ddd');
}

export const format = (date, fmt) => dayjs(date).format(toDayjsFormat(fmt));

// date-fns parseISO returns a Date. dayjs() auto-parses ISO strings;
// .toDate() unwraps to the same Date type call sites expect.
export const parseISO = (s) => dayjs(s).toDate();

export const addDays    = (d, n) => dayjs(d).add(n, 'day').toDate();
export const subDays    = (d, n) => dayjs(d).subtract(n, 'day').toDate();
export const addMonths  = (d, n) => dayjs(d).add(n, 'month').toDate();
export const subMonths  = (d, n) => dayjs(d).subtract(n, 'month').toDate();

export const differenceInDays         = (a, b) => dayjs(a).diff(dayjs(b), 'day');
export const differenceInCalendarDays = (a, b) =>
  dayjs(a).startOf('day').diff(dayjs(b).startOf('day'), 'day');
export const differenceInMinutes      = (a, b) => dayjs(a).diff(dayjs(b), 'minute');

export const isToday      = (d) => dayjs(d).isToday();
export const isYesterday  = (d) => dayjs(d).isYesterday();
export const isPast       = (d) => dayjs(d).isBefore(dayjs());
export const isAfter      = (a, b) => dayjs(a).isAfter(dayjs(b));
export const isSameDay    = (a, b) => dayjs(a).isSame(dayjs(b), 'day');
export const isSameMonth  = (a, b) => dayjs(a).isSame(dayjs(b), 'month');
export const isWithinInterval = (d, { start, end }) =>
  dayjs(d).isBetween(dayjs(start), dayjs(end), null, '[]');

export const startOfMonth = (d) => dayjs(d).startOf('month').toDate();
export const endOfMonth   = (d) => dayjs(d).endOf('month').toDate();

// date-fns startOfWeek defaults to Sunday (weekStartsOn: 0); we mirror
// that contract so call sites can keep their `{ weekStartsOn }` opts.
export const startOfWeek = (d, opts = {}) => {
  const weekStartsOn = opts.weekStartsOn ?? 0;
  const dj = dayjs(d).startOf('day');
  let diff = dj.day() - weekStartsOn;
  if (diff < 0) diff += 7;
  return dj.subtract(diff, 'day').toDate();
};

export const endOfWeek = (d, opts = {}) =>
  dayjs(startOfWeek(d, opts)).add(6, 'day').endOf('day').toDate();

export const eachDayOfInterval = ({ start, end }) => {
  const days = [];
  let cur = dayjs(start).startOf('day');
  const last = dayjs(end).startOf('day');
  while (cur.isSameOrBefore(last, 'day')) {
    days.push(cur.toDate());
    cur = cur.add(1, 'day');
  }
  return days;
};

export const getDay = (d) => dayjs(d).day();
