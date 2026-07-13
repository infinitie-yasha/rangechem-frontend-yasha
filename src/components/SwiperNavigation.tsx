import { FC, RefObject } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwiperNavigationProps {
  prevRef: RefObject<HTMLButtonElement | null>;
  nextRef: RefObject<HTMLButtonElement | null>;
  rtl?: boolean;
}

const SwiperNavigation: FC<SwiperNavigationProps> = ({
  prevRef,
  nextRef,
  rtl = false,
}) => {
  return (
    <>
      {/* Previous Button */}
      <Button
        isIconOnly
        ref={prevRef}
        size="md"
        radius="full"
        aria-label="Previous"
        className="hidden lg:flex
        absolute -left-6 xl:-left-14 top-1/2 -translate-y-1/2 z-20
        bg-white/95 hover:bg-white text-gray-700 shadow-md disabled:opacity-0 disabled:pointer-events-none
        transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer w-10 h-10 min-w-0"
      >
        {rtl ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </Button>

      {/* Next Button */}
      <Button
        isIconOnly
        ref={nextRef}
        size="md"
        radius="full"
        aria-label="Next"
        className="hidden lg:flex
        absolute -right-6 xl:-right-14 top-1/2 -translate-y-1/2 z-20
        bg-white/95 hover:bg-white text-gray-700 shadow-md disabled:opacity-0 disabled:pointer-events-none
        transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer w-10 h-10 min-w-0"
      >
        {rtl ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </Button>
    </>
  );
};

export default SwiperNavigation;
