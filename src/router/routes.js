//所有的路由组件
import Project from '../pages/Project'
import Editor from '../pages/Editor'
import Login from '../pages/Login'

export default[
  //登录的路由
  {
    path:'/login',
    component:Login,
  },
  //首页的路由
  {
    path:'/project',
    component:Project,
  },

  //编辑页面
  {
    path:'/editor',
    component:Editor,
  },

  // 路由重定向
  {
    path:'/',
    redirect:'/project'
  }
]