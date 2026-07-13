import { Skeleton } from "@heroui/react";
import React from "react";

interface SkeletonTabButtonProps {
  size?: "sm" | "lg";
}

const SkeletonTabButton: React.FC<SkeletonTabButtonProps> = ({
  size = "sm",
}) => {
  const isLarge = size === "lg";
  return (
    <div
      className={`
        flex flex-row items-center border border-default-200 dark:border-default-100 rounded-2xl bg-white dark:bg-default-50 min-w-max animate-pulse
        ${
          isLarge
            ? "gap-3 px-4 py-2 h-14"
            : "gap-2.5 px-3.5 py-1.5 h-11"
        }
      `}
    >
      {/* Icon Skeleton */}
      <div
        className={`
          flex items-center justify-center rounded-xl bg-default-100/80 dark:bg-default-250 shrink-0
          ${
            isLarge
              ? "w-10 h-10"
              : "w-8 h-8"
          }
        `}
      >
        <Skeleton
          className={`
            rounded-lg
            ${
              isLarge
                ? "w-7 h-7"
                : "w-5.5 h-5.5"
            }
          `}
        />
      </div>

      {/* Title Skeleton */}
      <Skeleton
        className={`
          h-3.5 rounded-sm
          ${isLarge ? "w-16" : "w-12"}
        `}
      />
    </div>
  );
};

export default SkeletonTabButton;
