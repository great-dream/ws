<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--  <ws-login />-->
<!--  <router-view/>-->
<!--  <UserManager />-->
<ws-main />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import WsLogin from './components/Login.vue';

import WsMenu from './components/Menu';
import UserManager from "@/components/user/UserManager";
import wsMain from './components/Main';

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    HelloWorld,WsLogin,WsMenu,UserManager,wsMain

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
