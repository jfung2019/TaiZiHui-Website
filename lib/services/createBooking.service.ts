import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";
import type { BookingMealPeriod } from "@/lib/booking.config";

const BOOKINGS_ENDPOINT_PATH = "/api/v1/website/bookings";

export type CreateBookingPayload = {
  name: string;
  tel: string;
  booking_date: string;
  number_of_customers: number;
  preferences: Record<string, unknown>;
  customer_order: string;
  customer_ingredients: string;
  customer_requests: string;
  customer_budget: number;
};

export type CreateBookingInput = {
  name: string;
  tel: string;
  bookingDate: Date;
  timeSlot: string;
  mealPeriod: BookingMealPeriod;
  numberOfCustomers: number;
  preOrderLabels: string[];
  ingredientLabels: string[];
  specialRequests: string;
  allergy: string;
  budget: number;
};

function buildBookingDateTime(date: Date, timeSlot: string) {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
  return datetime.toISOString();
}

function buildCustomerRequests(specialRequests: string, allergy: string) {
  const parts = [specialRequests.trim()];

  if (allergy.trim()) {
    parts.push(allergy.trim());
  }

  return parts.filter(Boolean).join("\n");
}

export function buildCreateBookingPayload(input: CreateBookingInput): CreateBookingPayload {
  return {
    name: input.name.trim(),
    tel: input.tel.trim(),
    booking_date: buildBookingDateTime(input.bookingDate, input.timeSlot),
    number_of_customers: input.numberOfCustomers,
    preferences: {},
    customer_order: input.preOrderLabels.join(", "),
    customer_ingredients: input.ingredientLabels.join(", "),
    customer_requests: buildCustomerRequests(input.specialRequests, input.allergy),
    customer_budget: input.budget
  };
}

export async function createBookingFromBackend(input: CreateBookingInput): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const endpointUrl = joinApiUrl(baseUrl, BOOKINGS_ENDPOINT_PATH);
  const body = buildCreateBookingPayload(input);

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let message = `Booking request failed: ${response.status}`;

    try {
      const errorPayload: unknown = await response.json();

      if (typeof errorPayload === "object" && errorPayload !== null) {
        const record = errorPayload as Record<string, unknown>;
        const detail = record.detail ?? record.message ?? record.error;

        if (typeof detail === "string" && detail.trim()) {
          message = detail.trim();
        }
      }
    } catch {
      // Keep default message when error body is not JSON.
    }

    throw new Error(message);
  }
}
