import CoreClient from '../../services/core.js';

const baseState = {
  active: null
};

export const USER_MUTATIONS = {
  SET_USER: 'setUser'
};

const mutations = {
  [USER_MUTATIONS.SET_USER] (state, user) {
    state.active = user;
  }
};

export const USER_ACTIONS = {
  GET_USER_FROM_TOKEN: 'getUserFromToken',
  LOGIN: 'login',
  SIGNUP: 'signup',
  LOGOUT: 'logout',
  CONFIRM_PHONE: 'confirmPhone'
};

const actions = {
  async [USER_ACTIONS.GET_USER_FROM_TOKEN]({ commit }) {
    const user = await CoreClient.getUserFromToken();
    commit(USER_MUTATIONS.SET_USER, user);
  },
  async [USER_ACTIONS.LOGIN]({ commit }, loginInfo) {
    const user = await CoreClient.login(loginInfo.email, loginInfo.password);
    commit(USER_MUTATIONS.SET_USER, user);
  },
  async [USER_ACTIONS.SIGNUP]({ commit }, signupInfo) {
    const user = await CoreClient.signup(signupInfo.email, signupInfo.phoneNumber, signupInfo.password);
    commit(USER_MUTATIONS.SET_USER, user);
  },
  [USER_ACTIONS.LOGOUT]({ commit }) {
    CoreClient.logout();
    commit(USER_MUTATIONS.SET_USER, null);
  },
  async [USER_ACTIONS.CONFIRM_PHONE]({ commit, state }, code) {
    const result = await CoreClient.confirmPhone(code);

    let updatedUser = state.active;
    updatedUser.phoneNumber = result.phoneNumber;

    commit(USER_MUTATIONS.SET_USER, updatedUser);
  }
}

export const USER_GETTERS = {};

const getters = {};

export default {
  state: baseState,
  mutations,
  actions,
  getters
};
