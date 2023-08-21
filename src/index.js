import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import 'react-quill/dist/quill.snow.css'
import App from './App';
// 导入提供器组件
import {Provider} from 'react-redux'
// 导入store
import store from './redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);