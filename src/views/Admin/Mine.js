import React from 'react'
import {useSelector} from 'react-redux'
import {baseURL} from '../../config'

export default function Mine() {
  // 获取登录信息子模块
  const {adminSlice} = useSelector(state=>state)
  const {admin} = adminSlice
  return (
    <div style={{display:'flex',}}>
      <img style={{width:'200px'}} src={baseURL+'upload/admin/'+admin.photo} />
      <div style={{marginLeft:'10px',fontSize:'20px'}}>
        <p>账号：{admin.loginId}</p>
        <p>姓名：{admin.name}</p>
        <p>电话：{admin.phone}</p>
        <p>角色：{admin.role?.roleName}</p>
      </div>
    </div>
  )
}
