import { createStore } from "vuex";
import { auth } from "./auth/auth";
import { albumInfo } from "./albums/albums";

export default createStore({
  modules: {
    auth,
    albumInfo,
  },
});
