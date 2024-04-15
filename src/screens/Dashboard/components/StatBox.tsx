import { useI18n } from "@/i18n";
import { useSelector } from "@/store";
import { type Component, Show } from "solid-js";

const StatBox: Component<{
  title: string;
  value: number;
  last?: number;
}> = (props) => {
  const percentageChange = (current: number, last?: number) => {
    if (!last) return 0;

    const percentage = ((current - last) / last) * 100;
    return Number(percentage.toFixed(2));
  };
  const [t] = useI18n();

  const settings = useSelector((state) => state.settingsService.settings);

  const percentage = percentageChange(props.value, props.last);
  const isNegative = percentage < 0;

  return (
    <div class="p-2.5 rounded-lg border bg-element border-default h-25 w-full relative overflow-hidden">
      <div
        class={"absolute top-0 right-0 w-14 h-8 rounded-lg blur-md"}
        classList={{
          "bg-red-500/30": isNegative,
          "bg-green-500/30": !isNegative,
        }}
      />
      <div class="flex flex-col justify-between items-stretch w-full h-full">
        <div class="flex flex-row justify-between items-start">
          <p class="text-xs font-medium">{props.title}</p>
          <div
            class={"text-sm"}
            classList={{
              "text-red-600": isNegative,
              "text-green-600": !isNegative,
            }}
          >
            {percentage}%
          </div>
        </div>
        <div class="flex flex-col justify-between text-secondary gap-1">
          <p class="text-xl font-medium text-primary">
            {props.value} {settings.defaultCurrency.code}
          </p>
          <Show when={props.last}>
            <p class="text-xs font-normal">
              {props.last} {settings.defaultCurrency.code} {t("statbox.lastMonth")}
            </p>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default StatBox;
