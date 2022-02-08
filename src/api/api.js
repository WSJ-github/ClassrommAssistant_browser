import AxiosInstance from './axios_config.js'
import $store from '@/store' 

const base_api=process.env.VUE_APP_BASE_API



export default {
    /**
     * 登录系统接口
     */
    async LoginIn(accountName,password){ //用户名:密码
        return await AxiosInstance.post('/login_BE',{accountName,password}) //BE是backend的意思
    },

    /***
     * 拉取登录(即当前)用户信息接口(用户信息包括权限等)
     */
    async FetchUserInfo(token){
        return await AxiosInstance.get('/fetch/userInfo',{
            params:{
                accessToken:token
            }
        })
    },
    /***
     * 登出系统接口
     */
    async LoginOut(token){
        return await AxiosInstance.get('/login_OUT',{
            params:{
                accessToken:token
            }
        })
    },
    /***
     * 调取普通用户or管理员用户信息列表
     * 参数:1.判断接口url(common or admin) 2.当前是第几页 3.一页多少条(默认一页20条)
     */
    async FetchUserList(state,page_index=1,page_size=25,token){
        if(state!='common-user'&&state!='admin-user') return Promise.reject('传参错误')
        return await AxiosInstance.get(`/fetch/${state}`,{
            params:{
                page_index,
                page_size,
                accessToken:token
            }
        })
    },
    /***
     * 删除 用户列表里某条用户数据
     * 参数:1.判断删除的是普通用户表还是管理员用户表2.用户类型3.用户账户名
     */
    async DeleteUserInfo(state,userType,userAccount){
        return await AxiosInstance({
            url:`/delete/${state}`,
            method:'POST',
            data:{userType,userAccount},
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 注册用户（普通用户or管理员用户）
     * 参数:1.state用来判断用户类型 2.data是注册用户的注册列表
     */
    async AddUserInfo(state,data){
        return await AxiosInstance({
            url:`/add/${state}`,
            method:'POST',
            data:data,
            params:{accessToken:$store.state.accessToken}
        })
    },

    /***
     * 拉取学院信息
     * 参数:1.第几页2.每页的大小
     */
    async FetchInstituesList(page_index,page_size){
        return await AxiosInstance({
            url:`/fetch/institues`,
            method:'GET',
            params:{
                page_index,
                page_size,
                accessToken:$store.state.accessToken
            }
        })
    },
    /***
     * 注册学院
     * 参数:1.注册学院的注册信息列表
     */
    async AddInstituesList(data){
        return await AxiosInstance({
            url:'/add/institute',
            method:'POST',
            data:data,
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 删除学院信息
     * 参数:1.学院名称
     */
    async DeleteInstitute(insName){
        return await AxiosInstance({
            url:'/delete/institute',
            method:'POST',
            data:{insName},
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取某个学院的专业信息
     * 参数:1.页码2.页大小3.学院名称(可选)
     */
    async FetchMajorsList(page_index,page_size,insName){
        return await AxiosInstance({
            url:'/fetch/majors',
            method:'GET',
            params:{
                accessToken:$store.state.accessToken,
                insName,
                page_index,
                page_size
            }
        })
    },
    /***
     * 注册某个学院的专业
     * 参数:1.注册专业的注册数据列表
     */
    async AddMajorsList(data){
        return await AxiosInstance({
            url:'/add/majors',
            method:'POST',
            data,
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 删除某个专业信息
     * 参数:1.专业名称
     */
    async DeleteMajor(majorName){
        return await AxiosInstance({
            url:'/delete/major',
            method:'POST',
            data:{majorName},
            params:{accessToken:$store.state.accessToken}
        })
    }, 

    /***
     * 拉取班级信息
     * 参数:1.页码2.页大小3.学院名称（可选参数）
     */
    async FetchClassesList(page_index,page_size,insName){
        return await AxiosInstance({
            url:'/fetch/classes',
            method:'GET',
            params:{
                page_index,
                page_size,
                insName,
                accessToken:$store.state.accessToken
            }
        })
    },
    /***
     * 删除某条班级信息
     */
     async DeleteClass(className){
        return await AxiosInstance({
            url:'/delete/class',
            method:'POST',
            data:{className},
            params:{accessToken:$store.state.accessToken}
        })
    }, 
    /***
     * 注册某个班级
     */
     async AddClassesList(data){
        return await AxiosInstance({
            url:'/add/classes',
            method:'POST',
            data,
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取某个班级的学生信息
     */
    async FetchStudentsInfo(className,page_index,page_size){
        return await AxiosInstance({
            url:'/fetch/students',
            method:'GET',
            params:{
                className,
                page_index,
                page_size,
                accessToken:$store.state.accessToken
            }
        })
    }
}
