<template>
  <div id="class-manage-institutes">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册班级</el-button>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="ClassesInfoColumns">
      <template slot-scope="scope">
        <el-button @click="updateRow(scope.rowData)">修改</el-button>
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
        <el-button @click="clickCheck(scope.rowData)">学生信息</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getClassesList()"
      @current-change="getClassesList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <register-dialog
      title="注册班级"
      :showRegisterBox="showRegisterBox"
      :registerLoading="registerLoading"
      :columnInfo="ClassesInfoColumns"
      :optionList="optionList"
      :staticDataList="staticDataList"
      @clickConfirm="registerClasses"
      @clickCancel="showRegisterBox=false"
      ref='registerDialog'
      width="80%">
    </register-dialog>
    <modify-dialog
      v-if="showModifyBox"
      :showModifyBox="showModifyBox"
      :modifyLoading="modifyLoading"
      :columnInfo="ClassesInfoColumns"
      :rowData="currentRowData"
      :optionList="optionList"
      :staticDataList="staticDataList"
      @clickConfirm="updateClassInfo"
      @clickCancel="showModifyBox=false"
      ref='modifyDialog'
      width="80%">
    </modify-dialog>
    <!-- <button @click="print"></button> -->
  </div>
</template>

<script>
import ClassesInfoColumns from './classes-info-columns.js'
import WTable from '@/components/WTable.vue'
import TableHeader from '@/components/Table-Header.vue'
import RegisterDialog from '@/components/Register-Dialog.vue'
import ModifyDialog from '@/components/Modify-Dialog.vue'
import api from 'api'
import {mapState} from 'vuex'
export default {
  components:{
    WTable,
    TableHeader,
    RegisterDialog,
    ModifyDialog
  },
  data(){
    return{
      ClassesInfoColumns,
      tableData:[],
      showLoading:false,
      breadcrumbItems:[{label:'班级管理'},{label:'班级信息'}],
      sumNum:0,
      page_index:1,
      page_size:25,
      //下面变量是用于传递给注册框子组件的
      showRegisterBox:false,
      registerLoading:false,
      //下面是去用来装学院信息和专业信息的对象
      optionList:{
        'majorName':[], //专业信息，初始值为空，需要下面去网络请求回来
        'insName':[] //学院信息
      },
      //下面变量是用于传递给修改框子组件的
      showModifyBox:false,
      modifyLoading:false,
      currentRowData:''
    }
  },
  computed: {
    ...mapState(['userInfo']),
    staticDataList(){
      if(this.userInfo.insName!=null) return {insName:this.userInfo.insName}
      else return{}
    }
  },
  created() {
    this.getClassesList();
    if(this.userInfo.userType==='TS'){ //如果当前登录的用户是教秘的话，那注册普通用户的时候只能注册本学院的用户(如果是管理员的话就都可以,在后端做判断即可)
      api.FetchMajorsList(1,50,this.userInfo.insName).then(res=>{
        if(res.code===1){
          res.data.forEach(item=>{this.optionList.majorName.push({'label':item.majorName,'value':item.majorName})})
        }
      }).catch(err=>console.log(err))
    }
    else if(this.userInfo.userType==='SA'){
      api.FetchInstituesList(1,100).then(res=>{ //拉取所有学院的信息
        if(res.code===1){
          res.data.forEach(item=>{this.optionList.insName.push({'label':item.insName,'value':item.insName})})
        }
      }).catch(err=>console.log(err))
      api.FetchMajorsList(1,100).then(res=>{ //拉取所有专业的信息
        if(res.code===1){
          console.log(res.data)
          res.data.forEach(item=>{this.optionList.majorName.push({'label':item.majorName,'value':item.majorName})})
        }
      }).catch(err=>console.log(err))
    }
  },
  methods:{
    print(){
      console.log(this.userInfo);
    },
    getClassesList(){
      this.showLoading=true;
      if(this.userInfo.userType==='TS'){
        api.FetchClassesList(this.page_index,this.page_size,this.userInfo.insName).then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.data
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }
      else if(this.userInfo.userType==='SA'){
        api.FetchClassesList(this.page_index,this.page_size).then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.data
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }   
    },
    deleteRow(rowData){
      this.$confirm('确认删除该条班级数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteClass(rowData.className,rowData.group_id)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.className===rowData.className) return false
              else return true
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    registerClasses(registerList){
      this.registerLoading=true;
      api.AddClassesList(registerList).then(res=>{
        this.registerLoading=false;
        if(res.code==1){ //注册成功
          this.showRegisterBox=false;
          this.getClassesList();
          this.$refs.registerDialog.initRegisterList(); //调用子组件的方法来初始化注册列表
          this.$message({
            message:res.message,
            type:'success'
          })
        }
        else if(res.code==2){ //注册过程中出现了点问题(可能部分学院没有注册成功)
          this.$refs.registerDialog.filterRegisterList(res.errorList);
          this.getClassesList();
        }
      })
    },
    clickCheck(rowData){ //查看当前班级的学生信息
      this.$router.push({
        path:'/classManage/students',
        query:{
          className:rowData.className,
          insName:rowData.insName,
          group_id:rowData.group_id
        }
      })
    },
    updateRow(rowData){
      this.currentRowData=rowData
      this.showModifyBox=true
    },
    updateClassInfo(oldData,updateObj){
      this.modifyLoading=true
      api.UpdateClassInfo(oldData,updateObj).then(res=>{
        if(res.code==1){
          this.modifyLoading=false;
          this.showModifyBox=false;
          this.getClassesList();
          this.$message({
            type: 'success',
            message: res.message
          })
        }
        else if(res.code==2){
          this.modifyLoading=false;
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style>

</style>