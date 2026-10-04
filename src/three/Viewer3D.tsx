import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Sky } from '@react-three/drei'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { Monument } from '../data/types'
import { MonumentModel } from './MonumentModel'

export function SceneLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <hemisphereLight args={['#ffe8c8', '#5a6b45', 0.85 * intensity]} />
      <ambientLight intensity={0.28 * intensity} color="#fff6ea" />
      <directionalLight
        position={[70, 110, 45]}
        intensity={2.6 * intensity}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.04}
        shadow-camera-left={-140}
        shadow-camera-right={140}
        shadow-camera-top={140}
        shadow-camera-bottom={-140}
        shadow-camera-far={420}
      />
      <directionalLight position={[-55, 35, -70]} intensity={0.55 * intensity} color="#9ec4ff" />
      <directionalLight position={[20, 25, 100]} intensity={0.45 * intensity} color="#ffd9a8" />
    </>
  )
}

function CameraRig({ footprint }: { footprint: number }) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(footprint * 2.15, footprint * 1.2, footprint * 2.55)
    camera.far = footprint * 50
    camera.near = 0.05
    camera.lookAt(0, footprint * 0.32, 0)
    camera.updateProjectionMatrix()
  }, [camera, footprint])
  return null
}

function Ground({ radius }: { radius: number }) {
  const grass = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#6f8450'
    ctx.fillRect(0, 0, size, size)
    const img = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.sin(i * 12.9898) * 43758.5453) % 1
      const v = (n < 0 ? -n : n) * 40 - 18
      img.data[i] = Math.max(0, Math.min(255, img.data[i] + v))
      img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + v * 0.9))
      img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + v * 0.5))
    }
    ctx.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 8)
    return tex
  }, [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[radius, 96]} />
        <meshStandardMaterial map={grass} color="#ffffff" roughness={0.95} metalness={0} />
      </mesh>
      {/* soft earth rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <ringGeometry args={[radius * 0.92, radius * 1.35, 96]} />
        <meshStandardMaterial color="#8a7355" roughness={1} />
      </mesh>
    </group>
  )
}

export interface Viewer3DProps {
  monument: Monument
  blend: number
  autoRotate?: boolean
  className?: string
}

/** Non-XR fallback viewer: orbit around the Then/Now reconstruction. */
export function Viewer3D({ monument, blend, autoRotate = true, className }: Viewer3DProps) {
  const f = monument.footprint
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      camera={{ position: [f * 2.15, f * 1.2, f * 2.55], fov: 40, near: 0.05, far: f * 50 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
    >
      <color attach="background" args={['#b7cce0']} />
      <fog attach="fog" args={['#b7cce0', f * 7, f * 18]} />
      <Sky sunPosition={[100, 55, 30]} turbidity={3.2} rayleigh={0.9} mieCoefficient={0.003} mieDirectionalG={0.85} />
      <CameraRig footprint={f} />
      <SceneLights />
      {/* Environment is optional (needs CDN); keep the model outside so a slow/failed HDR never blanks the scene */}
      <Suspense fallback={null}>
        <Environment preset="park" environmentIntensity={0.4} />
      </Suspense>
      <MonumentModel monument={monument} blend={blend} />
      <Suspense fallback={null}>
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.45}
          scale={f * 6}
          blur={2.4}
          far={f * 2}
          color="#2a1a10"
        />
      </Suspense>
      <Ground radius={f * 3.4} />
      <OrbitControls
        key={monument.id}
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={0.45}
        enablePan={false}
        minDistance={f * 0.55}
        maxDistance={f * 5.5}
        maxPolarAngle={Math.PI / 2 - 0.04}
        target={[0, f * 0.32, 0]}
      />
    </Canvas>
  )
}
