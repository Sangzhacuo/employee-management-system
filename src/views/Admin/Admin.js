import React,{useState,useEffect} from 'react'
import {Table,Button,Popconfirm,Pagination,Select} from 'antd'
import {$list,$del} from '../../api/adminApi'
import {$list as $roleList} from '../../api/RoleApi'
import AddAdmin from './AddAdmin';
import MyNotification from "../../components/MyNotification/MyNotification";
import {baseURL} from '../../config'

export default function Admin() {
  // 角色列表
  let [roleList, setRoleList] = useState([]);
  // 加载角色列表的方法
  const loadRoleList = () => {
    $roleList().then((data) => {
      data = data.map((r) => {
        return {
          value:r.roleId,
          label:r.roleName
        };
      });
      data.unshift({value:0,label:'请选择角色'})
      setRoleList(data);
    });
  };
  // 角色Id，用于筛选列表数据
  let [roleId,setRoleId] = useState(0)
  // 总数量
  let [count,setCount] = useState(1)
  // 页码
  let [pageIndex,setPageIndex] = useState(1)
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 编辑状态Id
  let [loginId,setLoginId] = useState(0)
  // 是否打开抽屉
  const [open, setOpen] = useState(false);
  // 账户列表数据
  let [adminList, setAdminList] = useState([]);
  // 表格列数据
  const columns = [
    {
      title: "编号",
      dataIndex: "id",
      width: "100px",
    },
    {
      title: "账号",
      dataIndex: "loginId",
      width: "150px",
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: "150px",
    },
    {
      title: "电话",
      dataIndex: "phone",
      width: "150px",
    },
    {
      title: "头像",
      dataIndex: "photo",
      width: "150px",
      render:(ret)=>(
        <img style={{width:'50px'}} src={baseURL+'upload/admin/'+ret} />
      )
    },
    {
      title: "角色",
      dataIndex: "roleName",
      width: "150px",
    },
    {
      title: "操作",
      key: "action",
      render: (ret) => (
        <>
          <Button size="small" style={{borderColor:'orange',color:'orange'}} onClick={()=>{
            edit(ret.loginId)
          }}>编辑</Button>
          <Popconfirm
          title="提示"
          description="确定删除吗？"
          onConfirm={() => {
            del(ret.id,ret.photo);
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
    }
  ];
  // 编辑方法
  const edit = (loginId)=>{
    setOpen(true)  //打开抽屉
    setLoginId(loginId)  //设置为编辑状态
  }
  // 删除方法
  const del = (id,photo) => {
    $del({ id,photo }).then(({ success, message }) => {
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
    $list({roleId,pageSize:8,pageIndex}).then(({data,count}) => {
      data = data.map((r) => {
        return {
          ...r,
          key: r.loginId,
          roleName:r.role.roleName
        };
      });
      // 设置账户数据
      setAdminList(data);
      // 设置总数量
      setCount(count)
    });
  };
  // 副作用函数
  useEffect(() => {
    loadRoleList()  //加载角色列表数据
    loadList();   //加载列表数据
  }, [pageIndex]);
  return (
    <>
      <div className="search">
        <span>角色：</span>
        {/* 下拉菜单组件 */}
        {/* value值打印出来是角色编号 */}
        <Select size='small' style={{width:'200px'}} options={roleList} defaultValue={0} onSelect={(value)=>{
          // console.log(value);
          setRoleId(value)
        }}></Select>
        <Button type="primary" style={{marginLeft:'5px'}} size='small' onClick={()=>{loadList()}}>查询</Button>
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
      <Table size="small" dataSource={adminList} columns={columns} pagination={false} />
      {/* antd分页组件 */}
      <Pagination style={{marginTop:'5px'}} size='small' defaultCurrent={pageIndex} 
      total={count} pageSize={8} onChange={(page)=>{setPageIndex(page)}}/>
      <AddAdmin open={open} setOpen={setOpen} loadList={loadList} loginId={loginId} setLoginId={setLoginId} />
      <MyNotification notiMsg={notiMsg} />
    </>
  )
}