import {useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {adminSlice} from './redux'
import {$getOne} from './api/adminApi'
// 导入页面组件
import Login from "./views/Login/Login";
import Layout from "./views/Layout/Layout";
import Role from './views/Role/Role';
import Admin from './views/Admin/Admin';
import Mine from './views/Admin/Mine';
import UpdatePwd from './views/Admin/UpdatePwd'
import Type from './views/Type/Type'
import Room from './views/Room/Room'
import Guest from './views/Guest/Guest'
import TotalPrice from './views/Type/TotalPrice'

function App() {
  // 定义redux的派发器
  const dispatch = useDispatch()
  // 获取更新admin全局数据的action
  let {setAdmin} = adminSlice.actions
  useEffect(()=>{
    // 判断是否是登录状态
    if(sessionStorage.getItem('loginId')){
      // 获取登录账号
      let loginId = sessionStorage.getItem('loginId')
      // 根据登录名获取账户信息
      $getOne({loginId}).then(admin=>{
        // 将当前登录账户信息，存储到redux
        dispatch(setAdmin(admin))
      })
    }
  },[])
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>} />
        <Route path='/layout' element={<Layout/>}>
          <Route path='role' element={<Role/>}/>
          <Route path='admin' element={<Admin/>}/>
          <Route path='mine' element={<Mine/>}/>
          <Route path='pwd' element={<UpdatePwd/>}/>
          <Route path='type' element={<Type/>}/>
          <Route path='room' element={<Room/>}/>
          <Route path='guest' element={<Guest/>}/>
          <Route path='total' element={<TotalPrice/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
