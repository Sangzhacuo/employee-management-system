import React,{useState,useEffect} from "react";
import { Button, Drawer,Form, Input } from "antd";
import { $add,$getOne,$update } from "../../api/typeApi";
import MyNotification from "../../components/MyNotification/MyNotification";
// 导入富文本编辑器的React封装库
import ReactQuill from 'react-quill'

export default function AddType({open,setOpen,loadList,roomTypeId,setRoomTypeId}) {
  // 定义表单实例
  let [form] = Form.useForm()
  // 通知框状态
  let [notiMsg,setNotiMsg] = useState({type:'',description:''})
  useEffect(()=>{
    if(roomTypeId!==0){
      $getOne({roomTypeId}).then(data=>{
        form.setFieldsValue(data)
      })
    }
  },[roomTypeId])
  // 关闭抽屉的方法
  const onClose = () => {
    clear()  //清空表单
    setRoomTypeId(0)  //取消编辑状态
    setOpen(false);  //关闭抽屉
  };
  // 表单提交的方法
  const onFinish = (values) => {
    if(roomTypeId){
      // 修改
      $update(values).then(({success,message})=>{
        if(success){
          setNotiMsg({type:'success',description:message})
          loadList()  //加载列表
        }else{
          setNotiMsg({type:'error',description:message})
        }
      })
    }else{
      // 添加
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
    setOpen(false);
  }
  return (
    <>
      <Drawer
        title={roomTypeId?'修改房型':'添加房型'}
        width={600}
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
            label="房型编号"
            name="roomTypeId"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房型名称"
            name="roomTypeName"
            rules={[
              {
                required: true,
                message: "请输入房型名称",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房型价格"
            name="roomTypePrice"
            rules={[
              {
                required: true,
                message: "请输入房型价格",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="床位数量"
            name="bedNum"
            rules={[
              {
                required: true,
                message: "请输入床位数量",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房型描述"
            name="typeDescription"
            rules={[
              {
                required: false,
                message: "请输入房型描述",
              },
            ]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              // 设置富文本编辑器的占位符
              placeholder="请输入房型描述"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {roomTypeId?'修改':'添加'}
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
