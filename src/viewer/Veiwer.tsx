import React, { Component } from 'react';
import './Viewer.css';
import { Button, Col, Divider, Form, Input, message, Modal, Row, Table } from 'antd';
import { isNil, isEmpty, get } from 'lodash';
import { numbersAndLetterRegex, numbersRegex, validateIdentityCard, validatePeselNumbers } from '../helper/helper';
import axios from 'axios';
import moment from 'moment';

const FormItem = Form.Item;

interface IViewerProps {
    setUserData: (value: any) => void;
    clearUserData: () => void;
    userData: any;
}

interface IViewerState {
    pesel?: any;
    idNumber?: any;
    http: any;
    authorized: boolean;
    loading: boolean;
    isModalVisible: boolean;
    isModalLoading: boolean;
    currentRecord: any;
    statementPassword: any;
    statementInformation: any;
    forms: { id: number, createTimeStamp: number }[];
}

class Viewer extends Component<IViewerProps, IViewerState> {
    constructor(props: IViewerProps) {
        super(props);
        this.state = {
            idNumber: {
                value: undefined
            },
            pesel: {
                value: undefined
            },
            ...this.getValues(this.props),
            http: axios.create({
                baseURL: 'https://securitysystems.herokuapp.com/',
                timeout: 5000,
                headers: { 'Content-Type': 'application/json' }
            }),
            loading: false,
            isModalLoading: false,
            statementPassword: undefined,
            statementInformation: undefined,
            isModalVisible: false
        };
    }

    componentWillReceiveProps(nextProps: Readonly<IViewerProps>, nextContext: any): void {
        this.setState(this.getValues(nextProps));
    }

    getValues = (props: IViewerProps) => ({
        ...props.userData
    });

    onPeselChange = (event: any) => {
        const { value } = event.target;
        if (!numbersRegex.test(value))
            return;

        const isPeselValid = this.validatePesel(value);

        this.props.setUserData({
            pesel: isPeselValid
        });
    };

