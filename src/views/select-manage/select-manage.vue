<template>
  <div id="select-manage">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="SelectInfoColumns">
      <template slot-scope="scope">
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getSelectedList()"
      @current-change="getSelectedList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
  </div>
</template>

<script>
import SelectInfoColumns from './select-info-columns.js'
import WTable from '@/components/WTable.vue'
import TableHeader from '@/components/Table-Header.vue'
import api from 'api'
import {mapState} from 'vuex'
export default {
  components:{
    WTable,
    TableHeader
  },
  data(){
    return{
      SelectInfoColumns,
      tableData:[],
      showLoading:false,
      breadcrumbItems:[{label:'选课管理'},{label:'选课信息'}],
      sumNum:0,
      page_index:1,
      page_size:25,
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  created(){
    this.getSelectedList()
  },
  methods:{
    getSelectedList(){
        api.FetchSelectedCoursesInfo(this.page_index,this.page_size,this.userInfo.insName?this.userInfo.insName:undefined).then(res=>{
        if(res.code==1){
          this.sumNum=res.sumNum
          this.tableData = res.data
          this.showLoading=false
        }
      })
    },
    deleteRow(rowData){
      this.$confirm('确认删除该条选课数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteSelectedCoursesInfo(rowData.couID,rowData.stuID)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.couID===rowData.couID&&item.stuID===rowData.stuID) return false
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
  }
  
}
</script>

<style>

</style>