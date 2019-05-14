import BatchExport from './batch-export.vue'

const plugins = {
  install(Vue) {
      Vue.component(BatchExport.name, BatchExport)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(BatchExport)
}

export default plugins
