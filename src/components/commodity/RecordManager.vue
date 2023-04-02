<template>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>当前页面:记录管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
        时间：<el-date-picker v-model="dtRange" v-bind="dtRange" type="datetimerange" start-placeholder="开始时间"
            end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
        操作类型：
        <el-select v-model="operationType" placeholder="请选择操作类型" style="width: 100px">
            <el-option v-for="ot in operationTypes" :key="ot.code" :value="ot.code" :label="ot.name">
            </el-option>
        </el-select>
        <el-button type="primary" v-on:click="queryRecords(1,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
        <el-button type="primary" v-on:click="exportExcel()">导出Excel</el-button>
    </div>
    <div>
        <el-table :data="records" stripe border="true" v-loading="loading" element-loading-text="加载中...">
            <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
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
                style="margin-left: 300px"
        />
    </div>
</template>

<script>
    import axios from "axios";
    // eslint-disable-next-line no-unused-vars
    import XLSX from 'xlsx'; // Vue3 版本
    export default {
        name: "RecordManager",
        data(){
            return {
                startTime:"",
                endTime:"",
                dtRange:[],
                page:1,
                size:20,
                total:0,
                records:[],
                operationType:"",
                operationTypes:[],
                loading:false
            }
        },
        mounted() {
            this.queryOperationTypes();
        },
        methods:{
            clearData(){
                this.dtRange=[];
                this.operationType=""
            },
            indexMethod(index) {
                return (index+1)+this.size*(this.page-1);
            },
            queryOperationTypes(){
                let wsThat = this;
                let categoryM="OPERATION_TYPE";
                let params="?category="+categoryM;
                wsThat.loading=true;
                axios.get("/api/dictionary/query"+params).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.operationTypes=response.data.data;
                    } else if(response.data.code==401) {
                        wsThat.$router.push("/wsLogin");
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                });
            },
            queryRecords(page,size){
                // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                console.log(wsThat.dtRange);
                wsThat.startTime=wsThat.handleUndefined(this.dtRange[0]);
                wsThat.endTime=wsThat.handleUndefined(this.dtRange[1]);
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime+"&operationType="+wsThat.operationType+"&page="+page+"&size="+size;
                wsThat.loading=true;
                axios.get("/api/record/query"+params).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.records=response.data.data.data;
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
                this.queryRecords(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryRecords(newPage,this.size);
            },
            exportExcel(){
                let wsThat = this;
                wsThat.startTime=this.dtRange[0];
                wsThat.endTime=this.dtRange[1];
                let params="?startTime="+wsThat.startTime+"&endTime="+wsThat.endTime;
                axios.get("/api/record/exportExcel"+params,{headers:{'Content-Type':'application/json; charset=UTF-8'},responseType:"blob"}).then(function (response) {
                    console.log(response);
                    // if(response.data.code==200){
                    //     wsThat.records=response.data.data.data;
                    //     console.log(wsThat.records);
                    //     // 创建工作表
                    //     const data = XLSX.utils.json_to_sheet(wsThat.records);
                    //     // 创建工作簿
                    //     const wb = XLSX.utils.book_new();
                    //     // 将工作表放入工作簿中
                    //     XLSX.utils.book_append_sheet(wb, data, 'data');
                    //     // 生成文件并下载
                    //     XLSX.writeFile(wb, 'test.xlsx');
                    // } else {
                    //     alert("查询失败啦");
                    // }
                    let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
                    let url = URL.createObjectURL(blob);
                    const link = document.createElement('a'); //创建a标签
                    link.href = url;
                    link.download = '操作记录信息.xlsx'; //重命名文件
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