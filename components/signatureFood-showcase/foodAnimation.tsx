import gsap from "gsap";

type SlotName = "left" | "center" | "right";
type Direction = "left" | "right";

type CarouselItem = {
  id: string;
  el: HTMLElement;
};

type RotateOptions = {
  duration?: number;
  ease?: string;
};

const SLOT: Record<SlotName, gsap.TweenVars> = {
  left: { left: "12%", xPercent: -50, yPercent: -50, scale: 0.6, zIndex: 18, autoAlpha: 0.78 },
  center: { left: "50%", xPercent: -50, yPercent: -50, scale: 1, zIndex: 36, autoAlpha: 1 },
  right: { left: "88%", xPercent: -50, yPercent: -50, scale: 0.6, zIndex: 18, autoAlpha: 0.78 }
};

const DEFAULTS: Required<RotateOptions> = {
  duration: 1.5,
  ease: "power3.out"
};

export function setToSlot(target: HTMLElement, slot: SlotName) {
  gsap.set(target, SLOT[slot]);
}

export function tweenToSlot(
  tl: gsap.core.Timeline,
  target: HTMLElement,
  slot: SlotName,
  options: RotateOptions = {},
  at: gsap.Position = 0
) {
  const { duration, ease } = { ...DEFAULTS, ...options };
  tl.to(target, { ...SLOT[slot], duration, ease }, at);
}

/**
 * order = [leftId, centerId, rightId]
 * returns next order after rotation
 */
export function rotateTriplet(
  tl: gsap.core.Timeline,
  items: Record<string, CarouselItem>,
  order: [string, string, string],
  direction: Direction,
  options: RotateOptions = {}
): [string, string, string] {
  const [leftId, centerId, rightId] = order;
  const next: [string, string, string] =
    direction === "left"
      ? [centerId, rightId, leftId]
      : [rightId, leftId, centerId];

  const [nextLeft, nextCenter, nextRight] = next;

  // Optional: the item moving across back layer
  const backMoverId = direction === "left" ? leftId : rightId;
  gsap.set(items[backMoverId].el, { zIndex: 10 });

  tweenToSlot(tl, items[nextLeft].el, "left", options, 0);
  tweenToSlot(tl, items[nextCenter].el, "center", options, 0);
  tweenToSlot(tl, items[nextRight].el, "right", options, 0);

  // Restore center/top layering at end
  tl.set(items[nextCenter].el, { zIndex: 30 });

  return next;
}