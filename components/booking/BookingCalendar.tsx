"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  isDateFullyBlockedByBlocker,
  type BookingBlockerRecord
} from "@/lib/services/blackoutDate.services";
import { typography } from "@/lib/typography";

type BookingCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  bookingBlockers: BookingBlockerRecord[];
};

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function monthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

export default function BookingCalendar({
  selectedDate,
  onSelectDate,
  bookingBlockers
}: BookingCalendarProps) {
  const { t, i18n } = useTranslation();
  const today = useMemo(() => startOfDay(new Date()), []);
  const minViewMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const maxViewMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 1, 1), [today]);
  const latestBookableDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 2, 0),
    [today]
  );
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language === "zh-TW" ? "zh-HK" : "en-HK", {
        month: "long",
        year: "numeric"
      }).format(viewMonth),
    [i18n.language, viewMonth]
  );

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = firstDayOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [viewMonth]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const day = startOfDay(selectedDate);
    const isOutsideBookableWindow = day < today || day > latestBookableDate;
    const isSelectedBlocked = bookingBlockers.some((blocker) =>
      isDateFullyBlockedByBlocker(selectedDate, blocker)
    );

    if (isOutsideBookableWindow || isSelectedBlocked) {
      onSelectDate(null);
    }
  }, [bookingBlockers, latestBookableDate, onSelectDate, selectedDate, today]);

  const canGoPrev = monthIndex(viewMonth) > monthIndex(minViewMonth);
  const canGoNext = monthIndex(viewMonth) < monthIndex(maxViewMonth);

  const goPrevMonth = () => {
    if (!canGoPrev) {
      return;
    }
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    if (!canGoNext) {
      return;
    }
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#141418] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrevMonth}
          disabled={!canGoPrev}
          aria-label={t("booking.calendar.prevMonth")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.41 0Z" />
          </svg>
        </button>
        <p className={`${typography.button} text-white/95`}>{monthLabel}</p>
        <button
          type="button"
          onClick={goNextMonth}
          disabled={!canGoNext}
          aria-label={t("booking.calendar.nextMonth")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M9.3 5.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.59 11 9.3 6.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_KEYS.map((key) => (
          <div
            key={key}
            className={`${typography.caption} py-2 text-center ${key === "sun" ? "text-[#b3201d]" : "text-white/45"}`}
          >
            {t(`booking.calendar.weekdays.${key}`)}
          </div>
        ))}

        {calendarDays.map((date) => {
          const inCurrentMonth = date.getMonth() === viewMonth.getMonth();
          const day = startOfDay(date);
          const isPast = day < today;
          const isOutsideBookableWindow = day > latestBookableDate;
          const isBlocked = bookingBlockers.some((blocker) =>
            isDateFullyBlockedByBlocker(date, blocker)
          );
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);
          const isSunday = date.getDay() === 0;
          const disabled = !inCurrentMonth || isPast || isOutsideBookableWindow || isBlocked;

          let dayClass = "relative flex h-10 items-center justify-center rounded-full text-sm transition-colors duration-200 sm:h-11 ";

          if (isSelected) {
            dayClass += "bg-[#b3201d] font-medium text-white hover:bg-[#ca2a26]";
          } else if (disabled) {
            if (isBlocked && inCurrentMonth && !isPast) {
              dayClass += "cursor-not-allowed text-white/28 line-through decoration-white/40";
            } else if (isSunday) {
              dayClass += "cursor-not-allowed text-[#b3201d]/22";
            } else {
              dayClass += "cursor-not-allowed text-white/18";
            }
          } else if (isSunday) {
            dayClass += "text-[#b3201d] hover:bg-[#b3201d]/10";
          } else if (isToday && inCurrentMonth) {
            dayClass += "text-[#e8cb75] hover:bg-white/6";
          } else {
            dayClass += "text-white/88 hover:bg-white/6";
          }

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              aria-label={
                isBlocked && inCurrentMonth && !isPast
                  ? t("booking.calendar.blockedDate", { date: date.getDate() })
                  : undefined
              }
              onClick={() => onSelectDate(date)}
              className={dayClass}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
