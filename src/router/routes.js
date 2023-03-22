import  wsLogin from '@/components/Login'
import wsMain from '@/components/Main'
import userManager from '@/components/user/UserManager'
import positionManager from '@/components/position/PositionManager'
const routes = [
    {
        path:'/login',
        name:'wsLogin',
        component:wsLogin
    },{
        path:'/main',
        name:'wsMain',
        component:wsMain
    },{
        path:'/userManager',
        name:'userManager',
        component:userManager
    },{
        path:'/positionManager',
        name:'positionManager',
        component:positionManager
    }
]
export default routes;