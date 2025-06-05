import { useTheme } from "../../context/themeContext";

export const useThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return {
    theme,
    handleThemeChange
  };
};