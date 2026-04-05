import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './stylus/variables.styl'
import './stylus/base.styl'

const app = createApp(App)
app.use(router)
app.mount('#app')
