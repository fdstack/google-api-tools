export function loadApi(url: string, loaded: boolean): void {
  if (document === undefined) {
    return;
  }
  if (!loaded) {
    const apiScript = document.createElement('SCRIPT');
    apiScript.setAttribute('src', url);
    apiScript.setAttribute('async', '');
    apiScript.setAttribute('defer', '');
    document.head.appendChild(apiScript);
  } else {
    throw new Error(`You are attempting to load this script multiple times. ${url}`);
  }
}
export function emptyPromise(): () => Promise<null> {
  return () => new Promise(() => null);
}
