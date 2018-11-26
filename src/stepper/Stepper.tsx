import React, { Component } from 'react';
import { Button, Col, message, Row, Steps, Modal } from 'antd';
import './Stepper.css';
import FirstStepForm from '../form/first-step/FirstStepForm';
import SecondStepForm from '../form/second-step/SecondStepForm';
import ThirdStepFormPageProps from '../form/third-step/ThirdStepForm';
import LastStep from '../form/last-step/LastStep';
import axios from 'axios/index';
import { getNumberAndPrefix, getPhoneNumber } from '../helper/helper';
import { get, isEmpty, isNil } from 'lodash';
import moment from 'moment';

const Step = Steps.Step;
const confirm = Modal.confirm;
const success = Modal.success;

interface IStepperProps {
}

interface IStepperState {
    current: number;
    wholeForm: any;
    http: any;
    loading: boolean;
    autoFilled: boolean;
}

class Stepper extends Component<IStepperProps, IStepperState> {
    constructor(props: IStepperProps) {
        super(props);
        this.state = {
            current: 0,
            wholeForm: {},
            http: axios.create({
                baseURL: 'https://securitysystems.herokuapp.com/',
                timeout: 5000,
                headers: { 'Content-Type': 'application/json' }
            }),
            loading: false,
            autoFilled: false
        };
    }

    next() {
        this.validateAtBackend().then((resp: any) => {
            console.log('validateAtBackend', resp);
            const current = this.state.current + 1;
            this.setState({
                loading: false
            });
            if (resp)
                this.setState({ current });
            else
                message.error('Failure at backend validation');
        });
    }

    submit() {
        this.submitData().then((resp: any) => {
            console.log('validateAtBackend', resp);
            this.setState({
                loading: false
            });
            if (resp)
                message.success('Processing complete!');
            else
                message.error('Failure at backend validation');

        });
    }

    validateAtBackend() {
        this.setState({
            loading: true
        });

        switch (this.state.current) {
            case 0:
                return this.validateStepOne();
            case 1:
                return this.validateStepTwo();
            case 2:
                return this.validateStepThree();
            default:
                return new Promise((resolve: any, reject: any) => resolve(true));
        }
    }

    setSuggestion(suggestion: any) {
        const obj = getNumberAndPrefix(suggestion.phoneNumber);
        console.log(obj);
        this.setState({
            autoFilled: true
        });
        this.setFormState({
            phone: {
                ...this.state.wholeForm.phone,
                ...getNumberAndPrefix(suggestion.phoneNumber),
                validateStatus: 'success',
            },
            firstName: {
                ...this.state.wholeForm.firstName,
                value: suggestion.firstName,
                validateStatus: 'success',
            },
            secondName: {
                ...this.state.wholeForm.secondName,
                value: suggestion.lastName,
                validateStatus: 'success',
            },
            email: {
                ...this.state.wholeForm.email,
                value: suggestion.email,
                validateStatus: 'success',
            },
            date: {
                ...this.state.wholeForm.date,
                value: suggestion.birthDate,
                validateStatus: 'success',
                momentValue: moment(suggestion.birthDate)
            }
        });
    }

    clearForm = () => {
      this.setState({
          wholeForm: {},
          current: 0,
          autoFilled: false
      });
    };

    showConfirm = (suggestion: any, that: any) => {
        confirm({
            title: 'We noticed that you already was there',
            content: 'Do you want to auto-fill base information about you?',
            onOk() {
                return new Promise((resolve, reject) => {
                    that.setSuggestion(suggestion);
                    resolve(true);
                }).catch((error) => console.log('Oops error!', error));
            },
            onCancel() {
            },
            okText: 'Auto-fill'
        });
    };

    askClearData = (that: any) => {
        confirm({
            title: 'Statement successfully sent',
            content: 'Do you want to clear all information?',
            iconType: 'check-circle',
            onOk() {
                return new Promise((resolve, reject) => {
                    that.clearForm();
                    resolve(true);
                }).catch((error) => console.log('Oops error!', error));
            },
            onCancel() {
            },
            okText: 'Clear all data'
        });
    };

