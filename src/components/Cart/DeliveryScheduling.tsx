import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setDeliveryScheduleDate,
  setRusDelivery,
} from "@/lib/redux/slices/checkoutSlice";
import { getStoreSchedulingLimit } from "@/routes/api";
import { StoreSchedulingLimit } from "@/types/ApiResponse";
import { Card, CardBody, Spinner, DatePicker } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { parseDate, today, getLocalTimeZone, DateValue } from "@internationalized/date";

const DeliveryScheduling: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { rushDelivery, deliveryScheduleDate } = useSelector(
    (state: RootState) => state?.checkout
  );
  const { cartData } = useSelector((state: RootState) => state.cart);

  const [limitData, setLimitData] = useState<StoreSchedulingLimit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch store scheduling limit
  useEffect(() => {
    const fetchLimit = async () => {
      setLoading(true);
      try {
        const response = await getStoreSchedulingLimit();
        if (response.success && response.data) {
          setLimitData(response.data);
        }
      } catch (error) {
        console.error("Error fetching scheduling limit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLimit();
  }, []);

  // Generate date bounds
  const maxDays = limitData?.max_scheduling_days || 0;
  const cartItemsClosed = cartData?.items?.some(
    (item) => !item.store?.status?.is_open || item.store?.status?.status === "offline"
  ) || false;
  const isClosed = (limitData?.is_closed || false) || cartItemsClosed;

  const localToday = today(getLocalTimeZone());
  const minDate = isClosed ? localToday.add({ days: 1 }) : localToday;
  const maxDate = minDate.add({ days: Math.max(0, maxDays - 1) });

  // Sync scheduled date when store is closed/offline, or clear it if store is online
  useEffect(() => {
    if (limitData) {
      if (!isClosed) {
        // Store is online: clear scheduled delivery date so they checkout normally
        dispatch(setDeliveryScheduleDate(null));
      }
    }
  }, [limitData, isClosed, dispatch]);

  const selectDate = (dateStr: string) => {
    dispatch(setDeliveryScheduleDate(dateStr));
    // Turn off rush delivery if we schedule for a future date
    if (rushDelivery) {
      dispatch(setRusDelivery(false));
      // Trigger click on ExpressDelivery off button to update cart delivery charges
      setTimeout(() => {
        document.getElementById("rush-delivery-off")?.click();
      }, 100);
    }
  };

  const handleDatePickerChange = (value: DateValue | null) => {
    if (value) {
      selectDate(value.toString()); // DateValue.toString() returns YYYY-MM-DD
    } else {
      dispatch(setDeliveryScheduleDate(null));
    }
  };

  // Convert string date from Redux to DateValue for HeroUI DatePicker
  const getSelectedDateValue = (): DateValue | null => {
    if (!deliveryScheduleDate) return null;
    try {
      return parseDate(deliveryScheduleDate);
    } catch (error) {
      console.error("Error parsing deliveryScheduleDate:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <Card className="w-full" radius="md" shadow="sm">
        <CardBody className="p-4 flex justify-center items-center">
          <Spinner size="sm" color="primary" label={t("loading")} />
        </CardBody>
      </Card>
    );
  }

  // If scheduling is not supported, or the store is open/online, do not show the scheduling component
  if (maxDays === 0 || !isClosed) {
    return null;
  }

  return (
    <Card className="w-full" radius="md" shadow="sm">
      <CardBody className="p-4 space-y-4">
        {/* Title Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-xs md:text-small">
              {t("cart.scheduleDelivery.title", "Schedule Delivery")}
            </p>
            <p className="text-xxs md:text-xs text-default-500">
              {t("cart.scheduleDelivery.closedDesc", "Store is currently closed. Choose a future delivery date.")}
            </p>
          </div>
        </div>



        {/* HeroUI Date Picker */}
        <div className="pt-2">
          <DatePicker
            label={t("cart.scheduleDelivery.dateLabel", "Delivery Date")}
            minValue={minDate}
            maxValue={maxDate}
            value={getSelectedDateValue()}
            onChange={handleDatePickerChange}
            className="w-full max-w-md"
            variant="bordered"
            size="md"
            showMonthAndYearPickers
            isRequired
            classNames={{
              label: "text-xs font-semibold",
              segment: "text-base",
              errorMessage: "text-xs md:text-xs font-medium",
              helperWrapper: "text-xs md:text-xs",
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default DeliveryScheduling;
