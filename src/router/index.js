import Vue from 'vue'
import VueRouter from 'vue-router'
import entry from '@/views/entry/entry.vue'
import home from '@/views/home/home.vue'
import Layout from '@/views/Layout.vue'
import userManage from '@/views/user-manage/user-manage.vue'
import institutes from '@/views/institute-manage/institutes.vue'
import majors from '@/views/institute-manage/majors.vue'
import classes from '@/views/class-manage/classes.vue'
import students from '@/views/class-manage/students.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect:'/home',
    hidden: true
  },
  {
    path:'/home', //首页
    name:'首页',
    component:home,
    icon:'el-icon-s-home'
  },
  {
    path: '/entry', //登录界面
    name: '登录页',
    component:entry,
    hidden: true,
  },
  {
    path: '/userManage', //用户管理页面
    component: Layout,
    redirect:'/userManage/common-user',
    icon:'el-icon-user-solid',
    name:'用户管理',
    children:[
      {
        path:'common-user', //对普通用户（比如手机端的学生用户）信息的管理(包括增删查改学生信息)
        name:'普通用户',
        component:userManage, //对普通用户的管理和对管理员用户的管理使用同一组件（通过路由的query参数控制）
        meta:{keyWord:'common-user'}
      },
      {
        path:'admin-user', //对管理员用户信息的管理（管理员用户指的是能登入后台的教秘的账号），该功能只有超级管理员可以使用
        name:'管理员用户',
        component:userManage,
        meta:{keyWord:'admin-user'}
      },
    ]
  },
  {
    path: '/instituteManage', //学院信息管理（包括学院信息和相应学院开设的专业信息管理）
    component: Layout,
    redirect:'/instituteManage/institutes',
    showOnly: true, //说明在菜单栏上不显示子路由对应的菜单项只显示父级菜单项
    icon:'el-icon-s-management',
    name:'学院管理',
    children:[
      {
        path:'institutes', //学院信息
        name:'institutes',
        component:institutes
      },
      {
        path:'majors', //学院对应的专业信息
        name:'major',
        component:majors
      }
    ]
  },
  {
    path: '/classManage', //班级信息管理
    component: Layout,
    redirect:'/classManage/classes',
    showOnly: true,
    icon:'el-icon-s-custom',
    name:'班级管理',
    children:[
      {
        path:'classes', //班级基本信息
        component:classes
      },
      {
        path:'students', //班级对应的学生的信息(增删查改)
        component:students
      }
    ]
  },
  {
    path: '/courseManage', //课程信息管理
    component:Layout,
    redirect:'/courseManage/courses',
    showOnly: true,
    icon:'el-icon-s-check ',
    name:'课程管理',
    children:[
      {
        path:'courses' //课程信息
      },
      {
        path:'courseDetail' //课程详情信息
      }
    ]
  },
  {
    path:'/selecteManage', //选课信息管理
    name:'选课管理',
    icon:'el-icon-s-platform'
  },
  {
    path:'/attendanceManage', //考勤信息管理
    name:'考勤管理',
    icon:'el-icon-message-solid'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(to.path)
  // console.log(localStorage.getItem('accessToken'))
  if(to.path!='/entry'&&!localStorage.getItem('accessToken')){
    next('/entry')
  }
  else next()
})
export default router
