import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/auth/Login'
import Client from '@/components/Client'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta : {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component : Login
    }, 
    {
      path: '/client/:name',
      name: 'Client',
      component : Client,
      meta : {
        requiresAuth: true
      }
    }
  ]
})


router.beforeEach((to, from, next) => {
  // check to see if route requires auth 
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user signed in, proceed to route 
      next();
    } else { 
      // no user signed in 
      next({ name : 'Login' });
    }
  } else { 
    next();
  }
})


export default router