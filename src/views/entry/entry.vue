<template>
  <div id="loginPage">
    <div class="login-box">
      <header>教室小助手后台管理系统</header>
      <el-input v-model="accountName" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      <el-input v-model="password" placeholder="请输入密码" show-password prefix-icon="el-icon-key"></el-input>
      <el-button type="primary" @click="login()">登录</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js'
export default {
  data () {
    return{
      accountName:'superAdmin',
      password:'123456'
    }
  },
  methods:{
    login(){
      api.LoginIn(this.accountName,this.password).then(res=>{
        if(res.code==1){ //code为1表示登录成功
          localStorage.setItem('accessToken',res.accessToken);
          this.$store.commit('SET_TOKEN',res.accessToken);
          this.$store.dispatch('GET_USERINFO');
          this.$router.push('/home');
        }
      })
    }
  }

}
</script>

<style lang="scss">
#loginPage{
  width: 100vw;
  height: 100vh;
  background-color: #2d3a4b;
  position: relative;
  .login-box{
    width:520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top:20%;
    left:50%;
    transform: translateX(-50%);
    header{
      color:#eee;
      font-weight: 600;
      font-size: 26px;
      margin-bottom: 30px;
    }
    .el-input{
      margin-bottom:20px;
      width: 350px;
    }
    .el-button{
      width: 350px;
    }
  }

}
</style>