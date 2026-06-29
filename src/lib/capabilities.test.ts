import { shouldRender3D } from "./capabilities";

test("renders 3D when WebGL is available and motion is allowed, regardless of viewport", () => {
  expect(shouldRender3D({ webgl: true, reducedMotion: false })).toBe(true);
  expect(shouldRender3D({ webgl: false, reducedMotion: false })).toBe(false);
  expect(shouldRender3D({ webgl: true, reducedMotion: true })).toBe(false);
});
