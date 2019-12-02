# @fdstack/google-api-tools
A couple handy functions I use when working with Google Maps, Google Recaptcha,
or Google Tag Manager. 

## Google Map & Recaptcha
When working with the google maps js library or google recaptcha, we need 
to get access to the global objects but may want to defer loading the 
script until we actually need them. In this case it is advantageous
to have a Promise that will resolve with the global object once loaded.

### Usage
Early in your application lifecycle call the apiLoader function and provide 
the returned output to the rest of your app. Below is a simple example with Vue.
This could be modified to work with any framework though. 
##### main.ts
```typescript
import Vue from 'vue';
import { apiLoader, ApiLoaderOptions } from '@fdstack/google-api-tools';

const options: ApiLoaderOptions = {
  recap: true,
  map: {
    apiKey: 'your-gmap-api-key',
    libraries: 'places,geometry',
  }
}

const loader = apiLoader(options);
Vue.prototype.$mapPromise = loader.map;
Vue.prototype.$recapPromise = loader.recap;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
```
##### Map.vue
```vue
<template>
  <div ref="mapEl"></div>
</template>

<script>
  export default {
    data: () => ({
      google: null,
      map: null,
    }),
    async mounted() {
      this.google = await this.$mapPromise();
      this.map = new this.google.maps.Map(this.$refs.mapEl, {
        zoom: 4,
        center: { lat: 39.8290291, lng: -98.5817437 },
      });
    }
  }
</script>
```

## Google Tag Manager
This is really just a convenience function for using the gtm data layer.
The data layer allows pushing events into tag manager from your app. More
info can be found about the [gtmDataLayer](https://developers.google.com/tag-manager/devguide#datalayer)
but getting setup is fairly simple.

### Usage
Add the gtmDataLayer array to the global window object in your index page. 
Be sure to place this **above** the gtm script tag in the head. After that, 
simply import the function and push events as desired. 


 
