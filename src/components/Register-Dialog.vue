<template>
  <el-dialog
    :title="title"
    :visible.sync="showRegisterBox"
    :width="width"
    :show-close="false"
    :close-on-click-modal="false"
    center>
    <slot>
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
            action='http://127.0.0.1:9999/add/students'
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
          <!--2.其次有select则优先显示静态数据-->
          <el-select
            :key="item"
            v-model="registerItem[item]"
            :placeholder="`请选择${registerListHeader[item]}`" 
            v-else-if="Object.keys(optionList).indexOf(item)!=-1">
            <el-option
              v-for="(option,optionIndex) in optionList[item]"
              :key="optionIndex"
              :label="option"
              :value="option">
            </el-option>
          </el-select>
          <!--3.最后是普通输入框-->
          <el-input
            v-else
            :placeholder="registerListHeader[item]" 
            :key="item" 
            v-model="registerItem[item]">
          </el-input>
        </template>
        <i v-if="pictureList.length!=0"></i><!--注意带图片上传的注册框暂时不知道批量注册-->
        <i v-else-if="index+1==registerList.length" @click="addRegisterList" class="el-icon-circle-plus-outline"></i>
        <i v-else @click="registerList.splice(index,1)" class="el-icon-circle-close"></i>
      </div>
    </slot>
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
    }
  },
  data(){
    return{
      registerList:[], //注册用户用的注册列表
      registerListHeader:{}, //注册列表的列表头
      keyList:[], //用来记录列表的主键属性(因为主键可以是多个属性组合成的)
      pictureList:[], //用来记录需要上传图片的字段
      uploadPictureData:{}, //上传图片的同时额外上传的数据参数（其实也就是把registerList里的数据处理之后放进来）
      imageUrl:'' //显示上传的图片
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
      })
    },
    addRegisterList(){ //添加一行注册信息
      let tempObject=new Object();
      this.columnInfo.forEach(item=>{
        if(item.static||this.staticDataList[item.prop]) tempObject[item.prop]=this.staticDataList[item.prop]; //即如果有传入的静态数据那初始值就设为该静态值
        else if(item.prop) tempObject[item.prop]=''
      })
      this.registerList.push(tempObject);
    },
    clickRegister(){
      this.registerList=this.registerList.filter(item=>{ //过滤掉key word为空的情况
        for(let majorKey of this.keyList){
          if(item[majorKey]=='') return false
          break;
        }
        return true
      })
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
      //因为仅是当个注册而不是批量注册，所以registerList里面也就一个object
      Object.keys(this.registerList[0]).forEach(key=>{
        if(this.pictureList.indexOf(key)==-1) 
          this.uploadPictureData[key]=this.registerList[0][key] //筛选出要随图片一起发出的额外数据
      })
    },
  }

}
</script>

<style lang="scss">
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

</style>