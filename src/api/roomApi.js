import axios from '../utils/request'

// 客房列表
export const $list = async (params)=>{
  let {data} = await axios.get('Room/List',{params})
  return data
}

// 获取单个客房
export const $getOne = async(params)=>{
  let {data} = await axios.get('Room/GetOne',{params})
  return data
}

// 添加客房
export const $add = async (params)=>{
  let {data} = await axios.post('Room/Add',params)
  return data
}

// 修改客房
export const $update = async (params)=>{
  let {data} = await axios.post('Room/Update',params)
  return data
}

// 删除客房
export const $del = async (params)=>{
  let {data} = await axios.post('Room/Delete',params)
  return data
}