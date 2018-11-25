import React, { Component } from 'react';
import { Steps, Button, message, Row, Col } from 'antd';
import './Stepper.css';
import FirstStepForm from '../form/first-step/FirstStepForm';
import SecondStepForm from '../form/second-step/SecondStepForm';
import ThirdStepFormPageProps from '../form/third-step/ThirdStepForm';
import LastStep from '../form/last-step/LastStep';

const Step = Steps.Step;

interface IStepperProps {
}

interface IStepperState {
    current: number;
    wholeForm: object;
}

class Stepper extends Component<IStepperProps, IStepperState> {
    form: any;
    constructor(props: IStepperProps) {
        super(props);
        this.state = {
            current: 0,
            wholeForm: {
            }
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
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
        const { current } = this.state;

        const steps = [
            {
                title: 'Base information',
                content: <FirstStepForm changeForm={this.changeForm}/>
            }, {
                title: 'Verification data',
                content: <SecondStepForm changeForm={this.changeForm}/>
            }, {
                title: 'Write statement',
                content: <ThirdStepFormPageProps changeForm={this.changeForm}/>
            },
            {
                title: 'Finishing',
                content: <LastStep changeForm={this.changeForm}/>
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
                                && <Button style={{ marginLeft: 8 }} type="primary"
                                           onClick={() => this.next()}>Next</Button>
                            }
                            {
                                current === steps.length - 1
                                && <Button style={{ marginLeft: 8 }} type="primary"
                                           onClick={() => message.success('Processing complete!')}>Sent</Button>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Stepper;
