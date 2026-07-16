# B2B Frontend Capability Integration — Final Implementation Plan

This plan details the frontend changes required in the React/Next.js repository ([rangechem-frontend-code](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code)) to integrate with the Laravel backend's B2B customer request, approval, and discount systems.

---

## Resolved Decisions & Design Tree

| # | Question / Decision Area | Final Resolved Approach |
|---|---|---|
| 1 | B2B Registration Visibility | **Visible to all customers** globally during registration (not restricted by zone/region). |
| 2 | Registration Document Uploads | **No document uploads** required on the frontend for now; admin verifies details manually out-of-band. |
| 3 | Delivery Options for B2B | **Only Scheduled Delivery is allowed**. The Express/Rush delivery toggle is completely hidden, and the Scheduled Delivery date picker is rendered permanently (even if stores are online). Checkout is blocked until a date is chosen. |
| 4 | Promo Code Section for B2B | **Hidden entirely** from the cart/checkout page for B2B-approved users, as promo codes are not allowed for B2B accounts. |
| 5 | Profile Conversion Request Flow | **Show a confirmation modal** explaining that submitting a B2B request will deactivate the account pending approval and log them out. If they proceed, make the update API call and log out. |
| 6 | Header Badges / Status Chips | **No global header badges**; the B2B status will be shown inside the "My Account" page. |
| 7 | Payment Methods | **Cash On Delivery Only**. Approved B2B customers are restricted to COD only. All other payment options (M-Pesa, Stripe, etc.) are filtered out, and COD is auto-selected. |
| 8 | Active Orders Blocker | **Block B2B Upgrade if active orders exist**. Checked on the backend during profile update. Prevents deactivating accounts that have undelivered shipments. |

---

## Implemented Changes

We have updated the customer web storefront to support the B2B customer lifecycle across registration, my-account profile management, cart calculations, and checkout validation.

### 1. Types & Data Contracts

#### [MODIFY] [ApiResponse/index.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/types/ApiResponse/index.ts)
- Added B2B properties to `userData`:
  ```typescript
  b2b_status?: "none" | "pending" | "approved" | "rejected" | string;
  b2b_multiplier?: string | number | null;
  b2b_min_order_amount?: string | number | null;
  ```
- Added B2B properties to `PaymentSummary`:
  ```typescript
  b2b_discount?: number;
  b2b_multiplier?: number | null;
  b2b_min_order_amount?: number | null;
  ```

#### [MODIFY] [params.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/types/params.ts)
- Updated `RegisterUserParams` and `UpdateUserParams` to support sending the B2B request flag to the backend API:
  ```typescript
  is_b2b_requested?: boolean | number;
  ```

---

### 2. Registration Flow

#### [MODIFY] [auth.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/helpers/auth.ts)
- Updated the `handleRegisterUser` function to pass `is_b2b_requested` (as `1` or `0`) down to the API payload.
- Bypassed auto-login on B2B success and outputted the custom backend status message.
- Updated `handleGoogleLogin` and `handleAppleLogin` callbacks to catch database unique key constraints and show a clean `"There is already an account with that email."` Toast.

#### [MODIFY] [RegisterModal.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Modals/RegisterModal.tsx)
- Added `is_b2b_requested` to the modal's `formData` state object.
- Injected a Checkbox before the terms checkbox for B2B registration.
- Custom success screen: If B2B is requested, displays `"Your B2B account has been created successfully. An administrator will review and approve your application."` along with a `"Close"` button instead of standard start options.

---

### 3. Profile & Account Management

#### [MODIFY] [my-account/index.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/pages/my-account/index.tsx)
- **B2B Status Banner**: Displayed warning/success alert banners at the top of the account details page matching `pending`, `rejected`, or `approved` B2B statuses.
- **Request B2B Upgrade Toggle**: If the user is currently `none` or `rejected`, displayed a toggle option under personal info: *"Upgrade to B2B Customer Account"*.
- **Confirmation Modal & Atomic Logout**: Showed a confirmation modal. On confirmation, submits `is_b2b_requested: 1` to `updateUserData()`. If the backend blocks the upgrade (e.g. active orders validation fail), displays the translated warning; otherwise, executes an atomic `forceLogout` instantly.

---

### 4. Cart & Checkout Summary

#### [MODIFY] [CheckoutSection.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/views/CartPageView/CheckoutSection.tsx)
- **B2B Discount Rendering**: Injected a summary row in the pricing breakdown displaying the applied discount if `payment_summary.b2b_discount > 0` (or calculated local fallback).
- **Required Scheduled Date**: Checked if the active user is approved B2B and blocked checkout if no delivery date was selected.
- **Promo Code Clearance**: Cleared guest session promo codes (`dispatch(setPromoCode(""))`) if logged in as an approved B2B user.

#### [MODIFY] [PromoCodeSection.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/PromoCodeSection.tsx)
- Hid the entire Promo Code section completely from the cart/checkout page for approved B2B users.

#### [MODIFY] [ExpressDelivery.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/ExpressDelivery.tsx)
- Hid the Express/Rush delivery component completely for approved B2B users.

#### [MODIFY] [DeliveryScheduling.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/DeliveryScheduling.tsx)
- Bypassed store closed checks and rendered the date picker permanently for B2B users.

#### [MODIFY] [PaymentMethods.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/PaymentMethods.tsx)
- Filtered payment gateway methods to only return `"cod"` (Cash On Delivery) for approved B2B users. Added `useEffect` auto-selection if COD is the only available option.
