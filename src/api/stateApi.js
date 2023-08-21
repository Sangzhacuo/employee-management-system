import axios from '../utils/request'

// 房间状态列表
export const $list = async ()=>{
  let {data} = await axios.get('RoomState/List')
  return data
}

// 房间状态列表（没有入住状态）
export const $listToUpdate = async ()=>{
  let {data} = await axios.get('RoomState/ListToUpdate')
  return data
}