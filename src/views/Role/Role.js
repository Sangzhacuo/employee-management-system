import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import { $list, $del } from "../../api/RoleApi";
import MyNotification from "../../components/MyNotification/MyNotification";
// 导入添加组件
import AddRole from "./AddRole";

export default function Role() {
  // 编辑状态Id
  let [roleId,setRoleId] = useState(0)
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 是否打开抽屉
  const [open, setOpen] = useState(false);
  // 角色列表数据
  let [roleList, setRoleList] = useState([]);
  useEffect(() => {
    loadList();
  }, []);
  // 加载列表数据的方法
  const loadList = () => {
    $list().then((data) => {
      data = data.map((r) => {
        return {
          ...r,
          key: r.roleId,
        };
      });
      setRoleList(data);
    });
  };
  // 编辑方法
  const edit = (roleId)=>{
    setOpen(true)  //打开抽屉
    setRoleId(roleId)  //设置为编辑状态
  }
  // 删除方法
  const del = (roleId) => {
    $del({ roleId }).then(({ success, message }) => {
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
      title: "角色编号",
      dataIndex: "roleId",
      width: "100px",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      width: "200px",
    },
    {
      title: "操作",
      key: "action",
      render: (ret) => (
        <>
          <Button size="small" style={{borderColor:'orange',color:'orange'}} onClick={()=>{
            edit(ret.roleId)
          }}>编辑</Button>
          <Popconfirm
          title="提示"
          description="确定删除吗？"
          onConfirm={() => {
            del(ret.roleId);
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
  return (
    <>
      <div className="search">
        <Button
          size="middle"
          onClick={() => {
            //打开抽屉
            setOpen(true);
          }}
        >
          添加
        </Button>
      </div>
      <Table size="small" dataSource={roleList} columns={columns} />
      <AddRole open={open} setOpen={setOpen} loadList={loadList} roleId={roleId} setRoleId={setRoleId} />
      <MyNotification notiMsg={notiMsg} />
    </>
  );
}
