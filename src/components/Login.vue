<template>
    <div>在线仓储系统</div>
    <div>
        用户名<input v-model="userId" type="text" />
    </div>
    <div>
        密  码<input v-model="password" type="password" />
    </div>
    <div>
        <input  type="button" value="登  录" v-on:click="login()" />
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import axios from "axios";
    // import store from "@/store";

    export default {
        name: "wsLogin",
        data(){
            return {
                userId:"",
                password:""
            }
        },
        methods:{
            login () {
                let wsThat = this;
                axios.post("/api/user/login",{"userId":wsThat.userId,"password":wsThat.password}).then(function (response) {
                    console.log(response);
                    // store.dispatch('SetToken',response.data.token);
                    sessionStorage.setItem('token',response.data.data.token);
                    wsThat.$router.push({path:"/"});
                }).catch(function (response) {
                    console.log(response);
                });
            }
        }
    }
</script>

<style scoped>

</style>