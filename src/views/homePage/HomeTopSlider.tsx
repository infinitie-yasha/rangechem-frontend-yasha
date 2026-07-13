import { FC } from "react";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation } from "swiper/modules";
import { Card, Image, Skeleton } from "@heroui/react";
import { getBannerImages } from "@/routes/api";
import { getActiveCategory, isSSR } from "@/helpers/getters";
import { BannerData } from "@/types/ApiResponse";
import Link from "next/link";
import { getCookie } from "@/lib/cookies";
import { UserLocation } from "@/components/Location/types/LocationAutoComplete.types";
import { useScreenType } from "@/hooks/useScreenType";
import { useTranslation } from "react-i18next";
import { getLocationParams, isRTL } from "@/helpers/functionalHelpers";
import { useSettings } from "@/contexts/SettingsContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HomeTopSliderProps = {
  initialBanners?: BannerData;
};

// Fetcher function for SWR
const fetcher = async (defaultLocation?: { lat: number; lng: number } | null) => {
  const scopeCategorySlug = getActiveCategory();

  const location = getCookie("userLocation") as UserLocation | undefined;
  const locationParams = getLocationParams(location, defaultLocation);

  const response = await getBannerImages({
    scope_category_slug: scopeCategorySlug,
    per_page: 50,
    ...locationParams,
  });

  if (!response.success || !response.data) {
    console.error(response.message || "Failed to fetch banner images");
  }

  return response.data?.data ?? { top: [], carousel: [] };
};

const HomeTopSlider: FC<HomeTopSliderProps> = ({
  initialBanners = { top: [], carousel: [] },
}) => {
  const screen = useScreenType();
  const { i18n } = useTranslation();
  const { defaultLocation } = useSettings();
  const currentLang = i18n.resolvedLanguage || i18n.language;
  const rtl = isRTL(currentLang);

  const {
    data: bannerImages,
    isLoading,
    isValidating,
    mutate,
  } = useSWR("/banners", () => fetcher(defaultLocation), {
    fallbackData: isSSR() ? initialBanners : undefined,
    revalidateOnFocus: false,
    revalidateOnMount: !isSSR(),
  });

  if (isLoading || !bannerImages || isValidating) {
    return (
      <div className="w-full my-4">
        <Skeleton className="w-full aspect-[409/240] md:aspect-[3/1] lg:aspect-[3.5/1] rounded-lg animate-pulse" />
      </div>
    );
  }

  const shouldHide = bannerImages?.top?.length === 0;
  const canLoopTop = (bannerImages?.top?.length ?? 0) > 1;

  return (
    <section id="home-slider" className="mt-4">
      <button
        onClick={() => mutate()}
        className="hidden"
        id="home-banners-refetch"
      />
      {!shouldHide && (
        <div className="relative w-full mb-4 group">
          <Swiper
            key={rtl ? "rtl-hs" : "ltr-hs"}
            dir={rtl ? "rtl" : "ltr"}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            loop={canLoopTop}
            spaceBetween={12}
            slidesPerView={1}
            navigation={{
              prevEl: ".home-top-prev",
              nextEl: ".home-top-next",
            }}
            className="rounded-lg shadow-none"
          >
            {bannerImages?.top &&
              bannerImages.top.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <Card
                    className="w-full border-none"
                    radius="lg"
                    isPressable={screen !== "mobile"}
                    as={Link}
                    shadow="none"
                    href={
                      banner.type === "brand"
                        ? `/brands/${banner.brand_slug}`
                        : banner.type === "category"
                          ? `/categories/${banner.category_slug}`
                          : banner.type === "product"
                            ? `/products/${banner.product_slug}`
                            : banner.type === "custom" && banner.custom_url
                              ? banner.custom_url
                              : "#"
                    }
                  >
                    <Image
                      src={banner.banner_image}
                      alt={banner.title}
                      loading="eager"
                      radius="lg"
                      removeWrapper
                      className="w-full h-full aspect-[409/240] md:aspect-[3/1] lg:aspect-[3.5/1] object-cover"
                    />
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Left Arrow */}
          <button className="home-top-prev absolute -left-6 xl:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hidden lg:flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer disabled:opacity-0 disabled:pointer-events-none">
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button className="home-top-next absolute -right-6 xl:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hidden lg:flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer disabled:opacity-0 disabled:pointer-events-none">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HomeTopSlider;

