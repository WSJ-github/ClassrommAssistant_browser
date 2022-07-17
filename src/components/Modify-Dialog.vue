<template>
  <el-dialog
    title="修改信息"
    :visible.sync="showModifyBox"
    :width="width"
    :show-close="false"
    :close-on-click-modal="false"
    center
    class="modify-dialog">
    <div class="modify-box-body">
      <div v-for="(item,index) in Object.keys(modifyObj)" :key="index">
        <!--1.如果有静态数据则优先显示静态数据-->
        <el-input
          v-if="Object.keys(staticDataList).indexOf(item)!=-1"
          :placeholder="modifyObjHeader[item]" 
          :key="item" 
          v-model="modifyObj[item]"
          :disabled="true">
        </el-input>
        <!--2.其次有select则优先显示选项数据-->
        <el-select
          :class="keyList.indexOf(item)!=-1?{errorTip:showBorderRed}:{}"
          :multiple="item=='manageCourse'?true:false"
          :key="item"
          v-model="modifyObj[item]"
          :placeholder="`请选择${modifyObjHeader[item]}`" 
          v-else-if="Object.keys(optionList).indexOf(item)!=-1">
          <el-option
            v-for="(option,optionIndex) in optionList[item]"
            :key="optionIndex"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
        <!--3.如果item即key值是extra的话说明modifyObjHeader[item]即其value是一个额外对象，在这里不显示-->
        <template v-else-if="item==='extra'">
        </template>
        <!--4.最后是普通输入框-->
        <el-input
          :class="keyList.indexOf(item)!=-1?{errorTip:showBorderRed}:{}"
          v-else
          :placeholder="modifyObjHeader[item]" 
          :key="item" 
          v-model="modifyObj[item]">
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('clickCancel')">取 消</el-button>
      <el-button type="primary" @click="clickModify" v-loading="modifyLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showModifyBox:{
      type:Boolean,
      default:false
    },
    width: {
      type:String,
      default:'60%'
    },
    modifyLoading:{
      type:Boolean,
      default:false
    },
    columnInfo:{ //列属性列表
      type:Array,
      required:true
    },
    rowData:{ //修改前的行数据
      type:Object,
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
      modifyObj:{}, //注册用户用的注册列表
      modifyObjHeader:{}, //注册列表的列表头
      keyList:[], //用来记录列表的主键属性(因为主键可以是多个属性组合成的)
      showBorderRed:false
    }
  },
  created(){
    this.createModifyObjHeader();
    this.addModifyObj();
  },
  methods:{
    createModifyObjHeader(){ //生成注册列表的列表头
      this.columnInfo.forEach(item=>{
        if(item.prop) this.modifyObjHeader[item.prop]=item.label;
        if(item.majorKey) this.keyList.push(item.prop); //如果该属性是主键的话就加入主键列表
      })
    },
    addModifyObj(){
      let tempObject=new Object();
      this.columnInfo.forEach(item=>{
        if(this.staticDataList[item.prop]) tempObject[item.prop]=this.staticDataList[item.prop]
        else if(item.multiple&&this.rowData[item.prop]) tempObject[item.prop]=this.rowData[item.prop].split(',')
        else if(item.prop&&!item.extra) tempObject[item.prop]=this.rowData[item.prop]
      })
      this.modifyObj=tempObject
    },
    clickModify(){
      for(let majorKey of this.keyList){
        if(this.modifyObj[majorKey]==""){
          this.$message({
            message: `主键字段不能为空`,
            type: 'warning'
          });
          this.showBorderRed=true;
          return false;
        }
      }
      console.log(this.rowData)
      console.log(this.modifyObj)
      this.$emit('clickConfirm',this.rowData,this.modifyObj)
    }
  }
}
</script>

<style lang="scss">
  .modify-dialog{
  .el-dialog{
    border-radius: 10px;
  }
  .modify-box-body{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    div{
      margin: 0 5px;
      flex: 1;
    }
    span{
      white-space: nowrap;
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