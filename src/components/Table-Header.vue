<template>
  <header id="table-header">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item,index) in breadcrumbItems"
        :key="index" 
        :to="item.path?{path:item.path}:''">
        {{item.label}}
      </el-breadcrumb-item>
      &nbsp;·&nbsp;{{sumNum}}
    </el-breadcrumb>
    <slot>
      <!-- <button>123</button> -->
    </slot>
  </header>
</template>

<script>
export default {
  props:{
    breadcrumbItems:{
      type:Array,
      required:true
    },
    sumNum:{
      type:Number,
      default:0
    }
  }

}
</script>

<style lang="scss">
  #table-header{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin: 0 20px;
    .el-breadcrumb{
      font-size:16px;
      line-height:50px;
    }
  }
</style>