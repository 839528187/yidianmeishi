import util from '@/libs/util.js'

export default {
  namespaced: true,
  state: {
    // D2Admin 版本
    version: '1.0.0'
  },
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state vuex state
     */
    versionShow (state) {
      util.log.capsule('壹点美食', `v${state.version}`)
    }
  }
}
