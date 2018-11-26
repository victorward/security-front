import React, { Component } from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import Stepper from './stepper/Stepper';
import Viewer from './viewer/Veiwer';
import { isEqual } from 'lodash';

const { Header, Content, Footer } = Layout;

interface IAppProps {
}

interface IAppState {
    selectedMenu: string[];
    userData: { pesel: any, idNumber: any, authorized: boolean };
    forms?: { id: number, createTimeStamp: number };
}

const defaultSelectedMenu = ['1'];

class App extends Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        this.state = {
            selectedMenu: defaultSelectedMenu,
            userData: {
                idNumber: {
                    value: undefined,
                },
                pesel: {
                    value: undefined,
                },
                authorized: false,
            }
        };
        this.onMenuSelect = this.onMenuSelect.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.clearUserData = this.clearUserData.bind(this);
    }

    setUserData(value: any) {
        console.log('setUserData', value);
        this.setState(
            {
                userData: {
                    ...this.state.userData,
                    ...value
                }
            }
        );
    };

    clearUserData() {
        this.setState(
            {
                userData: {
                    idNumber: undefined,
                    pesel: undefined,
                    authorized: false
                }
            }
        );
    };

    onMenuSelect({ item, key, selectedKeys }: any) {
        this.setState({
            selectedMenu: selectedKeys
        });
    }

    render() {
        const { selectedMenu, userData } = this.state;

        return (
            <Layout className="layout">
                <Header className="header">
                    <div className="logo">
                        <span>Security form</span>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={selectedMenu}
                        className="menu"
                        onSelect={this.onMenuSelect}
                    >
                        <Menu.Item key="1">Submitting</Menu.Item>
                        <Menu.Item key="2">Viewer</Menu.Item>
                    </Menu>
                </Header>
                <Content className="content-container">
                    {
                        isEqual(selectedMenu, defaultSelectedMenu)
                            ? <Stepper/>
                            : <Viewer clearUserData={this.clearUserData} setUserData={this.setUserData}
                                      userData={userData}/>
                    }
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
