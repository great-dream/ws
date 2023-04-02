<template>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>当前页面:字典管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
        类别：
        <el-select v-model="category" placeholder="请选择类别" style="width: 100px">
            <el-option v-for="cat in categorys" :key="cat.code" :value="cat.code" :label="cat.name">
            </el-option>
        </el-select>
        编码：<el-input v-model="code" placeholder="请输入编码" type="text" style="width: 100px"></el-input>
        名称：<el-input v-model="name" placeholder="请输入名称" type="text" style="width: 200px"></el-input>
        <el-button type="primary" v-on:click="queryDicts(1,this.size)" style="margin-left: 100px">查询</el-button>
        <el-button type="primary" v-on:click="clearData()">重置</el-button>
        <el-button type="primary" v-on:click="addDict()">新增字典</el-button>
    </div>
    <div>
        <el-table :data="dicts" stripeborder="true" v-loading="loading" element-loading-text="加载中...">
<!--            <el-table-column prop="id" label="唯一键"></el-table-column>-->
            <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
            <el-table-column prop="category" label="类别">
                <template #default="scope">
                    {{categoryName(scope.row.category)}}
                </template>
            </el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="deleteFlag" label="是否删除">
                <template #default="scope">
                    {{scope.row.deleteFlag?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="160px">
                <template #default="scope">
                    <el-button type="primary" v-on:click="editDict(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="primary"  v-if="scope.row.deleteFlag" v-on:click="activateDictApi(scope.$index,scope.row)">激活</el-button>
                    <el-button type="primary"  v-if="!scope.row.deleteFlag" v-on:click="deleteDictApi(scope.$index,scope.row)">删除</el-button>
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
    <!-- 新增字典对话框 -->
    <el-dialog title="新增字典" v-model="addDictVisible">
        <el-form :model="addForm">
            <el-form-item label="类别">
                <el-select v-model="addForm.category" placeholder="请选择类别" >
                    <el-option v-for="cat in categorys" :key="cat.code" :value="cat.code" :label="cat.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="addForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="addForm.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="删  除">
                <el-switch v-model="addForm.deleteFlag"></el-switch>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="addDictVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="addDictApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑字典对话框 -->
    <el-dialog title="修改字典" v-model="editDictVisible">
        <el-form :model="editForm">
            <el-form-item label="id">
                <el-input v-model="editForm.id" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="类别">
                <el-select v-model="editForm.category" placeholder="请选择类别" >
                    <el-option v-for="cat in categorys" :key="cat.code" :value="cat.code" :label="cat.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="editForm.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="editForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="editForm.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="删  除">
                <el-switch v-model="editForm.deleteFlag"></el-switch>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-on:click="editDictVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="editDictApi()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
    import axios from "axios";
    export default {
        name: "DictManager",
        data(){
            return {
                category:"",
                code:"",
                name:"",
                page:1,
                size:20,
                total:0,
                dicts:[],
                addDictVisible:false,
                addForm:{
                    category:"",code:"",name:"",remark:"",deleteFlag:0
                },
                editDictVisible:false,
                editForm:{
                    id:"",category:"",code:"",name:"",remark:"",deleteFlag:""
                },
                categorys:[],
                loading:false
            }
        },
        mounted() {
            this.queryCategorys();
        },
        methods:{
            clearData(){
                this.category="";
                this.code="";
                this.name="";
            },
            indexMethod(index) {
                return (index+1)+this.size*(this.page-1);
            },
            queryCategorys(){
                let wsThat = this;
                let categoryM="ROOT_TYPE";
                let params="?category="+categoryM;
                wsThat.loading=true;
                axios.get("/api/dictionary/query"+params).then(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.categorys=response.data.data;
                        console.log(wsThat.categorys);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    wsThat.loading=false;
                    console.log(response);
                });
            },
            categoryName(code){
                for(let cat of this.categorys){
                    if(code==cat.code){
                        return cat.name;
                    }
                }
                return code;
            },
            queryDicts(page,size){
                // this.$message({message:"info提示",type:"info"});
                let wsThat = this;
                let params="?category="+wsThat.category+"&code="+wsThat.code+"&name="+wsThat.name+"&page="+page+"&size="+size;
                axios.get("/api/dictionary/query2"+params).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        wsThat.dicts=response.data.data.data;
                        wsThat.page=response.data.data.page;
                        wsThat.size=response.data.data.size;
                        wsThat.total=response.data.data.total;
                        console.log(this.dicts);
                    } else {
                        alert("查询失败啦");
                    }

                }).catch(function (response) {
                    console.log(response);
                });
            },
            handleSizeChange(newSize){
                this.queryDicts(this.page,newSize);
            },
            handleCurrentChange(newPage){
                this.queryDicts(newPage,this.size);
            },
            addDict(){
                this.addDictVisible=true;
            },
            addDictApi(){
                axios.post("/api/dictionary/addDict",this.addForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
                this.addDictVisible=false;
            },
            // editDict(){
            //     this.editDictVisible=true;
            // },
            editDict(index,row){
                this.editDictVisible=true;
                console.log(index+'---'+row);
                this.editForm=row;

            },
            editDictApi(){
                axios.post("/api/dictionary/editDict",this.editForm).then(function (response) {
                    console.log(response);
                    if(response.data.code==200){
                        alert(response.data.msg);
                    } else {
                        alert(response.data.msg);
                    }

                }).catch(function (response) {
                    console.log(response);
                });
                this.editDictVisible=false;
            },
            deleteDictApi(index,row){
                row.deleteFlag=1;
                this.editForm=row;
                axios.post("/api/dictionary/editDict",this.editForm).then(function (response) {
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
            activateDictApi(index,row){
                row.deleteFlag=0;
                this.editForm=row;
                axios.post("/api/dictionary/editDict",this.editForm).then(function (response) {
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