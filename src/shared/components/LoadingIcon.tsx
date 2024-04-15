import { FiLoader } from "solid-icons/fi";
import type { Component } from "solid-js";

const LoadingIcon: Component = () => {
  return (
    <div class="absolute w-screen h-screen top-0 left-0 flex items-center justify-center transition-all bg-black/20">
      <FiLoader class="animate-spin text-primary w-6 h-6 text-secondary" />
    </div>
  );
};

export default LoadingIcon;
