const isBrowser = typeof window !== 'undefined';
let dn = (isBrowser && window._dn) || '35.163.232.7';

export const IS_PRODUCTION = false;
export const ENV_PLATFORM = (isBrowser && window._envPlatform);
export const BASE_URL = window.location.protocol + '//' + dn;
export const WEB_PORT = window._defaultPort || 80;
export const WEBSOCKET_URI = (isBrowser && window._dn);
export const WEBSOCKET_PORT = (isBrowser && window._websocketPort);
export const VERSION_NAME = ENV_PLATFORM === 'cloud' ? 'Cloud' : 3;
