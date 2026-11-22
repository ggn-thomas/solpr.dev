/**
 * Pixel masks for portrait screens, 12 cells wide; "#" is a black square.
 * Drawn for this app (the mockup only has the landscape mask). Instead of one
 * mask stretched over the hero, a cap sits at the top and one at the bottom:
 * cells stay square at any height and the photo shows in between.
 */
export const PORTRAIT_MASK_TOP: readonly string[] = [
  "############",
  "#####...####",
  "###......###",
  "##........##",
  "#..........#",
];

export const PORTRAIT_MASK_BOTTOM: readonly string[] = [
  "#..........#",
  "##........##",
  "##.......###",
  "####....####",
  "############",
];
