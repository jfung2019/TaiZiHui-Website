"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type SubmitEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useWebContent } from "@/components/WebContentProvider";
import BookingCalendar from "@/components/booking/BookingCalendar";
import {
  BOOKING_BUDGET_MAX,
  BOOKING_BUDGET_MIN,
  BOOKING_BUDGET_STEP,
  BOOKING_DINNER_SLOTS,
  BOOKING_GUEST_COUNTS,
  BOOKING_HK_TEL_LENGTH,
  BOOKING_HK_TEL_REGEX,
  BOOKING_LARGE_GROUP_MAX,
  BOOKING_LARGE_GROUP_MIN,
  BOOKING_LUNCH_SLOTS,
  BOOKING_INGREDIENT_PAGE_SIZE,
  BOOKING_PREORDER_PAGE_SIZE,
  type BookingMealPeriod
} from "@/lib/booking.config";
import { createBookingFromBackend } from "@/lib/services/createBooking.service";
import { typography } from "@/lib/typography";
import { 
  fetchPreOrderRequiredItemsFromBackend,
  type MenuItemRecord,
  type MenuItemViewModel,
  toMenuItemViewModel,
  fetchIngredientsFromBackend,
  type IngredientRecord,
  type IngredientViewModel,
  toIngredientViewModel
} from "@/lib/services/mediaLoader.service";

type BookingFormState = {
  name: string;
  tel: string;
  guests: number | null;
  date: Date | null;
  mealPeriod: BookingMealPeriod;
  timeSlot: string | null;
  preOrderIds: string[];
  ingredientIds: string[];
  budget: number;
  specialRequests: string;
  allergy: string;
};

const initialFormState: BookingFormState = {
  name: "",
  tel: "",
  guests: null,
  date: null,
  mealPeriod: "dinner",
  timeSlot: null,
  preOrderIds: [],
  ingredientIds: [],
  budget: 1800,
  specialRequests: "",
  allergy: ""
};

function resolveLocale(language: string) {
  return language === "zh-TW" ? "zh-TW" : "en";
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h2 className={`${typography.button} text-white/95`}>{title}</h2>
    </div>
  );
}

function formatBudget(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "zh-TW" ? "zh-HK" : "en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0
  }).format(value);
}

function normalizeHkTelInput(value: string) {
  return value.replace(/\D/g, "").slice(0, BOOKING_HK_TEL_LENGTH);
}

function isValidHkTel(tel: string) {
  return BOOKING_HK_TEL_REGEX.test(tel);
}

