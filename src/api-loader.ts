import {
  GOOGLE_MAP_CALLBACK,
  GOOGLE_MAP_ID,
  GOOGLE_MAP_URL, GOOGLE_RECAPTCHA_CALLBACK,
  GOOGLE_RECAPTCHA_ID,
  GOOGLE_RECAPTCHA_URL
} from './constants';
import {
  CallbackName,
  GoogleAPILoaderOptions,
  IGoogleMap,
  IGoogleRecaptcha,
} from './types';

export class GoogleAPILoader {
  private readonly mapConfig?: IGoogleMap;
  private readonly recaptchaConfig: IGoogleRecaptcha;
  private recaptcha?: ReCaptchaV2.ReCaptcha;
  private map?: typeof google;

  constructor(private options: GoogleAPILoaderOptions) {
    if (this.options && this.options.map && !this.options.map.apiKey) {
      throw new Error(`A google maps javascript API key is required to use google maps. You must either
    define options.map as false, leave it undefined, or pass an api key`);
    }
    this.recaptchaConfig = { id: GOOGLE_RECAPTCHA_ID, ...this.options.recaptcha };
    this.mapConfig =
      this.options.map !== undefined
        ? { id: GOOGLE_MAP_ID, ...this.options.map }
        : undefined;
  }

  async loadMaps(): Promise<typeof google> {
    if (!this.mapConfig) throw new Error('To load the Google Maps library the GoogleMapOptions must be provided with an API key');

    if (!this.map) {
      let mapApiUrl = `${GOOGLE_MAP_URL}&key=${this.mapConfig.apiKey}`;
      if (this.mapConfig.libraries) {
        mapApiUrl += `&libraries=${this.mapConfig.libraries}`;
      }
      if (this.mapConfig.language) {
        mapApiUrl += `&language=${this.mapConfig.language}`;
      }
      if (this.mapConfig.region) {
        mapApiUrl += `&region=${this.mapConfig.region}`;
      }
      try {
        await this.createAPIPromise(this.mapConfig.id, mapApiUrl, GOOGLE_MAP_CALLBACK);
      } catch (e) {
        // TODO: Handle errors gracefully. Possibly with a retry
        console.error('Loading Google Maps failed with the following error: ', e);
        throw e;
      }
      this.map = window.google;
    }

    return this.map;
  }

  async loadRecaptcha(): Promise<ReCaptchaV2.ReCaptcha> {
    if (!this.recaptcha) {
      try {
        await this.createAPIPromise(this.recaptchaConfig.id, GOOGLE_RECAPTCHA_URL, GOOGLE_RECAPTCHA_CALLBACK);
      } catch (e) {
        // TODO: Handle errors gracefully. Possibly with a retry
        console.error('Loading Google Recaptcha failed with the following error: ', e)
        throw e;
      }
      this.recaptcha = window.grecaptcha;
    }
    return this.recaptcha
  }

  private createAPIPromise(id: string, url: string, callbackName: CallbackName): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        window[callbackName] = resolve;
        this.createScript(url, id);
      } catch (err) {
        reject(err);
      }
    });
  }

  private createScript(url: string, id: string): void {
    if (!document) {
      return;
    }
    const created = document.getElementById(id);
    if (!created) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'text/javascript';
      script.src = url;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      // TODO: Come back to consider how this works here
      console.error(
        `The script tag with the id "${id}" is trying to load multiple times`
      );
    }
  }
}
