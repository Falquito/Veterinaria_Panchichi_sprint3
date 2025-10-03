// client/src/components/Layout.tsx
import React from "react"
import { Outlet } from "react-router-dom"
import { SidebarDemo } from "../components/SidebarDemo"

// No necesita la prop 'children' cuando se usa con Outlet
export function Layout() {
  return (
    <div className="flex h-screen bg-white ">
      <aside className="bg-white"><SidebarDemo /></aside>
      <main className="flex-1 overflow-auto p-6 bg-gray-100 rounded-4xl">
        <Outlet /> {/* Outlet renderizará el componente de la ruta activa */}
      </main>
    </div>
  )
}