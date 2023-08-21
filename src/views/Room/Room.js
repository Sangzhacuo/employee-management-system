import React,{useState,useEffect} from 'react'
import {Table,Button,Popconfirm,Pagination,Select,Tag} from 'antd'
import {$list,$del} from '../../api/roomApi'
import {$list as $typeList} from '../../api/typeApi'
import {$list as $stateList} from '../../api/stateApi'
import MyNotification from "../../components/MyNotification/MyNotification";
import AddRoom from './AddRoom'

export default function Room() {
  // 房间类型列表
  let [typeList, setTypeList] = useState([]);
  // 房间状态列表
  let [stateList, setStateList] = useState([]);
  // 加载房间类型列表的方法
  const loadTypeList = () => {
    $typeList().then((data) => {
      data = data.map((r) => {
        return {
          value:r.roomTypeId,
          label:r.roomTypeName
        };
      });
      data.unshift({value:0,label:'请选择房间类型'})
      setTypeList(data);
    });
  };
  // 加载房间状态列表的方法
  const loadStateList = ()=>{
    $stateList().then((data)=>{
      data = data.map((r) => {
        console.log(r);
        return {
          value:r.roomStateId,
          label:r.roomStateName
        };
      });
      data.unshift({value:0,label:'请选择房间状态'})
      setStateList(data);
    })
  }
  // 类型id，用于筛选列表数据
  let [roomTypeId,setRoomTypeId] = useState(0)
  // 状态id，用于筛选列表数据
  let [roomStateId,setRoomStateId] = useState(0)
  // 总数量
  let [count,setCount] = useState(1)
  // 页码
  let [pageIndex,setPageIndex] = useState(1)
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 编辑状态Id
  let [roomId,setRoomId] = useState(0)
  // 是否打开抽屉
  const [open, setOpen] = useState(false);
  // 客房列表数据
  let [roomList, setRoomList] = useState([]);
  // 表格列数据
  const columns = [
    {
      title: "房间编号",
      dataIndex: "roomId",
      width: "100px",
    },
    {
      title: "房间类型",
      dataIndex: "roomTypeName",
      width: "150px",
    },
    {
      title: "房间价格",
      dataIndex: "roomTypePrice",
      width: "150px",
    },
    {
      title: "床位数量",
      dataIndex: "bedNum",
      width: "150px",
    },
    {
      title: "房间状态",
      dataIndex: "roomStateName",
      width: "150px",
      render: (roomStateName) => (
        <Tag color={roomStateName==='空闲'?'lightgreen':(roomStateName==='维修'?'lightsalmon':'lightcoral')
          }>
          {roomStateName}
        </Tag>
      )
    },
    {
      title: "操作",
      key: "action",
      render: (ret) => {
        return (
          // ret.roomStateName==='入住'?null:
          <>
            <Button size="small" style={{borderColor:'orange',color:'orange'}} onClick={()=>{
              edit(ret.roomId)
            }}>编辑</Button>
            <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => {
              del(ret.roomId);
            }}
            okText="确定"
            cancelText="取消"
            >
              <Button style={{marginLeft:'5px'}} danger size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        )
      },
    }
  ];
  // 编辑方法
  const edit = (roomId)=>{
    setOpen(true)  //打开抽屉
    setRoomId(roomId)  //设置为编辑状态
  }
  // 删除方法
  const del = (roomId) => {
    $del({ roomId }).then(({ success, message }) => {
      if (success) {
        setNotiMsg({ type: "success", description: message });
        loadList(); //重新加载列表
      } else {
        setNotiMsg({ type: "error", description: message });
      }
    });
  };
  // 加载列表数据的方法
  const loadList = () => {
    $list({roomTypeId,roomStateId,pageSize:10,pageIndex}).then(({data,count}) => {
      data = data.map((r) => {
        console.log(r);
        return {
          key: r.roomId,
          roomId:r.roomId,
          roomTypeName:r.roomType.roomTypeName,
          roomTypePrice:r.roomType.roomTypePrice,
          bedNum:r.roomType.bedNum,
          roomStateName:r.roomState.roomStateName,
        };
      });
      // 设置客房列表数据
      setRoomList(data);
      // 设置总数量
      setCount(count)
    });
  };
  // 副作用函数
  useEffect(() => {
    loadTypeList()  //加载房间类型列表数据
    loadStateList()   //加载房间状态列表数据
    loadList();   //加载列表数据
  }, [pageIndex]);
  return (
    <>
      <div className="search">
        <span>类型：</span>
        <Select size='small' style={{width:'200px'}} options={typeList} defaultValue={0} onSelect={(value)=>{
          setRoomTypeId(value)
        }}></Select>
        <span style={{marginLeft:'5px'}}>状态：</span>
        <Select size='small' style={{width:'200px'}} options={stateList} defaultValue={0} onSelect={(value)=>{
          setRoomStateId(value)
        }}></Select>
        <Button type="primary" style={{marginLeft:'5px'}} size='small' onClick={loadList}>查询</Button>
        <Button
          style={{marginLeft:'5px'}}
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          添加
        </Button>
      </div>
      <Table size="small" dataSource={roomList} columns={columns} pagination={false} />
      <Pagination style={{marginTop:'5px'}} size='small' defaultCurrent={pageIndex} 
      total={count} pageSize={10} onChange={(page)=>{setPageIndex(page)}}/>
      <AddRoom open={open} setOpen={setOpen} loadList={loadList} roomId={roomId} setRoomId={setRoomId}/>
      <MyNotification notiMsg={notiMsg} />
    </>
  )
}