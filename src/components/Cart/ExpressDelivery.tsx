import { updateCartData } from "@/helpers/updators";
import { setRusDelivery, setDeliveryScheduleDate } from "@/lib/redux/slices/checkoutSlice";
import { RootState } from "@/lib/redux/store";
import { Card, CardBody, Switch } from "@heroui/react";
import { Truck } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const ExpressDelivery: React.FC = () => {
  const { selectedAddress, isDeliverySchedulingShown } = useSelector((state: RootState) => state.checkout);
  const isLoading = useSelector((state: RootState) => state.cart.isLoading);
  const user = useSelector((state: RootState) => state.auth.user);

  const [isRushEnabled, setIsRushEnabled] = useState(false);
  const [isRushAvailable, setIsRushAvailable] = useState(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  if (isDeliverySchedulingShown || user?.b2b_status === "approved") {
    return null;
  }

  const handleRushSwitchToggle = async (checked: boolean) => {
    setIsRushEnabled(checked);

    dispatch(setRusDelivery(checked));
    if (checked) {
      dispatch(setDeliveryScheduleDate(null));
    }

    setTimeout(async () => {
      const res = await updateCartData(true, false);

      if (
        !res?.data?.payment_summary?.is_rush_delivery_available &&
        checked &&
        selectedAddress?.id
      ) {
        await handleRushSwitchToggle(false);
        setIsRushAvailable(false);
      }
    }, 500);
  };

  const makeRushDeliveryOff = async () => {
    handleRushSwitchToggle(false);
  };

  const makeRushDeliveryAvailable = async () => {
    setIsRushAvailable(true);
  };

  return (
    <Card className="w-full" radius="md" shadow="sm">
      <CardBody className="space-y-4">
        <button
          onClick={makeRushDeliveryOff}
          className="hidden"
          id="rush-delivery-off"
        />
        <button
          onClick={makeRushDeliveryAvailable}
          className="hidden"
          id="rush-delivery-available"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Truck className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="flex gap-2">
                <p className="font-semibold text-xs md:text-small">
                  {t("express_rushDelivery")}
                </p>
              </div>
              <p className="text-xxs md:text-xs text-default-500">
                {t("express_rushDeliveryDescription")}
              </p>
            </div>
          </div>
          <Switch
            isDisabled={isLoading || !isRushAvailable}
            isSelected={isRushEnabled}
            onValueChange={handleRushSwitchToggle}
            color="success"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default ExpressDelivery;
