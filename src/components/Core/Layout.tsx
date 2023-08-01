import { ParentComponent } from "solid-js";
import MenuButton from "../Menu/Button";
import { useI18n } from "../../i18n";

const Layout: ParentComponent = (props) => {
  const [t] = useI18n();

  return (
    <div class="container flex flex-row">
      <div class="w-1/5 bg-gray">
        <MenuButton label={t.hello()} icon="home" active={true} onClick={() => {}} />

      </div>
      <div class="w-4/5">{props.children}</div>
    </div>
  );
};

export default Layout;
