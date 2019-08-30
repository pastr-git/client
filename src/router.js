import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'create',
      components: { 
        default: require('./views/create.vue').default,
        navbar: require('./views/navbar/create.vue').default
      }
    },
    {
      path: '/:id.:lang',
      name: 'view-lang',
      components: { 
        default: require('./views/view.vue').default,
        navbar: require('./views/navbar/view.vue').default
      }
    },
    {
      path: '/:id',
      name: 'view',
      components: { 
        default: require('./views/view.vue').default,
        navbar: require('./views/navbar/view.vue').default
      }
    }
  ]
})
