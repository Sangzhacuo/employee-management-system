import React,{useState,useEffect} from 'react'
import { PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import {baseURL} from '../../config'
// 使用FileRender将图片转为base64编码的方法
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  // 添加事件监听器
  reader.addEventListener('load', () => callback(reader.result));
  // 转成DataURL格式
  reader.readAsDataURL(img);
};
// 上传之前调用的方法
const beforeUpload = (file) => {
  // 判断图片类型（只能是jpg和png类型）
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!');
  }
  // 判断图片大小
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJpgOrPng && isLt2M;
};
export default function UploadImg({form}) {
  // 上传状态
  const [loading, setLoading] = useState(false);
  // 图片地址
  const [imageUrl, setImageUrl] = useState();
  // 上传成功调用的方法
  const handleChange = (info) => {
    // status三种状态 uploading done error
    // 上传中
    if (info.file.status === 'uploading') {
      setLoading(true);   //开始上传loading
      return;
    }
    // 上传成功
    if (info.file.status === 'done') {
      // 将图片转为base64编码
      // .originFileObj获取上传文件的原始 File 对象
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);  //关闭上传loading
        setImageUrl(url);   //更新图片地址
        // 更新表单中photo的值
        form.setFieldValue('photo',info.file.response.filename)
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </div>
  );
  useEffect(()=>{
    // 在编辑状态中拿到图片地址，显示图片
    let photoUrl = form.getFieldValue('photo')
    if(photoUrl){
      setImageUrl(baseURL+'upload/admin/'+photoUrl)
    }
  },[form.getFieldValue('photo')])
  return (
    <>
      <Upload
        name="photo"
        // 上传成功后显示图片的列表类型
        listType="picture-card"
        className="avatar-uploader"
        // 是否显示已上传的文件列表
        showUploadList={false}
        action={baseURL+"Admin/UploadImg"}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  )
}
