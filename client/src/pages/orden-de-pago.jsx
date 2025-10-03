import React, { useState } from "react";
import OrdenDePagoList from "../components/ordenes-de-pago/OrdenDePagoList";
import CrearOrdenDePago from "../components/ordenes-de-pago/CrearOrdenDePago";
import OrdenDetalleModal from "../components/ordenes-de-pago/OrdenDetalleModal";

const OrdenDePagoPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div >
      <OrdenDePagoList
        onCreate={() => setShowCreate(true)}
        onSelect={(id) => setSelectedId(id)}
      />

      {showCreate && (
        <CrearOrdenDePago
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            // refrescar lista si hace falta
          }}
        />
      )}

      {selectedId && (
        <OrdenDetalleModal
          ordenId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default OrdenDePagoPage;
