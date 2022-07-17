<template>
  <div id="w-table">
    <el-table
     :data="tableData"
     style="width: 100%"
     align="center"
     header-align="center"
     class="table">
     <template v-for="col in columns">
        <template v-if="col.hidden"></template><!--带有hidden的属性直接跳过不显示-->
        <template v-else-if="col.operate"> <!--下面作用域插槽给父组件调用相应操作-->
          <el-table-column
            :key="col.label"
            :label="col.label"
            :width="col.width?col.width:'150'">
            <template slot-scope="scope">
                <slot :rowData="scope.row"></slot> 
            </template>
          </el-table-column>
        </template>
        <template v-else-if="col.picture">
          <el-table-column
            :key="col.label"
            :label="col.label"
            :width="col.width?col.width:'150'">
            <template slot-scope="scope">
              <el-image 
                style="width: 100px; height: 100px"
                fit="cover"
                :src="`data:image/png;${col.picture},${scope.row[col.prop]}`">
              </el-image>
            </template>
          </el-table-column>
        </template>
        <!-- <template v-else-if="col.toolTip">
          <el-table-column
            :key="col.label"
            :label="col.label"
            :width="col.width?col.width:'150'">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row[col.prop]!=''||scope.row[col.prop]!=null" :content="scope.row[col.prop]" placement="top">
                <el-button>{{scope.row[col.prop]}}</el-button>
              </el-tooltip>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </template> -->
        <template v-else>
          <el-table-column
            :key="col.label"
            :label="col.label"
            :width="col.width?col.width:'150'">
            <template slot-scope="scope">
              <span>{{ scope.row[col.prop]==''||scope.row[col.prop]==null?'--':scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
     </template>     
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData:{ //需要显示的列表中的数据
      type: Array,
      default(){
        return []
      }
    },
    columns:{ //列信息数据
      type: Array,
      required: true
    }
  },
  data(){
    return {

    }
  },
  
}
</script>

<style lang="scss">
  // @import '../styles/publicVariate.scss'; //引入公共变量表
  #w-table{
    .cell{
      text-align: center;
    }
    .table{
      height:calc(100vh - #{$sheader-height} - #{$table-header} - #{$pagination-height});
      overflow-y:auto;
      width: 96% !important;
      margin: 0 auto;
      border-radius: 10px;
      &::-webkit-scrollbar{
        width : 5px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb{
        border-radius: 20px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #d6d6d6;
      }
      &::-webkit-scrollbar-track{
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        background   : #ededed;
      }
      scrollbar-width: thin; /*火狐特有属性（因为上面的样式火狐浏览器中不生效）*/
      scrollbar-color:  #e1e1e1 #f3f3f3;
    }
    .el-table::before{
      width:unset;
    }
  }
</style>