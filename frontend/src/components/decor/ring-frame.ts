// Ported from the mockup's "Ring background" artboard (Rings.dc.html).

/** Grid size in characters, and the projection constants of the mockup. */
const COLUMNS = 124;
const ROWS = 76;
const FOCAL = 1020;
const DISTANCE = 4;
const RING_RADIUS = 0.85;
const RING_OFFSET = 0.45;
/** From facing away from the light to facing it. */
const RAMP = "-=+X";
/** Light from the upper left, towards the viewer. */
const LIGHT = [-0.45, 0.6, -0.66] as const;
const TAU = 6.2832;

type Vec3 = [number, number, number];

/**
 * The pair turns slowly around the axis that joins the two centres and sways
 * left and right.
 */
function rotation(t: number): (x: number, y: number, z: number) => Vec3 {
  const a = t * 0.16;
  const b = 0.55 + 0.35 * Math.sin(t * 0.11);
  const c = 0.22;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  const [cb, sb] = [Math.cos(b), Math.sin(b)];
  const [cc, sc] = [Math.cos(c), Math.sin(c)];
  return (x, y, z) => {
    const y1 = y * ca - z * sa;
    const z1 = y * sa + z * ca;
    const x2 = x * cb + z1 * sb;
    const z2 = -x * sb + z1 * cb;
    return [x2 * cc - y1 * sc, x2 * sc + y1 * cc, z2];
  };
}

/**
 * One frame of two linked rings (thin tori) passing through each other, as
 * rows of "- = + X" characters joined by newlines. Brighter characters face
 * the light.
 * @param t Time; the mockup advances it by 0.07 every 70ms.
 * @param tube Thickness of each ring.
 */
export function ringFrame(t: number, tube = 0.06): string {
  const chars = new Array<string>(COLUMNS * ROWS).fill(" ");
  const depth = new Array<number>(COLUMNS * ROWS).fill(0);
  const turn = rotation(t);

  // flat: the ring lies in the XY plane, shifted left; otherwise in the XZ
  // plane, shifted right. Perpendicular planes and overlapping centres make
  // the two rings pass through each other like chain links.
  const drawRing = (flat: boolean) => {
    for (let th = 0; th < TAU; th += 0.03) {
      const [ct, st] = [Math.cos(th), Math.sin(th)];
      for (let ph = 0; ph < TAU; ph += 0.7) {
        const [cp, sp] = [Math.cos(ph), Math.sin(ph)];
        const u = (RING_RADIUS + tube * cp) * ct;
        const w = (RING_RADIUS + tube * cp) * st;
        const h = tube * sp;
        const p = flat
          ? turn(u - RING_OFFSET, w, h)
          : turn(u + RING_OFFSET, h, w);
        const n = flat
          ? turn(cp * ct, cp * st, sp)
          : turn(cp * ct, sp, cp * st);
        const ooz = 1 / (p[2] + DISTANCE);
        const col = Math.round(COLUMNS / 2 + (FOCAL * ooz * p[0]) / 6);
        const row = Math.round(ROWS / 2 - (FOCAL * ooz * p[1]) / 10);
        if (col < 0 || col >= COLUMNS || row < 0 || row >= ROWS) continue;
        const i = col + row * COLUMNS;
        if (ooz <= depth[i]) continue;
        depth[i] = ooz;
        const light = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
        chars[i] = RAMP.charAt(
          light <= 0 ? 0 : Math.min(3, 1 + Math.floor(light * 3)),
        );
      }
    }
  };
  drawRing(true);
  drawRing(false);

  const rows: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    rows.push(chars.slice(y * COLUMNS, (y + 1) * COLUMNS).join(""));
  }
  return rows.join("\n");
}
