<template>
    <div style="text-align: center;height:519px;">
        <!-- 为了登录框上下左右剧中 position: absolute; left: 50%;top: 50%;transform: translate(-50%,-50%);-->
        <el-form style="width: 300px;border: #409EFF 1px solid;position: absolute; left: 50%;top: 50%;transform: translate(-50%,-50%);"  v-loading="loading" element-loading-text="加载中...">
            <el-form-item ><el-text style="margin: auto;font-size:25px"><b>在线仓储系统</b></el-text></el-form-item>
            <el-form-item label="账号">
                <el-input v-model="userId" size="150px"/>
            </el-form-item>
            <el-form-item label="密&nbsp&nbsp码">
                <el-input type="password" v-model="password" show-password size="150px" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login()" style="margin-left: 50px;">登录</el-button>
                <el-button type="primary" @click="clearData()" style="margin-left: 70px;">重置</el-button>
            </el-form-item>
        </el-form>
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
                password:"",
                loading:false
            }
        },
        methods:{
            login () {
                let wsThat = this;
                wsThat.loading=true;
                axios.post("/api/user/login",{"userId":wsThat.userId,"password":wsThat.password}).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        // store.dispatch('SetToken',response.data.token);
                        sessionStorage.setItem('token',response.data.data.token);
                        wsThat.$router.push({path:"/"});
                    } else {
                        alert(response.data.msg);
                    }
                }).catch(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    alert(response);
                });
            },
            clearData(){
                this.userId="",
                this.password=""
            }
        }
    }
</script>

<style scoped>

</style>