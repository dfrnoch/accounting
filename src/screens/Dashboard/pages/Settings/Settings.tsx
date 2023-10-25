import { Component } from "solid-js";
import Toolbar from "./components/Toolbar";
import { FiSettings } from "solid-icons/fi";

const Settings: Component = () => {
  return (
    <div class="">
      <div class="w-full h-20 gap-2 flex justify-center items-center border-b border-black">
        <Toolbar text="Nastavení" icon={<FiSettings />} active={true} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
        <Toolbar text="Nastavení" icon={<FiSettings />} />
      </div>
      <div class="w-full h-full px-20">aaa</div>
    </div>
  );
};

export default Settings;
