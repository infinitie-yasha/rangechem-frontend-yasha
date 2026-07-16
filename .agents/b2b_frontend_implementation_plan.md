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

---

## Proposed Changes

We will update the customer web storefront to support the B2B customer lifecycle across registration, my-account profile management, cart calculations, and checkout validation.

### 1. Types & Data Contracts

#### [MODIFY] [ApiResponse/index.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/types/ApiResponse/index.ts)
- Add B2B properties to `userData`:
  ```typescript
  b2b_status?: "none" | "pending" | "approved" | "rejected" | string;
  b2b_multiplier?: string | number | null;
  b2b_min_order_amount?: string | number | null;
  ```
- Add B2B properties to `PaymentSummary`:
  ```typescript
  b2b_discount?: number;
  b2b_multiplier?: number | null;
  b2b_min_order_amount?: number | null;
  ```

#### [MODIFY] [params.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/types/params.ts)
- Update `RegisterUserParams` and `UpdateUserParams` to support sending the B2B request flag to the backend API:
  ```typescript
  is_b2b_requested?: boolean | number;
  ```

---

### 2. Registration Flow

#### [MODIFY] [auth.ts](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/helpers/auth.ts)
- Update the `handleRegisterUser` function parameter signature to include `is_b2b_requested` and pass it down to the `registerUser` API call:
  ```typescript
  is_b2b_requested: formData.is_b2b_requested ? 1 : 0
  ```

#### [MODIFY] [RegisterModal.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Modals/RegisterModal.tsx)
- Add `is_b2b_requested` to the modal's `formData` state object.
- Inject a Checkbox from `@heroui/react` before the Terms and Conditions agreement checkbox:
  ```tsx
  <Checkbox
    isSelected={formData.is_b2b_requested}
    onValueChange={(selected) => setFormData(prev => ({ ...prev, is_b2b_requested: selected }))}
    color="primary"
    size="sm"
  >
    {t("register_modal.fields.is_b2b_requested.label", { defaultValue: "Apply for a B2B Business Account (Requires Admin Approval)" })}
  </Checkbox>
  ```
- Pass `is_b2b_requested: formData.is_b2b_requested` inside `handleRegisterUser` calls under `handleDetailsSubmit` and `handleOtpSubmit`.

---

### 3. Profile & Account Management

#### [MODIFY] [my-account/index.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/pages/my-account/index.tsx)
- **B2B Status Banner**: Display a prominent banner/alert at the top of the account details page matching the user's B2B status:
  - If `pending`: Show a warning/info banner saying: *"Your request for B2B status is pending admin review. You cannot place orders until approved."*
  - If `approved`: Show a success banner saying: *"B2B Account Approved! Enjoy a ${user.b2b_multiplier * 100}% discount on orders above KES ${user.b2b_min_order_amount}."*
- **Request B2B Upgrade Toggle**: If the user is currently `none`, display a toggle option under personal info: *"Upgrade to B2B Customer Account"*.
- **Confirmation Modal & Forced Logout**: When toggle is selected and submitted, show a confirmation modal explaining: *"Submitting a B2B request will deactivate your account pending admin approval and log you out. Proceed?"*. Upon confirmation, submit `is_b2b_requested: 1` to `updateUserData()`, show a success toast, and call `handleLogout(false, true)` to clear the session.

---

### 4. Cart & Checkout Summary

#### [MODIFY] [CheckoutSection.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/views/CartPageView/CheckoutSection.tsx)
- **B2B Discount Rendering**: Inject a summary row in the pricing breakdown displaying the applied discount if `payment_summary.b2b_discount > 0`:
  ```tsx
  {payment_summary.b2b_discount > 0 && (
    <div className="flex justify-between text-green-600 font-medium">
      <span>
        {t("checkout.b2bDiscount", { defaultValue: "B2B Discount" })} 
        ({((payment_summary.b2b_multiplier || 0) * 100).toFixed(0)}%)
      </span>
      <span>
        -{currencySymbol}
        {formatAmount(payment_summary.b2b_discount)}
      </span>
    </div>
  )}
  ```

#### [MODIFY] [PromoCodeSection.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/PromoCodeSection.tsx)
- Check the user's B2B status: if `user?.b2b_status === "approved"`, hide the entire Promo Code Card section completely from the cart/checkout page.

#### [MODIFY] [ExpressDelivery.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/ExpressDelivery.tsx)
- Check the user's B2B status: if `user?.b2b_status === "approved"`, hide the Express/Rush delivery component completely.

#### [MODIFY] [DeliveryScheduling.tsx](file:///home/yasha/yasha/Rangechem/rangechem-frontend-code/src/components/Cart/DeliveryScheduling.tsx)
- Check the user's B2B status: if `user?.b2b_status === "approved"`, bypass the store closed/offline checks (`maxDays === 0 || !isClosed`) and render the Scheduled Delivery date picker permanently. Force selection of a future delivery date.

---

## Verification Plan

### Manual Verification
1. **Registration Flow**:
   - Register a new user with the "B2B Account" checkbox selected.
   - Verify that the API payload contains `is_b2b_requested = 1`.
   - Verify that the registration is successful but the account remains inactive and logs out.
2. **Checkout Discount View**:
   - Place an order using an admin-approved B2B user.
   - Verify that when the cart subtotal exceeds the minimum threshold, the "B2B Discount" row is rendered with the correct percentage and negative deduction.
   - Verify that coupon code application fields are hidden.
3. **Profile Conversion**:
   - Log in as a normal customer.
   - Request B2B status from the "My Account" profile settings.
   - Verify the profile submits successfully, and the user is cleanly logged out with a pending status notification.
