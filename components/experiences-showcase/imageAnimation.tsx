import gsap from "gsap";

type AnimationTarget = gsap.TweenTarget;
type AnimationOptions = {
    duration?: number;
    ease?: string;
    offset?: gsap.Position; 
    distance?: number; 
}

const DEFAULTS = {
    duration: 0.8,
    ease: "power3.out",
    distance: 80,
};


export function fadeInFromTop(
    timeline: gsap.core.Timeline,
    target: AnimationTarget,
    options: AnimationOptions,
) {
    const { duration = DEFAULTS.duration, ease = DEFAULTS.ease, distance = DEFAULTS.distance, offset = 0 } = options;

    timeline.fromTo(
        target,
        { y: -distance, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration, ease },
        offset
      );
}


export function fadeInFromBottom(
    timeline: gsap.core.Timeline,
    target: AnimationTarget,
    options: AnimationOptions,
) {
    const { duration = DEFAULTS.duration, ease = DEFAULTS.ease, distance = DEFAULTS.distance, offset = 0 } = options;

    timeline.fromTo(
        target,
        { y: distance, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration, ease },
        offset
      );
}

export function fadeInFromLeft(
    timeline: gsap.core.Timeline,
    target: AnimationTarget,
    options: AnimationOptions,
) {
    const { duration = DEFAULTS.duration, ease = DEFAULTS.ease, distance = DEFAULTS.distance, offset = 0 } = options;

    timeline.fromTo(
        target,
        { x: -distance, autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1, duration, ease },
        offset
      );
}

export function fadeInFromRight(
    timeline: gsap.core.Timeline,
    target: AnimationTarget,
    options: AnimationOptions,
) {
    const { duration = DEFAULTS.duration, ease = DEFAULTS.ease, distance = DEFAULTS.distance, offset = 0 } = options;

    timeline.fromTo(
        target,
        { x: distance, autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1, duration, ease },
        offset
      );
}