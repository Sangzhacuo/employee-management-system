import axios from '../utils/request'
import md5 from 'md5'

//使用axios从服务器获取数据
// 登录
export const $login = async (params)=>{
  // 对密码加密
  params.loginPwd = md5(md5(params.loginPwd).split('').reverse().join(''))
  let {data} = await axios.get('Admin/Login',{params})
  //data 包含两个属性 message：密码错误/登录名不存在... 和 suceess:true/false 是否成功登录 
  if(data.success){
    // 在浏览器缓存中存储token
    sessionStorage.setItem('token',data.token)
  }
  return data
}

// 账户列表
export const $list = async (params)=>{
  let {data} = await axios.get('Admin/List',{params})
  return data
}

// 获取单个账户
export const $getOne = async (params)=>{
  let {data} = await axios.get('Admin/GetOne',{params})
  return data
}

// 添加账户
export const $add = async (params)=>{
  // 要对密码加密
  params.loginPwd = md5(md5(params.loginPwd).split('').reverse().join(''))
  let {data} = await axios.post('Admin/Add',params)
  return data
}

// 修改账户
export const $update = async (params)=>{
  let {data} = await axios.post('Admin/Update',params)
  return data
}

// 删除账户
export const $del = async (params)=>{
  let {data} = await axios.post('Admin/Delete',params)
  return data
}

// 修改密码
export const $resetPwd = async (params)=>{
  // 要对密码加密
  params.oldLoginPwd = md5(md5(params.oldLoginPwd).split('').reverse().join(''))
  params.newLoginPwd = md5(md5(params.newLoginPwd).split('').reverse().join(''))
  let {data} = await axios.post('Admin/ResetPwd',params)
  return data
}