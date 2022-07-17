<template>
  <div id="attendance-manage">
    <table-header
      @getList="getAttendanceRecordList()" 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <!-- <el-button @click="showRegisterBox=true">注册班级</el-button> -->
      <div style="display:flex">
        <el-input class="record-input" placeholder="记录ID" v-model="filterData.recordID"></el-input>
        <el-input class="couID-input" placeholder="课程ID" v-model="filterData.couID"></el-input>
        <el-date-picker
          class="picker"
          v-model="filterData.timeRange"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-button @click="clickFilter">筛选</el-button>
      </div>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="AttendanceInfoColumns">
      <template slot-scope="scope">
        <el-button @click="clickCheckDetail(scope.rowData)">记录详情</el-button>
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
      </template>
    </w-table>
    <el-pagination
      @size-change="getAttendanceRecordList()"
      @current-change="getAttendanceRecordList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <el-dialog
      title="记录详情"
      v-if="nowRowData!=''"
      :visible.sync="centerDialogVisible"
      width="40%"
      :show-close="false"
      center>
      <ul>
        <li class="detail-item">
          缺勤人员名单：{{nowRowData.attAbsencePerson.length!=0?nowRowData.attAbsencePerson.join('  '):'无缺勤人员'}}
        </li>
        <li class="detail-item">
          请假人员名单：{{nowRowData.attLeavePerson.length!=0?nowRowData.attLeavePerson.join('  '):'无请假人员'}}
        </li>
        <li class="detail-item">
          考勤课程详情：{{nowRowData.couName}}&nbsp;星期{{nowRowData.couWeek}}&nbsp;第{{nowRowData.couTimeBegin}}~{{nowRowData.couTimeEnd}}节
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AttendanceInfoColumns from './attendance-info-columns.js'
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
      AttendanceInfoColumns,
      tableData:[],
      showLoading:false,
      breadcrumbItems:[{label:'考勤管理'},{label:'考勤信息'}],
      sumNum:0,
      page_index:1,
      page_size:25,
      centerDialogVisible:false,
      nowRowData:'',
      //筛选记录
      filterData:{
        recordID:'', //记录ID
        couID:'', //课程ID
        timeRange:'', //时间范围
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  created () {
    this.getAttendanceRecordList();
  },
  methods: {
    getAttendanceRecordList(){
      console.log(1)
      this.breadcrumbItems=[{label:'考勤管理'},{label:'考勤信息'}]
      this.showLoading=true;
      if(this.userInfo.userType==='TS'){
        api.FetchAttendanceRecordList(this.page_index,this.page_size,this.userInfo.insName).then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.attendaceRecordList
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }
      else if(this.userInfo.userType==='SA'){
        api.FetchAttendanceRecordList(this.page_index,this.page_size,'All').then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.attendaceRecordList
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }
    },
    clickCheckDetail(rowData){
      this.nowRowData=rowData
      this.centerDialogVisible=true
    },
    deleteRow(rowData){
      this.$confirm('确认删除该条考勤数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteAttendanceRecord(rowData.recordID)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.recordID===rowData.recordID) return false
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
    clickFilter(){
      if(this.filterData.timeRange==''&&this.filterData.recordID==''&&this.filterData.couID=='')
        this.getAttendanceRecordList()
      else{
          if(this.filterData.timeRange!=''){
            this.filterData.timeRange.forEach((item,index)=>{
              let d=new Date(item.toString())
              this.filterData.timeRange[index]=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            })
          }
          api.FilterAttendanceRecord(this.filterData).then(res=>{
            if(res.code==1){
              this.tableData=res.attendaceRecordList
              this.breadcrumbItems=[{label:'考勤管理'},{label:'考勤信息',reList:true},{label:'筛选结果'}]
              this.sumNum=res.attendaceRecordList.length
              this.filterData={
                recordID:'', //记录ID
                couID:'', //课程ID
                timeRange:'', //时间范围
              }
            }
          })
      }
      
    }
  }
}
</script>

<style lang="scss">
  #attendance-manage{
    .detail-item{
      font-size:16px;
      margin:5px;
    }
    .record-input{
      width: 200px;
      margin-right:5px;
    }
    .couID-input{
      width: 200px;
      margin-right:5px;
    }
    .picker{
      margin-right:5px;
    }
  }

</style>