# Kellogg Board Fellows Matching Tool

This is a tool for the Kellogg Board Fellows program to optimally match students to board fellowships based on their ranked preferences (using the [Hungarian algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm)). Fully client-side in the browser, using web workers API to perform computation asynchronously.

Using:

* [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) + [Vuex](https://vuex.vuejs.org/)
* [Vuetify](https://vuetifyjs.com/en/) for UI
* [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
* [munkres-js](https://www.npmjs.com/package/munkres-js) - Munkres (Hungarian) algorithm implementation for Javascript

Currently (September 21, 2021) hosted here: http://kbfmatcher.kellogg.work/ using [surge.sh](https://surge.sh/) using an account belonging to Nicholas Bennett.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
