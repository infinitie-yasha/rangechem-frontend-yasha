import { handleGoogleLogin } from "@/helpers/auth";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Link,
} from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

interface GoogleLoginBtnProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onOpenChange: () => void;
  context?: "login" | "register";
}

const GoogleLoginBtn: FC<GoogleLoginBtnProps> = ({
  isLoading,
  setIsLoading,
  onOpenChange,
  context = "login",
}) => {
  const { t } = useTranslation();
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleGoogleBtnPress = () => {
    setAgreeToTerms(false);
    setIsConsentOpen(true);
  };

  return (
    <>
      <Button
        isDisabled={isLoading}
        variant="bordered"
        className="w-full font-medium mt-4"
        onPress={handleGoogleBtnPress}
        startContent={
          <div className="w-7 h-7 object-cover">
            <Image
              src="/logos/google-logo.png"
              className="w-full h-full"
              alt="Google logo"
              width={50}
              height={50}
            />
          </div>
        }
      >
        {t("continue_with_google")}
      </Button>

      {/* Terms and Privacy Consent Popup Modal */}
      <Modal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        placement="center"
        backdrop="blur"
        size="md"
        classNames={{
          base: "rounded-lg max-w-[420px]",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg">
                  {t("register_modal.fields.termsAgreement.title") || "Terms & Privacy Policy"}
                </h3>
              </ModalHeader>
              <ModalBody className="py-5 space-y-4">
                <div className="flex items-start gap-2.5 px-0.5">
                  <Checkbox
                    isRequired
                    isSelected={agreeToTerms}
                    onValueChange={setAgreeToTerms}
                    classNames={{
                      base: "p-0 m-0 min-w-0 align-top mt-0.5",
                    }}
                  />
                  <span className="text-xs text-default-600 leading-normal select-none">
                    {t("register_modal.fields.termsAgreement.agreeText") ||
                      "I have read and agree to the"}{" "}
                    <Link
                      as={NextLink}
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline hover:text-primary-600 font-medium transition-colors"
                    >
                      {t("register_modal.fields.termsAgreement.termsLink") ||
                        "Terms & Conditions"}
                    </Link>{" "}
                    {t("register_modal.fields.termsAgreement.andText") || "and"}{" "}
                    <Link
                      as={NextLink}
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline hover:text-primary-600 font-medium transition-colors"
                    >
                      {t("register_modal.fields.termsAgreement.privacyLink") ||
                        "Privacy Policy"}
                    </Link>{" "}
                    {t("register_modal.fields.termsAgreement.accessText") ||
                      "to access the platform."}
                  </span>
                </div>
              </ModalBody>
              <ModalFooter className="flex w-full p-4">
                <Button
                  color="primary"
                  className="w-full font-medium"
                  isDisabled={!agreeToTerms}
                  onPress={async () => {
                    setIsConsentOpen(false);
                    await handleGoogleLogin({ setIsLoading, onOpenChange, context });
                  }}
                >
                  {t("register_modal.buttons.agree_register") || "Agree & Register"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GoogleLoginBtn;
