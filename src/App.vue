<template>
  <BarcodeGenerator msg="Welcome to Your Vue.js App"/>
</template>

<script>
import BarcodeGenerator from './components/BarcodeGenerator.vue';

export default {
  name: 'App',
  components: {
    BarcodeGenerator
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
  background-color: green;
  height: 100%;
}
</style>
