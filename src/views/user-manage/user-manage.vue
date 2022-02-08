<template>
  <div id="user-manage">
    <table-header 
      :breadcrumbItems="componentState=='common-user'?
      breadcrumbItems1:
      breadcrumbItems2"
      :sumNum="sumNum">
      <el-button @click="showRegisterBox=true">注册用户</el-button>
    </table-header>
    <w-table 
      :tableData="tableData" 
      v-loading="showLoading"
      :columns="componentState=='admin-user'?UserInfoAdminColumns:UserInfoCommonColumns">
      <!-- <template slot-scope="row">
        <el-button>编辑{{row.rowData}}</el-button>
      </template> -->
      <template slot-scope="scope">
        <!-- <el-button>编辑</el-button> -->
        <el-button @click="deleteRow(scope.rowData)">删除</el-button>
      </template>
    </w-table>
    <el-pagination
      v-if="tableData.length != 0"
      @size-change="getUserInfoList()"
      @current-change="getUserInfoList()"
      :current-page.sync="page_index"
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page_size"
      layout="sizes, prev, pager, next"
      :total="sumNum">
    </el-pagination>
    <el-dialog
      :title="`注册${componentState=='common-user'?'普通':'管理员'}用户`"
      :visible.sync="showRegisterBox"
      width="70%"
      :show-close="false"
      center>
      <div class="register-box-body" v-for="(registerItem,index) in registerList" :key="index">
        <span>用户{{index+1}}:</span>
        <template v-for="item in Object.keys(registerItem)">
          <el-select
            :key="item" 
            v-model="registerItem[item]"
            :placeholder="`请选择${registerListHeader[item]}`" 
            v-if="Object.keys(optionList).indexOf(item)!=-1">
            <el-option
              v-for="(option,optionIndex) in optionList[item]"
              :key="optionIndex"
              :label="option"
              :value="option">
            </el-option>
          </el-select>
          <el-input
            v-else
            :placeholder="registerListHeader[item]" 
            :key="item" 
            v-model="registerItem[item]">
          </el-input>
        </template>
        <i v-if="index+1==registerList.length" @click="addRegisterList" class="el-icon-circle-plus-outline"></i>
        <i v-else @click="registerList.splice(index,1)" class="el-icon-circle-close"></i>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRegisterBox = false">取 消</el-button>
        <el-button type="primary" @click="registerUser" v-loading="registerLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserInfoAdminColumns from './user-info-admin-columns'
