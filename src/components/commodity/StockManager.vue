<template>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>当前页面:库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
        商品名：<el-input v-model="commodityName" placeholder="请输入商品名" type="text" style="width: 200px"></el-input>
        仓库：
        <el-select v-model="warehouse" placeholder="请选择仓库" style="width: 100px">
            <el-option v-for="wh in warehouses" :key="wh.code" :value="wh.code" :label="wh.name">
            </el-option>
        </el-select>
        仓位：<el-input v-model="position" placeholder="请输入仓位" type="text" style="width: 100px"></el-input>
        <el-button type="primary" v-on:click="queryStocks(1,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
        <el-button type="primary" v-on:click="exportExcel()">导出Excel</el-button>
    </div>
    <div>
        <el-table :data="stocks" stripe border="true" v-loading="loading" element-loading-text="加载中...">
            <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
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
                style="margin-left: 300px"
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
                commodityName:"",
                warehouse:"",
                position:"",
                page:1,
                size:20,
                total:0,
                stocks:[],
                warehouses:[],
                loading:false
            }
        },
        mounted() {
            this.queryWarehoses();
        },
        methods:{
            clearData(){
                this.dtRange=""
            },
            indexMethod(index) {
                return (index+1)+this.size*(this.page-1);
            },
            queryWarehoses(){
                let wsThat = this;
                let categoryM="WAREHOUSE";
                let params="?category="+categoryM;
                axios.get("/api/dictionary/query"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.warehouses=response.data.data;
                        console.log(wsThat.warehouses);
                    } else if(response.data.code==401) {
                        wsThat.$router.push("/wsLogin");
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            queryStocks(page,size){
                let wsThat = this;
                let params="?commodityName="+wsThat.commodityName+"&warehouse="+wsThat.warehouse+"&position="+wsThat.position+"&page="+page+"&size="+size;
                wsThat.loading=true;
                axios.get("/api/commodity/queryStock"+params).then(function (response) {
                    wsThat.loading=false;
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
                    wsThat.loading=false;
                    console.log(response);
                });
            },
            handleUndefined(dateTime){
                if (typeof dateTime == "undefined") {
                    return ''
                } else {
                  return  dateTime;
                }
            },
            handleSizeChange(newSize){
                this.queryStocks(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryStocks(newPage,this.size);
            },
            exportExcel(){
                let wsThat = this;
                let params="?commodityName="+wsThat.commodityName+"&warehouse="+wsThat.warehouse+"&position="+wsThat.position;
                axios.get("/api/commodity/exportStockExcel"+params,{headers:{'Content-Type':'application/json; charset=UTF-8'},responseType:"blob",timeout:60000}).then(function (response) {
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