<template>
    <div>
        时间：<el-date-picker v-model="dateTimeRange" type="datetimerange" start-placeholder="Start Date"
                           end-placeholder="End Date" :default-time="defaultTime" />
        <el-button type="primary" v-on:click="queryRecords(this.page,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
    </div>
    <div align="left">
        <el-button type="primary" v-on:click="exportExcel()">导出Excel</el-button>
    </div>
    <div>
        <el-table :data="records" stripe>
            <el-table-column prop="commodityName" label="商品名称"></el-table-column>
            <el-table-column prop="pluginNameName" label="插件名称"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
            <el-table-column prop="operationTypeName" label="操作类型"></el-table-column>
            <el-table-column prop="userId" label="操作人账号"></el-table-column>
            <el-table-column prop="userName" label="操作人名称"></el-table-column>
            <!--            <el-table-column prop="" label="操作">-->
            <!--                <template #default="scope">-->
            <!--                    <el-button type="primary" v-on:click="editUser(scope.$index,scope.row)">编辑</el-button>-->
            <!--                </template>-->
            <!--            </el-table-column>-->
        </el-table>
        <!--分页组件-->
        <el-pagination
                :current-page="page"
                :page-size="size"
                :page-sizes="[2, 5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
    import axios from "axios";
    // eslint-disable-next-line no-unused-vars
    import XLSX from 'xlsx'; // Vue3 版本
    export default {
        name: "StockManager",
        data(){
            return {
                startTime:"",
                endTime:"",
                dateTimeRange:"",
                // eslint-disable-next-line no-global-assign
                defaultTime:[Date, Date] = [
                    new Date(2000, 1, 1, 0, 0, 0),
                    new Date(2000, 2, 1, 23, 59, 59),
                ], // '12:00:00', '08:00:00'
                page:1,
                size:20,
                total:0,
                records:[]
            }
        },
        methods:{
            clearData(){
                this.dateTimeRange=""
            },
            queryRecords(page,size){
                // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                console.log(this.datetimerange);
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime+"&page="+page+"&size="+size;
                axios.get("/api/commodity/queryStock"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.records=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(this.records);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            handleSizeChange(newSize){
                this.queryRecords(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryRecords(newPage,this.size);
            },
            exportExcel(){
                let wsThat = this;
                console.log(this.datetimerange);
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime;
                axios.get("/api/commodity/exportStockExcel"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.records=response.data.data.data;
                        console.log(wsThat.records);
                        // 创建工作表
                        const data = XLSX.utils.json_to_sheet(wsThat.records);
                        // 创建工作簿
                        const wb = XLSX.utils.book_new();
                        // 将工作表放入工作簿中
                        XLSX.utils.book_append_sheet(wb, data, 'data');
                        // 生成文件并下载
                        XLSX.writeFile(wb, 'test.xlsx');
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            }
        }
    }
</script>

<style scoped>

</style>