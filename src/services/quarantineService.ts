import axios from "axios";
import { ApiResponse, PaginatedResponse } from "@/types/ApiResponse";
import {
  QuarantinedItem,
  QuarantineFilterParams,
  CreateQuarantineRequest,
  DisposeQuarantineRequest,
} from "@/types/quarantine";

const getApiInstance = (accessToken?: string, storeId?: number) => {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL
    ? `${process.env.NEXT_PUBLIC_ADMIN_PANEL_URL.replace(/\/$/, "")}/api`
    : "/api";

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  if (storeId) {
    headers["X-Selected-Store-Id"] = String(storeId);
  }

  return axios.create({
    baseURL: baseUrl,
    headers,
  });
};

/**
 * Fetch list of seller quarantined items.
 */
export const getQuarantinedItems = async (
  params: QuarantineFilterParams & { access_token?: string } = {}
): Promise<ApiResponse<PaginatedResponse<QuarantinedItem[]>>> => {
  try {
    const { access_token, store_id, ...queryParams } = params;
    const client = getApiInstance(access_token, store_id);
    const response = await client.get("/seller/quarantine", {
      params: queryParams,
    });
    return response.data;
  } catch (error: any) {
    console.error("getQuarantinedItems error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch quarantined items.",
      data: undefined,
    };
  }
};

/**
 * Fetch a single quarantined item by ID.
 */
export const getQuarantinedItemById = async (
  id: number,
  options: { access_token?: string; store_id?: number } = {}
): Promise<ApiResponse<QuarantinedItem>> => {
  try {
    const client = getApiInstance(options.access_token, options.store_id);
    const response = await client.get(`/seller/quarantine/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`getQuarantinedItemById (${id}) error:`, error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch quarantined item.",
      data: undefined,
    };
  }
};

/**
 * Move stock to quarantine.
 */
export const createQuarantinedItem = async (
  data: CreateQuarantineRequest,
  options: { access_token?: string } = {}
): Promise<ApiResponse<QuarantinedItem>> => {
  try {
    const client = getApiInstance(options.access_token, data.store_id);
    const response = await client.post("/seller/quarantine", data);
    return response.data;
  } catch (error: any) {
    console.error("createQuarantinedItem error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to quarantine item.",
      data: undefined,
    };
  }
};

/**
 * Release a quarantined item back to active stock.
 */
export const releaseQuarantinedItem = async (
  id: number,
  options: { access_token?: string; store_id?: number } = {}
): Promise<ApiResponse<QuarantinedItem>> => {
  try {
    const client = getApiInstance(options.access_token, options.store_id);
    const response = await client.post(`/seller/quarantine/${id}/release`);
    return response.data;
  } catch (error: any) {
    console.error(`releaseQuarantinedItem (${id}) error:`, error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to release quarantined item.",
      data: undefined,
    };
  }
};

/**
 * Dispose / write-off a quarantined item.
 */
export const disposeQuarantinedItem = async (
  id: number,
  data?: DisposeQuarantineRequest,
  options: { access_token?: string; store_id?: number } = {}
): Promise<ApiResponse<QuarantinedItem>> => {
  try {
    const client = getApiInstance(options.access_token, options.store_id);
    const response = await client.post(`/seller/quarantine/${id}/dispose`, data || {});
    return response.data;
  } catch (error: any) {
    console.error(`disposeQuarantinedItem (${id}) error:`, error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to dispose quarantined item.",
      data: undefined,
    };
  }
};
