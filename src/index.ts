import { apiLoader } from "./api-loader";
import { gtmPushEvent } from "./tag-manager";

declare global {
  interface Window {
    gtmDataLayer: any[];
    google: any;
    grecaptcha: any;
    gMapRes: any;
    gRecapRes: any;
  }
}

export {
  apiLoader,
  gtmPushEvent,
}
