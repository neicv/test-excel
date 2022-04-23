export const state = () => ({
  globalState: {
    isLoadingExcel: false,
    alertMessage: '',
    dataExcel: []
  }
})

export const actions = {
  setIsLoadingExcel ({ commit }, value) {
    commit('updateIsLoadingExcel', value)
  },

  setDataExcel ({ commit }, data) {
    commit('updateDataExcel', data)
  }
}
export const mutations = {
  updateIsLoadingExcel (state, value) {
    state.globalState.isLoadingExcel = value
  },

  updateDataExcel (state, data) {
    state.globalState.dataExcel = data
  }
}

export const getters = {
  getGlobalState: state => state.globalState
}
