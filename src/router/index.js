import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import AlbumsPage from "../views/AlbumsPage.vue";
import AlbumsDetailPage from "../views/AlbumsDetailPage.vue";
import Auth from "@aws-amplify/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "SignUpPage",
    component: SignUp,
  },
  {
    path: "/album/:id",
    name: "AlbumDetailPage",
    component: AlbumsDetailPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/albums",
    name: "AlbumsPage",
    component: AlbumsPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = await Auth.currentUserInfo();

  if (requiresAuth && !isAuthenticated) next("/");
  else next();
});

export default router;
