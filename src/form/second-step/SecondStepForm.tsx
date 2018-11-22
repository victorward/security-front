import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { isEmpty } from 'lodash';
import { numbersAndLetterRegex, numbersRegex, validateIdentityCard, validatePeselNumbers } from '../../helper/helper';
import { Col, Form, Input, Row, Progress, Tooltip } from 'antd';
import zxcvbn from 'zxcvbn';

const FormItem = Form.Item;
const InputGroup = Input.Group;

interface ISecondStepFormProps {

}

interface SecondStepFormState {
    pesel: any;
    identity: any;
    password: any;
}

type SecondStepFormProps = ISecondStepFormProps & FormComponentProps;

class SecondStepForm extends Component<SecondStepFormProps, SecondStepFormState> {
    constructor(props: SecondStepFormProps) {
        super(props);
        this.state = {
            pesel: {
                value: undefined
            },
            identity: {
                value: undefined
            },
            password: {
                value: undefined,
                percent: 0,
                successPercent: 0,
                status: undefined,
                hint: '',
                title: 'Password strength'
            }
        };
    }

    onPeselChange = (event: any) => {
        const { value } = event.target;

        if (isEmpty(value)) {
            this.setState({
                pesel: {
                    errorMsg: 'PESEL is required',
                    validateStatus: 'error',
                    value
                }
            });
            return;
        }

        if (numbersRegex.test(value) && ('' + value).length < 11) {
            this.setState({
                pesel: {
                    errorMsg: 'PESEL is too short',
                    validateStatus: 'error',
                    value
                }
            });
            return;
        }

        if (numbersRegex.test(value))
            this.setState({
                pesel: {
                    ...this.validatePesel(value),
                    value
                }
            });
    };

    onIdentityChange = (event: any) => {
        const { value } = event.target;

        if (isEmpty(value)) {
            this.setState({
                identity: {
                    errorMsg: 'Identity card is required',
                    validateStatus: 'error',
                    value: value
                }
            });
            return;
        }

        const upperValue = value.toUpperCase();
        if (numbersAndLetterRegex.test(upperValue))
            this.setState({
                identity: {
                    ...this.validateIdentity(upperValue),
                    value: upperValue
                }
            });
    };

    onPasswordChange = (event: any) => {
        const { value } = event.target;
        const strength = zxcvbn(value);
        const percent = (strength.score + 1) * 20;
        const hint = `For crack your password on our site hacker need ${
            strength.crack_times_display.online_no_throttling_10_per_second
        }`;
        const base = {
            value,
            hint,
            percent,
            errorMsg: strength.feedback.suggestions
        };

        if (isEmpty(value)) {
            this.setState({
                password: {
                    ...base,
                    errorMsg: 'Password is required',
                    validateStatus: 'error',
                    status: 'exception',
                    title: 'Password can\' be empty'
                }
            });
            return;
        }

        if (percent < 30) {
            this.setState({
                password: {
                    ...base,
                    validateStatus: 'error',
                    status: 'exception',
                    title: 'Password is too simple'
                }
            });
            return;
        }

        if (percent < 50) {
            this.setState({
                password: {
                    ...base,
                    validateStatus: 'warning',
                    status: 'exception',
                    title: 'Password is not good enough'
                }
            });
            return;
        }


        if (percent < 70) {
            this.setState({
                password: {
                    ...base,
                    validateStatus: 'warning',
                    status: 'active',
                    title: 'Password is particular secure, add something more'
                }
            });
            return;
        }

        this.setState({
            password: {
                ...this.state.password,
                ...base,
                validateStatus: 'success',
                successPercent: percent,
                title: percent === 100 ? 'Password is really secure' : 'Password is good but it can be better'
            }
        });
    };

    validateIdentity = (value: string) => {
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

    validatePesel = (value: any) => {
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

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };


    render() {
        const { pesel, identity, password } = this.state;
        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form onSubmit={this.handleSubmit} layout="vertical">
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
                            validateStatus={identity.validateStatus}
                            help={identity.errorMsg}
                        >
                            <Input
                                placeholder='Identity document'
                                maxLength={9}
                                style={{ minWidth: 100 }}
                                value={identity.value}
                                onChange={this.onIdentityChange}
                            />
                        </FormItem>

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
                </Col>
            </Row>);
    };
}

export default Form.create<SecondStepFormProps>()(SecondStepForm);