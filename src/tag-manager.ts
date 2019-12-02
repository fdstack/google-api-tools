/**
 * disables pushing events in development by default
 */
const enableGTM = process.env.NODE_ENV === 'production';

/**
 * Push events to Google Tag Manager using the gtmDataLayer
 *
 * @param event
 * @param enable
 * @param rest
 */
export function gtmPushEvent({event = null, enable = enableGTM, ...rest}) {
  if (enable) {
    window.gtmDataLayer.push({
      'event': event || 'interaction',
      ...rest,
    });
  }
}
