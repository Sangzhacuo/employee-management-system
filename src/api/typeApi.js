import axios from '../utils/request'

// 房型列表
export const $list = async ()=>{
  let {data} = await axios.get('RoomType/List')
  return data
}

// 获取单个房型
export const $getOne = async(params)=>{
  let {data} = await axios.get('RoomType/GetOne',{params})
  return data
}

// 添加房型
export const $add = async (params)=>{
  let {data} = await axios.post('RoomType/Add',params)
  return data
}

// 修改房型
export const $update = async (params)=>{
  let {data} = await axios.post('RoomType/Update',params)
  return data
}

// 删除房型
export const $del = async (params)=>{
  let {data} = await axios.post('RoomType/Delete',params)
  return data
}

// 显示销售统计
export const $totalPrice = async ()=>{
  let {data} = await axios.get('RoomType/TotalTypePrice')
  return data
}