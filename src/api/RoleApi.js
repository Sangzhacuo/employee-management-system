import axios from '../utils/request'

// 角色列表
export const $list = async ()=>{
  let {data} = await axios.get('Role/List')
  return data
}

// 获取单个角色
export const $getOne = async(params)=>{
  let {data} = await axios.get('Role/GetOne',{params})
  return data
}

// 添加角色
export const $add = async (params)=>{
  let {data} = await axios.post('Role/Add',params)
  return data
}

// 修改角色
export const $update = async (params)=>{
  let {data} = await axios.post('Role/Update',params)
  return data
}

// 删除角色
export const $del = async (params)=>{
  let {data} = await axios.post('Role/Delete',params)
  return data
}

