export interface OrderResponse {
  id: number;
  tipo: string; // PM o PW
  numero: string;
  clienteId: number;
  fecha: string; // Formato ISO 8601
  direccionEntrega: string;
  estado: string; // Activo, Inactivo, Cancelado, etc.
}

export interface OrderRequest {
  tipo: string; // PM o PW
  numero: string;
  clienteId: number;
  fecha: string; // Formato ISO 8601
  direccionEntrega: string;
  estado: string; // Activo, Inactivo, Cancelado, etc.
}

export interface OrderDetailResponse {
  pedidoId: number;
  productoId: number;
  cantidad: number;
  valorUnitario: number;
  tasaImpuesto: number;
  precioUnitario: number;
  precioTotal: number;
}

export interface OrderDetailRequest {
  pedidoId: number;
  productoId: number;
  cantidad: number;
  valorUnitario: number;
  tasaImpuesto: number;
  precioUnitario: number;
  precioTotal: number;
}
