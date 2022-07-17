<template>
  <div id="courses-manage">
    <table-header 
      :breadcrumbItems="breadcrumbItems"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册课程</el-button>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="CoursesInfoColumns">
      <template slot-scope="scope">
        <div style="display:flex">
          <el-button @click="deleteRow(scope.rowData)">删除</el-button>
          <el-button @click="courseDetail(scope.rowData)">课程详情</el-button>
          <el-button @click="courseSelecting(scope.rowData)">学生选课</el-button>
        </div>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getCoursesList()"
      @current-change="getCoursesList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <register-dialog
      title="注册课程"
      :showRegisterBox="showRegisterBox"
      :registerLoading="registerLoading"
      :columnInfo="CoursesInfoColumns"
      :optionList="optionList"
      :staticDataList="staticDataList"
      @clickConfirm="registerCourses"
      @clickCancel="showRegisterBox=false"
      singleFlag
      ref='registerDialog'
      width="80%">
      <!--scope为{ "registerList": [ { "extra": [ { "couWeek": "", "couTimeBegin": "",
       "couTimeEnd": "" } ], "couID": "", "couName": "", "couTeacher": "", "couHour": "",
        "couCredit": "", "couNum": "", "couClassroom": "", "insName": "" } ] }-->
      <template slot-scope="scope">
        <template v-for="(extraObject,index) in scope.registerList[0].extra">
          <div :key="`scope${index}`" class="extraData">
            <span>任课时段{{index+1}}:</span>
            <el-select v-model="extraObject['couWeek']" placeholder="任课星期">
              <el-option
                v-for="item in optionList.couWeek"
                :key="`week${item.value}`"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="extraObject['couTimeBegin']" placeholder="开始时间">
              <el-option
                v-for="item in optionList.couTimeBegin"
                :key="`begin${item.value}`"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="extraObject['couTimeEnd']" placeholder="结束时间">
              <el-option
                v-for="item in optionList.couTimeEnd"
                :key="`end${item.value}`"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input
              placeholder="任课教室" 
              v-model="extraObject['couClassroom']">
            </el-input>
            <i 
              v-if="index+1==scope.registerList[0].extra.length" 
              @click="addExtraList" 
              class="el-icon-circle-plus-outline">
            </i>
            <i 
              v-else 
              @click="scope.registerList[0].extra.splice(index,1)" 
              class="el-icon-circle-close">
            </i>
          </div>
        </template>
      </template>
    </register-dialog>
    <!--课程详情对话框-->
    <el-dialog :title="currentSelectDetail" 
      :visible.sync="tableVisible" 
      custom-class="detail-dialog"
      width="50%">
      <el-table :data="detailData" align="center" header-align="center">
        <el-table-column property="couWeek" label="任课星期" width="100"></el-table-column>
        <el-table-column property="couTimeBegin" label="任课开始时间" width="200"></el-table-column>
        <el-table-column property="couTimeEnd" label="任课结束时间" width="200"></el-table-column>
        <el-table-column property="couClassroom" label="任课教室"></el-table-column>
      </el-table>
    </el-dialog>
    <!--学生选课对话框-->
    <el-dialog title="选课" 
      :visible.sync="selectDialogVisible" 
      center custom-class="select-dialog" 
      width="30%" 
      :show-close="false">
      <div class="tip">选择课程：<b>{{currentCourse.couName}}</b>的选课学生</div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in selectCourseBreadcrumb" :key="item.value">
          <b v-if="selectCourseBreadcrumb.length>1&&index==0" @click="clickBreadcrumb()" style="cursor:pointer">{{item.label}}</b>
          <span v-else>{{item.label}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="showArea" v-loading="selectDialogLoading">
        <ul v-if="currentView=='class'">
          <li v-for="(classObj,index) in classData" :key="index" class="class-item" @click="entryStuList(classObj,index)">
            <img src="@/assets/img/folder-icon.png" alt="">
            <span style="margin-left:8px">{{classObj.className}}</span>
            <i class="el-checkbox" v-if="classObj[index].count!=0" style="font-size:12px">已选{{classObj[index].count}}</i>
          </li>
        </ul>
        <ul v-else>
          <template v-if="stuInfoList.length!=0">
            <li v-for="(stuObj,index) in stuInfoList" :key="index" class="class-item">
              <el-image 
                style="width: 60px; height: 60px"
                fit="cover"
                :src="`data:image/png;base64,${stuObj['stuPhoto']}`">
              </el-image>
              <div style="margin-left:8px">
                <div>{{stuObj.stuName}}</div>
                <div>{{stuObj.stuID}}</div>
              </div>
              <i class="el-checkbox" v-if="stuObj.having" style="font-size:12px">已选课</i> <!--选过课的学生就显示已选课即可-->
              <el-checkbox v-else v-model="stuObj.selected" @change="statusChange(stuObj)"></el-checkbox>
            </li>
          </template>
          <template v-else-if="stuInfoList.length===0&&selectDialogLoading===false">
            <h3 style="text-align:center">暂未录入学生信息</h3>
          </template>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initCourseSelectedDialog">取 消</el-button>
        <el-button type="primary" @click="selectConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <button @click="print"></button> -->
  </div>
</template>

<script>
import CoursesInfoColumns from './courses-info-columns'
import CoursesOptionList from './courses-option-list'
import TableHeader from '@/components/Table-Header.vue'
import WTable from '@/components/WTable.vue'
import RegisterDialog from '@/components/Register-Dialog.vue'
import api from 'api'
import {mapState} from 'vuex'
export default {
  components:{
    WTable,
    TableHeader,
    RegisterDialog
  },
  data() {
    return{
      CoursesInfoColumns,
      showLoading:false,
      registerLoading:false,
      showRegisterBox:false,
      breadcrumbItems:[{label:'课程管理'},{label:'课程信息'}],
      tableData:[],
      sumNum:0,
      page_index:1,
      page_size:25,
      optionList:CoursesOptionList,
      //下面属性用于显示课程详情数据
      tableVisible:false,
      detailData:[], //请求来的列表详情数据
      currentSelectDetail:'', //当前选择的课程的ID
      //下面是选课对话框用到的属性
      selectDialogVisible:false,
      currentCourse:{}, //当前课程的信息（用于选课）
      selectCourseBreadcrumb:[{label:'班级列表',value:'class'}], //面包屑(初始只有班级)
      currentView:'class', //选课对话框的当前视图('class'表示当前在班级页面 'student'表示当前在学生页面)
      classData:[], //班级数据
      selectDialogLoading:false,
      stuSelectingIDList:[], //正在选课中的学生的stuID列表
      stuSelectedIDList:[], //已选过该课程的学生的stuID列表(用来过滤的)
      stuInfoList:[], //学生信息列表(即某个班级所有学生的信息的列表)
      selectedCount:{} //计数器，计算每次从某个班级进入的学生列表时，选择的学生的数目
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
    this.getCoursesList(); //此时不包括请求课程详情
    if(this.userInfo.userType==='SA'){ //如果是超级管理员的话要把全部学院信息都拉取下来
      api.FetchInstituesList(1,100).then(res=>{ //拉取所有学院的信息
        if(res.code===1){
          res.data.forEach(item=>{this.optionList.insName.push({'label':item.insName,'value':item.insName})})
        }
      }).catch(err=>console.log(err))
    }
    //将班级信息拉取下来备用(TS和SA管理员拉取的区间稍微不同)
    api.FetchClassesList(1,100,this.userInfo.userType==='TS'?this.userInfo.insName:undefined).then(res=>{
      if(res.code===1){
        res.data.forEach((item,index)=>{
          item[index]={count:0}  //为每个班级对象都添加一个index属性，该属性是一个对象，用来监听某个班级中的选课学生
        })
        this.classData = res.data
      }
    }).catch(err=>console.log(err))
  },
  methods: {
    getCoursesList(){
      this.showLoading=true;
      if(this.userInfo.userType==='TS'){ //教秘只能看到自己学院开设的课程
        api.FetchCoursesList(this.page_index,this.page_size,this.userInfo.insName).then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.data
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }
      else if(this.userInfo.userType==='SA'){ //管理员可以看到所有学院开设的课程
        api.FetchCoursesList(this.page_index,this.page_size).then(res=>{
          if(res.code===1){
            this.sumNum=res.sumNum
            this.tableData = res.data
            this.showLoading=false;
          }
        }).catch(err=>console.log(err))
      }   
    },
    registerCourses(registerList){
      this.registerLoading=true;
      api.AddCourseInfo(registerList[0]).then(res=>{
        this.registerLoading=false;
        if(res.code==1){ //注册成功
          this.showRegisterBox=false;
          this.getCoursesList();
          this.$refs.registerDialog.initRegisterList(); //调用子组件的方法来初始化注册列表
          this.$message({
            message:res.message,
            type:'success'
          })
        }
        else if(res.code==2){ //注册过程中出现了点问题(可能部分学院没有注册成功)
          this.$message({
            message:'课程注册失败',
            type:'error'
          })
          this.getCoursesList();
        }
      })  
      console.log('registerList',registerList)
    },
    addExtraList(){
      this.$refs.registerDialog.addExtraList();
    },
    courseDetail(rowData){
      this.currentSelectDetail=rowData.couName
      api.FetchCoursesDetail(rowData.couID).then(res=>{
        if(res.code==1){ //注册成功
          this.tableVisible=true
          res.data.forEach(detailObject=>{
            detailObject.couTimeBegin=this.optionList.couTimeBegin.find(obj=>obj.value==detailObject.couTimeBegin).label
            detailObject.couTimeEnd=this.optionList.couTimeEnd.find(obj=>obj.value==detailObject.couTimeEnd).label
            detailObject.couWeek=this.optionList.couWeek.find(obj=>obj.value==detailObject.couWeek).label
          })
          this.detailData=res.data //课程详情数据
          // this.$message({
          //   message:res.message,
          //   type:'success'
          // })
        }
        else if(res.code==2){ //注册过程中出现了点问题(可能部分学院没有注册成功)
          this.$message({
            message:'课程注册失败',
            type:'error'
          })
        }
      })  
    },
    deleteRow(rowData){
      this.$confirm('确认删除该课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeleteCourse(rowData.couID)
        .then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.sumNum--;
            this.tableData=this.tableData.filter(item=>{
              if(item.couID===rowData.couID) return false
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
    courseSelecting(rowData){
      this.currentCourse=rowData //保存当前的课程信息
      this.selectDialogVisible=true //打开选课框框
      api.QuerySelectedCoursesInfo(rowData.couID).then(res=>{ //导出课程的已选学生ID列表
        if(res.code===1){
          res.data.forEach(item=>{
            this.stuSelectedIDList.push(item.stuID)
          })
        }
      })
    },
    selectConfirm(){ //选课确认
      if(this.stuSelectingIDList.length!=0){
        api.addSelectCourseInfo(this.stuSelectingIDList,this.currentCourse.couID).then(res=>{
          if(res.code===1){
            this.$message({
              type: 'success',
              message:res.message
            })
            this.initCourseSelectedDialog();
          }
        })
      }
      else{
        this.initCourseSelectedDialog();
      }
    },
    initCourseSelectedDialog(){ //初始化选课对话框中用到的一些数据
      this.currentView='class'
      this.selectDialogVisible=false
      this.stuSelectingIDList=[]
      this.stuSelectedIDList=[]
      this.selectCourseBreadcrumb=[{label:'班级列表',value:'class'}]
      this.classData.forEach((item,index)=>{
        item[index]={count:0}
      })
    },
    entryStuList(classObj,index){ //进入学生列表   
      this.selectedCount=classObj[index] //装载计数器
      this.stuInfoList=[]
      this.selectCourseBreadcrumb.push({label:'学生列表',value:'student'})
      this.currentView='student'
      this.selectDialogLoading=true
      api.FetchStudentsInfo(classObj.className,1,100).then(res=>{
        if(res.code===1){
          res.data.forEach(item=>{
             //如果某个学生之前已选择了该课程并录入选课表中那么为item添加一个having属性
            if(this.stuSelectedIDList.indexOf(item.stuID)!=-1){
              item.having=true
            }
            else if(this.stuSelectingIDList.indexOf(item.stuID)!=-1){ //刚刚选过该学生则selected为true
              item.selected=true
            }
            //否则设置该课程的selected标记为false
            else item.selected=false
            this.stuInfoList.push(item)
            // console.log(this.stuInfoList)
          })
          this.selectDialogLoading=false
        }
      })
    },
    clickBreadcrumb(){ //点击选课框中的面包屑时
      this.selectCourseBreadcrumb=[{label:'班级列表',value:'class'}] //初始化
      this.currentView='class'
    },
    statusChange(stuObj){ //选课时学生复选框状态变化时
      if(stuObj.selected){ //从未选中状态到选中状态时
        this.stuSelectingIDList.push(stuObj.stuID)
        this.selectedCount.count++
      }
      else{ //从选中状态到未选中状态
        this.stuSelectingIDList.splice(this.stuSelectingIDList.indexOf(stuObj.stuID),1)
        this.selectedCount.count--
      }
    }
  }

}
</script>

<style lang="scss">
  .extraData{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span{
      white-space:nowrap;
      margin-right:5px;
    }
    .el-input,.el-select{
      flex: 1;
      margin: 0 5px 0 0;
    }
  }
  #courses-manage{
     .detail-dialog{
        .cell{
          text-align:center;
        } 
        .el-dialog__title{
          position:absolute;
          left:50%;
          transform:translateX(-50%)

        }
     }
     .select-dialog{
       border-radius: 8px;
       min-width:400px;
        .el-dialog__title{
         font-size:20px;
         font-weight: bold;
        }
        .el-dialog__body{
         padding-top:10px;
         padding-bottom: 10px;
        .tip{
          text-align:center;
          &:after{
            content:"";
            display: block;
            width: 100%;
            height: 1px;
            text-align: center;
            background-color:#e0e0e0;
            margin:15px 0;
          }
        }
        .showArea{
          height: 350px;
          // background-color:#d6d4d4;
          margin-top:10px;
          overflow: auto;
          ul{
            list-style: none;
            padding:0;
            margin:5px 0;
          }
          .class-item{
            display:flex;
            position: relative;
            align-items: center;
            margin-bottom:10px;
            padding-top: 2px;
            border-radius: 5px;
            &:hover{
              cursor:pointer;
              background-color:#ebeaea;
            }
          }
          .el-checkbox{
            position: absolute;
            right:15px;
          }
        }
       } 
     }
  }
</style>