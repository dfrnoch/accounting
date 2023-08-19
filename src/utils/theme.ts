export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const setTheme = (theme: Theme) => {
  if (theme === Theme.Dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const getTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.Dark : Theme.Light;
};
