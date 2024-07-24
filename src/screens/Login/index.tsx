import { type Company, getCompanies, validateCompanyPassword } from "@/bindings";
import { useI18n } from "@/i18n";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Form/Input";
import { useSelector } from "@/store";
import { useNavigate } from "@solidjs/router";
import { FiCheck, FiLock } from "solid-icons/fi";
import { createSignal, For, onMount, type Component, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import toast from "solid-toast";

const Login: Component = () => {
  const [companies, setCompanies] = createSignal<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = createSignal<number | null>(null);
  const [password, setPassword] = createSignal<string>("");
  const [isValidating, setIsValidating] = createSignal<boolean>(false);
  const [passwordError, setPasswordError] = createSignal<string | null>(null);
  const navigate = useNavigate();
  const [t] = useI18n();
  const stateService = useSelector((state) => state.stateService);

  onMount(async () => {
    const data = await getCompanies();
    console.log(data);
    setCompanies(data);
  });

  const setCompany = async (company: Company) => {
    if (company.isProtected) {
      setIsValidating(true);
      const isValid = await validateCompanyPassword(company.id, password());
      setIsValidating(false);
      if (!isValid) {
        setPasswordError(t("pages.login.invalidPassword"));
        toast.error(t("pages.login.invalidPassword"));
        return;
      }
    }
    stateService.updateState({ companyId: company.id });
    toast.success(t("pages.login.switchedCompany"));
    navigate("/dashboard");
  };

  const handleCompanyClick = (companyId: number) => {
    setSelectedCompany((prev) => (prev === companyId ? null : companyId));
    setPassword("");
    setPasswordError(null);
  };

  return (
    <div class="w-screen h-screen flex flex-col justify-center items-center" data-tauri-drag-region>
      <div class="w-96 bg-primary rounded-lg shadow-xl flex flex-col items-center justify-between p-6 gap-4">
        <h2 class="text-2xl font-bold text-primary">{t("pages.login.manageAccounts")}</h2>
        <p class="text-sm text-secondary -mt-2">{t("pages.login.switchAccountsDescription")}</p>
        <div class="overflow-y-auto w-full max-h-80 space-y-3 shadow-inner rounded-lg p-2">
          <For each={companies()}>
            {(company) => (
              <Motion.div
                animate={{
                  scale: selectedCompany() === company.id ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                class="flex flex-col rounded-lg border border-default w-full bg-element hover:bg-opacity-80 transition-colors duration-200 cursor-pointer overflow-hidden"
              >
                <div class="flex items-center justify-between p-3" onClick={() => handleCompanyClick(company.id)}>
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                      <div class="w-full h-full bg-gray-400" />
                    </div>
                    <div>
                      <h3 class="text-primary font-semibold">{company.name}</h3>
                      <p class="text-secondary text-sm">{company.email}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    {company.isProtected && <FiLock class="w-4 h-4 text-secondary" />}
                    {selectedCompany() === company.id && <FiCheck class="w-5 h-5 text-green-600" />}
                  </div>
                </div>
                <Presence>
                  {selectedCompany() === company.id && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      class="flex flex-col justify-center items-center py-2 px-3 space-y-2"
                    >
                      <Show when={company.isProtected}>
                        <Input
                          type="password"
                          label={t("pages.login.password")}
                          placeholder={t("pages.login.enterPassword")}
                          onChange={(value) => setPassword(value)}
                          errors={passwordError() ? [passwordError()] : undefined}
                          class="w-full"
                        />
                      </Show>
                      <Button class="w-2/3" onClick={() => setCompany(company)} disabled={isValidating()}>
                        {isValidating() ? t("pages.login.validating") : t("pages.login.logIn")}
                      </Button>
                    </Motion.div>
                  )}
                </Presence>
              </Motion.div>
            )}
          </For>
        </div>
        <Button class="w-full" onClick={() => navigate("/setup/2")}>
          {t("pages.login.addAccount")}
        </Button>
      </div>
    </div>
  );
};

export default Login;
