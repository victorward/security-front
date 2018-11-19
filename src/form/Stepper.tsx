import React, { Component } from 'react';
import { Steps, Button, message, Row, Col } from 'antd';
import './Stepper.css';
import FirstStepForm from './FirstStepForm';

const Step = Steps.Step;

const steps = [{
    title: 'Base information',
    content: <FirstStepForm/>
}, {
    title: 'Second',
    content: 'Second-content'
}, {
    title: 'Last',
    content: 'Last-content'
}];

interface IStepperProps {
}

interface IStepperState {
    current: number;
}

class Stepper extends Component<IStepperProps, IStepperState> {
    constructor(props: IStepperProps) {
        super(props);
        this.state = {
            current: 0,
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
                    <Col>
                        <div className="steps-action">
                            {
                                current < steps.length - 1
                                && <Button type="primary" onClick={() => this.next()}>Next</Button>
                            }
                            {
                                current === steps.length - 1
                                && <Button type="primary"
                                           onClick={() => message.success('Processing complete!')}>Done</Button>
                            }
                            {
                                current > 0
                                && (
                                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                        Previous
                                    </Button>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Stepper;
