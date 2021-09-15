/* eslint-disable */
import { Auth } from "aws-amplify";

export const auth = {
  namespaced: true,
  state: { user: null },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    async logout({ commit }) {
      commit("setUser", null);
      return await Auth.signOut();
    },
    async login({ commit }, { username, password }) {
      try {
        await Auth.signIn(username, password);
        const userInfo = await Auth.currentUserInfo();
        commit("setUser", userInfo);
        return Promise.resolve("Success");
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
    async confirmSignUp(_, { username, code }) {
      try {
        await Auth.confirmSignUp(username, code);
        return Promise.resolve("Success");
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    },
    async signUp(_, { username, password, email }) {
      try {
        await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
        });
        return Promise.resolve("Success");
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    },
    async authAction({ commit }) {
      const userInfo = await Auth.currentUserInfo();
      commit("setUser", userInfo);
    },
  },
};
