import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    emotion: null,
  },
  mutations: {
    setEmotion(state, emotion) {
      state.emotion = emotion;
    },
  },
});
