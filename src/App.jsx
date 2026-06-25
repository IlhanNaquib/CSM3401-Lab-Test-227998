import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF } from '@react-three/drei'
import { useState, Suspense } from 'react'

// --- Preload Assets to avoid lagging ---
useGLTF.preload('/models/restaurant_table.glb')
useGLTF.preload('/models/door.glb')
useGLTF.preload('/models/lamp.glb')
useGLTF.preload('/models/plant.glb')
useGLTF.preload('/models/window.glb')

function RestaurantTable({ id, position, isBooked, onSelectTable }) {
  const { scene } = useGLTF('/models/restaurant_table.glb')
  const [hovered, setHovered] = useState(false)
  const clonedTable = scene.clone()

  const statusColor = isBooked ? '#ef4444' : '#22c55e'
  const hoverColor = '#3b82f6'

  return (
    <group position={position}>
      <group
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => (e.stopPropagation(), onSelectTable(id))}
      >
        <primitive object={clonedTable} scale={1} castShadow receiveShadow />

        {/*  Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial color={hovered ? hoverColor : statusColor} />
        </mesh>

        {/*  Float Tag */}
        <Text position={[0, 2, 0]} fontSize={0.4} color="#1e293b" anchorX="center" anchorY="middle">
          {`Table ${id}`}
        </Text>
      </group>
    </group>
  )
}

