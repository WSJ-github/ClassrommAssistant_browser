<template>
  <div id="institutes-manage-institutes">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册学院</el-button>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="InstitutesInfoColumns">
      <template slot-scope="scope">
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
        <el-button @click="checkMajors(scope.rowData)">开设专业</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getInstituesList()"
      @current-change="getInstituesList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <register-dialog
      title="注册学院"
      :showRegisterBox="showRegisterBox"
      :registerLoading="registerLoading"
      :columnInfo="InstitutesInfoColumns"
      @clickConfirm="registerInstitute"
      @clickCancel="showRegisterBox=false"
      ref='registerDialog'
      width="40%">
    </register-dialog>
  </div>
</template>

<script>
import InstitutesInfoColumns from './institues-info-columns.js'
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
    return {
      InstitutesInfoColumns, //列属性
      tableData:[], //表格数据
      showLoading:false,
      breadcrumbItems:[{label:'学院管理'},{label:'学院信息'}],
      sumNum:0,
      page_index:1,
      page_size:25,
      //下面变量是用于传递给注册框子组件的
      showRegisterBox:false,
      registerLoading:false
    }
  },
  created() {
    this.getInstituesList();
  },
  methods:{
    getInstituesList(){
      this.showLoading=true;
      api.FetchInstituesList(this.page_index,this.page_size).then(res=>{
        if(res.code===1){
          this.sumNum=res.sumNum
          this.tableData = res.data
          this.showLoading=false;
        }
      }).catch(err=>console.log(err))
    },
    deleteRow(rowData){
      this.$confirm('确认删除该条学院数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let tempTable=this.tableData; //临时保存原来的表格数据，用于删除失败时恢复原来数据
        api.DeleteInstitute(rowData.insName)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.insName===rowData.insName) return false
              else return true
            })
          }
          // else if(res.code===0||res.code===6){ //删除错误或者无权限时恢复数据
          //   this.tableData=tempTable; //恢复请求前的数据
          // }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    registerInstitute(registerList){
      this.registerLoading=true;
      api.AddInstituesList(registerList).then(res=>{
        this.registerLoading=false;
        if(res.code==1){ //注册成功
          this.showRegisterBox=false;
          this.getInstituesList();
          this.$refs.registerDialog.initRegisterList(); //调用子组件的方法来初始化注册列表
          this.$message({
            message:res.message,
            type:'success'
          })
        }
        else if(res.code==2){ //注册过程中出现了点问题(可能部分学院没有注册成功)
          this.$refs.registerDialog.filterRegisterList(res.errorList);
          this.getInstituesList();
        }
      })
    },
    checkMajors(rowData){ //查看某个学院开设的专业
      this.$router.push({
        path:'/instituteManage/majors',
        query:{
          insName:rowData.insName
        }
      })
    }
  }
}
</script>

<style lang="scss">
  #institutes-manage-institutes{
    .el-pagination{
      text-align: center;
    }
  }
</style>