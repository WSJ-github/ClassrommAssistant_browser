<template>
  <div id="w-table">
    <el-table
     :data="tableData"
     height="500"
     style="width: 100%"
     align="center"
     header-align="center">
     <template v-for="col in columns">
        <template v-if="col.operate"> <!--下面作用域插槽给父组件调用相应操作-->
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
  #w-table{
    .cell{
      text-align: center;
    }
  }
</style>