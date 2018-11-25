import React, { Component } from 'react';
import { Steps, Button, message, Row, Col } from 'antd';
import './Stepper.css';
import FirstStepForm from '../form/first-step/FirstStepForm';
import SecondStepForm from '../form/second-step/SecondStepForm';
import ThirdStepFormPageProps from '../form/third-step/ThirdStepForm';
import LastStep from '../form/last-step/LastStep';
import axios from 'axios/index';
import { getPhoneNumber } from '../helper/helper';
import { get, isEmpty } from 'lodash';

const Step = Steps.Step;

interface IStepperProps {
}

interface IStepperState {
    current: number;
    wholeForm: any;
    http: any;
    loading: boolean;
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
            loading: false
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
            default:
                return new Promise((resolve: any, reject: any) => resolve(true));
        }
    }

    validateStepOne() {
        return new Promise((resolve: any, reject: any) => {
            this.state.http.post('validate/stepB', {
                pesel: get(this.state.wholeForm, 'pesel.value'),
                idNumber: get(this.state.wholeForm, 'identity.value')
            }).then((resp: any) => {
                console.log(resp);
                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);
                resolve(false);
            });
        });
    }

    validateStepTwo() {
        return new Promise((resolve: any, reject: any) => {
            this.state.http.post('validate/stepA', {
                phoneNumber: getPhoneNumber(get(this.state.wholeForm, 'phone.value'), get(this.state.wholeForm, 'phone.prefix')),
                firstName: get(this.state.wholeForm, 'firstName.value'),
                lastName: get(this.state.wholeForm, 'secondName.value'),
                email: get(this.state.wholeForm, 'email.value'),
                birthDate: get(this.state.wholeForm, 'date.value')
            }).then((resp: any) => {
                console.log(resp);
                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);
                resolve(false);
            });
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
                resolve(true);
            }).catch((err: any) => {
                console.log(err.response);
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
