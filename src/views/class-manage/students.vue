<template>
  <div id="class-manage-students">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册学生</el-button>
    </table-header>
    <w-table
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="StudentsInfoColumns">
      <template slot-scope="scope">
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getStudentsList()"
      @current-change="getStudentsList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <register-dialog
      title="注册学生"
      :showRegisterBox="showRegisterBox"
      :registerLoading="registerLoading"
      :columnInfo="StudentsInfoColumns"
      :staticDataList="{className,insName}"
      :group_id="group_id"
      singleFlag
      @pictureUploadOver="pictureUploadOver"
      @clickCancel="showRegisterBox=false"
      ref='majorDialog'
      width="80%">
    </register-dialog>
  </div>
</template>

<script>
import StudentsInfoColumns from './students-info-columns'
import WTable from '@/components/WTable.vue'
import TableHeader from '@/components/Table-Header.vue'
import RegisterDialog from '@/components/Register-Dialog.vue'
import api from 'api'
export default {
  components:{
    WTable,
    TableHeader,
    RegisterDialog
  },
  data(){
    return{
      className:this.$route.query.className, //当前学生页对应的班级
      insName:this.$route.query.insName, //当前班级所在的学院
      breadcrumbItems:[{label:'班级管理'},{label:'班级信息',path:'/classManage/classes'},{label:'学生信息'}],
      showRegisterBox:false,
      tableData:[],
      showLoading:false,
      StudentsInfoColumns,
      sumNum:0,
      page_index:1,
      page_size:25,
      registerLoading:false,
      group_id:this.$route.query.group_id
    }
  },
  created(){
    //待：获取当前班级对应的学院名称
    this.getStudentsList();
  },
  methods:{
    getStudentsList(){
      this.showLoading=true
      api.FetchStudentsInfo(this.className,this.page_index,this.page_size).then(res=>{
        if(res.code===1){
          this.sumNum = res.sumNum
          this.tableData=res.data
          this.showLoading=false
        }
      }).catch(err=>console.log(err))
    },
    pictureUploadOver(){
      this.getStudentsList();
      this.showRegisterBox=false;
    },
    deleteRow(rowData){
       this.$confirm('确认删除该条学生数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteStudent(rowData.stuID,this.group_id)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.stuID===rowData.stuID) return false
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
    }
  }

}
</script>
  
<style lang='scss'>
  #class-manage-students{
    .el-pagination{
      text-align: center;
    }
  }
</style>