# Kellogg Board Fellows Matching Tool

This is a tool for the Kellogg Board Fellows program to optimally match students to board fellowships based on their ranked preferences (using the [Hungarian algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm)). Fully client-side in the browser, using web workers API to perform computation asynchronously.

Using:

- [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) + [Vuex](https://vuex.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/) for UI
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [munkres-js](https://www.npmjs.com/package/munkres-js) - Munkres (Hungarian) algorithm implementation for Javascript

Currently (September 21, 2021) hosted here: http://kbfmatcher.kellogg.work/ using [surge.sh](https://surge.sh/) using an account belonging to Nicholas Bennett.

## How To Use It

It is a bit wonky in terms of the process, but it’s essentially:

1. Export the results from Qualtrics as a CSV.
1. Open the CSV on Excel.
1. Select all cells and copy.
1. Open this Qualtrics Converter page (http://kbfmatcher.kellogg.work/qualtrics) and paste into the “Qualtrics Input (CSV)” text area.
1. Scroll down to the “Rankings Matrix Output (CSV)”, select everything in that text area, and copy.
1. Open the main Optimizer page (http://kbfmatcher.kellogg.work/) and paste into the “CSV/TSV of Student Rankings of Companies”.
1. Press the “FIND ASSIGNMENTS” button.
1. The assignments will show below in a table, along with a download link to a new CSV with the assignments there. The name of the CSV file indicates the average ranking of the matches, with the closer to 1 meaning more people got their first choice or very close to it.

I separated out the Qualtrics parsing function from the optimizer function in case the Qualtrics format ever changes in a way that would break the whole process. If Qualtrics changes, then worst case scenario you could still manually extract the results and make a new CSV spreadsheet following the form indicated in the Optimizer help:

![image](https://user-images.githubusercontent.com/486230/135540130-67abd322-fda9-4f5b-89f6-1b5748eb622c.png)

If you copy the fake data it generates out of this text area, you can paste it into an Excel spreadsheet, do the Data > Text to Columns function with commas selected as the delimiter, and you’ll get an idea of the matrix form. Modify with the real company names, students, and rankings, and you’d be able to paste this back into the optimizer for calculation.

This is all to try to future proof this a bit, anticipating it might live on well after I forget I wrote it.

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

### Docker Commands

Until the docker image is avaiabile on dockerhub, the image is created locally.

Clone the repo and cd into the root directory. Run

```
docker build --tag kbfoptimizer .
```

To run / deploy run

```
docker compose up
```
