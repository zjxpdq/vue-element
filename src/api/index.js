import * as v1 from './v1'

const api = {
  ...v1,
  install(Vue) {
    Vue.prototype.$api = api
  }
}

export default api
