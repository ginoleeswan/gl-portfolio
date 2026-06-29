import { useEffect, useState } from "react";
import PixelBlast from "./PixelBlast";
import Dither from "./Dither";
import { shouldRender3D, detectWebGL } from "../../lib/capabilities";

type Mode = "pixel" | "dither";

// Periwinkle (--secondary #9ca2d2) as a second riso ink, normalized for the
// wave shader. Acid stays reserved for punctuation; this layer is atmosphere.
const PERIWINKLE_RGB: [number, number, number] = [0.612, 0.635, 0.824];

// A soft vignette so the field concentrates and fades before the hard edges —
// echoes the .halftone mask elsewhere on the site.
const VIGNETTE = "radial-gradient(125% 125% at 50% 32%, #000 28%, transparent 86%)";

/**
 * Ambient, site-wide screenprint backdrop. Desktop + motion-allowed only
 * (reuses the Hero3D capability gate); mobile keeps the riso paper texture.
 * Sits behind page content (z-0, pointer-events: none) and composites in
 * `screen` so periwinkle reads as ink over the void rather than a flat fill.
 */
export default function Backdrop({ mode = "dither" }: { mode?: Mode }) {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsMobile(window.innerWidth < 768);
    setShow(shouldRender3D({ webgl: detectWebGL(), reducedMotion }));
  }, []);

  if (!show) return null;

  // On phones the field reads as noise on a small screen, so pull it back and
  // coarsen the grain — quieter atmosphere, lighter on the GPU.
  const baseOpacity = mode === "dither" ? 0.32 : 0.55;
  const opacity = isMobile ? baseOpacity * 0.62 : baseOpacity;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        mixBlendMode: "screen",
        opacity,
        maskImage: VIGNETTE,
        WebkitMaskImage: VIGNETTE,
      }}
    >
      {mode === "dither" ? (
        <Dither
          waveColor={PERIWINKLE_RGB}
          waveSpeed={0.02}
          waveFrequency={2.4}
          waveAmplitude={0.28}
          colorNum={4}
          pixelSize={isMobile ? 3 : 2}
        />
      ) : (
        <PixelBlast
          variant="square"
          color="#9ca2d2"
          pixelSize={isMobile ? 6 : 5}
          pixelSizeJitter={0.4}
          patternScale={2}
          patternDensity={1}
          speed={0.35}
          edgeFade={0.6}
          enableRipples={false}
          liquid={false}
          transparent
        />
      )}
    </div>
  );
}
