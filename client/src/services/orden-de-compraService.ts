// src/features/orden-compra/api.ts
import {type  CreateOrdenDto, type OrdenDeCompra,type  Producto, type Proveedor } from "../types/orden-de-compra";

const API_BASE = "http://localhost:3000";

export async function fetchProveedores(): Promise<Proveedor[]> {
  const r = await fetch(`${API_BASE}/proveedores?limit=100`);
  const data = await r.json();
  return (data?.items ?? data ?? []) as Proveedor[];
}

export async function fetchOrdenes(): Promise<OrdenDeCompra[]> {
  const r = await fetch(`${API_BASE}/orden-de-compra`);
  return (await r.json()) as OrdenDeCompra[];
}

export async function createOrden(dto: CreateOrdenDto) {
  const r = await fetch(`${API_BASE}/orden-de-compra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  return r.json();
}

export async function fetchProductosNormalizados(): Promise<Producto[]> {
  const r = await fetch(`${API_BASE}/productos`);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  const data = await r.json();

  let rawList: any[] = [];
  if (Array.isArray(data) && data.length && Array.isArray(data[0]?.productos)) {
    rawList = data.flatMap((dep: any) => Array.isArray(dep?.productos) ? dep.productos : []);
  } else if (Array.isArray(data?.productos)) {
    rawList = data.productos;
  } else if (Array.isArray(data)) {
    rawList = data;
  } else {
    return [];
  }

  const byId = new Map<number, Producto>();
  for (const r of rawList) {
    const id = Number(r?.id ?? 0);
    if (!id) continue;
    const prev = byId.get(id);
    const normalized: Producto = {
      id,
      nombre: String(r?.nombre ?? prev?.nombre ?? "").trim() || `Producto #${id}`,
      descripcion: String(r?.descripcion ?? prev?.descripcion ?? ""),
      precio: Number(r?.precio ?? prev?.precio ?? 0),
      stock: (Number(prev?.stock ?? 0) + Number(r?.stock ?? 0)) || 0,
      categoria: String(r?.nombreCategoria ?? r?.categoria?.nombre ?? prev?.categoria ?? ""),
    };
    byId.set(id, normalized);
  }
  return Array.from(byId.values());
}
