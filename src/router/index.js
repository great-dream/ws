import {createRouter,createWebHistory} from 'vue-router'
import routes from  './routes'
const router = createRouter({
    routes:routes,history:createWebHistory()
});
router.beforeEach((to,from,next)=>{
    let token = sessionStorage.getItem('token');
    if(token || to.path==='/login'){
        next();
    } else {
        // alert('无权访问');
        router.go('/login');
    }
})
export  default  router;
