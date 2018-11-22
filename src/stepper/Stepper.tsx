import React, { Component } from 'react';
import { Steps, Button, message, Row, Col } from 'antd';
import './Stepper.css';
import FirstStepForm from '../form/first-step/FirstStepForm';
import SecondStepForm from '../form/second-step/SecondStepForm';
import ThirdStepFormPageProps from '../form/third-step/ThirdStepForm';
import LastStep from '../form/last-step/LastStep';

const Step = Steps.Step;

const steps = [
    {
        title: 'Base information',
        content: <FirstStepForm/>
    }, {
        title: 'Verification data',
        content: <SecondStepForm/>
    }, {
        title: 'Write statement',
        content: <ThirdStepFormPageProps/>
    },
    {
        title: 'Finishing',
        content: <LastStep/>
    }
];

interface IStepperProps {
}

interface IStepperState {
    current: number;
}

class Stepper extends Component<IStepperProps, IStepperState> {
    constructor(props: IStepperProps) {
        super(props);
        this.state = {
            current: 0
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

    render() {
        const { current } = this.state;

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
                                           onClick={() => message.success('Processing complete!')}>Done</Button>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Stepper;
