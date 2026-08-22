import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * 中央の3Dオブジェクト（トーラスノット＋グラデーションの周回球体）
 * マウス座標への追従（lerp 補間）とスクロール連動のアニメーションを持つ
 */
function CenterObject() {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const damping = 1 - Math.pow(0.001, delta);
    const scrollRatio = Math.min(window.scrollY / window.innerHeight, 1);

    // マウス + スクロール連動の回転目標
    const targetRotX = state.mouse.y * 0.22 + scrollRatio * 0.3;
    const targetRotY = state.mouse.x * 0.36 + scrollRatio * Math.PI * 0.5;

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, damping);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, damping);

    // スクロールに応じて少し沈み、縮小する視差
    group.position.y = THREE.MathUtils.lerp(group.position.y, -scrollRatio * 1.6, damping);
    const scale = 1 - scrollRatio * 0.22;
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, scale, damping));
  });

  const ringColors = [
    "#22d3ee",
    "#38bdf8",
    "#60a5fa",
    "#818cf8",
    "#a78bfa",
    "#c084fc",
    "#818cf8",
    "#60a5fa",
    "#38bdf8",
    "#22d3ee",
  ];

  return (
    <group ref={groupRef}>
      {/* メインのトーラスノット */}
      <mesh>
        <torusKnotGeometry args={[1.1, 0.38, 220, 36]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#22d3ee"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* グラデーションの周回球体 */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 1.9;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial
              color={ringColors[i]}
              emissive={ringColors[i]}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 背景に浮遊するパーティクル（柔らかい白〜シアン系の発光）
 */
function Particles({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 16;
      arr[i3 + 1] = (Math.random() - 0.5) * 10;
      arr[i3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#67e8f9"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/**
 * ヒーローセクション背景用の3Dシーン
 * ライトテーマ（白基調）に調和し、HDR 外部アセットに依存しない
 */
export default function Scene3D() {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[6, 6, 6]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-6, -4, 4]} intensity={0.9} color="#a5f3fc" />
        <pointLight position={[2, 6, -6]} intensity={0.7} color="#c4b5fd" />

        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
          <CenterObject />
        </Float>

        <Particles />
      </Canvas>
    </div>
  );
}
