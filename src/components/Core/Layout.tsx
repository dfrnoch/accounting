import { ParentComponent } from "solid-js";
import { useI18n } from "../../i18n";

const Layout: ParentComponent = (props) => {
  const [t] = useI18n();

  return (
    <div class="container flex flex-row">
      <div class="w-1/4 bg-gray">
        <h1 class="text-2xl font-bold">
          {t.hello()}, {t.world()}!
        </h1>
      </div>
      <div class="w-3/4">{props.children}</div>
    </div>
  );
};

export default Layout;
