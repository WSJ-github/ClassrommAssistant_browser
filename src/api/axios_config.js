import Axios from 'axios'
import Store from '@/store'
import { MessageBox } from 'element-ui'
import router from '@/router'

// console.log(process.env.VUE_APP_BASE_API)
const service = Axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:500
})

// service.interceptors.request.use(config=>{
//     // if(Store.state.token)
//     console.log(config)
// },error=>{
//     console.log(error)
//     Promise.reject(error)
// })

service.interceptors.response.use(({data:res})=>{
    if(res.code == '4'){ //token过期
        MessageBox.alert('您的身份已经过期，请重新登录','身份过期',{
            confirmButtonText:'重新登录',
            type:'waring',
            center:true,
            showClose:false
        }).then(()=>{
            Store.dispatch('LOGIN_OUT_REMOTE')
            router.push('/entry')
            location.reload() //重新实例化vue-router
        })
    }
    else if(res.code == '3'){ //访问页面权限不足
        MessageBox.alert(res.message,'权限警告',{
            confirmButtonText:'返回首页',
            type:'waring',
            center:true,
            showClose:false
        }).then(()=>{
            router.push('/home')
            location.reload() //重新实例化vue-router
        })
    }
    else if(res.code == '0'){ //请求失败
        MessageBox.alert(res.message,'请求失败',{
            confirmButtonText:'确定',
            type:'error',
            center:true,
            showClose:false
        })
    }
    else if(res.code == '6'){ //操作权限不足
        MessageBox.alert(res.message,'权限不足',{
            confirmButtonText:'确定',
            type:'error',
            center:true,
            showClose:false
        })
    }
    return res;
},error=>{
    Promise.reject(error)
})

export default service