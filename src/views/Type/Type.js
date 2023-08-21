import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import { $list,$del } from "../../api/typeApi";
import MyNotification from "../../components/MyNotification/MyNotification";
import AddType from "./AddType";

export default function Type() {
  // 编辑状态Id
  let [roomTypeId,setRoomTypeId] = useState(0)
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 是否打开抽屉
  const [open, setOpen] = useState(false);
  // 房型列表数据
  let [typeList, setTypeList] = useState([]);
  // 加载列表数据的方法
  const loadList = () => {
    $list().then((data) => {
      data = data.map((r) => {
        // console.log(r);
        return {
          ...r,
          key: r.roomTypeId,
        };
      });
      setTypeList(data);
    });
  };
  // 编辑方法
  const edit = (roomTypeId)=>{
    setOpen(true)  //打开抽屉
    setRoomTypeId(roomTypeId)  //设置为编辑状态
  }
  // 删除方法
  const del = (roomTypeId) => {
    $del({ roomTypeId }).then(({ success, message }) => {
      if (success) {
        setNotiMsg({ type: "success", description: message });
        loadList(); //重新加载列表
      } else {
        setNotiMsg({ type: "error", description: message });
      }
    });
  };
  // 表格列数据
  const columns = [
    {
      title: "房型编号",
      dataIndex: "roomTypeId",
      width: "100px",
    },
    {
      title: "房型名称",
      dataIndex: "roomTypeName",
      width: "200px",
    },
    {
      title: "房型价格",
      dataIndex: "roomTypePrice",
      width: "200px",
    },
    {
      title: "床位数量",
      dataIndex: "bedNum",
      width: "100px",
    },
    {
      title: "操作",
      key: "action",
      render: (ret) => (
        <>
          <Button size="small" style={{borderColor:'orange',color:'orange'}} onClick={()=>{
            edit(ret.roomTypeId)
          }}>编辑</Button>
          <Popconfirm
          title="提示"
          description="确定删除吗？"
          onConfirm={() => {
            del(ret.roomTypeId);
          }}
          okText="确定"
          cancelText="取消"
          >
            <Button style={{marginLeft:'5px'}} danger size="small">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  // 副作用
  useEffect(() => {
    loadList();  //调用加载列表的方法
  }, []);
  return (
    <>
      <div className="search">
        <Button
          size="middle"
          onClick={() => {
            setOpen(true);
          }}
        >
          添加
        </Button>
      </div>
      <Table size="small" dataSource={typeList} columns={columns} />
      <AddType open={open} setOpen={setOpen} loadList={loadList} roomTypeId={roomTypeId} setRoomTypeId={setRoomTypeId} />
      <MyNotification notiMsg={notiMsg} />
    </>
  );
}
