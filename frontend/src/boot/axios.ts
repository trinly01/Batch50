import { boot } from 'quasar/wrappers'

import axios from 'axios'

const $backendApi = axios.create({
  baseURL: 'http://localhost:1337/api'
})

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app } /* { app, router, ... } */) => {
  // something to do
  

  app.config.globalProperties.$backendApi = $backendApi
})

export {axios, $backendApi}


