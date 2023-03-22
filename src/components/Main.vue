<template>
    <div class="common-layout">
        <el-container id="el-container">
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">
                    <router-link to="/userManager">用户管理</router-link>
                    <router-link to="/positionManager">仓位管理</router-link>
                    <router-link to="/dictManager">字典管理</router-link>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                    <el-footer>中国电网</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>


<script>
    export default {
        name: "wsMain"

    }

</script>

<style scoped>

</style>