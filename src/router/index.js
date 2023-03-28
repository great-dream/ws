import {createRouter,createWebHistory} from 'vue-router'
import routes from  './routes'
const router = createRouter({
    routes:routes,history:createWebHistory()
});
router.beforeEach((to,from,next)=>{
   console.log(to);
    // console.log(from);
    // console.log(next);
    // next();
    if(to.path==="/wsLogin"){
        next();
    } else {
        let token = sessionStorage.getItem('token');
        if(token!=null){
            sessionStorage.clear();
            next();
        } else {
            next("/wsLogin");
        }
    }
})
export  default  router;
