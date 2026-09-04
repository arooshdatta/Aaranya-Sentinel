"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const PARTICLE_COUNT = 120;
const SEGMENTS = 28;

function TopographicWave({ reducedMotion }: { reducedMotion: boolean | null }) {
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry>>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !mesh.current) return;

    const positions = mesh.current.geometry.attributes.position;
    const time = clock.getElapsedTime() * 0.32;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      positions.setZ(index, Math.sin(x * 1.45 + time) * 0.12 + Math.cos(y * 1.18 - time * 0.8) * 0.1);
    }

    positions.needsUpdate = true;
    mesh.current.rotation.z = Math.sin(time * 0.25) * 0.05;
  });

  return (
    <mesh ref={mesh} rotation={[-1.08, 0.05, 0.08]} position={[0, -0.5, -1.5]}>
      <planeGeometry args={[7.2, 7.2, SEGMENTS, SEGMENTS]} />
      <meshBasicMaterial color="#14B8A6" opacity={0.16} transparent wireframe depthWrite={false} />
    </mesh>
  );
}

function AmbientParticles({ reducedMotion }: { reducedMotion: boolean | null }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(PARTICLE_COUNT * 3);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const seed = index * 12.9898;
      values[index * 3] = Math.sin(seed) * 4.2;
      values[index * 3 + 1] = Math.cos(seed * 1.7) * 3.2;
      values[index * 3 + 2] = Math.sin(seed * 0.43) * 1.4 - 1.2;
    }

    return values;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion || !points.current) return;

    const time = clock.getElapsedTime();
    points.current.rotation.z = time * 0.012;
    points.current.position.y = Math.sin(time * 0.18) * 0.08;
  });

  return (
    <points ref={points} position={[0, 0, -2.3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5eead4" size={0.025} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

export function SpatialBackdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
      <Canvas
        camera={{ fov: 42, position: [0, 0, 6] }}
        dpr={[1, 1.25]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <TopographicWave reducedMotion={reducedMotion} />
        <AmbientParticles reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
