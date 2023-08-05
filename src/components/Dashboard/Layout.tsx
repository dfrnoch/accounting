import { ParentComponent } from "solid-js";
import Sidebar from "./Sidebar";

const Layout: ParentComponent = (props) => {
  return (
    <div class="flex flex-row w-screen">
      {/* TODO: Sidebard close funtion idk */}
      <Sidebar />
      <div class="w-4/5">{props.children}</div>
    </div>
  );
};

export default Layout;
