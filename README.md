# Kellogg Board Fellows Matching Tool

This is a tool for the Kellogg Board Fellows program to optimally match students to board fellowships based on their ranked preferences (using the Kuhn–Munkres algorithm). Fully client-side, using web workers API in-browser to perform async computation.

Using:

* [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) + [Vuex](https://vuex.vuejs.org/)
* [Vuetify](https://vuetifyjs.com/en/) for UI
* [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

Currently (September 21, 2021) hosted here: http://kbfmatcher.kellogg.work/ using [surge.sh](https://surge.sh/) using an account belonging to @lovingawareness .

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
