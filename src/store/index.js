import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken:'',
    userInfo:''
  },
  mutations: {
    SET_TOKEN(state,token){ //设置token信息
      state.accessToken=token
    },
    SET_USERINFO(state,userInfo){ //设置用户信息
      state.userInfo=userInfo
    },
    LOGIN_OUT(state){ //用户登出时调用
      state.userInfo=''
      state.accessToken=''
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    }
  },
  actions: {
    GET_USERINFO({commit,state}){ //异步拉取用户信息，然后回调设置用户信息
      api.FetchUserInfo(state.accessToken).then(res=> {
        if(res.code===1){ //表示拉取成功
          commit('SET_USERINFO',res.userInfo)
          localStorage.setItem('userInfo',JSON.stringify(res.userInfo)) //将用户信息转为json格式存在localStorage中
        }
      })
    },
    LOGIN_OUT_REMOTE({commit,state}){
      api.LoginOut(state.accessToken) //异步登出系统
      commit('LOGIN_OUT') //清除本地缓存
    }
  },
  modules: {
  }
})
