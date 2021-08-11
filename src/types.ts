export interface GoogleAPILoaderOptions {
	recaptcha?: GoogleRecaptchaOptions;
	map?: GoogleMapOptions;
}

export interface IGoogleRecaptcha {
	/**
	 * Script tag id for the Google Recaptcha API script.
	 */
	id: string;
}

export type GoogleRecaptchaOptions = Partial<IGoogleRecaptcha>;

export interface IGoogleMap {
	apiKey: string;
	/**
	 * Script tag id for the Google Map API script.
	 */
	id: string;
	/**
	 * Optionally load additional Google Maps Libraries
	 * https://developers.google.com/maps/documentation/javascript/libraries
	 */
	libraries?: MapLibraries;
	/**
	 * By default, the Maps API uses the user's preferred language
	 * setting as specified in the browser and this is the preferred method.
	 *
	 *  Overriding is possible, see supported languages https://developers.google.com/maps/faq#languagesupport
	 */
	language?: string;
	/**
	 * When loading Google Maps from maps.googleapis.com it applies a
	 * default bias towards the United States. Setting a region will override this behavior.
	 *
	 * The region parameter accepts Unicode region subtag identifiers.
	 */
	region?: string;
}

export type GoogleMapOptions = Partial<IGoogleMap> & Pick<IGoogleMap, 'apiKey'>

export type CallbackName = 'gMapCb' | 'gRecaptchaCb';
export type MapLibraries = (
	| 'drawing'
	| 'geometry'
	| 'localContext'
	| 'places'
	| 'visualization'
	)[];
