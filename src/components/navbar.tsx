import React, { FC, useEffect, useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Link,
  Image,
  useDisclosure,
  Button,
} from "@heroui/react";
import NextLink from "next/link";
import LocationSelector from "./Location/LocationSelector";
import { ThemeSwitch } from "./theme-switch";
import GlobalSearchbar from "./Functional/GlobalSearchbar";
import {
  ShoppingCart,
  Home,
  Tags,
  HelpCircle,
  Info,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/router";
import { useSettings } from "@/contexts/SettingsContext";
import CategoryTabs from "./Functional/CategoryTabs";
import LanguageSwitcher from "./Functional/LanguageSwitcher";
import { useTranslation } from "react-i18next";
const FallbackCartIcon = () => (
  <Link as={NextLink} href="/cart">
    <ShoppingCart className="text-default-500 cursor-pointer" />
  </Link>
);

const Badge = dynamic(() => import("@heroui/react").then((mod) => mod.Badge), {
  ssr: false,
  loading: () => <FallbackCartIcon />,
});

const ProfileBtn = dynamic(() => import("./ProfileBtn"), { ssr: false });
const LoginModal = dynamic(() => import("./Modals/LoginModal"), { ssr: false });
const OfflineCartDrawer = dynamic(() => import("./Cart/OfflineCartDrawer"), {
  ssr: false,
});

export const Navbar: FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoWarning, setShowDemoWarning] = useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { webSettings, demoMode, systemSettings } = useSettings();
  const router = useRouter();
  const cartCount =
    useSelector((state: RootState) => state.cart.cartData?.items_count) || 0;

  const offLineCartCount =
    useSelector((state: RootState) => state.offlineCart.items)?.length || 0;

  const {
    isOpen: isOfflineCartOpen,
    onOpen: openOfflineCart,
    onClose: closeOfflineCart,
  } = useDisclosure();
  const {
    siteHeaderLogo = "https://placehold.co/160x40?text=Logo",
    siteHeaderDarkLogo = "https://placehold.co/160x40?text=Logo",
    siteName = "Site Logo",
  } = webSettings || {};

  useEffect(() => {
    if (webSettings?.headerScript) {
      const temp = document.createElement("div");
      temp.innerHTML = webSettings.headerScript;

      // Append each <script> dynamically
      Array.from(temp.querySelectorAll("script")).forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        }
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }
        document.head.appendChild(newScript);
      });
    }
  }, [webSettings?.headerScript]);

  useEffect(() => {
    if (isLoggedIn && isOfflineCartOpen) {
      closeOfflineCart();
    }
  }, [isLoggedIn, isOfflineCartOpen, closeOfflineCart]);

  // Menu items with translation keys
  const navMenuItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.brands"), href: "/brands", icon: Tags },
    { label: t("nav.faqs"), href: "/faqs", icon: HelpCircle },
    { label: t("nav.about_us"), href: "/about-us", icon: Info },
  ];
  return (
    <>
      <div className="w-full flex flex-col items-start shadow-none">
        {demoMode && showDemoWarning && (
          <div className="w-full bg-primary-50 dark:bg-content1 text-warning-700 text-xs sm:text-sm px-3 py-1 flex items-center justify-center gap-2 relative">
            ℹ️
            <span className="font-medium flex items-center gap-2">
              {systemSettings?.customerDemoModeMessage
                ? systemSettings.customerDemoModeMessage
                : "Currently running in Demo Mode"}
            </span>
            <Button
              onPress={() => setShowDemoWarning(false)}
              aria-label="Close demo mode warning"
              isIconOnly
              size="sm"
              radius="full"
              color="primary"
              variant="flat"
              className="min-w-1 w-6 h-6"
            >
              <X size={16} className="text-warning-700 rounded-full" />
            </Button>
          </div>
        )}

        <HeroUINavbar
          maxWidth="2xl"
          position="sticky"
          className="p-0 bg-primary text-white"
          classNames={{
            wrapper: "px-4 md:px-6 justify-between gap-4 w-full max-w-screen-2xl mx-auto",
            base: "shadow-none bg-primary text-white",
          }}
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          {/* Logo and Location */}
          <NavbarContent className="md:basis-1/4 w-full" justify="start">
            <NavbarMenuToggle
              className="md:hidden"
              aria-label={
                isMenuOpen ? t("aria.close_menu") : t("aria.open_menu")
              }
            />
            <div className="flex justify-between w-full md:min-w-32 items-center gap-4">
              <NavbarBrand className="gap-3 w-full min-w-32">
                <Link as={NextLink} href="/" title={t("nav.home")}>
                  {/* Light theme logo */}
                  <Image
                    loading="eager"
                    src={siteHeaderLogo}
                    alt={siteName}
                    radius="none"
                    className="object-contain dark:hidden"
                    classNames={{
                      img: "h-8 sm:h-10 md:h-12 w-full sm:min-w-5 md:min-w-32",
                      wrapper: "cursor-pointer",
                    }}
                  />
                  {/* Dark theme logo */}
                  <Image
                    loading="eager"
                    src={siteHeaderDarkLogo}
                    alt={siteName}
                    radius="none"
                    className="object-contain hidden dark:block"
                    classNames={{
                      img: "h-8 sm:h-10 md:h-12 w-full sm:min-w-5 md:min-w-32",
                      wrapper: "cursor-pointer",
                    }}
                  />
                </Link>
              </NavbarBrand>
              <div className="flex items-center gap-4 md:hidden">
                <NavbarItem>
                  {isLoggedIn ? (
                    <ProfileBtn />
                  ) : (
                    <LoginModal triggerView="icon" />
                  )}
                </NavbarItem>
              </div>
            </div>
            <div className="hidden md:flex w-full items-center justify-start">
              <LocationSelector btnClassName="bg-primary-700 text-white hover:bg-primary-800 px-3.5 h-10 rounded-lg flex items-center gap-1.5 font-semibold transition-colors text-xs md:text-sm border-none" />
            </div>
          </NavbarContent>

          {/* Search Bar - Desktop */}
          <NavbarContent
            className="hidden md:flex md:basis-1/2"
            justify="center"
          >
            <div className="w-full max-w-xl">
              <GlobalSearchbar />
            </div>
          </NavbarContent>

          {/* Right Side Actions - Desktop */}
          <NavbarContent className="hidden md:flex gap-3" justify="end">
            <NavbarItem className="flex items-center">
              <LanguageSwitcher variant="circle" />
            </NavbarItem>
            <NavbarItem className="flex items-center">
              <ThemeSwitch />
            </NavbarItem>
            <NavbarItem className="flex items-center">
              <div className="flex items-center">
                <Badge
                  color="danger"
                  content={
                    isLoggedIn
                      ? cartCount || undefined
                      : offLineCartCount || undefined
                  }
                  variant="solid"
                  isInvisible={isLoggedIn ? !cartCount : !offLineCartCount}
                  classNames={{ badge: "text-[10px] min-w-4 h-4 p-0 right-0 top-0 bg-white text-primary border-white font-bold" }}
                >
                  <Link
                    title={t("cart_title")}
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (isLoggedIn) {
                        router.push("/cart");
                      } else {
                        openOfflineCart();
                      }
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-700 hover:bg-primary-800 text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </Link>
                </Badge>
              </div>
            </NavbarItem>
            <NavbarItem className="flex items-center">
              {isLoggedIn ? <ProfileBtn /> : <LoginModal />}
            </NavbarItem>
          </NavbarContent>

          {/* Mobile Menu */}
          <NavbarMenu>
            <NavbarMenuItem className="flex justify-between items-center gap-4 pb-4 border-b border-divider">
              <LanguageSwitcher />
              <ThemeSwitch variant="switch" />
            </NavbarMenuItem>
            <div className="flex flex-col gap-1 mt-2">
              {navMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavbarMenuItem key={`${item.label}-${index}`}>
                    <Link
                      as={NextLink}
                      color="foreground"
                      href={item.href}
                      size="lg"
                      className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-default-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} className="text-default-500" />
                      <span>{item.label}</span>
                    </Link>
                  </NavbarMenuItem>
                );
              })}
            </div>
          </NavbarMenu>
        </HeroUINavbar>

        {/* Mobile Search & Location */}
        <div className="w-full md:hidden px-2 flex flex-col sm:flex-row sm:justify-start sm:gap-4 relative -top-[1vh] sm:top-0">
          <LocationSelector />
          <GlobalSearchbar />
        </div>

        {/* CategoryTabs */}
        {router.pathname === "/" && (
          <div
            className={`w-full max-w-screen-2xl mx-auto px-2 md:px-6 ${
              router.pathname !== "/" ? "hidden" : ""
            }`}
          >
            <CategoryTabs className="w-full" />
          </div>
        )}
      </div>
      <OfflineCartDrawer
        isOpen={isOfflineCartOpen}
        onClose={closeOfflineCart}
      />
    </>
  );
};