import UserInfoCommonColumns from './user-info-common-columns'
import WTable from '@/components/WTable.vue'
import TableHeader from '@/components/Table-Header.vue'
import {mapState} from 'vuex'
import api from 'api'
export default {
    components: {
      WTable,
      TableHeader
    },
    data() {
      return{
        //根据url来判断当前组件显示的是普通用户的信息管理页还是管理员信息的管理页
        componentState:this.$route.meta.keyWord, //common-user or admin-user
        UserInfoAdminColumns, //对应admin-user表的列属性
        UserInfoCommonColumns, //对应common-user表的列属性
        page_index:1, //当前页数
        page_size:25, //当前每一页的数据条数
        tableData:[], //初始表格数据为空
        sumNum:0, //默认总条数为0
        showLoading:false,
        breadcrumbItems1:[{label:'用户管理'},{label:'普通用户'}],
        breadcrumbItems2:[{label:'用户管理'},{label:'管理员用户'}],
        showRegisterBox:false, //点击注册按钮弹出的注册对话框
        registerList:[], //注册用户用的注册列表
        registerListHeader:{}, //注册列表的列表头
        registerLoading:false, //点击注册用户时显示的loading
        optionList:{
          'insName':[], //学院信息，初始值为空，需要下面去网络请求回来（用来给SA注册管理员用）
          'className':[]
        }
      }
    },
    // watch:{ //该方法作废，因为用户信息即this.userInfo已经存储在本地缓存中
    //   userInfo(curVal,oldVal){ //监听vuex中的userInfo，如果获取到了userInfo就发送一次网络请求获取
    //     if(oldVal===''&&typeof curVal==='object'){ //如果旧值为空然后新值的类型是object，说明获取到了用户信息，那么
    //       // console.log(curVal);
    //       if(curVal.userType==='TS'){ //如果当前登录的用户是教秘的话，那注册普通用户的时候只能注册本学院的用户(如果是管理员的话就都可以,在后端做判断即可)
    //         api.FetchClassesList(1,50,curVal.insName).then(res=>{
    //           if(res.code===1){
    //             // console.log(res.data)
    //             res.data.forEach(item=>{this.optionList.className.push(item.className)})
    //             console.log(this.optionList)
    //           }
    //         }).catch(err=>console.log(err))
    //       }
    //       else if(curVal.userType==='SA'){
    //         api.FetchClassesList(1,100).then(res=>{
    //           if(res.code===1){
    //             // console.log(res.data)
    //             res.data.forEach(item=>{this.optionList.className.push(item.className)})
    //           }
    //         }).catch(err=>console.log(err))
    //       }
    //     }
    //   }
    // },
    computed:{
      ...mapState(['userInfo','accessToken'])
    },
    created() { 
      this.getUserInfoList()
      this.addRegisterList() //初始化注册列表(将一个初始对象加入列表中)
      this.createRegisterListHeader(); //生成注册列表的列表头
      api.FetchInstituesList(1,50).then(res=>{ //请求学院信息（取个100条，应该也没有这么多，这里的意思是取完学院信息）
        if(res.code===1){
          res.data.forEach(item=>{this.optionList.insName.push(item.insName)})
        }
      }).catch(err=>console.log(err))
      if(this.userInfo.userType==='TS'){ //如果当前登录的用户是教秘的话，那注册普通用户的时候只能注册本学院的用户(如果是管理员的话就都可以,在后端做判断即可)
        api.FetchClassesList(1,50,this.userInfo.insName).then(res=>{
          if(res.code===1){
            // console.log(res.data)
            res.data.forEach(item=>{this.optionList.className.push(item.className)})
            console.log(this.optionList)
          }
        }).catch(err=>console.log(err))
      }
      else if(this.userInfo.userType==='SA'){
        api.FetchClassesList(1,100).then(res=>{
          if(res.code===1){
            // console.log(res.data)
            res.data.forEach(item=>{this.optionList.className.push(item.className)})
          }
        }).catch(err=>console.log(err))
      }
    },
    methods:{
      getUserInfoList(){
        this.showLoading=true;
        //1.鉴权，如果是超级管理员用户的话就能对管理员表单进行管理(需要解决userInfo每次都是异步向服务器请求的问题)
        //下面在拉去信息时已经在后端做了鉴权操作了，所以不需要在前端鉴权了
        api.FetchUserList(this.componentState,this.page_index,this.page_size,this.accessToken)
          .then(res=>{
            if(res.code===1){
              this.tableData=res.data
              this.sumNum=res.sumNum
              this.showLoading=false;
            }
          }).catch(err=>console.log(err))
      },
      deleteRow(rowData){
        this.$confirm('确认删除该用户数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tempTable=this.tableData; //临时保存原来的表格数据，用于删除失败时恢复原来数据
          api.DeleteUserInfo(this.componentState,rowData.userType,rowData.userAccount)
          .then(res=>{
            if(res.code===1){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.sumNum--;
            }
            else if(res.code===0){
              this.tableData=tempTable; //恢复请求前的数据
            }
          })
          this.tableData=this.tableData.filter(item=>{
            if(item.userType===rowData.userType&&item.userAccount===rowData.userAccount) return false
            else return true
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      createRegisterListHeader(){
        if(this.componentState=='common-user'){
          UserInfoCommonColumns.forEach(item=>{
            if(item.prop) this.registerListHeader[item.prop]=item.label
          })
        }
        else{
          UserInfoAdminColumns.forEach(item=>{
            if(item.prop) this.registerListHeader[item.prop]=item.label
          })
        }
      },
      addRegisterList(){
        if(this.componentState=='common-user'){
          let tempObject=new Object();
          UserInfoCommonColumns.forEach(item=>{
            if(item.prop) tempObject[item.prop]=''
          })
          this.registerList.push(tempObject);
        }
        else if(this.componentState=='admin-user'){
          let tempObject=new Object();
          UserInfoAdminColumns.forEach(item=>{
            if(item.prop) tempObject[item.prop]=''
          })
          this.registerList.push(tempObject);
        }
      },
      registerUser(){ //注册用户(管理员 or 普通用户)
        this.registerList=this.registerList.filter(item=>{ //过滤掉key word为空的情况
          if(item.userType==''&&item.userAccount=='') return false
          else return true
        })
        this.registerLoading=true;
        api.AddUserInfo(this.componentState,this.registerList).then(res=>{
          this.registerLoading=false;
          if(res.code==1){ //注册成功
            this.showRegisterBox=false;
            this.getUserInfoList(); //刷新用户列表
            this.registerList=[]; //初始化registerList
            this.addRegisterList();
            this.$message({
              message:res.message,
              type:'success'
            })
          }
          else if(res.code==2){ //注册过程中出现了点问题
            this.registerList=this.registerList.filter((item,index)=>{ //过滤出注册没成功的用户
              if(res.errorList.indexOf(index)) return false;
              else return true;
            })
            this.$message({
              message:'剩余的这些用户未注册成功',
              type:'warning'
            })
          }
        })
      }
    }
}
</script>

<style lang="scss">
  #user-manage{
    .el-pagination{
      text-align: center;
    }
    .register-box-body{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span{
        white-space: nowrap;
      }
      i{
        cursor: pointer;
        margin-left:5px;
      }
      .el-input{
        margin:0 5px;
        flex: 1;
      }
      .el-select{
        flex: 1;
        margin:0 5px;
      }
    }
  }
</style>