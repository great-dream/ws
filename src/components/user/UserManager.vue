<template>
    <el-breadcrumb separator="/" style="margin-left: 5px;margin-bottom: 5px">
        <el-breadcrumb-item>当前页面:用户管理</el-breadcrumb-item>
    </el-breadcrumb>
<!--    <div style="margin: auto;font-size: 25px">用户管理</div>-->
    <div>
        账号：<el-input v-model="userId" placeholder="请输入账号" type="text" style="width: 200px"></el-input>
        用户名：<el-input v-model="userName" placeholder="请输入用户名" type="text" style="width: 200px"></el-input>
        <el-button type="primary" v-on:click="queryUsers(1,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
        <el-button type="primary" v-on:click="addUser()">新增用户</el-button>
    </div>
    <div>
        <el-table :data="users" stripe border="true" v-loading="loading" element-loading-text="加载中..."  max-height="400px">
<!--            <el-table-column prop="id" label="唯一键"></el-table-column>-->
            <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
            <el-table-column prop="userId" label="账号"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="phoneNumber" label="电话号码"></el-table-column>
            <el-table-column prop="managerFlag" label="是否管理员">
                <template #default="scope">
                    {{scope.row.managerFlag?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="deleteFlag" label="是否删除">
                <template #default="scope">
                    {{scope.row.deleteFlag?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="" label="操作" width="140px">
                <template #default="scope">
                    <el-button type="primary" size="small" v-on:click="editUser(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="primary" size="small"  v-if="scope.row.deleteFlag" v-on:click="activateUserApi(scope.$index,scope.row)">激活</el-button>
                    <el-button type="primary" size="small"  v-if="!scope.row.deleteFlag" v-on:click="deleteUserApi(scope.$index,scope.row)">删除</el-button>
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
    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" v-model="addUserVisible">
        <el-form :model="addForm" :rules="commonRules" ref="addForm">
            <el-form-item label="账号" prop="userId" :required="true">
                <el-input v-model="addForm.userId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :required="true">
                <el-input v-model="addForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName" :required="false">
                <el-input v-model="addForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber" :required="false">
                <el-input v-model="addForm.phoneNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-switch v-model="addForm.managerFlag"></el-switch>
            </el-form-item>
<!--            <el-form-item label="删除">-->
<!--                <el-switch v-model="addForm.deleteFlag"></el-switch>-->
<!--            </el-form-item>-->
            <el-form-item label="备注" prop="remarks" :required="false">
                <el-input type="textarea" v-model="addForm.remarks" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="addUserVisible=false">取消</el-button>
                <el-button type="primary" v-on:click="addUserApi()">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" v-model="editUserVisible">
        <el-form :model="editForm" :rules="commonRules" ref="editForm">
<!--            <el-form-item label="id">-->
<!--                <el-input v-model="editForm.id" disabled="false"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="账号"  prop="userId" :required="true">
                <el-input v-model="editForm.userId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :required="true">
                <el-input v-model="editForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName" :required="false">
                <el-input v-model="editForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber" :required="false">
                <el-input v-model="editForm.phoneNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-switch v-model="editForm.managerFlag"></el-switch>
            </el-form-item>
            <el-form-item label="删除">
                <el-switch v-model="editForm.deleteFlag"></el-switch>
            </el-form-item>
            <el-form-item label="备注"  prop="remarks" :required="false">
                <el-input type="textarea" v-model="editForm.remarks" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="editUserVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="editUserApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
    import axios from "axios";
    export default {
        name: "UserManager",
        data(){
            return {
                userId:"",
                userName:"",
                page:1,
                size:20,
                total:0,
                users:[],
                addUserVisible:false,
                addForm:{
                    userId:"",password:"",userName:"",phoneNumber:"",managerFlag:false,deleteFlag:false,remarks:""
                },
                editUserVisible:false,
                editForm:{
                    id:"",userId:"",password:"",userName:"",phoneNumber:"",managerFlag:false,deleteFlag:false,remarks:""
                },
                loading:false,
                commonRules: {
                    userId:[{ required: true, message: '账户必填', trigger: 'blur' }
                     ,{ required: false, max:255,message: '账户不能超过255字', trigger: 'blur' }],
                    password:[{ required: true, message: '密码必填', trigger: 'blur' }
                     ,{message: '请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种',pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/,trigger: 'blur'}],
                    userName:[{ required: false, max:255,message: '用户名不能超过255字', trigger: 'blur' }],
                    phoneNumber:[{ required: false,message:'请输入正确的电话号码',pattern:/^(1[34578]\d{9})$/, trigger: 'blur'}],
                    remarks:[{ required: false, max:255,message: '备注不能超过255字', trigger: 'blur' }]
                }
            }
        },
        methods:{
            clearData(){
                this.userId="";
                this.userName="";
            },
            indexMethod(index) {
                return (index+1)+this.size*(this.page-1);
            },
            queryUsers(page,size){
               // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                let params="?userId="+wsThat.userId+"&userName="+wsThat.userName+"&page="+page+"&size="+size;
                wsThat.loading=true;
                axios.get("/api/user/query"+params).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.users=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(wsThat.users);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                    wsThat.loading=false;
                });
            },
            handleSizeChange(newSize){
                this.queryUsers(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryUsers(newPage,this.size);
            },
            addUser(){
                this.addUserVisible=true;
            },
            addUserApi(){
                this.$refs.addForm.validate((valid) => {
                    if(!valid) {
                        this.$message.warning('请调整标红数据后再请求');
                        return false;
                    } else {
                        let thisWs=this;
                        axios.post("/api/user/addUser",thisWs.addForm).then(function (response) {
                            console.log(response);
                            if(response.data.code==200){
                                alert(response.data.msg);
                                thisWs.addUserVisible=false;
                                thisWs.queryUsers(thisWs.page,thisWs.size);//添加成功后，刷新表格数据
                            } else {
                                alert(response.data.msg);
                            }
                        }).catch(function (response) {
                            console.log(response);
                        });
                    }
                })
            },
            // editUser(){
            //     this.editUserVisible=true;
            // },
            editUser(index,row){
                this.editUserVisible=true;
                console.log(index+'---'+row);
                this.editForm=row;

            },
            editUserApi(){
                this.$refs.editForm.validate((valid) => {
                    if(!valid) {
                        this.$message.warning('请调整标红数据后再请求');
                        return false;
                    } else {
                        let thisWs=this;
                        axios.post("/api/user/editUser",thisWs.editForm).then(function (response) {
                            console.log(response);
                            if(response.data.code==200){
                                alert(response.data.msg);
                                thisWs.editUserVisible=false;
                                thisWs.queryUsers(thisWs.page,thisWs.size);//修改成功后，刷新表格数据
                            } else {
                                alert(response.data.msg);
                            }

                        }).catch(function (response) {
                            console.log(response);
                        });
                    }
                })
            },
            deleteUserApi(index,row){
                row.deleteFlag=1;
                this.editForm=row;
                let thisWs=this;
                axios.post("/api/user/editUser",thisWs.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                        thisWs.queryUsers(thisWs.page,thisWs.size);//逻辑删除成功后，刷新表格数据
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            activateUserApi(index,row){
                row.deleteFlag=0;
                this.editForm=row;
                let thisWs=this;
                axios.post("/api/user/editUser",thisWs.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                        thisWs.queryUsers(thisWs.page,thisWs.size);//激活成功后，刷新表格数据
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