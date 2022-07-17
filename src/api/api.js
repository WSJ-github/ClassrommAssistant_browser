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
                accessToken:token,
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
     * 修改用户信息
     */
     async UpdateUserInfo(state,oldData,newData){
        return await AxiosInstance({
            url:`/update/${state}`,
            method:'POST',
            data:{oldData,newData},
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
     * 修改学院信息
     */
     async UpdateInstitute(oldData,newData){
        return await AxiosInstance({
            url:'/update/institute',
            method:'POST',
            data:{oldData,newData},
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
     * 修改某个学院的专业
     * 参数:1.注册专业的注册数据列表
     */
     async UpdateMajor(oldData,newData){
        return await AxiosInstance({
            url:'/update/majors',
            method:'POST',
            data:{oldData,newData},
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
     async DeleteClass(className,group_id){
        return await AxiosInstance({
            url:'/delete/class',
            method:'POST',
            data:{className,group_id},
            params:{accessToken:$store.state.accessToken}
        })
    }, 
    /***
     * 更新某条班级信息
     */
     async UpdateClassInfo(oldData,newData){
        return await AxiosInstance({
            url:'/update/class',
            method:'POST',
            data:{oldData,newData},
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
    },
    /***
     * 删除某个学生信息
     */
     async DeleteStudent(stuID,group_id){
        return await AxiosInstance({
            url:'/delete/student',
            method:'POST',
            data:{stuID,group_id},
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取课程信息
     * 参数:1.页码2.页大小3.学院名称（可选参数，TS需要传获取部分，SA不传获取全部）
     */
    async FetchCoursesList(page_index,page_size,insName){
        return await AxiosInstance({
            url:'/fetch/courses',
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
     * 注册课程信息
     */
    async AddCourseInfo(data){
        return await AxiosInstance({
            url:'/add/courses',
            method:'POST',  
            data,
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取课程详情信息
     * 参数:1.课程ID
     */
    async FetchCoursesDetail(couID){
        return await AxiosInstance({
            url:'/fetch/courseDetail',
            method:'GET',
            params:{
                couID,
                accessToken:$store.state.accessToken
            }
        })
    },
    /***
     * 删除某条课程信息
     */
     async DeleteCourse(couID){
        return await AxiosInstance({
            url:'/delete/course',
            method:'POST',
            data:{couID},
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 查询课程选课信息(即根据课程ID来抽取出选择该课程的学生的ID)
     * 参数:1.课程ID 
     */
    async QuerySelectedCoursesInfo(couID){
        return await AxiosInstance({
            url:'/query/selectedInfo',
            method:'GET',
            params:{
                couID,
                accessToken:$store.state.accessToken
            }
        })
    },
    /***
     * 新增选课信息
     */
    async addSelectCourseInfo(stuIDList,couID){
        return await AxiosInstance({
            url:'/add/courseSelectedInfo',
            method:'POST',
            data:{stuIDList,couID},
            params:{ accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取课程选课信息
     * 参数:3.学院名称(可选参数，不传的话就默认拉取所有课程的选课信息)
     */
    async FetchSelectedCoursesInfo(page_index,page_size,insName){
        return await AxiosInstance({
            url:'/fetch/selectedInfo',
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
     * 删除课程选课信息(即根据课程ID来抽取出选择该课程的学生的ID)
     * 参数:1.couID 2.stuID
     */
     async DeleteSelectedCoursesInfo(couID,stuID){
        return await AxiosInstance({
            url:'/delete/selectedInfo',
            method:'POST',
            data:{couID,stuID},
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 拉取考勤记录
     */
    async FetchAttendanceRecordList(page_index,page_size,insName){
        return await AxiosInstance({
            url:'/getInstitute/AttendanceRecordList',
            method:'POST',
            data:{
                insName,
                page:page_index,
                per_page:page_size
            },
            params:{accessToken:$store.state.accessToken}
        })
    },
    /***
     * 删除考勤记录
     */
    async DeleteAttendanceRecord(recordID){
        return await AxiosInstance({
            url:'/delete/attendanceRecord',
            params:{
                accessToken:$store.state.accessToken,
                recordID
            }
        })
    },
    /***
     * 筛选出特定条件(比如特定时间范围内)的考勤记录
     */
    async FilterAttendanceRecord(filterData){
        return await AxiosInstance({
            url:'/filter/attendanceRecord',
            method:'POST',
            params:{
                accessToken:$store.state.accessToken,
            },
            data:{
                filterData
            }
        })
    }


}
