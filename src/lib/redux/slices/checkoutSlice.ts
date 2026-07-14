import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@/types/ApiResponse";

export interface CheckoutState {
  selectedAddress: Address | null;
  orderNote: string;
  useWallet: boolean;
  rushDelivery: boolean;
  promoCode: string;
  deliveryScheduleDate: string | null;
  isDeliverySchedulingShown: boolean;
}

const initialState: CheckoutState = {
  selectedAddress: null,
  orderNote: "",
  useWallet: false,
  rushDelivery: false,
  promoCode: "",
  deliveryScheduleDate: null,
  isDeliverySchedulingShown: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<Address | null>) => {
      state.selectedAddress = action.payload;
    },
    setOrderNote: (state, action: PayloadAction<string>) => {
      state.orderNote = action.payload;
    },
    setUseWallet: (state, action: PayloadAction<boolean>) => {
      state.useWallet = action.payload;
    },
    setRusDelivery: (state, action: PayloadAction<boolean>) => {
      state.rushDelivery = action.payload;
    },
    setPromoCode: (state, action: PayloadAction<string>) => {
      state.promoCode = action.payload;
    },
    setDeliveryScheduleDate: (state, action: PayloadAction<string | null>) => {
      state.deliveryScheduleDate = action.payload;
    },
    setIsDeliverySchedulingShown: (state, action: PayloadAction<boolean>) => {
      state.isDeliverySchedulingShown = action.payload;
    },
  },
});

export const {
  setSelectedAddress,
  setOrderNote,
  setUseWallet,
  setRusDelivery,
  setPromoCode,
  setDeliveryScheduleDate,
  setIsDeliverySchedulingShown,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
