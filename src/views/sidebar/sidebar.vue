<template>
  <div id="main-sidebar">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="$route.path"
      :collapse="isCollapse"
      class="sidebar"
      router>
      <template v-for="route in $router.options.routes">
        <template v-if="route.children&&!route.showOnly&&!route.hidden">
          <el-submenu :index='route.path' :key='route.path'>
            <template slot="title">
              <i :class="route.icon"></i>
              <span>{{route.name}}</span>
            </template>
            <el-menu-item v-for="(item,index) in route.children" :key="index" :index="route.path+'/'+item.path">
              {{item.name}}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else-if="!route.hidden">
          <el-menu-item :index="route.path" :key="route.path">
            <i :class="route.icon"></i>
            <span slot="title">{{route.name}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isCollapse:false
    }
  },
  created(){
    console.log(this.$route.path.split('/')[1]);  
  },
  computed: {
    // defaultActive(){
    //   if(this.$route.path.split('/').length>1) return this.$route.path
    //   else return `/${this.$route.path.split('/')[1]}`
    // }
  }
}
</script>

<style lang="scss">
  @import '../../styles/publicVariate.scss'; //引入公共变量表
  #main-sidebar{
    width: 210px;
    .sidebar{
      height:calc(100vh - #{$sheader-height});
      overflow: auto;
    }
  }
</style>