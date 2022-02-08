<template>
  <div id="app">
    <header class="app-header" v-if="$route.path!='/entry'">
      <h3>教室小助手后台管理系统</h3>
      <el-button size="small" @click="LoginOut()">登出</el-button>
    </header>
    <div style="display:flex">
      <Sidebar v-if="$route.path!='/entry'"></Sidebar>
      <div class="app-main">
        <router-view :key="$route.path"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex'
import Sidebar from './views/sidebar/sidebar.vue'
export default {
  components:{
    Sidebar
  },
  computed: {
    ...mapState(['accessToken'])
  },
  methods:{
    ...mapActions(['GET_USERINFO','LOGIN_OUT_REMOTE']),
    LoginOut(){
      this.LOGIN_OUT_REMOTE();
      this.$router.push('/entry');
    }
  },
  created () {
    //如果当前localStorage中有accessToken字段然后vuex里存的accessToken也为空（那就说明页面刷新了，或者是刚登录过现在重新打开该系统）
    if(localStorage.getItem('accessToken')&&this.accessToken==''){
      this.$store.commit('SET_TOKEN',localStorage.getItem('accessToken'))
      this.$store.commit('SET_USERINFO',JSON.parse(localStorage.getItem('userInfo'))) //现在有缓存中有token就有userInfo，不用每次都向服务器请求info了
      // console.log(this.accessToken);
      // this.GET_USERINFO(); //因为用户信息是不保存在本地的，所以每次进入网站或者刷新都要重新拉取一遍用户信息(改成存缓存了)
    }
  },
  
}
</script>

<style lang='scss'>
#app{
  margin: 0;
  padding: 0;
  .app-header{
    padding: 0 20px;
    height: 60px;
    background-color: rgb(179, 175, 175);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button{
      height: 38px;
    }
  }
  .app-main{
    flex: 1;
    background-color: #f0f2f5;
  }
}

</style>
