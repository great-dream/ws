<template>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>当前页面:仓位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
        仓库：
        <el-select v-model="warehouse" placeholder="请选择仓库" >
            <el-option v-for="wh in warehouses" :key="wh.code" :value="wh.code" :label="wh.name">
            </el-option>
        </el-select>
        仓位：<el-input v-model="position" placeholder="请输入仓位" type="text" style="width: 200px"></el-input>
        <el-button type="primary" v-on:click="queryPositions(1,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
        <el-button type="primary" v-on:click="addPosition()">新增仓位</el-button>
    </div>
    <div>
        <el-table :data="positions" stripe border="true" v-loading="loading" element-loading-text="加载中...">
<!--            <el-table-column prop="id" label="唯一键"></el-table-column>-->
            <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
            <el-table-column prop="warehouse" label="仓库">
                <template #default="scope">
                    {{warehouseName(scope.row.warehouse)}}
                </template>
            </el-table-column>
<!--            <el-table-column prop="cabinet" label="仓柜"></el-table-column>-->
            <el-table-column prop="position" label="仓位"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="deleteFlag" label="是否删除">
                <template #default="scope">
                    {{scope.row.deleteFlag?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="140px">
                <template #default="scope">
                    <el-button type="primary" size="small" v-on:click="editPosition(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="primary" size="small"  v-if="scope.row.deleteFlag" v-on:click="activatePositionApi(scope.$index,scope.row)">激活</el-button>
                    <el-button type="primary" size="small"  v-if="!scope.row.deleteFlag" v-on:click="deletePositionApi(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
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
    <!-- 新增仓位对话框 -->
    <el-dialog title="新增仓位" v-model="addPositionVisible">
        <el-form :model="addForm" :rules="commonRules" ref="addForm">
            <el-form-item label="仓库" prop="warehouse" :required="true">
                <el-select v-model="addForm.warehouse" placeholder="请选择仓库" >
                    <el-option v-for="wh in warehouses" :key="wh.code" :value="wh.code" :label="wh.name">
                    </el-option>
                </el-select>
            </el-form-item>
<!--            <el-form-item label="仓柜">-->
<!--                <el-input v-model="addForm.cabinet" autocomplete="off"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="仓位" prop="position" :required="true">
                <el-input v-model="addForm.position" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数量">
                <el-input v-model="addForm.number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="addForm.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="删除">
                <el-switch v-model="addForm.deleteFlag"></el-switch>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="addPositionVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="addPositionApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="修改仓位" v-model="editPositionVisible">
        <el-form :model="editForm" :rules="commonRules" ref="editForm">
            <el-form-item label="id">
                <el-input v-model="editForm.id" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="仓  库" prop="warehouse" :required="true">
                <el-select v-model="editForm.warehouse" placeholder="请选择仓库" >
                    <el-option v-for="wh in warehouses" :key="wh.code" :value="wh.code" :label="wh.name">
                    </el-option>
                </el-select>
            </el-form-item>
<!--            <el-form-item label="仓柜">-->
<!--                <el-input v-model="editForm.cabinet" autocomplete="off"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="仓  位" prop="position" :required="true">
                <el-input v-model="editForm.position" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数  量">
                <el-input v-model="editForm.number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备  注">
                <el-input type="textarea" v-model="editForm.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="删  除">
                <el-switch v-model="editForm.deleteFlag"></el-switch>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="editPositionVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="editPositionApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
    import axios from "axios";
    export default {
        name: "PositionManager",
        data(){
            return {
                warehouse:"",
                position:"",
                page:1,
                size:20,
                total:0,
                positions:[],
                addPositionVisible:false,
                addForm:{
                    warehouse:"",cabinet:"",position:"",number:"",remark:""
                },
                editPositionVisible:false,
                editForm:{
                    id:"",warehouse:"",cabinet:"",position:"",number:"",remark:""
                },
                warehouses:[],
                loading:false,
                commonRules: {
                    warehouse:[{ required: true, message: '仓库必选', trigger: ['blur','change'] }],
                    position:[{ required: true, message: '仓位必填', trigger: 'blur' }]
                }
            }
        },
        mounted() {
         this.queryWarehoses();
        },
        methods:{
            clearData(){
                this.warehouse="";
                this.position="";
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
            warehouseName(code){
                for(let wh of this.warehouses){
                    if(code==wh.code){
                        return wh.name;
                    }
                }
                return code;
            },
            queryPositions(page,size){
               // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                let params="?warehouse="+wsThat.warehouse+"&position="+wsThat.position+"&page="+page+"&size="+size;
                wsThat.loading=true;
                axios.get("/api/position/query"+params).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.positions=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(wsThat.positions);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                });
            },
            handleSizeChange(newSize){
                this.queryPositions(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryPositions(newPage,this.size);
            },
            addPosition(){
                this.addPositionVisible=true;
            },
            addPositionApi(){
                this.$refs.addForm.validate((valid) => {
                    if(!valid) {
                        this.$message.warning('请调整标红数据后再请求');
                        return false;
                    } else {
                        let thisWs=this;
                        axios.post("/api/position/addPosition",thisWs.addForm).then(function (response) {
                            console.log(response);
                            if(response.data.code==200){
                                alert(response.data.msg);
                                thisWs.addPositionVisible=false;
                                thisWs.queryPositions(thisWs.page,thisWs.size);
                            } else {
                                alert(response.data.msg);
                            }
                        }).catch(function (response) {
                            console.log(response);
                        });
                    }
                })
            },
            // editPosition(){
            //     this.editPositionVisible=true;
            // },
            editPosition(index,row){
                this.editPositionVisible=true;
                console.log(index+'---'+row);
                this.editForm=row;

            },
            editPositionApi(){
                this.$refs.editForm.validate((valid) => {
                    if(!valid) {
                        this.$message.warning('请调整标红数据后再请求');
                        return false;
                    } else {
                        let thisWs=this;
                        axios.post("/api/position/editPosition",thisWs.editForm).then(function (response) {
                            console.log(response);
                            if(response.data.code==200){
                                alert(response.data.msg);
                                thisWs.editPositionVisible=false;
                                thisWs.queryPositions(thisWs.page,thisWs.size);
                            } else {
                                alert(response.data.msg);

                            }
                        }).catch(function (response) {
                            console.log(response);
                        });
                    }
                })
            },
            deletePositionApi(index,row){
                row.deleteFlag=1;
                this.editForm=row;
                let thisWs=this;
                axios.post("/api/position/editPosition",thisWs.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                        thisWs.queryPositions(thisWs.page,thisWs.size);
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            activatePositionApi(index,row){
                row.deleteFlag=0;
                this.editForm=row;
                let thisWs=this;
                axios.post("/api/position/editPosition",thisWs.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                        thisWs.queryPositions(thisWs.page,thisWs.size);
                    } else {
                        alert(response.data.msg);
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