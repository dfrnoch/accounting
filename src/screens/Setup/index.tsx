import { locale, setLocale, useI18n } from "@/i18n";
import { createSignal, type Component, Show, createEffect } from "solid-js";
import ProgressDots from "./components/Progress";
import { createCompany, migrateAndPopulate } from "@/bindings";
import Input from "@/shared/components/Menu/Input";
import { createStore } from "solid-js/store";
import LangaugeBox from "./components/LanguageBox";
import { LANG } from "@/constants";
import { open } from "@tauri-apps/plugin-shell";
import { getDataByCIN } from "@/utils/getDataByCIN";
import InputList from "@/shared/components/Menu/InputList";
import { Hr } from "@/shared/components/Menu/Hr";
import { Button } from "./components/Button";
import { Title } from "./components/Title";
import { useNavigate } from "@solidjs/router";

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);
  const navigate = useNavigate();
  const [userData, setUserData] = createStore({
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

  createEffect(() => {
    if (userData.cin.length === 8) {
      getDataByCIN(userData.cin).then((data) => {
        if (data) {
          console.log(data);
          setUserData({
            companyName: data.company,
            vatID: data.dic,
          });
        }
      });
    }
  }, [userData.cin]);

  return (
    <div class="flex justify-center items-center w-screen h-screen " data-tauri-drag-region>
      <div class="w-3/4 h-5/7 bg-secondary rounded-xl drop-shadow-xl flex items-center justify-center flex-col gap-8 relative ">
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
              <LangaugeBox onClick={() => setLocale(LANG.CS)} active={locale() === LANG.CS}>
                🇨🇿
              </LangaugeBox>
              <LangaugeBox onClick={() => setLocale(LANG.EN)} active={locale() === LANG.EN}>
                🇬🇧
              </LangaugeBox>
            </div>
            <p
              class="text-primary text-center cursor-pointer text-lightgrey mt-2"
              onClick={() => {
                open("https://github.com");
              }}
            >
              {t("setup.step1.improve")}
            </p>
          </div>
          <Button onClick={() => setCurrentStep(2)}>{t("setup.continue")}</Button>
        </Show>

        <Show when={currentStep() === 2}>
          <div class="w-full h-full overflow-y-auto ">
            <div class="w-full flex items-center justify-center flex-col ">
              <Title class="mt-12 mb-8">{t("setup.step2.create_company")}</Title>
              <InputList>
                <Input
                  id="companme"
                  label={t("setup.step2.company_name")}
                  class="col-span-2"
                  onChange={(e) => setUserData("companyName", e.target.value)}
                />
                <Input
                  id="CIN"
                  label={t("setup.step2.CIN")}
                  info={t("setup.step2.help.retrieve_by_cin")}
                  onChange={(e) => setUserData("cin", e.target.value)}
                />
                <Input
                  id="vatID"
                  label={t("setup.step2.vatID")}
                  onChange={(e) => setUserData("vatID", e.target.value)}
                />
                <Hr />
                <Input
                  id="address"
                  label={t("setup.step2.street")}
                  onChange={(e) => setUserData("address", "street", e.target.value)}
                />
                <Input
                  id="city"
                  label={t("setup.step2.city")}
                  onChange={(e) => setUserData("address", "city", e.target.value)}
                />
                <Input
                  id="zip"
                  label={t("setup.step2.zip")}
                  onChange={(e) => setUserData("address", "zip", e.target.value)}
                />
                <Hr />
                <Input
                  id="email"
                  label={t("setup.step2.email")}
                  onChange={(e) => setUserData("contact", "email", e.target.value)}
                />
                <Input
                  id="phone"
                  label={t("setup.step2.phone")}
                  onChange={(e) => setUserData("contact", "phone", e.target.value)}
                />
              </InputList>
              <Button
                class="my-8"
                onClick={async () => {
                  try {
                    console.log(userData.address);
                    await createCompany({
                      cin: userData.cin,
                      name: userData.companyName,
                      vatId: userData.vatID,
                      email: userData.contact.email,
                      phoneNumber: userData.contact.phone,
                      city: userData.address.city,
                      postalCode: userData.address.zip,
                      streetAddress: "ahoj",
                    });

                    navigate("/loader");
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
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
