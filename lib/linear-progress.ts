/** Track centerline ranges outside the active strokes, including rounded-cap clearance. */
export function linearTrackSegments(
  start: number,
  end: number,
  active: readonly (readonly number[])[],
  thickness: 4 | 8,
): [number, number][] {
  // Preserve the default 4dp stroke's 2dp visible gap; scale it to 4dp at 8dp.
  // Each of the two round caps consumes half a stroke from the centerline gap.
  const gap = thickness + thickness / 2;
  const tracks: [number, number][] = [];
  let cursor = start;
  for (const [from, to] of [...active].sort((a, b) => a[0] - b[0])) {
    if (from - gap - cursor > 0.5) tracks.push([cursor, from - gap]);
    cursor = Math.max(cursor, to + gap);
  }
  if (end - cursor > 0.5) tracks.push([cursor, end]);
  return tracks;
}
