/**
 * Menu showcase asset paths — swap these when final PNGs are ready.
 * background: replace with /menu-showcase/background.jpg (full spotlight scene)
 */
export type MenuIngredientConfig = {
  id: string;
  src: string;
  altKey: string;
  top: string;
  left: string;
  width: number;
  zIndex: number;
  /** Parallax depth multiplier (0–1). Higher = travels farther. */
  depth: number;
  /** Follow speed (0.4–1.4). Higher = reacts faster to mouse. */
  motionSpeed: number;
  blurPx?: number;
};

export const menuShowcaseAssets = {
  background: "/placeholders/background_see_menu.jpeg",
  // heroDish: "/placeholders/6606_edited.png",
  // /** Center dish display size (px); responsive cap uses heroDishMaxVw. */
  // heroDishWidth: 884,
  // heroDishMaxVw: 96,
  /** Hide SVG seal ring when the background already includes pedestal geometry. */
  showSealGeometry: false
} as const;

/** Ingredient PNGs: /public/ingredients/ */
export const menuShowcaseIngredients: MenuIngredientConfig[] = [
  {
    id: "ingredient-1",
    src: "/ingredients/dried_abalone.png",
    altKey: "menuShowcase.ingredient1Alt",
    top: "54%",
    left: "3%",
    width: 280,
    zIndex: 5,
    depth: 0.9,
    motionSpeed: 1.1,
    blurPx: 0
  },
  {
    id: "ingredient-2",
    src: "/ingredients/tea_leaf_sprig.png",
    altKey: "menuShowcase.ingredient2Alt",
    top: "8%",
    left: "70%",
    width: 165,
    zIndex: 4,
    depth: 0.7,
    motionSpeed: 0.9,
    blurPx: 1.25
  },
  {
    id: "ingredient-3",
    src: "/ingredients/mandarin_orange_peel.png",
    altKey: "menuShowcase.ingredient3Alt",
    top: "14%",
    left: "10%",
    width: 200,
    zIndex: 3,
    depth: 0.75,
    motionSpeed: 0.6,
    blurPx: 0.35
  },
  {
    id: "ingredient-4",
    src: "/ingredients/star_anise.png",
    altKey: "menuShowcase.ingredient4Alt",
    top: "40%",
    left: "14%",
    width: 72,
    zIndex: 2,
    depth: 0.5,
    motionSpeed: 0.5,
    blurPx: 0.5
  },
  {
    id: "ingredient-5",
    src: "/ingredients/dried_ginseng.png",
    altKey: "menuShowcase.ingredient5Alt",
    top: "34%",
    left: "82%",
    width: 56,
    zIndex: 2,
    depth: 0.45,
    motionSpeed: 1.2,
    blurPx: 0.75
  }
];

/** Base lerp factor for pointer follow; multiplied by each ingredient's motionSpeed. */
export const MENU_PARALLAX_BASE_LERP = 0.09;

/** Max parallax shift in pixels (desktop). */
export const MENU_PARALLAX_MAX_SHIFT = 26;

/** Hero dish uses a fraction of ingredient movement. */
export const MENU_HERO_PARALLAX_DEPTH = 0.18;

/** Hero follow speed (lower = slower, more anchored). */
export const MENU_HERO_MOTION_SPEED = 0.42;