    validateStepOne() {
        return new Promise((resolve: any, reject: any) => {
            this.state.http.post('validate/stepB', {
                pesel: get(this.state.wholeForm, 'pesel.value'),
                idNumber: get(this.state.wholeForm, 'identity.value')
            }).then((resp: any) => {
                console.log(resp);
                if (!isNil(resp.data.suggestion) && !this.state.autoFilled)
                    this.showConfirm(resp.data.suggestion, this);

                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);

                if (err.response.data.pesel.status === 'ERROR')
                    this.setFormState({
                        pesel: {
                            ...this.state.wholeForm.pesel,
                            errorMsg: err.response.data.pesel.msg,
                            validateStatus: 'error'
                        }
                    });

                if (err.response.data.idNumber.status === 'ERROR')
                    this.setFormState({
                        identity: {
                            ...this.state.wholeForm.identity,
                            errorMsg: err.response.data.idNumber.msg,
                            validateStatus: 'error'
                        }
                    });
                resolve(false);
            });
        });
    }

    setFormState(error: any) {
        this.setState({
            wholeForm: {
                ...this.state.wholeForm,
                ...error
            }
        });
    }

    validateStepTwo() {
        return new Promise((resolve: any, reject: any) => {
            this.state.http.post('validate/stepA', {
                phoneNumber: getPhoneNumber(get(this.state.wholeForm, 'phone.value'), get(this.state.wholeForm, 'phone.prefix')),
                firstName: get(this.state.wholeForm, 'firstName.value'),
                lastName: get(this.state.wholeForm, 'secondName.value'),
                email: get(this.state.wholeForm, 'email.value'),
                birthDate: get(this.state.wholeForm, 'date.value'),
                pesel: get(this.state.wholeForm, 'pesel.value')
            }).then((resp: any) => {
                console.log(resp);
                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);

                if (err.response.data.phoneNumber.status === 'ERROR')
                    this.setFormState({
                        phone: {
                            ...this.state.wholeForm.phone,
                            errorMsg: err.response.data.phoneNumber.msg,
                            validateStatus: 'error',
                            prefix: get(this.state.wholeForm, 'phone.prefix') ? this.state.wholeForm.phone.prefix : 'PL'
                        }
                    });

                if (err.response.data.firstName.status === 'ERROR')
                    this.setFormState({
                        firstName: {
                            ...this.state.wholeForm.firstName,
                            errorMsg: err.response.data.firstName.msg,
                            validateStatus: 'error'
                        }
                    });

                if (err.response.data.lastName.status === 'ERROR')
                    this.setFormState({
                        secondName: {
                            ...this.state.wholeForm.secondName,
                            errorMsg: err.response.data.lastName.msg,
                            validateStatus: 'error'
                        }
                    });

                if (err.response.data.email.status === 'ERROR')
                    this.setFormState({
                        email: {
                            ...this.state.wholeForm.email,
                            errorMsg: err.response.data.email.msg,
                            validateStatus: 'error'
                        }
                    });

                if (err.response.data.birthDate.status === 'ERROR')
                    this.setFormState({
                        date: {
                            ...this.state.wholeForm.date,
                            errorMsg: err.response.data.birthDate.msg,
                            validateStatus: 'error'
                        }
                    });

                resolve(false);
            });
        });
    }

    validateStepThree() {
        return new Promise((resolve: any, reject: any) => {
            if (isEmpty(get(this.state.wholeForm, 'statement.value'))) {
                this.setFormState({
                    statement: {
                        ...this.state.wholeForm.statement,
                        errorMsg: 'Please write your statement. You already do so much steps!',
                        validateStatus: 'error'
                    }
                });
                resolve(false);
            }

            resolve(true);
        });
    }

    submitData() {
        return new Promise((resolve: any, reject: any) => {
            this.state.http.post('submit', {
                phoneNumber: getPhoneNumber(get(this.state.wholeForm, 'phone.value'), get(this.state.wholeForm, 'phone.prefix')),
                firstName: get(this.state.wholeForm, 'firstName.value'),
                lastName: get(this.state.wholeForm, 'secondName.value'),
                email: get(this.state.wholeForm, 'email.value'),
                birthDate: get(this.state.wholeForm, 'date.value'),
                pesel: get(this.state.wholeForm, 'pesel.value'),
                idNumber: get(this.state.wholeForm, 'identity.value'),
                application: get(this.state.wholeForm, 'statement.value'),
                password: get(this.state.wholeForm, 'password.value')
            }).then((resp: any) => {
                console.log(resp);
                this.askClearData(this);
                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);

                if (err.response.data.password.status === 'ERROR')
                    this.setFormState({
                        password: {
                            ...this.state.wholeForm.password,
                            errorMsg: err.response.data.password.msg,
                            validateStatus: 'error'
                        }
                    });

                resolve(false);
            });
        });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    changeForm = (value: any) => {
        console.log('changeFrom', value);
        this.setState(
            {
                ...this.state,
                wholeForm: {
                    ...this.state.wholeForm,
                    ...value
                }
            }
        );
    };

    render() {
        const { current, loading } = this.state;
        const steps = [
            {
                title: 'Base information',
                content: <SecondStepForm changeForm={this.changeForm} formState={this.state.wholeForm}/>
            }, {
                title: 'Verification data',
                content: <FirstStepForm changeForm={this.changeForm} formState={this.state.wholeForm}/>
            }, {
                title: 'Write statement',
                content: <ThirdStepFormPageProps changeForm={this.changeForm} formState={this.state.wholeForm}/>
            },
            {
                title: 'Finishing',
                content: <LastStep changeForm={this.changeForm} formState={this.state.wholeForm}/>
            }
        ];


        return (
            <div className="stepper">
                <Row>
                    <Col>
                        <Steps current={current}>
                            {steps.map(item => <Step key={item.title} title={item.title}/>)}
                        </Steps>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="steps-content">{steps[current].content}</div>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign: 'right' }}>
                        <div className="steps-action">
                            {
                                current > 0
                                && (
                                    <Button onClick={() => this.prev()}>
                                        Previous
                                    </Button>
                                )
                            }
                            {
                                current < steps.length - 1
                                && <Button
                                    style={{ marginLeft: 8 }}
                                    type="primary"
                                    onClick={() => this.next()}
                                    loading={loading}
                                >Next</Button>
                            }
                            {
                                current === steps.length - 1
                                && <Button
                                    style={{ marginLeft: 8 }}
                                    disabled={isEmpty(this.state.wholeForm.captcha)}
                                    type="primary"
                                    onClick={() => this.submit()}
                                >Sent</Button>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Stepper;
