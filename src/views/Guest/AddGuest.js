import React,{useState,useEffect} from "react";
import { Button, Drawer,Form, Input,Select,DatePicker } from "antd";
import { $add,$getOne,$update } from "../../api/guestApi";
import {$list as $typeList} from '../../api/typeApi'
import {$list as $roomList} from '../../api/roomApi'
import MyNotification from "../../components/MyNotification/MyNotification";

// 日期选择器中文包
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

export default function AddGuest({open,setOpen,loadList,guestId,setGuestId}) {
  // 房间类型列表
  let [typeList, setTypeList] = useState([]);
  // 房间列表
  let [roomList,setRoomList] = useState([])
  // 加载房间类型列表的方法
  const loadTypeList = () => {
    $typeList().then((data) => {
      //console.log(data);
      data = data.map((r) => {
        return {
          value:r.roomTypeId,
          label:r.roomTypeName
        };
      });
      setTypeList(data);
    });
  };
  // 加载房间列表的方法
  const loadRoomList = (roomTypeId)=>{
    // 这里是根据指定的房型查询空闲房间
    $roomList({roomTypeId,roomStateId:1,pageSize:99,guestId}).then(({data})=>{
      data = data.map((r) => {
        return {
          value:r.roomId,
          label:r.roomId
        };
      });
      setRoomList(data);
    })
  }
  // 定义表单实例
  let [form] = Form.useForm()
  // 通知框状态
  let [notiMsg,setNotiMsg] = useState({type:'',description:''})
  // 副作用
  useEffect(()=>{
    loadTypeList()  //加载房间类型列表数据
    if(guestId!==0){
      $getOne({guestId}).then(data=>{
        // 处理日期格式
        data.resideDate = dayjs(data.resideDate)
        // 处理房间类型
        data.roomTypeId = data.room.roomTypeId
        form.setFieldsValue(data)
      })
    }
  },[guestId])
  // 关闭抽屉的方法
  const onClose = () => {
    clear()  //清空表单
    setGuestId(0)  //取消编辑状态
    setOpen(false);  //关闭抽屉
  };
  // 表单提交的方法
  const onFinish = (values) => {
    if(guestId){
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
        title={guestId?'修改顾客':'添加顾客'}
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
            label="顾客编号"
            name="guestId"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="顾客姓名"
            name="guestName"
            rules={[
              {
                required: true,
                message: "请输入顾客姓名",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="身份证号"
            name="identityId"
            rules={[
              {
                required: true,
                message: "请输入身份证号",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入手机号码",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="房型"
            name="roomTypeId"
            rules={[
              {
                required: true,
                message: "请选择房型",
              },
            ]}
          >
            <Select size='small' style={{width:'200px'}} options={typeList} onSelect={(roomTypeId)=>{
              form.setFieldValue('roomId','')
              loadRoomList(roomTypeId)
            }}></Select>
          </Form.Item>
          <Form.Item
            label="房间"
            name="roomId"
            rules={[
              {
                required: true,
                message: "请选择房间",
              },
            ]}
          >
            <Select size='small' style={{width:'200px'}} options={roomList}></Select>
          </Form.Item>
          <Form.Item
            label="入住日期"
            name="resideDate"
            rules={[
              {
                required: true,
                message: "请输入入住日期",
              },
            ]}
          >
            <DatePicker locale={locale} placeholder="请输入入住日期" showTime  />
          </Form.Item>
          <Form.Item
            label="押金"
            name="deposit"
            rules={[
              {
                required: true,
                message: "请输入押金",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="入住人数"
            name="guestNum"
            rules={[
              {
                required: true,
                message: "请输入入住人数",
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
              {guestId?'修改':'添加'}
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
