import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import("../views/Login.vue")
  },
  {
    path: '/register',
    component: () => import("../views/Register.vue")
  },
  {
    path: '/dashboard',
    component: () => import("../views/Dashboard/DashBoard.vue"),
    children: [
      { path: "/dashboard/category", component: () => import("../views/Dashboard/Category.vue") },
      { path: "/dashboard/article", component: () => import("../views/Dashboard/Article.vue") },
    ],
    redirect: "/dashboard/article"
  },
  {
    path: '/home',
    component: () => import("../views/Home.vue")
  },
  {
    path: '/detail',
    component: () => import("../views/Detail.vue")
  },
  {
    path:"/:pathMatch(.*)",
    redirect:"/home"
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
