import { shouldRender3D } from "./capabilities";

test("renders 3D only when capable, motion allowed, and wide enough", () => {
  expect(shouldRender3D({ webgl: true, reducedMotion: false, width: 1200 })).toBe(true);
  expect(shouldRender3D({ webgl: false, reducedMotion: false, width: 1200 })).toBe(false);
  expect(shouldRender3D({ webgl: true, reducedMotion: true, width: 1200 })).toBe(false);
  expect(shouldRender3D({ webgl: true, reducedMotion: false, width: 500 })).toBe(false);
});
