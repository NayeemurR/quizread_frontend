import { createRouter, createWebHistory } from "vue-router";
import Library from "../views/Library.vue";
import Reading from "../views/Reading.vue";

const routes = [
  {
    path: "/",
    redirect: "/library",
  },
  {
    path: "/library",
    name: "Library",
    component: Library,
  },
  {
    path: "/reading/:bookId",
    name: "Reading",
    component: Reading,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
