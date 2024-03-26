import { locale, setLocale, useI18n } from "@/i18n";
import { createSignal, type Component, Show, createEffect } from "solid-js";
import ProgressDots from "./components/Progress";
import { createCompany, migrateAndPopulate } from "@/bindings";
import Input from "@/shared/components/Menu/Input";
import { createStore } from "solid-js/store";
import LanguageBox from "./components/LanguageBox";
import { LANG } from "@/constants";
import { open } from "@tauri-apps/plugin-shell";
import { getDataByCIN } from "@/utils/getDataByCIN";
import InputList from "@/shared/components/Menu/InputList";
import { Hr } from "@/shared/components/Menu/Hr";
import { Button } from "@/shared/components/Button";
import { Title } from "./components/Title";
import { useNavigate } from "@solidjs/router";
import { useSelector } from "@/store";

interface UserData {
  companyName: string;
  cin: string;
  vatID: string;
  userName: string;
  userEmail: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    zip: string;
  };
}

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);
  const stateService = useSelector((state) => state.stateService);
  const navigate = useNavigate();
  const [userData, setUserData] = createStore<UserData>({
    companyName: "",
    cin: "",
    vatID: "",
    userName: "",
    userEmail: "",
    contact: {
      email: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      zip: "",
    },
  });

  createEffect(async () => {
    if (userData.cin.length === 8) {
      const data = await getDataByCIN(userData.cin);
      if (data) {
        setUserData({
          companyName: data.company,
          vatID: data.dic,
        });
      }
    }
  });

  const handleCreateCompany = async () => {
    try {
      const result = await createCompany({
        cin: userData.cin,
        name: userData.companyName,
        vatId: userData.vatID,
        email: userData.contact.email,
        phoneNumber: userData.contact.phone,
        city: userData.address.city,
        postalCode: userData.address.zip,
        streetAddress: userData.address.street,
      });

      stateService.updateState({ companyId: result.id });
      navigate("/");
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <div class="flex justify-center items-center w-screen h-screen" data-tauri-drag-region>
      <div class="w-3/4 h-5/7 bg-secondary rounded-xl drop-shadow-xl flex items-center justify-center flex-col gap-8 relative">
        <ProgressDots count={5} active={currentStep()} />
        <Show when={currentStep() === 0}>
          <Title>{t("setup.welcome")}</Title>
          <Button
            onClick={() => {
              setCurrentStep(1);
              migrateAndPopulate();
            }}
          >
            {t("setup.get_started")}
          </Button>
        </Show>

        <Show when={currentStep() === 1}>
          <Title>{t("setup.step1.select_language")}</Title>
          <div>
            <div class="flex gap-4">
              <LanguageBox onClick={() => setLocale(LANG.CS)} active={locale() === LANG.CS}>
                🇨🇿
              </LanguageBox>
              <LanguageBox onClick={() => setLocale(LANG.EN)} active={locale() === LANG.EN}>
                🇬🇧
              </LanguageBox>
            </div>
            <p
              class="text-primary text-center cursor-pointer text-lightgrey mt-2"
              onClick={() => open("https://github.com")}
            >
              {t("setup.step1.improve")}
            </p>
          </div>
          <Button onClick={() => setCurrentStep(2)}>{t("setup.continue")}</Button>
        </Show>

        <Show when={currentStep() === 2}>
          <div class="w-full h-full overflow-y-auto">
            <div class="w-full flex items-center justify-center flex-col">
              <Title class="mt-12 mb-8">{t("setup.step2.create_company")}</Title>
              <InputList>
                <Input
                  id="companyName"
                  label={t("setup.step2.company_name")}
                  class="col-span-2"
                  onChange={(e) => setUserData("companyName", e.currentTarget.value)}
                />
                <Input
                  id="cin"
                  label={t("setup.step2.CIN")}
                  info={t("setup.step2.help.retrieve_by_cin")}
                  onChange={(e) => setUserData("cin", e.currentTarget.value)}
                />
                <Input
                  id="vatID"
                  label={t("setup.step2.vatID")}
                  onChange={(e) => setUserData("vatID", e.currentTarget.value)}
                />
                <Hr />
                <Input
                  id="street"
                  label={t("setup.step2.street")}
                  onChange={(e) => setUserData("address", "street", e.currentTarget.value)}
                />
                <Input
                  id="city"
                  label={t("setup.step2.city")}
                  onChange={(e) => setUserData("address", "city", e.currentTarget.value)}
                />
                <Input
                  id="zip"
                  label={t("setup.step2.zip")}
                  onChange={(e) => setUserData("address", "zip", e.currentTarget.value)}
                />
                <Hr />
                <Input
                  id="email"
                  label={t("setup.step2.email")}
                  onChange={(e) => setUserData("contact", "email", e.currentTarget.value)}
                />
                <Input
                  id="phone"
                  label={t("setup.step2.phone")}
                  onChange={(e) => setUserData("contact", "phone", e.currentTarget.value)}
                />
              </InputList>
              <Button class="my-8" onClick={handleCreateCompany}>
                {t("setup.finalize")}
              </Button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default SetupWizard;
