import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'

// A simple interactive 3D Cube Component
function SpinningBox() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? '#38bdf8' : '#4f46e5'} />
    </mesh>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      {/* daisyUI Navbar */}
      <div className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">3D Studio</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary btn-sm">Get Started</button>
        </div>
      </div>

      {/* Main Hero Section split with Three.js */}
      <div className="hero flex-1 py-10">
        <div className="hero-content flex-col lg:flex-row w-full max-w-6xl gap-12">
          
          {/* Left Side: daisyUI UI Elements */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-tight">
              React + daisyUI + <span className="text-primary">Three.js</span>
            </h1>
            <p className="py-6 text-lg opacity-80">
              Interactive 3D environments meeting clean, semantic component design. Click the 3D cube to scale it, or hover to watch its color shift!
            </p>
            <div className="space-x-2">
              <button className="btn btn-secondary">Explore Features</button>
              <button className="btn btn-outline">Documentation</button>
            </div>
          </div>

          {/* Right Side: Three.js Canvas Container */}
          <div className="flex-1 w-full h-[400px] bg-base-100 rounded-2xl shadow-xl overflow-hidden relative border border-base-300">
            <Canvas camera={{ position: [0, 0, 5] }}>
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              
              {/* 3D Object */}
              <SpinningBox />
              
              {/* Camera Controls (Allows dragging/rotating the scene) */}
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>

        </div>
      </div>
    </div>
  )
}