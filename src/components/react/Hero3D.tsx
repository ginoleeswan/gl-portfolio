import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { shouldRender3D, detectWebGL } from "../../lib/capabilities";

function Scene() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#b06fff" roughness={0.2} metalness={0.6} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const [render3D, setRender3D] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRender3D(shouldRender3D({ webgl: detectWebGL(), reducedMotion, width: window.innerWidth }));
  }, []);

  if (!render3D) {
    return <div className="h-[420px] w-full rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-40" aria-hidden="true" />;
  }
  return (
    <div className="h-[420px] w-full">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Scene />
      </Canvas>
    </div>
  );
}