    validatePesel = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'PESEL is required',
                validateStatus: 'error',
                value
            };

        if (('' + value).length < 11)
            return {
                errorMsg: 'PESEL is too short',
                validateStatus: 'error',
                value
            };

        return {
            ...this.validatePeselNumbers(value),
            value
        };
    };

    onIdentityChange = (event: any) => {
        const { value } = event.target;
        const upperValue = value.toUpperCase();
        if (!numbersAndLetterRegex.test(upperValue))
            return;

        const isValid = this.validateIdentity(upperValue);

        this.props.setUserData({
            idNumber: isValid
        });
    };

    validateIdentity = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Identity card is required',
                validateStatus: 'error',
                value: value
            };

        return {
            ...this.validateIdentityValue(value),
            value: value
        };
    };

    validateIdentityValue = (value: string) => {
        if (validateIdentityCard(value))
            return {
                validateStatus: 'success',
                errorMsg: null
            };

        return {
            validateStatus: 'error',
            errorMsg: 'Please provide valid identity card'
        };
    };

    validatePeselNumbers = (value: any) => {
        if (validatePeselNumbers(value))
            return {
                validateStatus: 'success',
                errorMsg: null
            };

        return {
            validateStatus: 'error',
            errorMsg: 'Please provide valid PESEL'
        };
    };

    loginUser = () => {
        this.setState({
            loading: true
        });
        this.state.http.get('forms', {
            params: {
                pesel: this.state.pesel.value,
                idNumber: this.state.idNumber.value
            }
        }).then((resp: any) => {
            console.log(resp);
            this.setState({
                loading: false
            });
            this.props.setUserData({
                forms: resp.data,
                authorized: true
            });

        }).catch((err: any) => {
            this.setState({
                loading: false
            });
            message.error('Some error occurred during loading data');
            console.log(err);
        });
    };

    logout = () => {
        this.props.clearUserData();
    };

    showInfoAboutRow = (record: any) => {
        console.log(record);
        this.setState({
            isModalVisible: true,
            currentRecord: record
        });
    };

    loadStatement = () => {
        if (isEmpty(this.state.statementPassword))
            return;

        this.state.http.get('formDetails', {
            params: {
                formId: this.state.currentRecord.id,
                password: this.state.statementPassword
            }
        }).then((resp: any) => {
            console.log(resp);
            this.setState({
                statementInformation: resp.data
            });
        }).catch((resp: any) => {
            console.log(resp);
            message.error('Wrong password');
        });
    };

    changePassword = (event: any) => {
        const { value } = event.target;
        this.setState({
            statementPassword: value
        });
    };

    closeModal = () => {
        this.setState({
            isModalVisible: false,
            currentRecord: undefined,
            statementInformation: undefined
        });
    };

    render() {
        const { loading, pesel, idNumber, authorized, forms, isModalVisible } = this.state;

        const columns = [{
            title: 'Id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: 'Created',
            dataIndex: 'createTimeStamp',
            key: 'createTimeStamp',
            render: (text: any, row: any, index: any) => (
                <span>{moment(text).format('dddd, MMMM Do YYYY, h:mm:ss a')}</span>
            )
        }, {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
                <Button onClick={() => this.showInfoAboutRow(record)}>Show</Button>
            )
        }];

        return (
            <div className="viewer">
                {
                    !authorized &&
                    <Row>
                        <Col>
                            <div className="viewer-content">
                                <Row>
                                    <Col span={14} offset={5}>
                                        <Form layout="vertical">
                                            <FormItem
                                                label="We need verify your identity by PESEL"
                                                hasFeedback
                                                required
                                                validateStatus={pesel.validateStatus}
                                                help={pesel.errorMsg}
                                            >
                                                <Input
                                                    placeholder='PESEL'
                                                    maxLength={11}
                                                    value={pesel.value}
                                                    onChange={this.onPeselChange}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="and your identity document"
                                                hasFeedback
                                                required
                                                validateStatus={idNumber.validateStatus}
                                                help={idNumber.errorMsg}
                                            >
                                                <Input
                                                    placeholder='Identity document'
                                                    maxLength={9}
                                                    style={{ minWidth: 100 }}
                                                    value={idNumber.value}
                                                    onChange={this.onIdentityChange}
                                                />
                                            </FormItem>
                                            <FormItem>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    disabled={
                                                        !isEmpty(idNumber.errorMsg)
                                                        || !isEmpty(pesel.errorMsg)
                                                        || isEmpty(idNumber.value)
                                                        || isEmpty(pesel.value)
                                                    }
                                                    onClick={this.loginUser}
                                                >
                                                    Log in
                                                </Button>
                                            </FormItem>
                                        </Form>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                }
                {
                    authorized &&
                    <Row>
                        <Col>
                            <div className="viewer-content">
                                <Row>
                                    <Col offset={18} span={3}>
                                        <Button icon="sync" onClick={this.loginUser}>Refresh</Button>
                                    </Col>
                                    <Col span={3}>
                                        <Button icon="logout" onClick={this.logout}>Logout</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Table
                                            dataSource={forms}
                                            columns={columns}
                                            rowKey={'id'}
                                            loading={loading}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                }
                <Modal
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                    okText={'Close'}
                    title="Information about statement"
                    visible={this.state.isModalVisible}
                >
                    {
                        this.state.isModalVisible && (
                            <>
                                {
                                    isNil(this.state.statementInformation) &&
                                    <Row>
                                        <Col span={21}>
                                            <Input
                                                autoFocus
                                                required
                                                type="password"
                                                onPressEnter={this.loadStatement}
                                                onChange={this.changePassword}
                                                about={'Write password for this statement'}
                                                placeholder={'Write password for this statement'}
                                            />
                                        </Col>
                                        <Col span={3}>
                                            <Button onClick={this.loadStatement}
                                                    disabled={isEmpty(this.state.statementPassword)}>Show</Button>
                                        </Col>
                                    </Row>
                                }
                                {
                                    !isNil(this.state.statementInformation) &&
                                    (
                                        <Row style={{ textAlign: 'center' }}>
                                            <Divider>Statement</Divider>
                                            <p>{get(this.state.statementInformation, 'application')}</p>
                                            <Divider>Birth date</Divider>
                                            <p>{get(this.state.statementInformation, 'birthDate')}</p>
                                            <Divider>Email</Divider>
                                            <p>{get(this.state.statementInformation, 'email')}</p>
                                            <Divider>First name</Divider>
                                            <p>{get(this.state.statementInformation, 'firstName')}</p>
                                            <Divider>Last name</Divider>
                                            <p>{get(this.state.statementInformation, 'lastName')}</p>
                                            <Divider>Pesel</Divider>
                                            <p>{get(this.state.statementInformation, 'pesel')}</p>
                                            <Divider>Phone number</Divider>
                                            <p>{get(this.state.statementInformation, 'phoneNumber')}</p>
                                        </Row>
                                    )
                                }
                            </>
                        )
                    }
                </Modal>
            </div>
        );
    }
}

export default Viewer;