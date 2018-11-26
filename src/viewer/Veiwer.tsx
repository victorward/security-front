import React, { Component } from 'react';
import './Viewer.css';
import { Button, Col, Form, Input, Row } from 'antd';
import { isNil, isEmpty } from 'lodash';
import { numbersAndLetterRegex, numbersRegex, validateIdentityCard, validatePeselNumbers } from '../helper/helper';
import axios from 'axios';

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
    forms: { id: number, createTimeStamp: number }
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
            })
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
        this.state.http.get('forms', {
            params: {
                pesel: this.state.pesel.value,
                idNumber: this.state.idNumber.value
            }
        }).then((resp: any) => {
            console.log(resp);
            this.props.setUserData({
                forms: resp.data,
                authorized: true
            });

        }).catch((err: any) => {
            console.log(err);
        });
    };

    render() {
        const { pesel, idNumber, authorized } = this.state;
        console.log(pesel, idNumber);

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
                            <div className="viewer-content">List</div>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

export default Viewer;