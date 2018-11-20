import { Col, Form, Input, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isEmpty, map } from 'lodash';
import { numbersRegex, validatePeselNumbers, validatePhoneNumber } from '../helper/helper';
import * as contriesPhonePrefixes from '../helper/countries-phone-prefixes.json';

const FormItem = Form.Item;
const Option = Select.Option;

interface IFirstStepForm {
}

interface IFormItem {
    value: number | undefined,
    validateStatus?: any,
    errorMsg?: string
}

interface IFirstStepFormState {
    pesel: any;
    phone: any;
}

type FirstStepFormPageProps = IFirstStepForm & FormComponentProps;


class FirstStepForm extends Component<FirstStepFormPageProps, IFirstStepFormState> {
    constructor(props: FirstStepFormPageProps) {
        super(props);
        this.state = {
            pesel: {
                value: undefined
            },
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
        const { pesel, phone } = this.state;

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
                {
                    map(contriesPhonePrefixes.countries, (value) => {
                        const name = `${value.name} (+${value.code})`;

                        return (<Option key={value.iso2} value={`${value.iso2}`} title={name}>
                            {name}
                        </Option>);
                    })
                }
            </Select>
        );

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
                            label="and your second name"
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
                            label="Now please provide your email address"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('email', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your email address'
                                        },
                                        {
                                            type: 'email',
                                            message: 'Is not valid email'
                                        }
                                    ]
                                })(
                                    <Input placeholder='email@gmail.com'/>
                                )
                            }
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
                                placeholder='Phone number'
                                value={phone.value}
                                onChange={this.onPhoneChange}
                            />
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
                                style={{ minWidth: 100 }}
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