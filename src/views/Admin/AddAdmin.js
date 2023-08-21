import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, Input, Select } from "antd";
import { $add,$getOne,$update } from "../../api/adminApi";
import { $list } from "../../api/RoleApi";
import MyNotification from "../../components/MyNotification/MyNotification";
import UploadImg from "./UploadImg";

export default function AddAdmin({
  open,
  setOpen,
  loadList,
  loginId,
  setLoginId,
}) {
  // 角色列表
  let [roleList, setRoleList] = useState([]);
  // 加载角色列表的方法
  const loadRoleList = () => {
    $list().then((data) => {
      data = data.map((r) => {
        return {
          value:r.roleId,
          label:r.roleName
        };
      });
      setRoleList(data);
    });
  };
  // 定义表单实例
  let [form] = Form.useForm();
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 关闭抽屉的方法
  const onClose = () => {
    clear(); //清空表单
    setLoginId(0)  //取消编辑状态
    setOpen(false); //关闭抽屉
  };
  // 表单提交的方法
  const onFinish = (values) => {
    if (loginId) {
      // 修改
      $update(values).then(({success,message})=>{
        if(success){
          setNotiMsg({type:'success',description:message})
          loadList()  //加载列表
        }else{
          setNotiMsg({type:'error',description:message})
        }
      })
    } else {
      // 添加
      $add(values).then(({ success, message }) => {
        if (success) {
          setNotiMsg({ type: "success", description: message });
          clear(); //清空表单
          loadList(); //加载列表
        } else {
          setNotiMsg({ type: "error", description: message });
        }
      });
    }
  };
  // 清空表单的方法
  const clear = () => {
    form.resetFields()
  };
  useEffect(() => {
    loadRoleList(); //加载角色列表
    if(loginId!==0){
      $getOne({loginId}).then(data=>{
        form.setFieldsValue(data)
      })
    }
  }, [loginId]);
  return (
    <>
      <Drawer
        title={loginId ? "修改账户" : "添加账户"}
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
          <Form.Item label="编号" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: "请输入账号",
              },
            ]}
            // 控制是否隐藏该表单项
            hidden={loginId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="loginPwd"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
            hidden={loginId}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入姓名",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入电话",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="头像"
            name="photo"
            rules={[
              {
                required: true,
                message: "请选择头像",
              },
            ]}
          >
            <UploadImg form={form}/>
          </Form.Item>
          <Form.Item
            label="角色"
            name="roleId"
            rules={[
              {
                required: true,
                message: "请选择角色",
              },
            ]}
          >
            <Select options={roleList}></Select>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {loginId ? "修改" : "添加"}
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
