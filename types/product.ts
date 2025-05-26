import { CategoryResponse } from "./caregory";

export type ProductResponse = {
  id: number;
  codigo: string;
  descripcion: string;
  unidadVenta: string;
  categoriaId: number;
  contenidoUnidad: string;
  infoAdicional: string;
  fotoUrl: string;
  moneda: string;
  tasaImpuesto: number;
  stock: Stock;
  precioVenta: number;
  estado: string;
  categoria: CategoryResponse;
};

export type Stock = {
  id: number;
  productId: number;
  stockFisico: number;
  stockComprometido: number;
};
export type ProductRequest = {
  codigo: string;
  descripcion: string;
  unidadVenta: string;
  categoriaId: number;
  contenidoUnidad: string;
  infoAdicional: string;
  fotoUrl: string;
  moneda: string;
  tasaImpuesto: number;
  precioVenta: number;
  estado: string;
};
