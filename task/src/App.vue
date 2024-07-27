<template>
  <div class="row">
    <SideBar/>
    <Main/>
  </div>
</template>

<script>
import SideBar from "./components/SideBar";
import Main from "./components/Main.vue";

export default {
  name: "App",
  components: {
    // for 月曆
    Main,
    // for側邊任務類別tab
    SideBar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
