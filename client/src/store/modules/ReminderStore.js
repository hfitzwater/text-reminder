import CoreClient from '../../services/core.js';

const state = {
  all: null
};

export const REMINDER_MUTATIONS = {
  SET_REMINDERS: 'setReminders',
  UPSERT_REMINDER: 'upsertReminder',
  REMOVE_REMINDER: 'removeReminder'
};

const mutations = {
  [REMINDER_MUTATIONS.SET_REMINDERS] (state, reminders) {
    state.all = reminders;
  },
  [REMINDER_MUTATIONS.UPSERT_REMINDER] (state, reminder) {
    const existingIndex = state.all.findIndex(r => r.id === reminder.id);
    
    if( existingIndex === -1 ) {
      state.all.push(reminder);
    } else {
      state.all.splice(existingIndex, 1, reminder);
    }
  },
  [REMINDER_MUTATIONS.REMOVE_REMINDER] (state, reminderId) {
    state.all = state.all.filter(r => {
      return r.id !== reminderId;
    });
  }
};

export const REMINDER_ACTIONS = {
  CREATE_REMINDER: 'createReminder',
  UPDATE_REMINDER: 'updateReminder',
  DELETE_REMINDER: 'deleteReminder',
  GET_USER_REMINDERS: 'getUserReminders'
};

const actions = {
  async [REMINDER_ACTIONS.GET_USER_REMINDERS]({ commit }) {
    const reminders = await CoreClient.getReminders();
    commit(REMINDER_MUTATIONS.SET_REMINDERS, reminders);
  },
  async [REMINDER_ACTIONS.CREATE_REMINDER]({ commit }, reminder) {
    const result = await CoreClient.createReminder(reminder);
    commit(REMINDER_MUTATIONS.UPSERT_REMINDER, result.data);
    return result;
  },
  async [REMINDER_ACTIONS.UPDATE_REMINDER]({ commit }, reminder) {
    const result = await CoreClient.updateReminder(reminder);
    commit(REMINDER_MUTATIONS.UPSERT_REMINDER, result.data);
    return result;
  },
  async [REMINDER_ACTIONS.DELETE_REMINDER]({ commit }, reminderId) {
    const result = await CoreClient.deleteReminder(reminderId);
    commit(REMINDER_MUTATIONS.REMOVE_REMINDER, reminderId);
    return result;
  }
}

export const REMINDER_GETTERS = {};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
};
