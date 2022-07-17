<template>
  <div id="home-page">
    <el-row class="home-row">
      <template v-for="route in $router.options.routes">
        <el-col class="home-item" :key="route.path" v-if="route.name&&route.name!='首页'&&route.name!='登录页'" :xs="12" :sm="6">
          <div @click="jumpRooter(route.redirect?route.redirect:route.path)">{{route.name}}</div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
export default {
  methods:{
    jumpRooter(path){
      console.log(path)
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss">
  #home-page{
    position: relative;
    .home-row{
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 30px;
      .home-item{
        text-align: center;
        margin:30px;
        // border: 1px solid rgb(73, 73, 73);
        border-radius:20px;
        font-size:25px;
        background-color: rgb(218, 218, 218);
        box-shadow: 0 0 10px #a8a8a8;
        cursor: pointer;
        transform:scale(1.0);
        div{
          padding: 60px;
        }
        &:hover{
          transform:scale(1.1);
          transition: transform 0.5s;
        }
      }
    }
    
  }
</style>