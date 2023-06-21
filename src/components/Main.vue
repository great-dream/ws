<template>
    <div>
        <el-container id="el-container">
            <el-header height="50px" style="font-size: 30px;background-color: #409EFF">在线仓储系统</el-header>
            <el-container>
                <el-aside width="100px"  style="background-color: #99AAFF">
                    <router-link to="/userManager">用户管理</router-link><br>
                    <router-link to="/positionManager">仓位管理</router-link><br>
                    <router-link to="/dictManager">字典管理</router-link><br>
                    <router-link to="/recordManager">记录管理</router-link><br>
                    <router-link to="/stockManager">库存管理</router-link><br>
                    <br><br><br><br><br><br><br><br><br><br>
                    <br><br><br><br><br><br><br><br>
                    <router-link to="" v-on:click.prevent="exitWs()">退出系统</router-link>
                </el-aside>
                <el-container  style="margin:0;padding:0;height: 519px">
                    <el-main style="margin:0;padding:0;height: 100%">
                        <el-config-provider :locale="locale">
                            <router-view  style="margin:0;padding:0;height: 500px"></router-view>
                        </el-config-provider>
                    </el-main>
                    <el-footer style="height: 25px;font-size: 10px;background-color:#EEEEEE">
                        CopyRight© 2023-2024 中国电网
                        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004451" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="../assets/备案图标.png" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">京公网安备 11011202004451号</p></a>
                        <a target="_blank" href="https://beian.miit.gov.cn/" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">京ICP备2023013981号-1</p></a>
                    </el-footer>
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