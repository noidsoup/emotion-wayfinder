<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  background: black;
}

@font-face {
  font-family: Rubik;
  src: url('/assets/Rubik-Regular.ttf');
}

#app {
  font-family: Rubik;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 2.0em;
  color: #ffeeff;
  margin: 0;
  padding: 0;
}
</style>
