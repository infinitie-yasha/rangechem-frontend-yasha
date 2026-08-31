export type QuarantineStatus = "quarantined" | "released" | "disposed";

export type QuarantineReason = "damaged" | "expired" | "customer_return" | "other";

export interface QuarantinedItem {
  id: number;
  store_id: number;
  store_name?: string;
  product_variant_id: number;
  product_id?: number;
  product_title: string;
  variant_title?: string;
  product_image?: string | null;
  batch_number?: string | null;
  expiry_date?: string | null;
  quantity: number;
  reason: QuarantineReason | string;
  status: QuarantineStatus | string;
  notes?: string | null;
  order_item_return_id?: number | null;
  order_item_id?: number | null;
  quarantined_at?: string | null;
  resolved_at?: string | null;
  resolved_by?: number | null;
  resolved_by_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface QuarantineFilterParams {
  page?: number;
  per_page?: number;
  store_id?: number;
  status?: QuarantineStatus | string;
  reason?: QuarantineReason | string;
  search?: string;
}

export interface CreateQuarantineRequest {
  store_id?: number;
  product_variant_id: number;
  quantity: number;
  batch_number?: string;
  expiry_date?: string;
  reason: QuarantineReason;
  notes?: string;
  deduct_active_stock?: boolean;
}

export interface DisposeQuarantineRequest {
  notes?: string;
}
