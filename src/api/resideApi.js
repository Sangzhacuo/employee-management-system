import axios from '../utils/request'

// 结账状态列表
export const $list = async ()=>{
  let {data} = await axios.get('ResideState/List')
  return data
}