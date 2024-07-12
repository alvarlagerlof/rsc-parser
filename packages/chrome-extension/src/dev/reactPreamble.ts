// @ts-expect-error Vite special sauce
import RefreshRuntime from 'http://localhost:6020/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
// @ts-expect-error Vite special sauce
window.$RefreshReg$ = () => {};
// @ts-expect-error Vite special sauce
window.$RefreshSig$ = () => (type) => type;
// @ts-expect-error Vite special sauce
window.__vite_plugin_react_preamble_installed__ = true;
