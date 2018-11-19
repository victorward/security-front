import React, {Component} from 'react';
import './App.css';
import {Layout, Menu, Breadcrumb, Row, Col} from 'antd';
import FormPage from "./form/FormPage";

const {Header, Content, Footer} = Layout;

class App extends Component {
    render() {
        return (
            <Layout className="layout">
                <Header>
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
                    <Row className="nav-breadcrumb" align="middle" type="flex">
                        <Col>
                            <Breadcrumb>
                                <Breadcrumb.Item>Submitting</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <Row className="content">
                        <Col>
                            <FormPage/>
                        </Col>
                    </Row>
                </Content>
                <Footer className="footer">
                    Security form for Security of Information's Systems ©2018 Created by Yuriy Babyak & Marcin Szalek
                </Footer>
            </Layout>
        );
    }
}

export default App;
