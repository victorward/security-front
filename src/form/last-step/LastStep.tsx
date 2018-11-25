import React, { Component } from 'react';
import { Col, Divider, Form, Input, Progress, Row, Tooltip } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { validatePassword } from '../../helper/helper';
import { get } from 'lodash';

const FormItem = Form.Item;

interface ILastStepProps {
    changeForm: (form: object) => void;
    formState: any;
}

interface ILastStepState {
    captcha: string | undefined;
    password: any;
}

const TEST_SITE_KEY = '6LeTfHwUAAAAAPKrFKVzVhQbraUPwUZpGAixZFsa';

class LastStep extends Component<ILastStepProps, ILastStepState> {
    constructor(props: ILastStepProps) {
        super(props);
        console.log(this.props.formState);
        this.state = this.getValues(props);
    }

    componentWillReceiveProps(nextProps: Readonly<ILastStepProps>, nextContext: any): void {
        this.setState(this.getValues(nextProps));
    }

    getValues = (props: ILastStepProps) => ({
        captcha: get(props.formState, 'captcha', undefined),
        password: get(
            props.formState,
            'password',
            {
                value: undefined,
                percent: 0,
                successPercent: 0,
                status: undefined,
                hint: '',
                title: 'Password strength'
            }
        )
    });

    handleChange = (value: any) => {
        console.log('Captcha value:', value);
        const captcha = { captcha: value };

        this.props.changeForm(captcha);
    };

    onPasswordChange = (event: any) => {
        const { value } = event.target;
        const isValid = validatePassword(value, this.state.password);

        this.props.changeForm({
            password: isValid
        });
    };

    render() {
        const { password } = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col span={14} offset={5} style={{ textAlign: 'center', marginBottom: 20 }}>
                        <p style={{ marginBottom: 20 }}>
                            Congratulation's! You finally do all steps, the last one is to verify if you are a human and
                            set password for getting access later.
                        </p>
                        <Divider>Set password</Divider>
                        <Form layout="vertical" style={{ textAlign: 'left' }}>
                            <FormItem
                                label="Now please provide secure password for get access to your statement"
                                required
                                validateStatus={password.validateStatus}
                                help={password.errorMsg}
                                extra={password.hint}
                            >
                                <Row gutter={8}>
                                    <Col span={18}>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            value={password.value}
                                            onChange={this.onPasswordChange}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <Tooltip title={password.title}>
                                            <Progress
                                                percent={password.percent}
                                                successPercent={password.successPercent}
                                                status={password.status}
                                                strokeColor={password.validateStatus === 'warning' ? '#faad14' : ''}
                                                size="small"
                                                default="small"
                                            />
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                        {!this.state.captcha && (
                            <React.Fragment><Divider>and check Captcha</Divider>
                                <ReCAPTCHA
                                    // @ts-ignore
                                    style={{ display: 'inline-block' }}
                                    sitekey={TEST_SITE_KEY}
                                    onChange={this.handleChange}
                                />
                            </React.Fragment>
                        )}
                        {
                            this.state.captcha && (
                                <p>
                                    Congratulation's you are human!
                                </p>
                            )
                        }

                    </Col>
                </Row>
            </React.Fragment>

        );
    }
}

export default LastStep;
