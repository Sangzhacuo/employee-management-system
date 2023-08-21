import { Layout, Menu, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./Layout.scss";
// 导入图标
import {
  HomeOutlined,
  NotificationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MailOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

//确认框
const { confirm } = Modal;
const { Header, Sider, Content } = Layout;

export default function () {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  // 菜单项当前选项
  const [current, setCurrent] = useState("home");
  // 顶部菜单项
  const items = [
    {
      label: "首页",
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "邮件",
      key: "mail",
      icon: <MailOutlined />,
    },
    {
      label: "通知",
      key: "noti",
      icon: <NotificationOutlined />,
    },
    {
      label: "个人中心",
      key: "mine",
      icon: <UserOutlined />,
      children: [
        {
          key: "my",
          label: "个人信息",
        },
        {
          key: "pwd",
          label: "修改密码",
        },
        {
          key: "exit",
          label: "退出系统",
        },
      ],
    },
  ];
  // 左侧菜单项
  const itmes2 = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "账户管理",
      children: [
        {
          key: "role",
          label: "角色管理",
        },
        {
          key: "admin",
          label: "账户管理",
        },
      ],
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: "客房管理",
      children: [
        {
          key: "type",
          label: "房型管理",
        },
        {
          key: "room",
          label: "房间管理",
        },
        {
          key: "total",
          label: "营业统计",
        },
      ],
    },
    {
      key: "guest",
      icon: <SettingOutlined />,
      label: "客户管理",
    },
  ];
  // 点击菜单方法
  const onClickMenu = (e) => {
    setCurrent(e.key);
    // 判断点击的菜单项
    switch (e.key) {
      //首页
      case 'home':
        navigate("/")
        break;
      // 角色管理
      case "role":
        navigate("/layout/role");
        break;
      // 账户管理
      case "admin":
        navigate("/layout/admin")
        break;
      // 个人信息
      case "my":
        navigate("/layout/mine")
        break;
      // 修改密码
      case "pwd":
        navigate("/layout/pwd")
        break;
      // 房型管理
      case 'type':
        navigate("/layout/type")
        break;
      // 客房管理
      case 'room':
        navigate("/layout/room")
        break;
      // 顾客管理
      case 'guest':
        navigate("/layout/guest")
        break;
      // 销售统计
      case 'total':
        navigate("/layout/total")
        break;
      // 退出系统
      case "exit":
        confirm({
          title: "系统提示",
          icon: <ExclamationCircleFilled />,
          content: "确定退出系统吗？",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            // 清除系统缓存
            sessionStorage.clear();
            localStorage.clear();
            // 跳转到登录页
            navigate("/");
          },
        });
        break;
    }
  };
  // 侧边栏折叠状态
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="layout">
      {/* 侧边栏触发器 */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">{collapsed ? "SANG" : "SANG酒店管理系统"}</div>
        <Menu   //设置菜单主题、模式
          onClick={onClickMenu}
          theme="dark"  
          mode="inline"
          selectedKeys={[current]}
          items={itmes2}
        />
      </Sider>
      <Layout className="right">
        <Header className="header">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <Menu
            onClick={onClickMenu}
            theme="dark"
            className="menu"
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </Header>
        <Content className="content">
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
}
