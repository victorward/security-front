import React, { Component } from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import Stepper from './stepper/Stepper';

const { Header, Content, Footer } = Layout;

class App extends Component {
    render() {
        return (
            <Layout className="layout">
                <Header className="header">
                    <div className="logo">
                        <span>Security form</span>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        className="menu"
                    >
                        <Menu.Item key="1">Submitting</Menu.Item>
                        <Menu.Item key="2">Viewer</Menu.Item>
                    </Menu>
                </Header>
                <Content className="content-container">
                    <Stepper/>
                </Content>
                <Footer className="footer">
                    <p>
                        Security form for Security of Information's Systems ©2018 Created by Yuriy Babyak & Marcin
                        Szalek
                    </p>
                </Footer>
            </Layout>
        );
    }
}

export default App;
