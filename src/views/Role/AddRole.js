import React,{useState,useEffect} from "react";
import { Button, Drawer,Form, Input } from "antd";
import { $add,$getOne,$update } from "../../api/RoleApi";
import MyNotification from "../../components/MyNotification/MyNotification";

export default function AddRole({open,setOpen,loadList,roleId,setRoleId}) {
  // 定义表单实例
  let [form] = Form.useForm()
  // 通知框状态
  let [notiMsg,setNotiMsg] = useState({type:'',description:''})
  useEffect(()=>{
    if(roleId!==0){
      $getOne({roleId}).then(data=>{
        //将数据填入表单中
        form.setFieldsValue(data)
      })
    }
  },[roleId])
  // 关闭抽屉的方法
  const onClose = () => {
    clear()  //清空表单
    setRoleId(0)  //取消编辑状态
    setOpen(false);  //关闭抽屉
  };
  // 表单提交的方法
  const onFinish = (values) => {
    //有id，编辑
    if(roleId){
      $update(values).then(({success,message})=>{
        if(success){
          setNotiMsg({type:'success',description:message})
          loadList()  //加载列表
        }else{
          setNotiMsg({type:'error',description:message})
        }
      })
    }else{
      //无id 增加
      $add(values).then(({success,message})=>{
        if(success){
          setNotiMsg({type:'success',description:message})
          clear()  //清空表单
          loadList()  //加载列表
        }else{
          setNotiMsg({type:'error',description:message})
        }
      })
    }
  };
  // 清空表单的方法
  const clear = ()=>{
    form.resetFields()
  }
  return (
    <>
      <Drawer
        title={roleId?'修改角色':'添加角色'}
        width={500}
        placement="right" 
        onClose={onClose}
        open={open}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="角色编号"
            name="roleId"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[
              {
                required: true,
                message: "请输入角色名称",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {roleId?'修改':'添加'}
            </Button>
            <Button onClick={clear} style={{ marginLeft: "10px" }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <MyNotification notiMsg={notiMsg} />
    </>
  );
}
