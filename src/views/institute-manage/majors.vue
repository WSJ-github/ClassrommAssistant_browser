<template>
  <div id="institutes-manage-majors">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册专业</el-button>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="MajorsInfoColumns">
      <template slot-scope="scope">
        <el-button @click="updateRow(scope.rowData)">修改</el-button>
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getMajorsList()"
      @current-change="getMajorsList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <register-dialog
      title="注册专业"
      :showRegisterBox="showRegisterBox"
      :registerLoading="registerLoading"
      :columnInfo="MajorsInfoColumns"
      :staticDataList="{insName}"
      @clickConfirm="registerMajors"
      @clickCancel="showRegisterBox=false"
      ref='majorDialog'
      width="40%">
    </register-dialog>
    <modify-dialog
      v-if="showModifyBox"
      :showModifyBox="showModifyBox"
      :modifyLoading="modifyLoading"
      :columnInfo="MajorsInfoColumns"
      :rowData="currentRowData"
      :staticDataList="{insName}"
      @clickConfirm="updateMajor"
      @clickCancel="showModifyBox=false"
      ref='modifyDialog'
      width="40%">
    </modify-dialog>
  </div>
</template>

<script>
import MajorsInfoColumns from './majors-info-columns.js'
import WTable from '@/components/WTable.vue'
import TableHeader from '@/components/Table-Header.vue'
import RegisterDialog from '@/components/Register-Dialog.vue'
import ModifyDialog from '@/components/Modify-Dialog.vue'
import api from 'api'
export default {
  components:{
    WTable,
    TableHeader,
    RegisterDialog,
    ModifyDialog
  },
  data(){
    return{
      insName:this.$route.query.insName, //获取当前专业列表对应的学院的名称
      breadcrumbItems:[{label:'学院管理'},{label:'学院信息',path:'/instituteManage/institutes'},{label:'专业信息'}],
      showRegisterBox:false,
      tableData:[],
      showLoading:false,
      MajorsInfoColumns,
      sumNum:0,
      page_index:1,
      page_size:25,
      registerLoading:false,
      showModifyBox:false,
      modifyLoading:false,
      currentRowData:''
    }
  },
  created(){
    this.getMajorsList();
  },
  methods:{
    getMajorsList(){
      this.showLoading=true
      api.FetchMajorsList(this.page_index,this.page_size,this.insName).then(res=>{
        if(res.code===1){
          this.sumNum = res.sumNum
          this.tableData=res.data
          this.showLoading=false
        }
      }).catch(err=>console.log(err))
    },
    registerMajors(registerList){
      this.registerLoading=true;
      api.AddMajorsList(registerList).then(res=>{
        this.registerLoading=false;
        if(res.code==1){ //注册成功
          this.showRegisterBox=false;
          this.getMajorsList();
          this.$refs.majorDialog.initRegisterList(); //调用子组件的方法来初始化注册列表
          this.$message({
            message:res.message,
            type:'success'
          })
        }
        else if(res.code==2){ //注册过程中出现了点问题(可能部分学院没有注册成功)
          this.$refs.registerDialog.filterRegisterList(res.errorList);
          this.getMajorsList();
        }
      })
    },
    deleteRow(rowData){
      this.$confirm('确认删除该条专业数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteMajor(rowData.majorName)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.majorName===rowData.majorName) return false
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
    updateRow(rowData){
      this.currentRowData=rowData
      this.showModifyBox=true
    },
    updateMajor(oldData,updateObj){
      this.modifyLoading=true
      api.UpdateMajor(oldData,updateObj).then(res=>{
        if(res.code==1){
          this.modifyLoading=false;
          this.showModifyBox=false;
          this.getMajorsList();
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

<style lang="scss">
  #institutes-manage-majors{
    .el-pagination{
      text-align: center;
    }
  }
</style>