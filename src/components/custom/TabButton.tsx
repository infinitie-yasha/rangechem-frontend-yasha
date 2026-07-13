import React, { useEffect, useRef } from "react";
import { Image } from "@heroui/react";
import { LayoutGrid } from "lucide-react";

interface Category {
  id: number;
  title: string;
  slug: string;
  image: string;
  icon: string;
  active_icon: string;
  description: string | null;
  status: string;
}

interface TabButtonProps {
  slug: string;
  title: string;
  category?: Category | null;
  isSelected: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  staticIcon?: React.ReactNode;
  size?: "sm" | "lg";
}

const TabButton: React.FC<TabButtonProps> = ({
  slug,
  title,
  category = null,
  isSelected,
  isLoading = false,
  onClick,
  staticIcon,
  size = "sm",
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Auto trigger when "see-more" is visible
  useEffect(() => {
    if (slug !== "see-more" || !buttonRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          onClick?.();
        }
      },
      { threshold: 1 },
    );

    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, [slug, isLoading, onClick]);

  const iconUrl =
    isSelected && category?.active_icon
      ? category.active_icon
      : category?.icon || category?.image;

  const isLarge = size === "lg";

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex flex-row items-center transition-all duration-200 min-w-max shrink-0 border rounded-2xl
        ${
          isLarge
            ? "gap-3 px-4 py-2 h-14"
            : "gap-2.5 px-3.5 py-1.5 h-11"
        }
        ${
          isSelected
            ? "border-primary bg-primary/5 text-primary font-bold animate-pulse-subtle"
            : "border-default-200 dark:border-default-100 bg-white dark:bg-default-50 text-default-700 font-semibold hover:border-default-300 dark:hover:border-default-200 hover:text-default-900"
        }
        ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
      `}
    >
      {/* Icon Wrapper */}
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
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={title}
            loading="eager"
            radius="none"
            removeWrapper
            className={`
              object-contain
              ${
                isLarge
                  ? "w-8 h-8"
                  : "w-6 h-6"
              }
            `}
          />
        ) : (
          staticIcon || (
            <LayoutGrid
              className={`
                ${
                  isLarge
                    ? "w-8 h-8"
                    : "w-6 h-6"
                }
                ${isSelected ? "text-primary" : "text-default-400"}
              `}
            />
          )
        )}
      </div>

      {/* Title */}
      <span
        className={`
          whitespace-nowrap leading-none
          ${isLarge ? "text-sm sm:text-base font-medium" : "text-xs sm:text-sm font-semibold"}
        `}
      >
        {title}
      </span>

      {/* Loader */}
      {isLoading && (
        <div className="animate-spin rounded-sm h-3 w-3 border-b-2 border-primary ml-1" />
      )}
    </button>
  );
};

export default TabButton;
