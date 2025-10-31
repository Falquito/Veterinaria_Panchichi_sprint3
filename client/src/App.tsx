import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Product";
import Catalogo from "./pages/Catalogo.jsx"; 
import Depositos from "./pages/Depot";
import OrdenDeCompraGenerator from "./pages/OrdenDeCompra.js";
import Movimientos from "./pages/movimientos.jsx";
import Comprobantes from "./pages/Comprobantes";
import Proveedores from "./pages/Proveedores";
import OrdenDePagoPage from "./pages/orden-de-pago.jsx";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
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
          <Route path="orden-de-pago" element={<OrdenDePagoPage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
          <Route path="catalogo" element={<Catalogo />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;