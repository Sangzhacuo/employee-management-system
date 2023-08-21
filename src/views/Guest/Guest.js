import React,{useState,useEffect} from 'react'
import {Table,Button,Popconfirm,Pagination,Select,Tag,Input} from 'antd'
import {$list,$del,$checkout} from '../../api/guestApi'
import {$list as $resideList} from '../../api/resideApi'
import MyNotification from "../../components/MyNotification/MyNotification";
import AddGuest from './AddGuest';

export default function Guest() {
  // 结账状态列表
  let [resideList, setResideList] = useState([]);
  // 加载房间状态列表的方法
  const loadStateList = ()=>{
    $resideList().then((data)=>{
      data = data.map((r) => {
        //console.log(r);
        return {
          value:r.resideStateId,
          label:r.resideStateName
        };
      });
      data.unshift({value:0,label:'请选择结账状态'})
      setResideList(data);
    })
  }
  // 顾客姓名，用于筛选列表数据
  let [guestName,setGuestName] = useState(null)
  // 结账状态id，用于筛选列表数据
  let [resideStateId,setResideStateId] = useState(0)
  // 总数量
  let [count,setCount] = useState(1)
  // 页码
  let [pageIndex,setPageIndex] = useState(1)
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 编辑状态Id
  let [guestId,setGuestId] = useState(0)
  // 是否打开抽屉
  const [open, setOpen] = useState(false);
  // 顾客列表数据
  let [guestList, setGuestList] = useState([]);
  // 表格列数据
  const columns = [
    {
      title: "姓名",
      dataIndex: "guestName",
      width: "80px",
    },
    {
      title: "电话",
      dataIndex: "phone",
      width: "100px",
    },
    {
      title: "身份证",
      dataIndex: "identityId",
      width: "120px",
    },
    {
      title: "房间号",
      dataIndex: "roomId",
      width: "80px",
    },
    {
      title: "房间类型",
      dataIndex: "roomTypeName",
      width: "100px",
    },
    {
      title: "价格",
      dataIndex: "roomTypePrice",
      width: "80px",
    },
    {
      title: "床位数",
      dataIndex: "bedNum",
      width: "80px",
    },
    {
      title: "入住日期",
      dataIndex: "resideDate",
      width: "100px",
    },
    {
      title: "离开日期",
      dataIndex: "leaveDate",
      width: "100px",
    },
    {
      title: "押金",
      dataIndex: "deposit",
      width: "80px",
    },
    {
      title: "总金额",
      dataIndex: "totalMoney",
      width: "80px",
    },
    {
      title: "人数",
      dataIndex: "guestNum",
      width: "80px",
    },
    {
      title: "结账状态",
      dataIndex: "resideStateName",
      width: "80px",
      render: (resideStateName) => (
        <Tag color={resideStateName==='已结账'?'lightgreen':'lightcoral'}>
          {resideStateName}
        </Tag>
      )
    },
    {
      title: "操作",
      key: "action",
      render: (ret) => {
        return (
          ret.resideStateName==='已结账'?
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => {
              del(ret.guestId);
            }}
            okText="确定"
            cancelText="取消"
            >
              <Button danger size="small">
                删除
              </Button>
            </Popconfirm>
          :
          <>
            <Button size="small" style={{borderColor:'orange',color:'orange'}} onClick={()=>{
              edit(ret.guestId)
            }}>编辑</Button>
            <Button size="small" style={{marginLeft:'5px',borderColor:'lightseagreen',color:'lightseagreen'}}
            onClick={()=>{
              // 执行结账操作
              $checkout({guestId:ret.guestId}).then(ret=>{
                setNotiMsg({
                  type: "success", description: `结账成功！总房费为：${ret.totalMoney}元`
                })
                // 重新加载列表数据
                loadList()  
              })
            }}>结账</Button>
          </>
        )
      },
    }
  ];
  // 编辑方法
  const edit = (guestId)=>{
    setOpen(true)  //打开抽屉
    setGuestId(guestId)  //设置为编辑状态
  }
  // 删除方法
  const del = (guestId) => {
    $del({ guestId }).then(({ success, message }) => {
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
    $list({pageSize:10,pageIndex,guestName,resideStateId}).then(({data,count}) => {
      //console.log(data);
      data = data.map((r) => {
        return {
          key: r.guestId,
          guestId:r.guestId,
          identityId:r.identityId,
          guestName:r.guestName,
          phone:r.phone,
          roomId:r.roomId,
          roomTypeName:r.room.roomType.roomTypeName,
          roomTypePrice:r.room.roomType.roomTypePrice,
          bedNum:r.room.roomType.bedNum,
          resideDate:r.resideDate,
          leaveDate:r.leaveDate,
          deposit:r.deposit,
          totalMoney:r.totalMoney,
          guestNum:r.guestNum,
          resideStateName:r.resideState.resideStateName
        };
      });
      // 设置顾客列表数据
      setGuestList(data);
      // 设置总数量
      setCount(count)
    });
  };
  // 副作用函数
  useEffect(() => {
    loadStateList()   //加载房间状态列表数据
    loadList();   //加载列表数据
  }, [pageIndex]);
  return (
    <>
      <div className="search">
        <span>顾客姓名：</span>
        <Input value={guestName} onChange={(e)=>{setGuestName(e.target.value)}} size='small' style={{width:'200px'}}/>
        <span style={{marginLeft:'5px'}}>结账状态：</span>
        <Select size='small' style={{width:'200px'}} options={resideList} defaultValue={0} onSelect={(value)=>{
          setResideStateId(value)
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
      <Table size="small" dataSource={guestList} columns={columns} pagination={false} />
      <Pagination style={{marginTop:'5px'}} size='small' defaultCurrent={pageIndex} 
      total={count} pageSize={10} onChange={(page)=>{setPageIndex(page)}}/>
      <AddGuest open={open} setOpen={setOpen} loadList={loadList} guestId={guestId} setGuestId={setGuestId}/>
      <MyNotification notiMsg={notiMsg} />
    </>
  )
}