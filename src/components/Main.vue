<template>
    <div class="common-layout">
        <el-container id="el-container">
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">
                    <router-link to="/userManager">用户管理</router-link><br>
                    <router-link to="/positionManager">仓位管理</router-link><br>
                    <router-link to="/dictManager">字典管理</router-link><br>
                    <router-link to="/recordManager">记录管理</router-link><br>
                    <router-link to="/stockManager">库存管理</router-link><br>
                    <router-link to="" v-on:click.prevent="exitWs()">退出系统</router-link><br>
                </el-aside>
                <el-container>
                    <el-main>
                        <el-config-provider :locale="locale">
                            <router-view></router-view>
                        </el-config-provider>
                    </el-main>
                    <el-footer>中国电网</el-footer>
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