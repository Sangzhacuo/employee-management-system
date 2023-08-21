import axios from '../utils/request'

// 顾客列表
export const $list = async (params)=>{
  let {data} = await axios.get('GuestRecord/List',{params})
  return data
}

// 获取单个顾客
export const $getOne = async(params)=>{
  let {data} = await axios.get('GuestRecord/GetOne',{params})
  return data
}

// 添加顾客
export const $add = async (params)=>{
  let {data} = await axios.post('GuestRecord/Add',params)
  return data
}

// 修改顾客
export const $update = async (params)=>{
  let {data} = await axios.post('GuestRecord/Update',params)
  return data
}

// 删除顾客
export const $del = async (params)=>{
  let {data} = await axios.post('GuestRecord/Delete',params)
  return data
}

// 顾客结账
export const $checkout = async (params)=>{
  let {data} = await axios.post('GuestRecord/Checkout',params)
  return data
}