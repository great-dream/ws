<template>
    <div style="height: 550px;margin: 0;padding: 0">
        <el-container id="el-container"  style="height: 550px;margin: 0;padding: 0">
            <el-header height="50px" style="margin-top: 5px;font-size: 30px;background-color: #409EFF">在线仓储系统</el-header>
            <el-container style="height: 500px;margin: 0;padding: 0">
                <el-aside width="100px"  style="background-color: #99AAFF;height: 500px">
                    <router-link to="/userManager">用户管理</router-link><br>
                    <router-link to="/positionManager">仓位管理</router-link><br>
                    <router-link to="/dictManager">字典管理</router-link><br>
                    <router-link to="/recordManager">记录管理</router-link><br>
                    <router-link to="/stockManager">库存管理</router-link><br>
                    <router-link to="" v-on:click.prevent="exitWs()">退出系统</router-link><br>
                </el-aside>
                <el-container  style="margin:0;padding:0;height: 500px">
                    <el-main style="margin:0;padding:0;height: 500px">
                        <el-config-provider :locale="locale">
                            <router-view  style="margin:0;padding:0;height: 500px"></router-view>
                        </el-config-provider>
                    </el-main>
                    <el-footer style="height: 25px;font-size: 10px;background-color:#EEEEEE">CopyRight© 2023-2024 中国电网</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>


<script>
    //如下设置，使分页空间显示中文
    import {ElConfigProvider} from 'element-plus'
    import zhCn from 'element-plus/lib/locale/lang/zh-cn'
    export default {
        name: "wsMain",
        components:{
            ElConfigProvider
        },
        setup(){
            return {
                locale:zhCn
            }
        },
        methods:{
            exitWs(){
               // sessionStorage.setItem("token",null);
               sessionStorage.clear();
               this.$router.push("/wsLogin");
            }
        }
    }

</script>

<style scoped>

</style>