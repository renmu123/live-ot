import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home.vue"),
  },
  {
    path: "/ot",
    name: "ot",
    component: () => import("@/views/ot.vue"),
  },
  {
    path: "/ot/:roomId",
    name: "otWithRoomId",
    component: () => import("@/views/ot.vue"),
  },
  {
    path: "/danmu",
    name: "danmu",
    component: () => import("@/views/danmu.vue"),
  },
  {
    path: "/danmu/:roomId",
    name: "danmuWithRoomId",
    component: () => import("@/views/danmu.vue"),
  },
  // {
  //   path: "/:error*",
  //   name: "404",
  //   component: () => import("@/views/404.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
