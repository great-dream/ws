<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--  <ws-login />-->
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import WsLogin from './components/Login';
import wsMain from './components/Main';

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    WsLogin,wsMain
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
