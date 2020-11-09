<template>
  <div id="app">
    <Google_map/>
  </div>
</template>

<script>
import Google_map from './components/Google map.vue';

export default {
  name: 'App',
  components: {
    Google_map
  }
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
