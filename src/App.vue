<template>
  <div id="app">
    <AppLayout />
    <NotificationSystem />
  </div>
</template>

<script>
import AppLayout from "./components/AppLayout.vue";
import NotificationSystem from "./components/NotificationSystem.vue";

export default {
  name: "App",
  components: {
    AppLayout,
    NotificationSystem,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
