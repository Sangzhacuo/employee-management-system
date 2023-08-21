import React,{useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import "./Login.scss";
import { Button, Form, Input } from "antd";
import MyNotification from "../../components/MyNotification/MyNotification";
import {$login,$getOne} from '../../api/adminApi'
import {useDispatch} from 'react-redux'
import {adminSlice} from '../../redux'

export default function Login() {
  // 定义redux的派发器
  const dispatch = useDispatch()
  // 获取更新admin全局数据的action
  let {setAdmin} = adminSlice.actions
  // 导航
  let navigate = useNavigate()
  useEffect(()=>{
    // 判断是否已登录成功
    if(sessionStorage.getItem('token')){
      navigate('/layout')
    }
  },[])
  
  // 通知框状态
  let [notiMsg,setNotiMsg] = useState({type:'',description:''})
  // 表单
  let [form] = Form.useForm()
  // 表单成功提交方法
  const onFinish = async (values) => {
    let {message,success} = await $login(values)
    // 判断是否登录成功
    if(success){
      // 将账号编号存储到缓存
      sessionStorage.setItem('loginId',values.loginId)
      // 根据登录名获取账户信息
      let admin = await $getOne({loginId:values.loginId})
      // 将当前登录账户信息，存储到redux
      dispatch(setAdmin(admin))
      setNotiMsg({type:'success',description:message})
      // 跳转到首页
      navigate('/layout')
    }else{
      setNotiMsg({type:'error',description:message})
    }
  };
  return (
    <div className="login">
      <div className="content">
        <h2>酒店后台管理系统</h2>
        <Form
          name="basic"
          form={form}
          //当前label在整行的占比
          labelCol={{            
            span: 4,
          }}
          //表示当前输入框在整行的占比
          wrapperCol={{
            span: 18,
          }}
          //初始值
          initialValues={{
            loginId:'',
            loginPwd:''
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: "请输入账号",
              },
            ]}
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
              登录
            </Button>
            <Button onClick={()=>{
              //重置
              form.resetFields()
            }} style={{marginLeft:'10px'}}>取消</Button>
          </Form.Item>
        </Form>
      </div>
      <MyNotification notiMsg={notiMsg} />
    </div>
  );
}
