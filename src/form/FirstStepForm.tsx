import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;

interface IFirstStepForm {
}

interface IFirstStepFormState {
    pesel: any;
    // pesel: {
    //     value: number | undefined,
    //     validateStatus?: any,
    //     errorMsg?: string
    // }
}

type FirstStepFormPageProps = IFirstStepForm & FormComponentProps;

const validatePeselNumbers = (pesel: number): boolean => {
    const dig = ('' + pesel).split('');
    let control = (parseInt(dig[0], 10) + 3 * parseInt(dig[1], 10) + 7 * parseInt(dig[2], 10) + 9
        * parseInt(dig[3], 10) + 1 * parseInt(dig[4], 10) + 3 * parseInt(dig[5], 10) + 7
        * parseInt(dig[6], 10) + 9 * parseInt(dig[7], 10) + 1 * parseInt(dig[8], 10) + 3
        * parseInt(dig[9], 10)) % 10;

    if (control === 0)
        control = 10;

    control = 10 - control;

    return parseInt(dig[10], 10) === control;
};

class FirstStepForm extends Component<FirstStepFormPageProps, IFirstStepFormState> {
    constructor(props: FirstStepFormPageProps) {
        super(props);
        this.state = {
            pesel: {
                value: undefined
            }
        };
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    onPeselChange = (event: any) => {
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        const { value } = event.target;

        if (isEmpty(value)) {
            this.setState({
                pesel: {
                    errorMsg: 'PESEL is requiered',
                    validateStatus: 'error',
                    value
                }
            });
            return;
        }

        if (reg.test(value) && ('' + value).length < 11) {
            this.setState({
                pesel: {
                    errorMsg: 'PESEL is too short',
                    validateStatus: 'error',
                    value
                }
            });
            return;
        }

        if (reg.test(value))
            this.setState({
                pesel: {
                    ...this.validatePesel(value),
                    value
                }
            });
    };

    // https://gist.github.com/marekbryling/8889065
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { pesel } = this.state;
        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form onSubmit={this.handleSubmit} layout="vertical">
                        <FormItem
                            label="Your first name"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('first-name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your first name'
                                        }
                                    ]
                                })(
                                    <Input placeholder='First name'/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            label="Your second name"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('second-name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your second name'
                                        }
                                    ]
                                })(
                                    <Input placeholder='Second name'/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            label="Your PESEL"
                            hasFeedback
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
                    </Form>
                </Col>
            </Row>);
    }
}

export default Form.create<IFirstStepForm>()(FirstStepForm);