// client/src/App.tsx
import { Layout } from "./components/Layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ModalProvider } from "./components/ui/animated-modal"; // <-- 1. Importar ModalProvider
import Products from "./pages/Product"
import Depositos from "./pages/Depot"
import OrdenDeCompraGenerator from "./pages/OrdenDeCompra.js"
import Movimientos from "./pages/movimientos.jsx"
import Comprobantes from "./pages/Comprobantes"
import Proveedores from "./pages/Proveedores"
import OrdenDePago from "./pages/OrdenDePago";

function App() {
  return (
    // 2. Envolver todo con ModalProvider
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/productos" replace />} />
            <Route path="productos" element={<Products />} />
            <Route path="depositos" element={<Depositos />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="orden-de-compra" element={<OrdenDeCompraGenerator />} />
            <Route path="comprobantes" element={<Comprobantes />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="orden-de-pago" element={<OrdenDePago />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  )
}

export default App