import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isNumber, isNil } from 'lodash';

const FormItem = Form.Item;

interface IFirstStepForm {
}

type FirstStepFormPage = IFirstStepForm & FormComponentProps;

class FirstStepForm extends Component<FirstStepFormPage> {
    constructor(props: FirstStepFormPage) {
        super(props);
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    // https://gist.github.com/marekbryling/8889065
    validatePesel = (rule: any, value: any, callback: any) => {
        console.log(value);
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;

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
                        >
                            {
                                getFieldDecorator('pesel', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your PESEL'
                                        },
                                        {
                                            validator: this.validatePesel
                                        },
                                        {
                                            len: 10,
                                            message: 'PESEL not has proper length'
                                        },
                                        {
                                            validator: (rule, value, cb) => (isNumber(value) ? cb() : cb(true)),
                                            message: 'Is not number'
                                        }
                                    ]
                                })(
                                    <Input placeholder='PESEL'/>
                                )
                            }
                        </FormItem>
                    </Form>
                </Col>
            </Row>);
    }
}

export default Form.create<IFirstStepForm>()(FirstStepForm);