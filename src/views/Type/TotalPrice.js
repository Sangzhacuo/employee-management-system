import React,{useRef,useEffect} from 'react'
import {$totalPrice} from '../../api/typeApi'
import './TotalPrice.scss'
// 引入了echarts的核心模块、全部图表以及图表所能用到的组件
import * as echarts from 'echarts';

export default function TotalPrice() {
// 创建ref对象refDiv，获取图表容器的DOM元素
  let refDiv = useRef()
  useEffect(()=>{
    // 初始化echarts实例，绑定图表
    var myChart = echarts.init(refDiv.current);
    $totalPrice().then(ret=>{
      let roomtypeNames = ret.map(r=>r.roomtypeName)
      let values = ret.map(r=>r.totalMoney)
      // 绘制图表
      myChart.setOption({
        title: {
          text: '房间类型销售额统计'
        },
        grid:{
          width:'1000px',
          height:'500px',
          top:'10%',
          left:'5%',
          right:'10%',
          bottom:'10%'
        },
        tooltip: {},
        xAxis: {
          data: roomtypeNames
        },
        yAxis: {},
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: values
          }
        ]
      });
    })
    
  },[])
  return (
    <div className='charts' ref={refDiv}>

    </div>
  )
}
