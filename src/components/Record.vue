<template>
    <el-table :data="tableData">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="subject" label="科目"></el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "wsRecord"
    }
</script>

<style scoped>

</style>