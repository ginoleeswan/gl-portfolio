export function shouldRender3D(opts: { webgl: boolean; reducedMotion: boolean }): boolean {
  // Render 3D on any viewport (mobile included) when the device supports WebGL
  // and the user hasn't asked to reduce motion.
  return opts.webgl && !opts.reducedMotion;
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
