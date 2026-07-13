import { Product } from "@/types/ApiResponse";
import { Card, CardBody, CardHeader, Avatar, Chip } from "@heroui/react";
import Link from "next/link";
import { FC } from "react";
import { useTranslation } from "react-i18next";
// ⭐ Lucide icon

const SoldBySection: FC<{ product: Product }> = ({ product }) => {
  const { t } = useTranslation();
  const {
    variants,
    store_status = {
      is_open: false,
      current_slot: null,
      next_opening_time: null,
    },
  } = product || {};
  const defaultVariant = variants?.[0];

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-3">
        <Avatar
          size="lg"
          name={defaultVariant?.store_name || t("soldBySection.storeLabel")}
          radius="lg"
          className="bg-primary/10 text-primary font-bold"
        />
        <div className="flex flex-col">
          <div className="flex gap-2 justify-start items-center">
            {defaultVariant?.store_slug ? (
              <Link
                href={`/stores/${defaultVariant.store_slug}`}
                className="text-medium font-semibold hover:text-primary transition-colors"
                title={defaultVariant.store_name}
              >
                {defaultVariant.store_name}
              </Link>
            ) : (
              <h3 className="text-medium font-semibold">
                {defaultVariant?.store_name || t("soldBySection.storeLabel")}
              </h3>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-1">
        {store_status?.is_open !== undefined && (
          <Chip
            color={store_status.is_open ? "success" : "danger"}
            variant="flat"
            className="mb-2"
          >
            {store_status.is_open
              ? t("soldBySection.open")
              : t("soldBySection.closed")}
          </Chip>
        )}

        <p className="text-sm text-foreground/50 mb-1">
          {store_status?.is_open
            ? t("soldBySection.acceptingOrders")
            : t("soldBySection.storeClosed")}
        </p>

        {/* Show next opening time only if closed */}
        {!store_status?.is_open && store_status?.next_opening_time && (
          <p className="text-sm text-primary font-medium">
            {t("soldBySection.opensAt")} {store_status.next_opening_time}
          </p>
        )}
      </CardBody>
    </Card>
  );
};

export default SoldBySection;
