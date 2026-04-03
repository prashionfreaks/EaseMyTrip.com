import { useState, useEffect, useCallback } from 'react';
import { useTrips } from '../context/TripContext';
import { ChevronLeft, ChevronRight, Globe, RefreshCw, Sun, CalendarDays } from 'lucide-react';
import {
  format, parseISO, addMonths, subMonths,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, isWithinInterval,
  getDay, addDays, subDays, differenceInDays, isAfter, isSameDay,
} from 'date-fns';

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
];

// Hardcoded holidays for countries not supported by Nager.Date API (e.g. India).
// Festival dates (Holi, Diwali, Eid, etc.) vary yearly by lunar/Islamic calendar.
const HARDCODED_HOLIDAYS = {
  IN: {
    2025: [
      { date: '2025-01-01', name: "New Year's Day",       localName: 'नव वर्ष' },
      { date: '2025-01-14', name: 'Makar Sankranti / Pongal', localName: 'मकर संक्रांति' },
      { date: '2025-01-26', name: 'Republic Day',         localName: 'गणतंत्र दिवस' },
      { date: '2025-02-26', name: 'Maha Shivaratri',      localName: 'महाशिवरात्रि' },
      { date: '2025-03-14', name: 'Holi',                 localName: 'होली' },
      { date: '2025-03-31', name: 'Eid ul-Fitr',          localName: 'ईद उल-फितर' },
      { date: '2025-04-06', name: 'Ram Navami',           localName: 'राम नवमी' },
      { date: '2025-04-10', name: 'Mahavir Jayanti',      localName: 'महावीर जयंती' },
      { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti / Baisakhi', localName: 'अम्बेडकर जयंती / बैसाखी' },
      { date: '2025-04-18', name: 'Good Friday',          localName: 'गुड फ्राइडे' },
      { date: '2025-05-12', name: 'Buddha Purnima',       localName: 'बुद्ध पूर्णिमा' },
      { date: '2025-06-07', name: 'Eid ul-Adha (Bakrid)', localName: 'ईद उल-अजहा' },
      { date: '2025-07-06', name: 'Muharram',             localName: 'मुहर्रम' },
      { date: '2025-08-15', name: 'Independence Day',     localName: 'स्वतंत्रता दिवस' },
      { date: '2025-08-16', name: 'Janmashtami',          localName: 'जन्माष्टमी' },
      { date: '2025-09-05', name: 'Onam',                 localName: 'ओणम' },
      { date: '2025-10-02', name: 'Gandhi Jayanti',       localName: 'गांधी जयंती' },
      { date: '2025-10-02', name: 'Mahatma Gandhi Jayanti', localName: 'महात्मा गांधी जयंती' },
      { date: '2025-10-02', name: 'Dussehra',             localName: 'दशहरा' },
      { date: '2025-10-20', name: 'Diwali',               localName: 'दीपावली' },
      { date: '2025-11-05', name: 'Guru Nanak Jayanti',   localName: 'गुरु नानक जयंती' },
      { date: '2025-12-25', name: 'Christmas',            localName: 'क्रिसमस' },
    ],
    2026: [
      { date: '2026-01-01', name: "New Year's Day",       localName: 'नव वर्ष' },
      { date: '2026-01-14', name: 'Makar Sankranti / Pongal', localName: 'मकर संक्रांति' },
      { date: '2026-01-26', name: 'Republic Day',         localName: 'गणतंत्र दिवस' },
      { date: '2026-02-15', name: 'Maha Shivaratri',      localName: 'महाशिवरात्रि' },
      { date: '2026-03-03', name: 'Holi',                 localName: 'होली' },
      { date: '2026-03-20', name: 'Eid ul-Fitr',          localName: 'ईद उल-फितर' },
      { date: '2026-03-27', name: 'Ram Navami',           localName: 'राम नवमी' },
      { date: '2026-03-31', name: 'Mahavir Jayanti',      localName: 'महावीर जयंती' },
      { date: '2026-04-03', name: 'Good Friday',          localName: 'गुड फ्राइडे' },
      { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti / Baisakhi', localName: 'अम्बेडकर जयंती / बैसाखी' },
      { date: '2026-05-02', name: 'Buddha Purnima',       localName: 'बुद्ध पूर्णिमा' },
      { date: '2026-05-27', name: 'Eid ul-Adha (Bakrid)', localName: 'ईद उल-अजहा' },
      { date: '2026-06-26', name: 'Muharram',             localName: 'मुहर्रम' },
      { date: '2026-08-05', name: 'Janmashtami',          localName: 'जन्माष्टमी' },
      { date: '2026-08-15', name: 'Independence Day',     localName: 'स्वतंत्रता दिवस' },
      { date: '2026-08-25', name: 'Onam',                 localName: 'ओणम' },
      { date: '2026-10-02', name: 'Gandhi Jayanti',       localName: 'गांधी जयंती' },
      { date: '2026-10-19', name: 'Dussehra',             localName: 'दशहरा' },
      { date: '2026-11-08', name: 'Diwali',               localName: 'दीपावली' },
      { date: '2026-11-22', name: 'Guru Nanak Jayanti',   localName: 'गुरु नानक जयंती' },
      { date: '2026-12-25', name: 'Christmas',            localName: 'क्रिसमस' },
    ],
    2027: [
      { date: '2027-01-01', name: "New Year's Day",       localName: 'नव वर्ष' },
      { date: '2027-01-14', name: 'Makar Sankranti / Pongal', localName: 'मकर संक्रांति' },
      { date: '2027-01-26', name: 'Republic Day',         localName: 'गणतंत्र दिवस' },
      { date: '2027-02-20', name: 'Holi',                 localName: 'होली' },
      { date: '2027-03-10', name: 'Eid ul-Fitr',          localName: 'ईद उल-फितर' },
      { date: '2027-03-26', name: 'Good Friday',          localName: 'गुड फ्राइडे' },
      { date: '2027-04-14', name: 'Dr. Ambedkar Jayanti / Baisakhi', localName: 'अम्बेडकर जयंती / बैसाखी' },
      { date: '2027-05-17', name: 'Eid ul-Adha (Bakrid)', localName: 'ईद उल-अजहा' },
      { date: '2027-08-15', name: 'Independence Day',     localName: 'स्वतंत्रता दिवस' },
      { date: '2027-10-02', name: 'Gandhi Jayanti',       localName: 'गांधी जयंती' },
      { date: '2027-10-29', name: 'Diwali',               localName: 'दीपावली' },
      { date: '2027-12-25', name: 'Christmas',            localName: 'क्रिसमस' },
    ],
  },
  AE: {
    2025: [
      { date: '2025-01-01', name: "New Year's Day",     localName: "رأس السنة الميلادية" },
      { date: '2025-03-31', name: 'Eid Al Fitr',        localName: 'عيد الفطر' },
      { date: '2025-04-01', name: 'Eid Al Fitr Holiday', localName: 'عطلة عيد الفطر' },
      { date: '2025-04-02', name: 'Eid Al Fitr Holiday', localName: 'عطلة عيد الفطر' },
      { date: '2025-06-07', name: 'Arafat Day',         localName: 'يوم عرفة' },
      { date: '2025-06-08', name: 'Eid Al Adha',        localName: 'عيد الأضحى' },
      { date: '2025-06-09', name: 'Eid Al Adha Holiday', localName: 'عطلة عيد الأضحى' },
      { date: '2025-06-10', name: 'Eid Al Adha Holiday', localName: 'عطلة عيد الأضحى' },
      { date: '2025-06-27', name: 'Islamic New Year',   localName: 'رأس السنة الهجرية' },
      { date: '2025-09-04', name: "Prophet's Birthday", localName: 'المولد النبوي الشريف' },
      { date: '2025-12-01', name: 'Commemoration Day',  localName: 'يوم الشهيد' },
      { date: '2025-12-02', name: 'UAE National Day',   localName: 'اليوم الوطني' },
      { date: '2025-12-03', name: 'UAE National Day Holiday', localName: 'اليوم الوطني' },
    ],
    2026: [
      { date: '2026-01-01', name: "New Year's Day",     localName: "رأس السنة الميلادية" },
      { date: '2026-03-20', name: 'Eid Al Fitr',        localName: 'عيد الفطر' },
      { date: '2026-05-27', name: 'Eid Al Adha',        localName: 'عيد الأضحى' },
      { date: '2026-06-16', name: 'Islamic New Year',   localName: 'رأس السنة الهجرية' },
      { date: '2026-08-25', name: "Prophet's Birthday", localName: 'المولد النبوي الشريف' },
      { date: '2026-12-01', name: 'Commemoration Day',  localName: 'يوم الشهيد' },
      { date: '2026-12-02', name: 'UAE National Day',   localName: 'اليوم الوطني' },
    ],
  },
};

function isWeekendDay(date) {
  const d = getDay(date);
  return d === 0 || d === 6;
}

function detectLongWeekends(holidays) {
  const results = [];
  const holidaySet = new Set(holidays.map(h => h.date));

  holidays.forEach(holiday => {
    const date = parseISO(holiday.date);

    // Walk backward to find start of the consecutive off-days block
    let start = date;
    let prev = subDays(date, 1);
    while (isWeekendDay(prev) || holidaySet.has(format(prev, 'yyyy-MM-dd'))) {
      start = prev;
      prev = subDays(prev, 1);
    }

    // Walk forward to find end
    let end = date;
    let next = addDays(date, 1);
    while (isWeekendDay(next) || holidaySet.has(format(next, 'yyyy-MM-dd'))) {
      end = next;
      next = addDays(next, 1);
    }

    const days = differenceInDays(end, start) + 1;
    if (days >= 3) {
      const key = format(start, 'yyyy-MM-dd');
      if (!results.find(r => format(r.start, 'yyyy-MM-dd') === key)) {
        results.push({
          start,
          end,
          days,
          holiday: holiday.localName || holiday.name,
        });
      }
    }
  });

  return results.sort((a, b) => a.start - b.start);
}

export default function CalendarPage() {
  const { trips, activeTrip, updateTrip } = useTrips();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [country, setCountry] = useState('IN');
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [longWeekends, setLongWeekends] = useState([]);
  const [selectStart, setSelectStart] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const year = currentMonth.getFullYear();

  const fetchHolidays = useCallback(async (yr, cc) => {
    setLoading(true);
    setError('');

    // Use hardcoded data if available for this country/year
    const hardcoded = HARDCODED_HOLIDAYS[cc]?.[yr];
    if (hardcoded) {
      setHolidays(hardcoded);
      setLongWeekends(detectLongWeekends(hardcoded));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${yr}/${cc}`);
      if (res.status === 404) {
        // Country not supported by Nager.Date and no hardcoded fallback
        setError(`Holiday data for this country is not available for ${yr}. Try another country or year.`);
        setHolidays([]);
        setLongWeekends([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHolidays(data);
      setLongWeekends(detectLongWeekends(data));
    } catch {
      setError('Could not load holidays. Check your internet connection.');
      setHolidays([]);
      setLongWeekends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays(year, country);
  }, [year, country, fetchHolidays]);

  const holidayMap = new Map(holidays.map(h => [h.date, h]));

  // Build calendar grid (Mon–Sun)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // Compute selection preview range (while picking second date)
  const previewRange = selectStart && hoverDate
    ? { start: isAfter(hoverDate, selectStart) ? selectStart : hoverDate,
        end:   isAfter(hoverDate, selectStart) ? hoverDate  : selectStart }
    : null;

  function handleDayClick(date) {
    if (!activeTrip) return;
    if (!selectStart) {
      setSelectStart(date);
    } else {
      const start = isAfter(date, selectStart) ? selectStart : date;
      const end   = isAfter(date, selectStart) ? date : selectStart;
      updateTrip(activeTrip.id, {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate:   format(end,   'yyyy-MM-dd'),
      });
      setSelectStart(null);
      setHoverDate(null);
    }
  }

  function getDayInfo(date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const holiday = holidayMap.get(dateStr);
    const weekend = isWeekendDay(date);
    const inMonth = isSameMonth(date, currentMonth);
    const today = isToday(date);
    const longWeekend = longWeekends.find(lw =>
      isWithinInterval(date, { start: lw.start, end: lw.end })
    );
    const inTrip = activeTrip
      ? isWithinInterval(date, { start: parseISO(activeTrip.startDate), end: parseISO(activeTrip.endDate) })
      : false;
    const inPreview = previewRange
      ? isWithinInterval(date, { start: previewRange.start, end: previewRange.end })
      : false;
    const isSelectStart = selectStart && isSameDay(date, selectStart);
    return { dateStr, holiday, weekend, inMonth, today, longWeekend, inTrip, inPreview, isSelectStart };
  }

  const upcomingLongWeekends = longWeekends.filter(lw =>
    isAfter(lw.end, new Date()) || isSameDay(lw.end, new Date())
  ).slice(0, 8);

  const thisMonthHolidays = holidays.filter(h =>
    h.date.startsWith(format(currentMonth, 'yyyy-MM'))
  );

  const countryInfo = COUNTRIES.find(c => c.code === country);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Trip Calendar</h1>
          <p>Public holidays, long weekends &amp; group date planning</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Globe size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 30, paddingTop: 8, paddingBottom: 8, fontSize: 13, width: 'auto', cursor: 'pointer' }}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          {loading && <RefreshCw size={16} style={{ color: '#6b7280', animation: 'spin 1s linear infinite' }} />}
        </div>
      </div>

      <div className="page-body">
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { dot: '#2563eb', bg: '#dbeafe', label: 'Trip dates' },
            { dot: '#16a34a', bg: '#dcfce7', label: 'Public holiday' },
            { dot: '#dc2626', bg: 'transparent', label: 'Weekend', textColor: '#dc2626' },
            { dot: '#92400e', bg: '#fef3c7', label: 'Long weekend' },
          ].map(({ dot, bg, label, textColor }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: bg, border: `1.5px solid ${dot}`, flexShrink: 0 }} />
              <span style={{ color: textColor || '#6b7280' }}>{label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: '#2563eb', flexShrink: 0 }} />
            <span style={{ color: '#6b7280' }}>Today</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 20, alignItems: 'start' }}>
          {/* Calendar */}
          <div className="card">
            {/* Month navigation */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 10px' }}
              >
                <ChevronLeft size={16} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{format(currentMonth, 'MMMM yyyy')}</h2>
                {activeTrip && (
                  <p style={{ fontSize: 11, color: '#2563eb', marginTop: 2 }}>
                    Showing: {activeTrip.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 10px' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Date selection prompt */}
            {activeTrip && (
              <div style={{
                padding: '8px 20px',
                background: selectStart ? '#eff6ff' : '#f8fafc',
                borderBottom: '1px solid var(--border-light)',
                fontSize: 12,
                color: selectStart ? '#1d4ed8' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>
                  {selectStart
                    ? `Start: ${format(selectStart, 'MMM d')} — now click an end date`
                    : 'Click any date to set trip start date'}
                </span>
                {selectStart && (
                  <button
                    onClick={() => { setSelectStart(null); setHoverDate(null); }}
                    style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}

            <div style={{ padding: '12px 16px 16px' }}>
              {/* Day-of-week headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} style={{
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    color: d === 'Sat' || d === 'Sun' ? '#dc2626' : '#94a3b8',
                    padding: '4px 0',
                    textTransform: 'uppercase',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}
                onMouseLeave={() => setHoverDate(null)}
              >
                {gridDays.map(date => {
                  const { dateStr, holiday, weekend, inMonth, today, longWeekend, inTrip, inPreview, isSelectStart } = getDayInfo(date);

                  let bg = 'transparent';
                  let color = inMonth ? '#0f172a' : '#cbd5e1';
                  let fontWeight = 400;
                  let radius = 8;

                  if (longWeekend && inMonth) bg = '#fef3c7';
                  if (holiday && inMonth) { bg = '#dcfce7'; color = '#16a34a'; fontWeight = 600; }
                  if (inTrip && inMonth) { bg = '#dbeafe'; color = '#2563eb'; fontWeight = 600; }
                  if (inPreview && inMonth) { bg = '#bfdbfe'; color = '#1d4ed8'; fontWeight = 600; }
                  if (isSelectStart) { bg = '#2563eb'; color = 'white'; fontWeight = 700; radius = 10; }
                  if (weekend && inMonth && !holiday && !inTrip && !inPreview && !isSelectStart) color = '#dc2626';
                  if (today && !isSelectStart) { bg = '#2563eb'; color = 'white'; fontWeight = 700; radius = 10; }

                  const tooltip = holiday
                    ? (holiday.localName || holiday.name)
                    : longWeekend
                    ? `Long weekend: ${longWeekend.holiday} (${longWeekend.days} days)`
                    : inTrip
                    ? activeTrip?.name
                    : '';

                  const clickable = activeTrip && inMonth;

                  return (
                    <div
                      key={dateStr}
                      title={tooltip}
                      onClick={() => clickable && handleDayClick(date)}
                      onMouseEnter={() => selectStart && inMonth && setHoverDate(date)}
                      style={{
                        textAlign: 'center',
                        padding: '5px 2px',
                        borderRadius: radius,
                        background: bg,
                        color,
                        fontWeight,
                        fontSize: 13,
                        minHeight: 34,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: clickable ? 'pointer' : 'default',
                        position: 'relative',
                        transition: 'background 0.1s',
                      }}
                    >
                      {format(date, 'd')}
                      {holiday && inMonth && !today && !isSelectStart && (
                        <div style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: '#16a34a', marginTop: 2,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Holidays this month */}
            {thisMonthHolidays.length > 0 && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                  Holidays in {format(currentMonth, 'MMMM')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {thisMonthHolidays.map(h => (
                    <div key={h.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{h.localName || h.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{format(parseISO(h.date), 'EEE, MMM d')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', color: '#dc2626', fontSize: 13 }}>
                {error} <button onClick={() => fetchHolidays(year, country)} style={{ color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Retry</button>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Long weekends */}
            <div className="card">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sun size={15} style={{ color: '#d97706' }} />
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Long Weekends {year}
                  </p>
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {countryInfo?.flag} {countryInfo?.name}
                </p>
              </div>
              <div style={{ padding: '8px' }}>
                {loading ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Loading holidays…
                  </div>
                ) : upcomingLongWeekends.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <CalendarDays size={28} style={{ color: '#cbd5e1', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>No upcoming long weekends found.</p>
                  </div>
                ) : (
                  upcomingLongWeekends.map((lw, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentMonth(lw.start)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '10px 12px', borderRadius: 10,
                        background: '#fef9c3', border: '1px solid #fde68a',
                        marginBottom: 6, cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#fef08a'}
                      onMouseOut={e => e.currentTarget.style.background = '#fef9c3'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 15 }}>🌟</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                          {lw.days}-day weekend
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#78350f', fontWeight: 500, marginBottom: 2 }}>{lw.holiday}</p>
                      <p style={{ fontSize: 11, color: '#a16207' }}>
                        {format(lw.start, 'MMM d')} – {format(lw.end, 'MMM d, yyyy')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
