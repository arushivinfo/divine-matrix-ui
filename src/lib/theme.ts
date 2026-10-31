export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dm.theme";

/**
 * Runs in <head> before first paint: uses the visitor's saved choice, otherwise
 * their device setting, so the page never flashes the wrong theme.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
