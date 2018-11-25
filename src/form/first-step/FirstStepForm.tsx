import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isEmpty, map } from 'lodash';
import { emailRegex, numbersRegex, validatePhoneNumber } from '../../helper/helper';
import * as countriesPhonePrefixes from '../../helper/countries-phone-prefixes.json';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

interface IFirstStepForm {
    changeForm: (form: object) => void;
}

interface IFormItem {
    value: number | undefined;
    validateStatus?: any;
    errorMsg?: string;
}

interface IFirstStepFormState {
    phone: any;
    firstName: any;
    secondName: any;
    email: any;
    date: any;
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
            },
            firstName: {
                value: undefined
            },
            secondName: {
                value: undefined
            },
            email: {
                value: undefined
            },
            date: {
                value: undefined,
                momentValue: undefined
            }
        };
    }

    onPhoneChange = (event: any) => {
        const { value } = event.target;
        if (!numbersRegex.test(value))
            return;

        const isValid = this.validatePhone(value);

        this.props.changeForm({
            phone: isValid
        });
        this.setState({
            phone: isValid
        });

    };

    validatePhone = (value: number) => {
        if (isEmpty(value))
            return {
                ...this.state.phone,
                errorMsg: 'Phone number is required',
                validateStatus: 'error',
                value
            };

        return {
            ...this.state.phone,
            ...validatePhoneNumber(value, this.state.phone.prefix),
            value
        };
    };

    phonePrefixChange = (value: any) => {
        const isValid = {
            ...this.state.phone,
            ...validatePhoneNumber(this.state.phone.value, value),
            prefix: value
        };

        this.setState({
            phone: isValid
        });

        this.props.changeForm({
            phone: isValid
        });
    };

    onFirstNameChange = (event: any) => {
        const { value } = event.target;
        const isValid = this.validateFirstName(value);

        this.props.changeForm({
            firstName: isValid
        });

        this.setState({
            firstName: isValid
        });

    };

    validateFirstName = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'First name is required',
                validateStatus: 'error',
                value
            };

        return {
            validateStatus: 'success',
            errorMsg: null,
            value
        };
    };


    onSecondNameChange = (event: any) => {
        const { value } = event.target;
        const isValid = this.validateSecondName(value);

        this.props.changeForm({
            secondName: isValid
        });

        this.setState({
            secondName: isValid
        });
    };

    validateSecondName = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Second name is required',
                validateStatus: 'error',
                value
            };

        return {
            validateStatus: 'success',
            errorMsg: null,
            value
        };
    };

    onEmailChange = (event: any) => {
        const { value } = event.target;

        const isValid = this.validateEmail(value);

        this.props.changeForm({
            email: isValid
        });

        this.setState({
            email: isValid
        });
    };

    validateEmail = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Email is required',
                validateStatus: 'error',
                value
            };

        if (emailRegex.test(value))
            return {
                validateStatus: 'success',
                errorMsg: null,
                value
            };

        return {
            validateStatus: 'error',
            errorMsg: 'Is not valid email',
            value
        };
    };

    onDateChange = (value: any) => {
        this.props.changeForm({
            date: {
                value: value.format('YYYY-MM-DD'),
                errorMsg: null,
                momentValue: value
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { phone, firstName, secondName, email } = this.state;

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
                    <Form
                        layout="vertical"
                    >
                        <FormItem
                            label="Your first name"
                            hasFeedback
                            validateStatus={firstName.validateStatus}
                            help={firstName.errorMsg}
                        >
                            <Input
                                placeholder="First name"
                                value={firstName.value}
                                onChange={this.onFirstNameChange}
                            />
                        </FormItem>

                        <FormItem
                            label="and your second name"
                            hasFeedback
                            validateStatus={secondName.validateStatus}
                            help={secondName.errorMsg}
                        >
                            <Input
                                placeholder="Second name"
                                value={secondName.value}
                                onChange={this.onSecondNameChange}
                            />
                        </FormItem>

                        <FormItem
                            label="Now please provide your email address"
                            hasFeedback
                            validateStatus={email.validateStatus}
                            help={email.errorMsg}
                        >
                            <Input
                                placeholder="email@gmail.com"
                                value={email.value}
                                onChange={this.onEmailChange}
                            />
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
                                        defaultValue={this.state.date.momentValue}
                                        style={{ width: '40%', minWidth: 180, maxWidth: 280 }}
                                        disabledDate={FirstStepForm.disabledDate}
                                        onChange={this.onDateChange}
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
