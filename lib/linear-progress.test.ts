import { describe, expect, it } from "vitest";
import { linearTrackSegments } from "./linear-progress";

describe("linear progress rounded-cap gaps", () => {
  it.each([4, 8] as const)("preserves determinate spacing at %sdp", (thickness) => {
    const inset = thickness / 2;
    const end = 200 - inset;
    const activeEnd = 100;
    const tracks = linearTrackSegments(inset, end, [[inset, activeEnd]], thickness);
    expect(tracks).toEqual([[activeEnd + thickness * 1.5, end]]);
    // Visible edges include the active head's and track tail's round caps.
    expect((tracks[0][0] - inset) - (activeEnd + inset)).toBe(thickness === 4 ? 2 : 4);
    expect(linearTrackSegments(inset, end, [], thickness)).toEqual([[inset, end]]);
    expect(linearTrackSegments(inset, end, [[inset, end]], thickness)).toEqual([]);
  });

  it.each([4, 8] as const)("leaves the same gap on both sides of indeterminate strokes at %sdp", (thickness) => {
    const inset = thickness / 2;
    const gap = thickness * 1.5;
    const tracks = linearTrackSegments(inset, 200 - inset, [[120, 150], [40, 70]], thickness);
    expect(tracks).toEqual([[inset, 40 - gap], [70 + gap, 120 - gap], [150 + gap, 200 - inset]]);
    expect(40 - inset - (tracks[0][1] + inset)).toBe(thickness === 4 ? 2 : 4);
    expect(tracks[1][0] - inset - (70 + inset)).toBe(thickness === 4 ? 2 : 4);
    expect(120 - inset - (tracks[1][1] + inset)).toBe(thickness === 4 ? 2 : 4);
    expect(tracks[2][0] - inset - (150 + inset)).toBe(thickness === 4 ? 2 : 4);
  });

  it("does not insert track inside overlapping active segments", () => {
    expect(linearTrackSegments(2, 198, [[2, 90], [70, 130]], 4)).toEqual([[136, 198]]);
  });
});
