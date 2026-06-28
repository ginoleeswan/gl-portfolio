export function shouldRender3D(opts: { webgl: boolean; reducedMotion: boolean; width: number }): boolean {
  return opts.webgl && !opts.reducedMotion && opts.width >= 768;
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
