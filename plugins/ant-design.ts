import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.dark.css'
import '../assets/styles/main.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Antd)
})
