import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isEmpty, map } from 'lodash';
import { numbersRegex, validatePhoneNumber } from '../../helper/helper';
import * as countriesPhonePrefixes from '../../helper/countries-phone-prefixes.json';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

interface IFirstStepForm {
}

interface IFormItem {
    value: number | undefined;
    validateStatus?: any;
    errorMsg?: string;
}

interface IFirstStepFormState {
    phone: any;
}

type FirstStepFormPageProps = IFirstStepForm & FormComponentProps;

class FirstStepForm extends Component<FirstStepFormPageProps, IFirstStepFormState> {
    static disabledDate(current: any) {
        return current && current > moment().endOf('day');
    }

    constructor(props: FirstStepFormPageProps) {
        super(props);
        this.state = {
            phone: {
                value: undefined,
                prefix: 'PL'
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

    onPhoneChange = (event: any) => {
        const { value } = event.target;

        if (isEmpty(value)) {
            this.setState({
                phone: {
                    ...this.state.phone,
                    errorMsg: 'Phone number is required',
                    validateStatus: 'error',
                    value
                }
            });
            return;
        }

        if (numbersRegex.test(value))
            this.setState({
                phone: {
                    ...this.state.phone,
                    ...this.validatePhone(value, this.state.phone.prefix),
                    value
                }
            });
    };

    validatePhone = (value: number, prefix: string) => {
        return validatePhoneNumber(value, prefix);
    };

    phonePrefixChange = (value: any) => {
        this.setState({
            phone: {
                ...this.state.phone,
                ...this.validatePhone(this.state.phone.value, value),
                prefix: value
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { phone } = this.state;

        const phonePrefixSelector = getFieldDecorator('phone-prefix', {
            initialValue: 'PL'
        })(
            <Select
                style={{ minWidth: 150 }}
                showSearch
                placeholder="Country prefix"
                optionFilterProp="children"
                onChange={this.phonePrefixChange}
            >
                {map(countriesPhonePrefixes.countries, value => {
                    const name = `${value.name} (+${value.code})`;

                    return (
                        <Option
                            key={value.iso2}
                            value={`${value.iso2}`}
                            title={name}
                        >
                            {name}
                        </Option>
                    );
                })}
            </Select>
        );

        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form onSubmit={this.handleSubmit} layout="vertical">
                        <FormItem label="Your first name" hasFeedback>
                            {getFieldDecorator('first-name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your first name'
                                    }
                                ]
                            })(<Input placeholder="First name"/>)}
                        </FormItem>

                        <FormItem label="and your second name" hasFeedback>
                            {getFieldDecorator('second-name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your second name'
                                    }
                                ]
                            })(<Input placeholder="Second name"/>)}
                        </FormItem>

                        <FormItem
                            label="Now please provide your email address"
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        required: true,
                                        message:
                                            'Please input your email address'
                                    },
                                    {
                                        type: 'email',
                                        message: 'Is not valid email'
                                    }
                                ]
                            })(<Input placeholder="email@gmail.com"/>)}
                        </FormItem>

                        <FormItem
                            label="and phone number for eventual communication"
                            hasFeedback
                            required
                            validateStatus={phone.validateStatus}
                            help={phone.errorMsg}
                        >
                            <Input
                                addonBefore={phonePrefixSelector}
                                placeholder="Phone number"
                                style={{ minWidth: 100 }}
                                value={phone.value}
                                onChange={this.onPhoneChange}
                            />
                        </FormItem>

                        <FormItem
                            label="and last of this section - your birth date"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('birth', {
                                    rules: [
                                        {
                                            required: true,
                                            type: 'object',
                                            message: 'Please select your birth date'
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        showToday={false}
                                        style={{ width: '40%', minWidth: 180, maxWidth: 280 }}
                                        disabledDate={FirstStepForm.disabledDate}
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Form.create<IFirstStepForm>()(FirstStepForm);
