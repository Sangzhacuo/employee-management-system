import React,{useState,useEffect} from "react";
import { Button, Drawer,Form, Input,Select } from "antd";
import { $add,$getOne,$update } from "../../api/roomApi";
import {$list as $typeList} from '../../api/typeApi'
import {$list as $stateList} from '../../api/stateApi'
import MyNotification from "../../components/MyNotification/MyNotification";
import ReactQuill from 'react-quill'

export default function AddRoom({open,setOpen,loadList,roomId,setRoomId}) {
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
      setStateList(data);
    })
  }
  // 定义表单实例
  let [form] = Form.useForm()
  // 通知框状态
  let [notiMsg,setNotiMsg] = useState({type:'',description:''})
  // 副作用
  useEffect(()=>{
    loadTypeList()  //加载房间类型列表数据
    loadStateList()   //加载房间状态列表数据
    if(roomId!==0){
      $getOne({roomId}).then(data=>{
        // 将roomId用id备份一下，因为roomId也是可以修改的
        data.id = data.roomId
        form.setFieldsValue(data)
      })
    }
  },[roomId])
  // 关闭抽屉的方法
  const onClose = () => {
    clear()  //清空表单
    setRoomId(0)  //取消编辑状态
    setOpen(false);  //关闭抽屉
  };
  // 表单提交的方法
  const onFinish = (values) => {
    if(roomId){
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
  }
  return (
    <>
      <Drawer
        title={roomId?'修改客房':'添加客房'}
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
            label="房间编号"
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房间编号"
            name="roomId"
            rules={[
              {
                required: true,
                message: "请输入房间编号",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房间描述"
            name="description"
            rules={[
              {
                required: true,
                message: "请输入房间描述",
              },
            ]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入房间描述"
            />
          </Form.Item>
          <Form.Item
            label="房间类型"
            name="roomTypeId"
            rules={[
              {
                required: true,
                message: "请选择房间类型",
              },
            ]}
          >
            <Select size='small' style={{width:'200px'}} options={typeList}></Select>
          </Form.Item>
          <Form.Item
            label="房间状态"
            name="roomStateId"
            rules={[
              {
                required: true,
                message: "请选择房间状态",
              },
            ]}
          >
           <Select size='small' style={{width:'200px'}} options={stateList}></Select>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {roomId?'修改':'添加'}
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
