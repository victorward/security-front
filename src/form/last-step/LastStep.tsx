import React, { Component } from 'react';
import { Col, Divider, Row } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

interface ILastStepProps {
}

interface ILastStepState {
    value: string | undefined;
}

const TEST_SITE_KEY = '6LeTfHwUAAAAAPKrFKVzVhQbraUPwUZpGAixZFsa';


class LastStep extends Component<ILastStepProps, ILastStepState> {
    constructor(props: ILastStepProps) {
        super(props);
        this.state = {
            value: undefined
        };
    }

    handleChange = (value: any) => {
        console.log('Captcha value:', value);
        this.setState({ value });
    };


    render() {
        return (
            <Row>
                <Col span={14} offset={5} style={{ textAlign: 'center', marginBottom: 150 }}>
                    <p style={{ marginBottom: 20 }}>
                        Congratulation's! You finally do all steps, the last one is to verify if you are a human.
                    </p>
                    <Divider>Please check Captcha</Divider>
                    <ReCAPTCHA
                        // @ts-ignore
                        style={{ display: 'inline-block' }}
                        sitekey={TEST_SITE_KEY}
                        onChange={this.handleChange}
                    />
                    {this.state.value && (<p>
                        Congratulation's you are human!
                    </p>)
                    }
                </Col>
            </Row>
        );
    }
}

export default LastStep;
