import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    paste: {},
    cachedPaste: JSON.parse(localStorage.getItem('cachedPaste')) || {},
    lang: undefined
  },
  getters: {
    getPaste({ paste }) {
      return paste;
    },
    getCachedPaste({ cachedPaste }) {
      return cachedPaste;
    },
    getLang({ lang }) {
      return lang;
    }
  },
  mutations: {
    setPaste(state, paste) {
      state.paste = paste;
    },
    setCachedPaste(state, cachedPaste) {
      state.cachedPaste = cachedPaste;
      localStorage.setItem('cachedPaste', JSON.stringify(cachedPaste));
    },
    setLang(state, lang) {
      state.lang = lang;
    }
  }
})
