<template>
  <div class="row">
    <SideBar/>
    <Main/>
  </div>
</template>

<script>
import Main from './components/Main'
import SideBar from './components/SideBar'

export default {
  name: 'App',
  components: {
    Main,SideBar
  },
}
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
