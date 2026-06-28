import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh, Group } from "three";
import { shouldRender3D, detectWebGL } from "../../lib/capabilities";

const ACID = "#4de852";

function Specimen() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.35;
      group.current.rotation.x += dt * 0.12;
    }
    if (core.current) core.current.rotation.y -= dt * 0.6;
  });
  return (
    <group ref={group}>
      {/* acid wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={ACID} wireframe />
      </mesh>
      {/* dark solid core */}
      <mesh ref={core} scale={0.62}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#0a0b0a" roughness={0.4} metalness={0.3} flatShading />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  const [render3D, setRender3D] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRender3D(shouldRender3D({ webgl: detectWebGL(), reducedMotion, width: window.innerWidth }));
  }, []);

  if (!render3D) {
    return (
      <div
        className="halftone relative flex h-full w-full items-center justify-center"
        style={{ background: "radial-gradient(120% 120% at 70% 20%, #1d2417, #0a0b0a 70%)" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="h-3/5 w-3/5 opacity-80" fill="none" stroke={ACID} strokeWidth={0.6}>
          <polygon points="50,8 86,30 86,70 50,92 14,70 14,30" />
          <polygon points="50,8 50,50 86,30" />
          <polygon points="50,50 86,30 86,70" />
          <polygon points="50,50 86,70 50,92" />
          <polygon points="50,50 50,92 14,70" />
          <polygon points="50,50 14,70 14,30" />
          <polygon points="50,50 14,30 50,8" />
        </svg>
      </div>
    );
  }
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 4.4] }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 4]} intensity={1.4} color={ACID} />
        <Specimen />
      </Canvas>
    </div>
  );
}
