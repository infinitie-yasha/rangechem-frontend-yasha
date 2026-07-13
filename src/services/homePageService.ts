import {
  getBannerImages,
  getBrands,
  getCategories,
  getProducts,
  getSections,
  getSettings,
  getStores,
} from "@/routes/api";
import {
  Banner,
  Brand,
  Category,
  FeaturedSection,
  Product,
  Settings,
  Store,
} from "@/types/ApiResponse";
import { getLocationParams } from "@/helpers/functionalHelpers";
import { getWebSettings } from "@/helpers/getters";

export type HomePageData = {
  settings: Settings;
  categories: Category[];
  banners: {
    top: Banner[];
    carousel: Banner[];
    [key: string]: Banner[]; // extendable if API has more groups
  };
  products: Product[];
  brands: Brand[];
  stores: Store[];
  sections: FeaturedSection[];
};

type HomePageParams = {
  lat?: string;
  lng?: string;
  access_token?: string;
  homeCategory?: string;
};

/**
 * Centralized function to fetch all homepage data
 * Each API call is handled independently - if one fails, others continue
 * @param params - Optional parameters including lat/lng
 * @returns Promise<HomePageData> - Object containing all homepage data
 */
export const getHomePageData = async (
  params: HomePageParams = {}
): Promise<HomePageData> => {
  const { lat = "", lng = "", access_token = "", homeCategory = "" } = params;

  // Initialize with default values
  let settings: Settings = {} as Settings;
  let categories: Category[] = [];
  let banners: { top: Banner[]; carousel: Banner[] } = {
    top: [],
    carousel: [],
  };
  let products: Product[] = [];
  let brands: Brand[] = [];
  let stores: Store[] = [];
  let sections: FeaturedSection[] = [];

  // Fetch settings (still needed for site config)
  try {
    const settingsResponse = await getSettings();
    if (settingsResponse.success && settingsResponse.data) {
      settings = settingsResponse.data;
    } else {
      console.error(
        settingsResponse.message || "Invalid settings response data"
      );
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }

  const webSettings = getWebSettings(settings);
  const defaultLocation =
    webSettings?.defaultLatitude && webSettings?.defaultLongitude
      ? {
          lat: webSettings.defaultLatitude,
          lng: webSettings.defaultLongitude,
        }
      : undefined;
  const locationParams = getLocationParams({ lat, lng }, defaultLocation);
  const effectiveLat = locationParams.latitude;
  const effectiveLng = locationParams.longitude;

  // Fetch categories (works with or without location)
  try {
    const isAllCategory = homeCategory === "all" || !homeCategory;
    const slug = isAllCategory ? undefined : homeCategory;

    const categoriesResponse = await getCategories({
      page: 1,
      per_page: 15,
      ...(isAllCategory ? { home: true } : { slug }),
      ...locationParams,
    });

    if (categoriesResponse.success && categoriesResponse.data) {
      categories = categoriesResponse.data.data || [];
    } else {
      console.error(
        categoriesResponse.message || "Invalid categories response data"
      );
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  // Fetch banners (top + carousel)
  try {
    const bannersResponse = await getBannerImages({
      scope_category_slug: homeCategory ? homeCategory : undefined,
      per_page: 50,
      ...locationParams,
    });
    if (bannersResponse.success && bannersResponse.data) {
      const allBanners = bannersResponse.data.data || {};
      banners = {
        top: allBanners.top || [],
        carousel: allBanners.carousel || [],
      };
    } else {
      console.error(
        bannersResponse.message || "Invalid banners response data"
      );
    }
  } catch (error) {
    console.error("Failed to fetch banners:", error);
  }

  // Fetch brands
  try {
    const brandsResponse = await getBrands({
      scope_category_slug: homeCategory ? homeCategory : undefined,
      ...locationParams,
    });
    if (brandsResponse.success && brandsResponse.data) {
      brands = brandsResponse.data.data || [];
    } else {
      console.error(brandsResponse.message || "Invalid brands response data");
    }
  } catch (error) {
    console.error("Failed to fetch brands:", error);
  }

  // Fetch featured sections
  try {
    const sectionsResponse = await getSections({
      ...locationParams,
      access_token,
      scope_category_slug: homeCategory ? homeCategory : undefined,
    });
    if (sectionsResponse.success && sectionsResponse.data) {
      sections = sectionsResponse.data.data || [];
    } else {
      console.error(
        sectionsResponse.message || "Invalid sections response data"
      );
    }
  } catch (error) {
    console.error("Failed to fetch sections:", error);
  }

  // Products and stores require a selected location
  if (effectiveLat && effectiveLng) {
    try {
      const productsResponse = await getProducts({
        latitude: effectiveLat,
        longitude: effectiveLng,
        access_token,
        include_child_categories: 0,
        categories: homeCategory
          ? homeCategory == "all"
            ? undefined
            : homeCategory
          : undefined,
      });
      if (productsResponse.success && productsResponse.data) {
        products = productsResponse.data.data || [];
      } else {
        console.error(
          productsResponse.message || "Invalid products response data"
        );
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }

    try {
      const storesResponse = await getStores({
        latitude: effectiveLat,
        longitude: effectiveLng,
      });
      if (storesResponse.success && storesResponse.data) {
        stores = storesResponse.data.data || [];
      } else {
        console.error(storesResponse.message || "Invalid stores response data");
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  }

  return {
    settings,
    categories,
    banners,
    products,
    brands,
    stores,
    sections,
  };
};
