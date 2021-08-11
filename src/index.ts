import { GoogleAPILoader } from "./api-loader";
import { GOOGLE_MAP_CALLBACK, GOOGLE_RECAPTCHA_CALLBACK } from './constants';
import { gtmPushEvent } from "./tag-manager";

declare global {
  interface Window {
    gtmDataLayer: any[];
    google: typeof google,
    grecaptcha: ReCaptchaV2.ReCaptcha;
    [GOOGLE_MAP_CALLBACK]: () => void;
    [GOOGLE_RECAPTCHA_CALLBACK]: () => void;
  }
}

export * from './types';

export {
  GoogleAPILoader,
  gtmPushEvent,
}