function CafeArchitecture() {
  const { scene: doorScene } = useGLTF('/models/door.glb')
  const { scene: windowScene } = useGLTF('/models/window.glb')
  const { scene: plantScene } = useGLTF('/models/plant.glb')
  const { scene: lampScene } = useGLTF('/models/lamp.glb')

  return (
    <group>
      {/* Floor  */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#eddcd2" roughness={0.5} />
      </mesh>

      {/*  Wall  */}
      <mesh position={[-12, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[24, 4, 0.3]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>

      {/*  Wall*/}
      <mesh position={[0, 2, -12]} receiveShadow castShadow>
        <boxGeometry args={[24, 4, 0.3]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>

      {/* Windows */}
      <primitive object={windowScene.clone()} position={[-11.8, 2, -5]} rotation={[0, Math.PI / 2, 0]} scale={1} />
      <primitive object={windowScene.clone()} position={[-11.8, 2, 5]} rotation={[0, Math.PI / 2, 0]} scale={1} />

      {/* Door */}
      <primitive object={doorScene.clone()} position={[5, 1, -11.8]} scale={1} />

      {/* Lamps */}
      <primitive object={lampScene.clone()} position={[-4, 2.8, -11.6]} rotation={[0, 0, 0]} scale={1} />
      <primitive object={lampScene.clone()} position={[1, 2.8, -11.6]} rotation={[0, 0, 0]} scale={1} />
      <primitive object={lampScene.clone()} position={[-11.6, 2.8, -1.5]} rotation={[0, Math.PI / 2, 0]} scale={1} />
      <primitive object={lampScene.clone()} position={[-11.6, 2.8, 3]} rotation={[0, Math.PI / 2, 0]} scale={1} />

      {/*  Plants */}
      <primitive object={plantScene.clone()} position={[-11, 0, -11]} scale={0.2} />
      <primitive object={plantScene.clone()} position={[11, 0, -11]} scale={0.2} />
      <primitive object={plantScene.clone()} position={[-11, 0, 11]} scale={0.2} />
    </group>
  )
}

// --- Main App Component ---
export default function App() {
  const [tables, setTables] = useState([
    /* Row 1 (Back row, closest to door/window corner) */
    { id: 1, position: [-6.5, 0, -5.5], isBooked: false, bookingDetails: null },
    { id: 2, position: [0, 0, -5.5], isBooked: false, bookingDetails: null },
    { id: 3, position: [6.5, 0, -5.5], isBooked: false, bookingDetails: null },

    /* Row 2 (Middle row arrangement) */
    { id: 4, position: [-6.5, 0, 1], isBooked: true, bookingDetails: { name: 'Sarah Lee', date: '2026-06-25', time: '15:00' } },
    { id: 5, position: [0, 0, 1], isBooked: false, bookingDetails: null }, // ✨ New Table completing the center
    { id: 6, position: [6.5, 0, 1], isBooked: false, bookingDetails: null },

    /* Row 3 (Front Row, closest to the viewpoint projection) */
    { id: 7, position: [-6.5, 0, 7.5], isBooked: false, bookingDetails: null },
    { id: 8, position: [0, 0, 7.5], isBooked: false, bookingDetails: null },
    { id: 9, position: [6.5, 0, 7.5], isBooked: false, bookingDetails: null },
  ])

  const [selectedTableId, setSelectedTableId] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')

  const activeTable = tables.find(t => t.id === selectedTableId)

  const handleTableSelect = (id) => {
    setSelectedTableId(id)
    const table = tables.find(t => t.id === id)
    if (table && !table.isBooked) {
      setCustomerName('')
      setBookingDate(new Date().toISOString().split('T')[0])
      setBookingTime('18:00')
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!customerName.trim()) return

    setTables(prev =>
      prev.map(table =>
        table.id === selectedTableId
          ? { ...table, isBooked: true, bookingDetails: { name: customerName, date: bookingDate, time: bookingTime } }
          : table
      )
    )
    setSelectedTableId(null)
  }

  return (
    <div data-theme="light" className="fixed inset-0 flex flex-col bg-base-200 text-base-content font-sans overflow-hidden select-none">

      {/* Header */}
      <header className="navbar bg-base-100 shadow-sm border-b border-base-300 px-6 h-16 flex-none z-10">
        <div className="flex-1">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black tracking-tight text-primary">Kedai Makan</span>
            <span className="text-xs opacity-60 font-medium tracking-wide">Book a table for your next meal!</span>
          </div>
        </div>
        <div className="flex-none gap-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span> Available
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-rose-500"></span> Reserved
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative bg-base-100">
        <Canvas camera={{ position: [20, 16, 20], fov: 24 }} shadows>

          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight
            position={[12, 25, 10]}
            intensity={1.7}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-10, 8, -10]} intensity={0.5} color="#ffffff" />

          <Suspense fallback={null}>
            <CafeArchitecture />
          </Suspense>

          <Suspense fallback={null}>
            {tables.map((table) => (
              <RestaurantTable
                key={table.id}
                id={table.id}
                position={table.position}
                isBooked={table.isBooked}
                onSelectTable={handleTableSelect}
              />
            ))}
          </Suspense>

          <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.3} minDistance={10} maxDistance={35} />
        </Canvas>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-base-100/95 border border-base-300 shadow-md px-6 py-2.5 rounded-full text-xs font-semibold text-center pointer-events-none backdrop-blur-xs">
          Left-click + drag to turn layout viewpoint. Click on any table indicator ring to manage reservations.
        </div>
      </main>

      <footer className="footer footer-center p-3 bg-base-300 text-base-content border-t border-base-300 font-medium text-xs h-12 flex-none">
        <p>© 2026 Kedai Makan. All rights reserved.</p>
      </footer>

      {selectedTableId && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box bg-base-100 text-base-content shadow-xl border border-base-200 p-6 max-w-md">

            <div className="flex justify-between items-center border-b border-base-200 pb-3 mb-4">
              <h3 className="font-bold text-xl">
                Table Assignment: <span className="text-primary">#{selectedTableId}</span>
              </h3>
              <span className={`badge ${activeTable?.isBooked ? 'badge-error' : 'badge-success'} text-white font-semibold`}>
                {activeTable?.isBooked ? 'Reserved' : 'Available'}
              </span>
            </div>

            {activeTable?.isBooked ? (
              <div className="space-y-4">
                <p className="text-sm opacity-80">This location is currently booked out for a seating schedule.</p>
                <div className="bg-base-200 p-4 rounded-lg space-y-2 text-sm border border-base-300">
                  <div><span className="font-bold opacity-60">Guest Name:</span> {activeTable.bookingDetails?.name}</div>
                  <div><span className="font-bold opacity-60">Date:</span> {activeTable.bookingDetails?.date}</div>
                  <div><span className="font-bold opacity-60">Arrival Time:</span> {activeTable.bookingDetails?.time}</div>
                </div>
                <div className="modal-action">
                  <button className="btn btn-block" onClick={() => setSelectedTableId(null)}>Close Overlay</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-xs opacity-70">Customer Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Liam Neeson"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input input-bordered w-full text-sm border-base-300 focus:input-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs opacity-70">Booking Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input input-bordered w-full text-sm border-base-300 focus:input-primary"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs opacity-70">Booking Time</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="input input-bordered w-full text-sm border-base-300 focus:input-primary"
                    />
                  </div>
                </div>

                <div className="modal-action pt-2 gap-2 flex justify-end">
                  <button type="button" className="btn btn-ghost border border-base-300" onClick={() => setSelectedTableId(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-8 text-white font-bold">
                    Book Now
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  )
}