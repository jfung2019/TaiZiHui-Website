import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";

const BLACKOUT_DATES_ENDPOINT_PATH = "/api/v1/cms/booking-blockers";

export type BookingBlockerRecord = {
  id: number;
  start_date: string;
  end_date: string;
  block_type: "slot" | "custom_time";
  slot: "full" | "lunch" | "dinner" | null;
  start_time: string | null;
  end_time: string | null;
};

function formatDateParam(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateParam(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getCalendarVisibleDateRange(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridStart.getDate() + 41);

  return {
    fromDate: formatDateParam(gridStart),
    toDate: formatDateParam(gridEnd)
  };
}

export function isDateBlockedByBlocker(date: Date, blocker: BookingBlockerRecord) {
  const day = startOfDay(date).getTime();
  const start = startOfDay(parseDateParam(blocker.start_date)).getTime();
  const end = startOfDay(parseDateParam(blocker.end_date)).getTime();
  return day >= start && day <= end;
}

export function isDateFullyBlockedByBlocker(date: Date, blocker: BookingBlockerRecord) {
  return isDateBlockedByBlocker(date, blocker) && blocker.block_type === "slot" && blocker.slot === "full";
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

export function isTimeSlotBlockedByBlocker(
  date: Date,
  mealPeriod: "lunch" | "dinner",
  timeSlot: string,
  blocker: BookingBlockerRecord
) {
  if (!isDateBlockedByBlocker(date, blocker)) {
    return false;
  }

  if (blocker.block_type === "slot") {
    return blocker.slot === "full" || blocker.slot === mealPeriod;
  }

  if (!blocker.start_time || !blocker.end_time) {
    return false;
  }

  const slotMinutes = timeToMinutes(timeSlot);
  const startMinutes = timeToMinutes(blocker.start_time);
  const endMinutes = timeToMinutes(blocker.end_time);

  if (slotMinutes === null || startMinutes === null || endMinutes === null) {
    return false;
  }

  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
}

function parseBlockerRecord(raw: unknown): BookingBlockerRecord | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const id = typeof record.id === "number" ? record.id : null;
  const startDate = typeof record.start_date === "string" ? record.start_date : "";
  const endDate = typeof record.end_date === "string" ? record.end_date : "";
  const blockType = record.block_type === "slot" || record.block_type === "custom_time"
    ? record.block_type
    : null;
  const slot =
    record.slot === "full" || record.slot === "lunch" || record.slot === "dinner"
      ? record.slot
      : null;

  if (id === null || !startDate || !endDate || !blockType) {
    return null;
  }

  return {
    id,
    start_date: startDate,
    end_date: endDate,
    block_type: blockType,
    slot,
    start_time: typeof record.start_time === "string" ? record.start_time : null,
    end_time: typeof record.end_time === "string" ? record.end_time : null
  };
}

export async function fetchBlackoutDatesFromBackend(
  fromDate: string,
  toDate: string
): Promise<BookingBlockerRecord[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const endpointPath = joinApiUrl(baseUrl, BLACKOUT_DATES_ENDPOINT_PATH);
    const query = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate
    });
    const endpointUrl = `${endpointPath}?${query.toString()}`;

    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Blackout dates request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(parseBlockerRecord).filter((item): item is BookingBlockerRecord => item !== null);
  } catch (error) {
    console.error("[fetchBlackoutDatesFromBackend] Failed to fetch blackout dates:", error);
    return [];
  }
}
