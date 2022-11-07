import { createApp, VueElement } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRightArrowLeft,faFolder,faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import './samples/node-api'

library.add(faArrowRightArrowLeft,faFolder,faGear)


createApp(App)
  .component('font-awesome-icon',FontAwesomeIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
