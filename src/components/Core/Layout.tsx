import { ParentComponent } from "solid-js";

const Layout: ParentComponent = (props) => {
  return <div class="container mx-auto px-4">{props.children}</div>;
};

export default Layout;