export default function BookingPageContent() {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const [form, setForm] = useState<BookingFormState>(initialFormState);
  const [preOrderPage, setPreOrderPage] = useState(0);
  const [ingredientPage, setIngredientPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [customGuestInput, setCustomGuestInput] = useState("");
  const [customGuestError, setCustomGuestError] = useState(false);
  const [telTouched, setTelTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [preOrderRecords, setPreOrderRecords] = useState<MenuItemRecord[]>([]);
  const [ingredientRecords, setIngredientRecords] = useState<IngredientRecord[]>([]);
  const { text } = useWebContent();
  const isLargeGroupSelected = form.guests !== null && form.guests >= BOOKING_LARGE_GROUP_MIN;

  const timeSlots = form.mealPeriod === "lunch" ? BOOKING_LUNCH_SLOTS : BOOKING_DINNER_SLOTS;

  const preOrderItems = useMemo<MenuItemViewModel[]>(
    () => preOrderRecords.map((item) => toMenuItemViewModel(item, locale)),
    [preOrderRecords, locale]
  );

  const ingredientItems = useMemo<IngredientViewModel[]>(
    () => ingredientRecords.map((item) => toIngredientViewModel(item, locale)),
    [ingredientRecords, locale]
  );

  const preOrderPageCount = Math.max(1, Math.ceil(preOrderItems.length / BOOKING_PREORDER_PAGE_SIZE));
  const ingredientPageCount = Math.max(1, Math.ceil(ingredientItems.length / BOOKING_INGREDIENT_PAGE_SIZE));

  const visiblePreOrderItems = useMemo(() => {
    const start = preOrderPage * BOOKING_PREORDER_PAGE_SIZE;
    return preOrderItems.slice(start, start + BOOKING_PREORDER_PAGE_SIZE);
  }, [preOrderPage, preOrderItems]);

  const visibleIngredients = useMemo(() => {
    const start = ingredientPage * BOOKING_INGREDIENT_PAGE_SIZE;
    return ingredientItems.slice(start, start + BOOKING_INGREDIENT_PAGE_SIZE);
  }, [ingredientPage, ingredientItems]);

  const preOrderLabelById = useMemo(
    () => Object.fromEntries(preOrderItems.map((item) => [item.id, item.name])),
    [preOrderItems]
  );

  const ingredientLabelById = useMemo(
    () => Object.fromEntries(ingredientItems.map((item) => [item.id, item.name])),
    [ingredientItems]
  );

  const togglePreOrder = (id: string) => {
    setForm((current) => ({
      ...current,
      preOrderIds: current.preOrderIds.includes(id)
        ? current.preOrderIds.filter((itemId) => itemId !== id)
        : [...current.preOrderIds, id]
    }));
  };

  const toggleIngredient = (id: string) => {
    setForm((current) => ({
      ...current,
      ingredientIds: current.ingredientIds.includes(id)
        ? current.ingredientIds.filter((itemId) => itemId !== id)
        : [...current.ingredientIds, id]
    }));
  };

  const openGuestModal = () => {
    setCustomGuestInput(isLargeGroupSelected && form.guests !== null ? String(form.guests) : "");
    setCustomGuestError(false);
    setIsGuestModalOpen(true);
  };

  const closeGuestModal = () => {
    setIsGuestModalOpen(false);
    setCustomGuestError(false);
  };

  const closeSuccessModal = () => {
    setSubmitSuccess(false);
  };

  const confirmCustomGuests = () => {
    const value = Number(customGuestInput);

    if (!Number.isInteger(value) || value < BOOKING_LARGE_GROUP_MIN || value > BOOKING_LARGE_GROUP_MAX) {
      setCustomGuestError(true);
      return;
    }

    setForm((current) => ({ ...current, guests: value }));
    closeGuestModal();
  };

  const isTelValid = isValidHkTel(form.tel);
  const showTelError = (telTouched || submitted) && !isTelValid;

  const isFormValid =
    form.name.trim().length > 0 &&
    isTelValid &&
    form.guests !== null &&
    form.date !== null &&
    form.timeSlot !== null;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTelTouched(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isFormValid || !form.date || !form.timeSlot || form.guests === null) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createBookingFromBackend({
        name: form.name,
        tel: form.tel,
        bookingDate: form.date,
        timeSlot: form.timeSlot,
        mealPeriod: form.mealPeriod,
        numberOfCustomers: form.guests,
        preOrderLabels: form.preOrderIds.map((id) => preOrderLabelById[id] ?? id),
        ingredientLabels: form.ingredientIds.map((id) => ingredientLabelById[id] ?? id),
        specialRequests: form.specialRequests,
        allergy: form.allergy,
        budget: form.budget
      });

      setSubmitSuccess(true);
      setForm(initialFormState);
      setPreOrderPage(0);
      setIngredientPage(0);
      setSubmitted(false);
      setTelTouched(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("booking.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetchPreOrderRequiredItemsFromBackend()
      .then((items) => {
        if (!cancelled) {
          setPreOrderRecords(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreOrderRecords([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchIngredientsFromBackend()
      .then((items) => {
        if (!cancelled) {
          setIngredientRecords(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIngredientRecords([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#e8cb75]/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-white/4 blur-3xl"
      />

      <section className="relative border-b border-white/10 pt-30 pb-8 sm:pt-28 sm:pb-10">
        <div className="mx-auto max-w-[760px] px-6">
          <p className={`${typography.eyebrow} text-[#e8cb75]/85`}>{text("booking_eyebrow", "booking.eyebrow")}</p>
          <h1 className={`${typography.sectionTitle} mt-3 text-white/95`}>{text("booking_title", "booking.title")}</h1>
          <p className={`${typography.paragraph} mt-4 max-w-[52ch] text-white/72`}>{text("booking_description", "booking.description")}</p>
        </div>
      </section>

      <section className="relative pb-24 pt-6 sm:pb-28">
        <form onSubmit={handleSubmit} className="mx-auto max-w-[760px] space-y-8 px-6">
          {/* Contact */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.contact.title")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={`${typography.caption} text-[#e8cb75]/90`}>{t("booking.fields.name")}</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder={t("booking.placeholders.name")}
                  className="mt-2 w-full border-b border-white/18 bg-transparent py-3 text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#e8cb75]/70"
                />
              </label>
              <label className="block">
                <span className={`${typography.caption} text-[#e8cb75]/90`}>{t("booking.fields.tel")}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={BOOKING_HK_TEL_LENGTH}
                  value={form.tel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tel: normalizeHkTelInput(event.target.value) }))
                  }
                  onBlur={() => setTelTouched(true)}
                  placeholder={t("booking.placeholders.tel")}
                  aria-invalid={showTelError}
                  aria-describedby={showTelError ? "booking-tel-error" : undefined}
                  className={[
                    "mt-2 w-full border-b bg-transparent py-3 text-white outline-none transition-colors duration-200 placeholder:text-white/35",
                    showTelError ? "border-[#ffb4b0]/70 focus:border-[#ffb4b0]" : "border-white/18 focus:border-[#e8cb75]/70"
                  ].join(" ")}
                />
                {showTelError ? (
                  <p id="booking-tel-error" className={`${typography.caption} mt-2 normal-case text-[#ffb4b0]`}>
                    {t("booking.fields.telError")}
                  </p>
                ) : null}
              </label>
            </div>
          </div>

          {/* Guests */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.guests.title")} />
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {BOOKING_GUEST_COUNTS.map((count) => {
                const selected = form.guests === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, guests: count }))}
                    className={[
                      "flex h-[72px] min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl border transition-colors duration-200",
                      selected
                        ? "border-[#b3201d] bg-[#b3201d] text-white"
                        : "border-white/12 bg-[#141418] text-white/88 hover:border-white/25"
                    ].join(" ")}
                  >
                    <span className="text-lg font-medium leading-none">{count}</span>
                    <span className={`${typography.caption} mt-1 ${selected ? "text-white/85" : "text-white/45"}`}>
                      {t("booking.guestUnit")}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={openGuestModal}
                className={[
                  "flex h-[72px] min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl border transition-colors duration-200",
                  isLargeGroupSelected
                    ? "border-[#b3201d] bg-[#b3201d] text-white"
                    : "border-[#b3201d] bg-[#141418] text-[#b3201d] hover:bg-[#b3201d]/12"
                ].join(" ")}
              >
                <span className="text-lg font-medium leading-none">
                  {isLargeGroupSelected ? form.guests : t("booking.largeGroupLabel")}
                </span>
                <span
                  className={`${typography.caption} mt-1 normal-case ${isLargeGroupSelected ? "text-white/85" : "text-[#b3201d]/75"}`}
                >
                  {t("booking.guestUnit")}
                </span>
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.date.title")} />
            <BookingCalendar
              selectedDate={form.date}
              onSelectDate={(date) => setForm((current) => ({ ...current, date }))}
            />
          </div>

          {/* Time */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.time.title")} />
            <div className="mb-5 inline-flex rounded-full border border-white/12 bg-[#141418] p-1">
              {(["lunch", "dinner"] as const).map((period) => {
                const selected = form.mealPeriod === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        mealPeriod: period,
                        timeSlot: null
                      }))
                    }
                    className={[
                      "rounded-full px-5 py-2 transition-colors duration-200",
                      typography.button,
                      selected ? "bg-[#b3201d] text-white" : "text-white/65 hover:text-white/90"
                    ].join(" ")}
                  >
                    {t(`booking.time.${period}`)}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {timeSlots.map((slot) => {
                const selected = form.timeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, timeSlot: slot }))}
                    className={[
                      "relative rounded-xl border px-3 py-3 text-sm transition-colors duration-200 sm:py-3.5",
                      selected
                        ? "border-[#b3201d] bg-[#b3201d]/12 text-[#ffb4b0]"
                        : "border-white/12 bg-[#141418] text-white/85 hover:border-white/25"
                    ].join(" ")}
                  >
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e8cb75]"
                      />
                    ) : null}
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pre-order */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.preOrder.title")} />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreOrderPage((current) => Math.max(0, current - 1))}
                disabled={preOrderPage === 0}
                aria-label={t("booking.preOrder.prevPage")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.41 0Z" />
                </svg>
              </button>

              <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-3">
                {visiblePreOrderItems.map((item) => {
                  const selected = form.preOrderIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePreOrder(item.id)}
                      className={[
                        "group rounded-xl border p-2 text-left transition-colors duration-200 sm:p-2.5",
                        selected
                          ? "border-[#e8cb75]/75 bg-[#e8cb75]/8"
                          : "border-white/10 bg-[#141418] hover:border-white/22"
                      ].join(" ")}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg border border-[#e8cb75]/35 bg-black/40">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 30vw, 120px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className={`${typography.caption} mt-2 line-clamp-2 text-[#e8cb75]/95`}>
                        {item.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPreOrderPage((current) => Math.min(preOrderPageCount - 1, current + 1))}
                disabled={preOrderPage >= preOrderPageCount - 1}
                aria-label={t("booking.preOrder.nextPage")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M9.3 5.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.59 11 9.3 6.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </div>
            <p className={`${typography.caption} mt-3 text-white/45`}>
              {t("booking.preOrder.pageIndicator", { current: preOrderPage + 1, total: preOrderPageCount })}
            </p>
          </div>

          {/* Ingredients */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.ingredients.title")} />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIngredientPage((current) => Math.max(0, current - 1))}
                disabled={ingredientPage === 0}
                aria-label={t("booking.ingredients.prevPage")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.41 0Z" />
                </svg>
              </button>

              <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-3">
                {visibleIngredients.map((item) => {
                  const selected = form.ingredientIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleIngredient(item.id)}
                      className={[
                        "group rounded-xl border p-2 text-left transition-colors duration-200 sm:p-2.5",
                        selected
                          ? "border-[#e8cb75]/75 bg-[#e8cb75]/8"
                          : "border-white/10 bg-[#141418] hover:border-white/22"
                      ].join(" ")}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg border border-[#e8cb75]/35 bg-black/40">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 30vw, 120px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className={`${typography.caption} mt-2 text-[#e8cb75]/95`}>{item.name}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIngredientPage((current) => Math.min(ingredientPageCount - 1, current + 1))}
                disabled={ingredientPage >= ingredientPageCount - 1}
                aria-label={t("booking.ingredients.nextPage")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e8cb75] transition-colors duration-200 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M9.3 5.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.59 11 9.3 6.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </div>
            <p className={`${typography.caption} mt-3 text-white/45`}>
              {t("booking.ingredients.pageIndicator", { current: ingredientPage + 1, total: ingredientPageCount })}
            </p>
          </div>

          {/* Budget */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.budget.title")} />
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-medium text-[#e8cb75]">{formatBudget(form.budget, i18n.language)}</p>
              <p className={`${typography.caption} text-white/45`}>{t("booking.budget.perPerson")}</p>
            </div>
            <input
              type="range"
              min={BOOKING_BUDGET_MIN}
              max={BOOKING_BUDGET_MAX}
              step={BOOKING_BUDGET_STEP}
              value={form.budget}
              onChange={(event) => setForm((current) => ({ ...current, budget: Number(event.target.value) }))}
              className="booking-range mt-5 w-full"
              style={{
                ["--range-progress" as string]: `${((form.budget - BOOKING_BUDGET_MIN) / (BOOKING_BUDGET_MAX - BOOKING_BUDGET_MIN)) * 100}%`
              }}
              aria-label={t("booking.sections.budget.title")}
            />
            <div className={`${typography.caption} mt-2 flex justify-between text-white/45`}>
              <span>{formatBudget(BOOKING_BUDGET_MIN, i18n.language)}</span>
              <span>{t("booking.budget.premium")}</span>
              <span>{formatBudget(BOOKING_BUDGET_MAX, i18n.language)}+</span>
            </div>
          </div>

          {/* Special requests */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.specialRequests.title")} />
            <textarea
              value={form.specialRequests}
              onChange={(event) => setForm((current) => ({ ...current, specialRequests: event.target.value }))}
              rows={4}
              placeholder={t("booking.placeholders.specialRequests")}
              className="w-full resize-y rounded-xl border border-white/12 bg-[#141418] px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#e8cb75]/55"
            />
          </div>

          {/* Allergy */}
          <div className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <SectionHeader title={t("booking.sections.allergy.title")} />
            <textarea
              value={form.allergy}
              onChange={(event) => setForm((current) => ({ ...current, allergy: event.target.value }))}
              rows={3}
              placeholder={t("booking.placeholders.allergy")}
              className="w-full resize-y rounded-xl border border-white/12 bg-[#141418] px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#e8cb75]/55"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`${typography.button} flex w-full items-center justify-center gap-2 rounded-xl bg-[#b3201d] px-6 py-4 text-white transition-colors duration-200 hover:bg-[#ca2a26] disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm-1 14.59-3.3-3.29 1.42-1.42L11 13.17l4.88-4.88 1.42 1.42Z" />
              </svg>
              {isSubmitting ? t("booking.submitting") : t("booking.submit")}
            </button>
            <p className={`${typography.caption} mt-3 text-center text-white/45`}>{t("booking.submitHint")}</p>
            {submitError ? (
              <p className={`${typography.caption} mt-2 text-center text-[#ffb4b0]`}>{submitError}</p>
            ) : null}
            {submitted && !isFormValid ? (
              <p className={`${typography.caption} mt-2 text-center text-[#ffb4b0]`}>{t("booking.validationHint")}</p>
            ) : null}
          </div>
        </form>
      </section>

      {isGuestModalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
          role="presentation"
          onClick={closeGuestModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-modal-title"
            className="w-[min(100%,300px)] rounded-xl border border-white/12 bg-[#101014] px-7 py-8 shadow-2xl sm:w-[min(100%,320px)] sm:px-8 sm:py-9"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="guest-modal-title" className="px-1 text-base font-medium text-white/95">
              {t("booking.guestModal.title")}
            </h3>
            <p className={`${typography.paragraph} mt-4 px-1 normal-case text-white/72`}>
              {t("booking.guestModal.description")}
            </p>
            <label className="mt-6 block px-1">
              <span className={`${typography.caption} normal-case text-[#e8cb75]/90`}>{t("booking.guestModal.inputLabel")}</span>
              <input
                type="number"
                min={BOOKING_LARGE_GROUP_MIN}
                max={BOOKING_LARGE_GROUP_MAX}
                value={customGuestInput}
                onChange={(event) => {
                  setCustomGuestInput(event.target.value);
                  setCustomGuestError(false);
                }}
                placeholder={t("booking.guestModal.placeholder")}
                className="mt-3 w-full rounded-xl border border-white/12 bg-[#141418] px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#e8cb75]/55"
              />
            </label>
            {customGuestError ? (
              <p className={`${typography.caption} mt-3 px-1 normal-case text-[#ffb4b0]`}>{t("booking.guestModal.error")}</p>
            ) : null}
            <div className="mt-8 flex gap-3 px-1 pb-1">
              <button
                type="button"
                onClick={confirmCustomGuests}
                className={`${typography.button} flex-1 rounded-xl bg-[#b3201d] px-4 py-3 normal-case text-white transition-colors duration-200 hover:bg-[#ca2a26]`}
              >
                {t("booking.guestModal.confirm")}
              </button>
              <button
                type="button"
                onClick={closeGuestModal}
                className={`${typography.button} flex-1 rounded-xl border border-white/18 px-4 py-3 normal-case text-white/80 transition-colors duration-200 hover:bg-white/6`}
              >
                {t("booking.guestModal.cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {submitSuccess ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
          role="presentation"
          onClick={closeSuccessModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            className="w-[min(100%,340px)] rounded-xl border border-white/12 bg-[#101014] px-7 py-8 shadow-2xl sm:w-[min(100%,360px)] sm:px-8 sm:py-9"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center px-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8cb75]/15 text-[#e8cb75]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                  <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm-1 14.59-3.3-3.29 1.42-1.42L11 13.17l4.88-4.88 1.42 1.42Z" />
                </svg>
              </div>
            </div>
            <h3 id="success-modal-title" className="mt-5 px-1 text-center text-base font-medium text-white/95">
              {t("booking.successModal.title")}
            </h3>
            <p className={`${typography.paragraph} mt-4 px-1 text-center normal-case text-white/72`}>
              {t("booking.successModal.description")}
            </p>
            <div className="mt-8 px-1 pb-1">
              <button
                type="button"
                onClick={closeSuccessModal}
                className={`${typography.button} w-full rounded-xl bg-[#b3201d] px-4 py-3 normal-case text-white transition-colors duration-200 hover:bg-[#ca2a26]`}
              >
                {t("booking.successModal.close")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
