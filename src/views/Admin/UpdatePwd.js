import React,{useEffect,useState} from "react";
import {Button,Form, Input} from 'antd'
import {useSelector} from 'react-redux'
import {$resetPwd} from '../../api/adminApi'
import MyNotification from "../../components/MyNotification/MyNotification";

export default function UpdatePwd() {
  // 通知框状态
  let [notiMsg, setNotiMsg] = useState({ type: "", description: "" });
  // 获取登录信息子模块
  const {adminSlice} = useSelector(state=>state)
  const {admin} = adminSlice

  // 定义表单实例
  let [form] = Form.useForm();
  // 表单提交的方法
  const onFinish = async (values) => {
    let {message,success} = await $resetPwd(values)
    if(success){
      setNotiMsg({type:'success',description:message})
    }else{
      setNotiMsg({type:'error',description:message})
    }
  }
  // 清空表单的方法
  const clear = () => {
    form.resetFields()
  };
  // 副作用
  useEffect(()=>{
    form.setFieldValue('id',admin.id)
  },[admin.id])
  return (
    <>
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
        label="原始密码"
        name="oldLoginPwd"
        rules={[
          {
            required: true,
            message: "请输入原始密码",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="最新密码"
        name="newLoginPwd"
        rules={[
          {
            required: true,
            message: "请输入最新密码",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="newLoginPwd2"
        // 如果该依赖项的值(newLoginPwd)发生变化，将触发当前表单项的验证
        dependencies={['newLoginPwd']}
        rules={[
          {
            required: true,
            message: "请再次确认密码",
          },
          ({ getFieldValue }) => ({
            // 自定义验证函数
            validator(_, value) {
              if (!value || getFieldValue('newLoginPwd') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码输入不一致'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          修改
        </Button>
        <Button onClick={clear} style={{ marginLeft: "10px" }}>
          取消
        </Button>
      </Form.Item>
    </Form>
    <MyNotification notiMsg={notiMsg} />
    </>
  );
}
