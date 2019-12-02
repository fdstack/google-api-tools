import { GOOGLE_MAP_URL, GOOGLE_RECAPTCHA_URL } from './constants';
import { emptyPromise, loadApi } from './utils';

export interface ApiLoaderOptions {
  recap?: boolean;
  map?: GoogleMapOptions | false;
}

export interface GoogleMapOptions {
  apiKey: string;
  libraries?: string;
}

export type RecaptchaPromise = () => Promise<ReCaptchaV2.ReCaptcha|null>;
export type MapPromise = () => Promise<any>;

/**
 * Loads the google map and/or google recaptcha js library,
 * Provides a function for each library specified in the options
 * and returns a promise that resolves to the respective global object once loaded
 *
 * @param options
 * @throws Error - when map options are missing an api key
 */
export function apiLoader(options: ApiLoaderOptions): { map?: MapPromise, recap?: RecaptchaPromise } {
  validateOptions(options);
  let isMapLoaded = false;
  let isRecapLoaded = false;

  const api: { map?: MapPromise, recap?: RecaptchaPromise } = {};
  const config: ApiLoaderOptions = {
    recap: options.recap ? options.recap : false,
    map: options.map ? options.map : false,
  };

  if (config.recap) {
    api.recap = makeRecapPromise();
  }
  if (config.map) {
    api.map = makeMapPromise(config.map.apiKey, config.map.libraries);
  }

  function makeMapPromise(apiKey: string, libraries?: string): MapPromise {
    if (window !== undefined) {
      let mapApiUrl = `${GOOGLE_MAP_URL}&key=${apiKey}`;
      if (libraries) {
        mapApiUrl += `&libraries=${libraries}`;
      }

      let promise = new Promise((resolve, reject) => {
        try {
          window.gMapRes = resolve;
          loadApi(mapApiUrl, isMapLoaded);
        } catch (err) {
          reject(err);
        }
      });

      return () => {
        if (!isMapLoaded) {
          isMapLoaded = true;
          promise = promise.then(_ => window.google);
        }
        return promise;
      };
    }
    return emptyPromise();
  }
  function makeRecapPromise(): RecaptchaPromise {
    if (window !== undefined) {
      let promise: Promise<ReCaptchaV2.ReCaptcha> = new Promise((resolve, reject) => {
        try {
          window.gRecapRes = resolve;
          loadApi(GOOGLE_RECAPTCHA_URL, isRecapLoaded);
        } catch (err) {
          reject(err);
        }
      });

      return () => {
        if (!isRecapLoaded) {
          isRecapLoaded = true;
          promise = promise.then(_ => window.grecaptcha);
        }
        return promise;
      };
    }
    return emptyPromise();
  }

  return api;
}

function validateOptions(options: ApiLoaderOptions) {
  if (!options) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`It looks like you may have forgotten to configure the 
      @fdstack/google-api-tools/api-loader. See https://github.com/fdstack/google-api-tools for more details`);
    }
    return;
  }
  if (options && options.map && !options.map.apiKey) {
    throw new Error(`A google maps javascript API key is required to use google maps. You must either
    define options.map as false, leave it undefined, or pass an api key`);
  }
}
