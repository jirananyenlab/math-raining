import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/campaign",
    name: "campaign",
    component: () => import("../views/CampaignMode.vue"),
  },
  {
    path: "/inGame/:mode:level",
    name: "inGame",
    component: () => import("../views/InGame.vue"),
  },
  {
    path: "/competitive",
    name: "competitive",
    component: () => import("../views/CompetitiveMode.vue"),
  },
  {
    path: "/custom",
    name: "custom",
    component: () => import("../views/CustomMode.vue"),
  },
  {
    path: "/tutorial",
    name: "tutorial",
    component: () => import("../views/Tutorial.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfilePage.vue"),
  },
  {
    path: "/credit",
    name: "credit",
    component: () => import("../views/Credit.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (
    to.name === "inGame" &&
    !(
      from.name === "tutorial" ||
      from.name === "competitive" ||
      from.name === "campaign" ||
      from.name === "custom"
    )
  )
    { return { name: "home" }; }
  else if(to.name === "profile" && !useUserStore().isLoggedIn) { return { name: "home" }; }
});



export default router;
