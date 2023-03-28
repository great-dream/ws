import  wsLogin from '@/components/Login'
import wsMain from '@/components/Main'
import userManager from '@/components/user/UserManager'
import positionManager from '@/components/position/PositionManager'
import dictManager from '@/components/dict/DictManager'
import recordManager from '@/components/commodity/RecordManager'
import stockManager from '@/components/commodity/StockManager'
const routes = [
    {
        path:'/wsLogin',
        name:'wsLogin',
        component:wsLogin
    },{
        path:'/',
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
    },{
        path:'/dictManager',
        name:'dictManager',
        component:dictManager
    },{
        path:'/recordManager',
        name:'recordManager',
        component:recordManager
    },{
        path:'/stockManager',
        name:'stockManager',
        component:stockManager
    }
]
export default routes;