import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { AppWindow } from "lucide-react";
import { getCategories } from "@/routes/api";
import { getActiveCategory, isSSR } from "@/helpers/getters";
import { Category } from "@/types/ApiResponse";
import CategoryCard from "@/components/Cards/CategoryCard";
import CategoryCardSkeleton from "@/components/Skeletons/CategoryCardSkeleton";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import { UserLocation } from "@/components/Location/types/LocationAutoComplete.types";
import { getCookie } from "@/lib/cookies";
import { getLocationParams, isRTL } from "@/helpers/functionalHelpers";
import { useSettings } from "@/contexts/SettingsContext";

interface HomeCategoriesProps {
  initialCategories?: Category[];
}

// SWR fetcher
const fetcher = async (defaultLocation?: { lat: number; lng: number } | null) => {
  const validSlug = getActiveCategory();

  // Don't fetch if "All" is selected (section will be hidden)
  if (!validSlug) {
    return [];
  }

  const location = getCookie("userLocation") as UserLocation | undefined;
  const locationParams = getLocationParams(location, defaultLocation);

  const response = await getCategories({
    page: 1,
    per_page: 15,
    slug: validSlug,
    ...locationParams,
  });

  if (!response.success || !response.data) {
    console.error(response.message || "Failed to fetch categories");
  }

  return response.data?.data ?? [];
};

const HomeCategories: FC<HomeCategoriesProps> = ({
  initialCategories = [],
}) => {
  const { t, i18n } = useTranslation();
  const { defaultLocation } = useSettings();

  const currentLang = i18n.resolvedLanguage || i18n.language;
  const rtl = isRTL(currentLang);

  // Hide this section when viewing "All" categories or on the homepage
  // since CategoryTabs already shows all categories as tab options
  const validSlug = getActiveCategory();
  const shouldHideSection = !validSlug; // Hide when "All" is selected (no specific category)

  // Only fetch when a specific category is selected, not on homepage
  const swrKey = shouldHideSection ? null : `/categories/${validSlug}`;

  const {
    data: categories = [],
    isLoading,
    isValidating,
    mutate,
  } = useSWR(swrKey, () => fetcher(defaultLocation), {
    fallbackData: isSSR() ? initialCategories : undefined,
    revalidateOnFocus: false,
    revalidateOnMount: !isSSR(),
  });

  const slides = useMemo(
    () =>
      categories.map((category) => (
        <SwiperSlide key={category.id}>
          <div className="flex flex-col items-center">
            <CategoryCard category={category} />
          </div>
        </SwiperSlide>
      )),
    [categories],
  );

  const skeletonSlides = useMemo(() => {
    return Array.from({ length: 12 }).map((_, index) => (
      <SwiperSlide key={`skeleton-${index}`}>
        <CategoryCardSkeleton />
      </SwiperSlide>
    ));
  }, []);
  const shouldHide =
    (categories?.length === 0 && !isLoading && !isValidating) ||
    shouldHideSection;

  return (
    <section id="home-categories">
      <button
        onClick={() => mutate()}
        className="hidden"
        id="home-categories-refetch"
      />
      {!shouldHide && (
        <div className="w-full mb-4">
          <div className="flex justify-between w-full items-center mb-4">
            <SectionHeading
              title={t("home.categories.title")}
              description={t("home.categories.description")}
              icon={<AppWindow size={16} className="text-white" />}
            />
            <Link
              href={validSlug ? `/categories?slug=${validSlug}` : "/categories"}
              className="text-xs sm:text-sm"
              title={t("see_all")}
            >
              {t("see_all")}
            </Link>
          </div>
          <Swiper
            key={rtl ? "rtl-hc" : "ltr-hc"}
            dir={rtl ? "rtl" : "ltr"}
            slidesPerView={3}
            spaceBetween={1}
            breakpoints={{
              315: { slidesPerView: 3 },
              424: { slidesPerView: 4 },
              426: { slidesPerView: 5 },
              640: { slidesPerView: 7, spaceBetween: 12 },
              1024: { slidesPerView: 9, spaceBetween: 12 },
              1280: { slidesPerView: 10, spaceBetween: 12 },
              1440: { slidesPerView: 12, spaceBetween: 12 },
            }}
            lazyPreloadPrevNext={0}
            modules={[Navigation, Autoplay]}
            loop={false}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {isLoading ? skeletonSlides : slides}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default HomeCategories;
