import { handleCheckout } from "@/helpers/functionalHelpers";
import { Button } from "@heroui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const MpesaPayment: FC<{
  onSuccess: () => void;
  onError: () => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
}> = ({ onSuccess, onError, isLoading, setIsLoading }) => {
  const { t } = useTranslation();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      await handleCheckout("mpesaPayment", {});

      onSuccess();
    } catch (err) {
      console.error(err);
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button color="primary" isLoading={isLoading} onPress={handlePayment} className="w-full">
      {t("payments.mpesa.name")} 
    </Button>
  );
};

export default MpesaPayment;
