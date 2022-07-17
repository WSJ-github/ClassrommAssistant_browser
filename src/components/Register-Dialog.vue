<template>
  <el-dialog
    :title="title"
    :visible.sync="showRegisterBox"
    :width="width"
    :show-close="false"
    :close-on-click-modal="false"
    center
    class="register-dialog">
    <div>
      <div class="register-box-body" v-for="(registerItem,index) in registerList" :key="index">
        <span>{{title.split('注册')[1]}}{{index+1}}:</span>
        <template v-for="item in Object.keys(registerItem)">
          <!-- :action="`${process.env.VUE_APP_BASE_API}/add/students`" -->
          <!--1.如果有二进制数据则优先显示上传框-->
          <el-upload
            v-if="pictureList.indexOf(item)!=-1"
            :key="item"
            ref="uploadFile"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            class="avatar-uploader"
            action='http://127.0.0.1:8999/add/students'
            :auto-upload="false"
            :limit=1
            :show-file-list="true"
            :data="uploadPictureData"
            :before-upload="beforeAvatarUpload"
            :on-change="handlePictureChange"
            :on-remove="handlePictureRmove">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!--1.如果有静态数据则优先显示静态数据-->
          <el-input
            v-else-if="Object.keys(staticDataList).indexOf(item)!=-1"
            :placeholder="registerListHeader[item]" 
            :key="item" 
            v-model="registerItem[item]"
            :disabled="true">
          </el-input>
          <!--2.其次有select则优先显示选项数据-->
          <el-select
            :multiple="item=='manageCourse'?true:false"
            :key="item"
            v-model="registerItem[item]"
            :placeholder="`请选择${registerListHeader[item]}`" 
            v-else-if="Object.keys(optionList).indexOf(item)!=-1">
            <el-option
              v-for="(option,optionIndex) in optionList[item]"
              :key="optionIndex"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
          <!--3.如果item即key值是extra的话说明registerListHeader[item]即其value是一个额外对象，在这里不显示-->
          <template v-else-if="item==='extra'">
          </template>
          <!--4.最后是普通输入框-->
          <el-input
            :class="{errorTip:false}"
            v-else
            :placeholder="registerListHeader[item]" 
            :key="item" 
            v-model="registerItem[item]">
          </el-input>
        </template>
        <i v-if="singleFlag"></i><!--不支持批量注册时使用-->
        <i v-else-if="index+1==registerList.length" @click="addRegisterList" class="el-icon-circle-plus-outline"></i>
        <i v-else @click="registerList.splice(index,1)" class="el-icon-circle-close"></i>
      </div>
      <slot :registerList="registerList"></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('clickCancel')">取 消</el-button>
      <el-button type="primary" @click="clickRegister" v-loading="registerLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title:{
      type:String,
      required:true
    },
    showRegisterBox:{
      type:Boolean,
      default:false
    },
    width: {
      type:String,
      default:'60%'
    },
    registerLoading:{
      type:Boolean,
      default:false
    },
    columnInfo:{ //列属性列表
      type:Array,
      required:true
    },
    staticDataList:{ //静态数据列表（当有静态数据传进来时会传入该列表）
      type:Object,
      default:()=>{
        return {}; //必须要有默认值不然出问题
      }
    },
    optionList:{ //选项列表(用来给注册时模板为el-select的选择器提供options选项)
      type:Object,
      default:()=>{
        return {};
      }
    },
    singleFlag:{ //即默认是可批量注册的(如果singleFlag=true则不支持批量注册)
      type:Boolean,
      default:false
    },
    group_id:{ //用户组ID
      type:String,
      required:false
    }  
  },
  data(){
    return{
      registerList:[], //注册用户用的注册列表
      registerListHeader:{}, //注册列表的列表头
      keyList:[], //用来记录列表的主键属性(因为主键可以是多个属性组合成的)
      pictureList:[], //用来记录需要上传图片的字段
      uploadPictureData:{}, //上传图片的同时额外上传的数据参数（其实也就是把registerList里的数据处理之后放进来）
      imageUrl:'', //显示上传的图片
      //额外数据列表(额外数据指的是注册一个对象时额外加进去的数据(可以加多条)，
      //这里主要应用在注册课程时，一个课程的任课时间段可以是多个
      //所以使用额外数据的形式为一个课程添加多个任课时间段,注意需要配合singleFlag使用
      //即一次只能注册一个课程的情况下使用)
      //extraList:[], //这个用来装额外数据的数据对象(如一个任课时间段为一个数据对象{任课星期:1,开始时间:xxx,结束时间:xxx})
      //上面这个data添加进registerList中了,即以这样的形式registerList=[{couNum:'',extra:[{...},{...},{...}]}]，即上面这个数组变为了extra数组
      extraPropList:[] //这个用来装额外数据的属性名(如couWeek,couTimeBegin,couTimeEnd)
    }
  },
  created(){
    this.createRegisterListHeader(); //生成注册列表头信息
    this.addRegisterList(); //刚开始先初始化注册列表
  },
  methods:{
    createRegisterListHeader(){ //生成注册列表的列表头
      this.columnInfo.forEach(item=>{
        if(item.prop) this.registerListHeader[item.prop]=item.label;
        if(item.majorKey) this.keyList.push(item.prop); //如果该属性是主键的话就加入主键列表
        if(item.picture) this.pictureList.push(item.prop); //将图片数据属性加入该列表
        if(item.extra) this.extraPropList.push(item.prop); //加入额外数据属性名列表
      })
    },
    addRegisterList(){ //添加一行注册信息
      let tempObject=new Object();
      if(this.extraPropList.length!=0){
        let extraObject={};
        this.extraPropList.forEach(prop=>{
          extraObject[prop]='' //初始化临时的extraObject对象
        })
        tempObject['extra']=[extraObject] //将临时的extraObject对象加入tempObject中
        //相当于初始化tempObject={'extra':[{couWeek:'',couTimeBegin:'',couTimeEnd:''}]},这里我用额外课程数据举的例子
        //注意extra数组中的每一对象是某个课程的某个任课时间段
      }
      this.columnInfo.forEach(item=>{
        if(item.static||this.staticDataList[item.prop]) tempObject[item.prop]=this.staticDataList[item.prop]; //即如果有传入的静态数据那初始值就设为该静态值
        else if(item.prop&&!item.extra) tempObject[item.prop]='' //即排除掉带有extra属性的item
      })
      this.registerList.push(tempObject); 
      // console.log(this.registerList)
      //extraPropList不为空的情况下初始化时registerList=[{'aaa':bbb,'ccc':ddd,'extra':[{couWeek:'',couTimeBegin:'',couTimeEnd:''}]}]
    },
    clickRegister(){
      // console.log(this.extraPropList)
      if(this.extraPropList.length == 0){ //extraPropList不为空的时候按照下面的方式过滤掉
        this.registerList=this.registerList.filter(item=>{ //过滤掉key word为空的情况
          for(let majorKey of this.keyList){
            if(item[majorKey]=='') return false
          }
          return true
        })
      }
      else{ //否则的话按照下面方式过滤(即registerList中带有extra属性的情况,注意此时singleFlag肯定为true)
        for(let majorKey of this.keyList){
          if(this.registerList[0][majorKey]==""){
            this.$message({
              message: `请填入${this.registerListHeader[majorKey]}`,
              type: 'warning'
            });
            return false;
          }
        }
        for(let obj of this.registerList[0].extra){
          for(let key of Object.keys(obj)){
            if(obj[key]==''){
              this.$message({
                message: `请填入${this.registerListHeader[key]}`,
                type: 'warning'
              });
              return false;
            }
          }
        }
      }
      if(this.registerList.length==0){
        this.$message({
          type:'warning',
          message:'当前注册信息为空'
        })
        this.initRegisterList();
      }  
      else {
        if(this.pictureList.length===0) //如果图片属性列表里没东西，那么说明此次注册不涉及图片，所以走正常流程，否则，随着图片一起把数据发送出去
          this.$emit('clickConfirm',this.registerList)
        else{
          // console.log(this.$refs.uploadFile.submit)结果undefined
          this.$refs.uploadFile[0].submit(); //上传图片，即调用上传图片的接口
        }
      }
    },
    initRegisterList(){ //给父组件调用来清空registerList列表并且初始化该列表
      this.registerList=[];
      this.addRegisterList();
    },
    filterRegisterList(errorList){ //根据错误列表来过滤掉注册未成功的行
      this.registerList=this.registerList.filter((item,index)=>{ //过滤出注册没成功的用户
        if(errorList.indexOf(index)) return false;
        else return true;
      })
      this.$message({
        message:'剩余的这些信息注册失败',
        type:'error'
      })
    },
    handlePictureRmove(file, fileList){
      this.imageUrl=''
    },
    handlePictureChange(file){ //最后成功后在handleAvatarSuccess回调函数后会回调这个
      // console.log(file)
      if(file.status=='ready')
        this.imageUrl = URL.createObjectURL(file.raw)
      else if(file.status=='success'){
        this.imageUrl =''
        this.$emit('pictureUploadOver')
        this.initRegisterList();
        this.$refs.uploadFile[0].clearFiles();
      }
    },
    beforeAvatarUpload(){
      //因为仅是单个注册而不是批量注册，所以registerList里面也就一个object
      Object.keys(this.registerList[0]).forEach(key=>{
        if(this.pictureList.indexOf(key)==-1) 
          this.uploadPictureData[key]=this.registerList[0][key] //筛选出要随图片一起发出的额外数据
      })
      this.uploadPictureData['group_id']=this.group_id
    },
    addExtraList(){
      let extraObject={};
      this.extraPropList.forEach(prop=>{
        extraObject[prop]='' //初始化临时的extraObject对象
      })
      this.registerList[0].extra.push(extraObject)
    }
  }

}
</script>

<style lang="scss">
.register-dialog{
  .el-dialog{
    border-radius: 10px;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
  .errorTip{
    input{
      border-color:red;
    }
  }
}


</style>