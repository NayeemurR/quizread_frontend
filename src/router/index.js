import { createRouter, createWebHistory } from "vue-router";
import Library from "../views/Library.vue";
import Reading from "../views/Reading.vue";
import Auth from "../views/Auth.vue";
import { useAuth } from "../stores/auth.js";

const routes = [
  {
    path: "/",
    redirect: "/library",
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    meta: { requiresGuest: true },
  },
  {
    path: "/library",
    name: "Library",
    component: Library,
    meta: { requiresAuth: true },
  },
  {
    path: "/reading/:bookId",
    name: "Reading",
    component: Reading,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/auth");
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next("/library");
    return;
  }

  next();
});

export default router;
