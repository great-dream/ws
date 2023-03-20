<template>
    <div>
        账号：<el-input v-model="userId" placeholder="请输入账号" type="text" style="width: 200px"></el-input>
        用户名：<el-input v-model="userName" placeholder="请输入用户名" type="text" style="width: 200px"></el-input>
        <el-button type="primary" v-on:click="queryUsers(this.page,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
    </div>
    <div align="left">
        <el-button type="primary" v-on:click="addUser()">新增用户</el-button>
<!--        <el-button type="primary" v-on:click="editUser()">新增用户</el-button>-->
    </div>
    <div>
        <el-table :data="users" stripe>
            <el-table-column prop="id" label="唯一键"></el-table-column>
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
            <el-table-column prop="" label="操作">
                <template #default="scope">
                    <el-button type="primary" v-on:click="editUser(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="primary"  v-if="scope.row.deleteFlag" v-on:click="activateUserApi(scope.$index,scope.row)">激活</el-button>
                    <el-button type="primary"  v-if="!scope.row.deleteFlag" v-on:click="deleteUserApi(scope.$index,scope.row)">删除</el-button>
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
        />

    </div>
    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" v-model="addUserVisible">
        <el-form :model="addForm">
            <el-form-item label="账  号">
                <el-input v-model="addForm.userId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密  码">
                <el-input v-model="addForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="addForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="addForm.phoneNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-switch v-model="addForm.managerFlag"></el-switch>
            </el-form-item>
            <el-form-item label="删  除">
                <el-switch v-model="addForm.deleteFlag"></el-switch>
            </el-form-item>
            <el-form-item label="备      注">
                <el-input v-model="addForm.remarks" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="addUserVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="addUserApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户" v-model="editUserVisible">
        <el-form :model="editForm">
            <el-form-item label="id">
                <el-input v-model="editForm.id" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="账  号">
                <el-input v-model="editForm.userId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密  码">
                <el-input v-model="editForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="editForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="editForm.phoneNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
                <el-switch v-model="editForm.managerFlag"></el-switch>
            </el-form-item>
            <el-form-item label="删  除">
                <el-switch v-model="editForm.deleteFlag"></el-switch>
            </el-form-item>
            <el-form-item label="备      注">
                <el-input v-model="editForm.remarks" autocomplete="off"></el-input>
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
                }
            }
        },
        methods:{
            clearData(){
                this.userId="";
                this.userName="";
            },
            queryUsers(page,size){
               // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                let params="?userId="+wsThat.userId+"&userName="+wsThat.userName+"&page="+page+"&size="+size;
                axios.get("/api/user/query"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.users=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(this.users);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
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
                axios.post("/api/user/addUser",this.addForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
                this.addUserVisible=false;
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
                axios.post("/api/user/editUser",this.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
                this.editUserVisible=false;
            },
            deleteUserApi(index,row){
                row.deleteFlag=1;
                this.editForm=row;
                axios.post("/api/user/editUser",this.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
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
                axios.post("/api/user/editUser",this.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
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