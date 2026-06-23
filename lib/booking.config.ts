import { menuPageDishes } from "@/lib/menuPage.config";

export const BOOKING_GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const BOOKING_HK_TEL_LENGTH = 8;
export const BOOKING_HK_TEL_REGEX = /^\d{8}$/;

export const BOOKING_LARGE_GROUP_MIN = 13;
export const BOOKING_LARGE_GROUP_MAX = 50;

export const BOOKING_LUNCH_SLOTS = ["11:30", "12:00", "12:30", "13:00", "13:30", "14:00"] as const;

export const BOOKING_DINNER_SLOTS = [
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30"
] as const;

export const BOOKING_BUDGET_MIN = 200;
export const BOOKING_BUDGET_MAX = 3000;
export const BOOKING_BUDGET_STEP = 100;

export const BOOKING_PREORDER_PAGE_SIZE = 6;

export const bookingPreOrderItems = menuPageDishes;

export const BOOKING_INGREDIENT_PAGE_SIZE = 6;

export type BookingIngredientConfig = {
  id: string;
  imageSrc: string;
};

export const bookingIngredients: BookingIngredientConfig[] = [
  { id: "driedAbalone", imageSrc: "/ingredients_booking/abalone.webp" },
  { id: "fish", imageSrc: "/ingredients_booking/fish.webp" },
  { id: "sharkFin", imageSrc: "/ingredients_booking/fin.webp" },
  { id: "shrimp", imageSrc: "/ingredients_booking/shrimp.webp" },
  { id: "crab", imageSrc: "/ingredients_booking/crab.webp" },
  { id: "beef", imageSrc: "/ingredients_booking/beef.webp" },
  { id: "chicken", imageSrc: "/ingredients_booking/chicken.webp" },
  { id: "goose", imageSrc: "/ingredients_booking/goose.webp" }
];

export type BookingMealPeriod = "lunch" | "dinner";
