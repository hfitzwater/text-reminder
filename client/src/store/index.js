import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/UserStore'
import reminders from './modules/ReminderStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    reminders
  }
})