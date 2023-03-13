import  wsLogin from '@/components/Login'
import wsMain from '@/components/Main'
const routes = [
    {
        path:'/',
        name:'wsLogin',
        component:wsLogin
    },{
        path:'/main',
        name:'wsMain',
        component:wsMain
    }
]
export default routes;