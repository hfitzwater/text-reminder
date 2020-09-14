import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Store from '../store'
import { SESSION_TOKEN_KEY } from '../services/core';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      public: true
    },
    component: Home
  },
  {
    path: '/login',
    meta: {
      public: true
    },
    name: 'Log In',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    meta: {
      public: true
    },
    name: 'Sign Up',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/forgot-password',
    meta: {
      public: true
    },
    name: 'Forgot Password',
    component: () => import('../views/PasswordForgot.vue')
  },
  {
    path: '/reset-password',
    meta: {
      public: true
    },
    name: 'Reset Password',
    component: () => import('../views/PasswordReset.vue')
  },
  {
    path: '/reset-password-sent',
    meta: {
      public: true
    },
    name: 'Reset Password Email Sent',
    component: () => import('../views/PasswordResetSent.vue')
  },
  {
    path: '/reset-password-success',
    meta: {
      public: true
    },
    name: 'Reset Password: Successful',
    component: () => import('../views/PasswordResetSuccess.vue')
  },
  {
    path: '/reminders',
    name: 'Reminders',
    component: () => import('../views/Reminders.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const hasToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

  if( !to.meta.public && !hasToken ) {
    next(false)
  } else {
    next()
  }
})

export default router
