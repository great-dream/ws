<template>
    <div>
        时间：<el-date-picker v-model="dtRange" type="datetimerange" start-placeholder="Start Date"
                           end-placeholder="End Date" value-format="YYYY-MM-DD HH:mm:ss" />
        <el-button type="primary" v-on:click="queryStocks(this.page,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
    </div>
    <div align="left">
        <el-button type="primary" v-on:click="exportExcel()">导出Excel</el-button>
    </div>
    <div>
        <el-table :data="stocks" stripe>
            <el-table-column prop="warehouseName" label="仓库名称"></el-table-column>
            <el-table-column prop="position" label="仓位号"></el-table-column>
            <el-table-column prop="pluginNameName" label="插件名称"></el-table-column>
            <el-table-column prop="commodityName" label="商品名称"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
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
                dtRange:"",
                page:1,
                size:20,
                total:0,
                stocks:[]
            }
        },
        methods:{
            clearData(){
                this.dtRange=""
            },
            queryStocks(page,size){
                let wsThat = this;
                wsThat.startTime=this.dtRange[0];
                wsThat.endTime=this.dtRange[1];
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime+"&page="+page+"&size="+size;
                axios.get("/api/commodity/queryStock"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.stocks=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(wsThat.records);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            handleSizeChange(newSize){
                this.queryStocks(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryStocks(newPage,this.size);
            },
            exportExcel(){
                let wsThat = this;
                wsThat.startTime=this.dtRange[0];
                wsThat.endTime=this.dtRange[1];
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime;
                axios.get("/api/commodity/exportStockExcel"+params,{headers:{'Content-Type':'application/json; charset=UTF-8'},responseType:"blob"}).then(function (response) {
                    console.log(response);
                    let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
                    let url = URL.createObjectURL(blob);
                    const link = document.createElement('a'); //创建a标签
                    link.href = url;
                    link.download = '库存信息.xlsx'; //重命名文件
                    link.click();
                    URL.revokeObjectURL(url);
                    console.log("下载文件" + response);

                }).catch(function (response) {
                    console.log(response);
                });
            }
        }
    }
</script>

<style scoped>

</style>