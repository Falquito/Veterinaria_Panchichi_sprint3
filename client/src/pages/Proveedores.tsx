import { useState } from "react";
import { Modal, ModalBody, ModalContent, useModal } from "../components/ui/animated-modal";
import { ProveedorHeader, ProveedorTable, ProveedorForm } from "../components/proveedores/";
import { useProveedores } from "../hooks/useProveedores.ts";
import type { Proveedor } from "../types/proveedor.ts";

export default function Proveedores() {
  return (
    <Modal>
      <ProveedoresContent />
    </Modal>
  );
}

function ProveedoresContent() {
  const { search, setSearch, paginated, loading, error, refresh } = useProveedores();
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const { setOpen } = useModal();

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditing(proveedor);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProveedorHeader onCreate={handleCreate} search={search} setSearch={setSearch} />

      <div className="mt-6">
        <ProveedorTable
            proveedores={paginated.items}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDeleteSuccess={refresh}
        />
      </div>

      <ModalBody>
        <ModalContent>
          <ProveedorForm
            initialData={editing}
            onSuccess={handleSuccess}
          />
        </ModalContent>
      </ModalBody>
    </div>
  );
}