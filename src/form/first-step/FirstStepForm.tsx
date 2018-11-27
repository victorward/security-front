import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { isEmpty, map, get } from 'lodash';
import { emailRegex, isDateAndPeselCorrect, numbersRegex, validatePhoneNumber } from '../../helper/helper';
import * as countriesPhonePrefixes from '../../helper/countries-phone-prefixes.json';
import moment from 'moment';
import * as EmailValidator from 'email-validator';

const FormItem = Form.Item;
const Option = Select.Option;

interface IFirstStepForm {
    changeForm: (form: object) => void;
    formState: any;
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
    pesel: any;
}

type FirstStepFormPageProps = IFirstStepForm & FormComponentProps;

class FirstStepForm extends Component<FirstStepFormPageProps, IFirstStepFormState> {
    static disabledDate(current: any) {
        return current && current > moment().endOf('day');
    }

    constructor(props: FirstStepFormPageProps) {
        super(props);
        this.state = this.getValues(this.props);
    }

    componentWillReceiveProps(nextProps: Readonly<FirstStepFormPageProps>, nextContext: any): void {
        this.setState(this.getValues(nextProps));
    }

    getValues = (props: FirstStepFormPageProps) => ({
        phone: {
            ...get(props.formState, 'phone', { value: undefined, prefix: 'PL' })
        },
        firstName: {
            ...get(props.formState, 'firstName', { value: undefined })
        },
        secondName: {
            ...get(props.formState, 'secondName', { value: undefined })
        },
        email: {
            ...get(props.formState, 'email', { value: undefined })
        },
        date: {
            ...get(props.formState, 'date', { value: undefined, momentValue: undefined })
        },
        pesel: {
            ...get(props.formState, 'pesel', { value: undefined })
        }
    });

    onPhoneChange = (event: any) => {
        const { value } = event.target;
        if (!numbersRegex.test(value))
            return;

        const isValid = this.validatePhone(value);

        this.props.changeForm({
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
    };

    validateEmail = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Email is required',
                validateStatus: 'error',
                value
            };

        if (EmailValidator.validate(value))
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
        const isValid = this.validateDate(value);
        this.props.changeForm({
            date: isValid
        });
    };

    validateDate = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Please select your birth date',
                validateStatus: 'error',
                momentValue: value,
                value
            };

        if (!isDateAndPeselCorrect(this.state.pesel.value, value))
            return {
                errorMsg: 'Your date of birth is not matching your PESEL number.',
                validateStatus: 'error',
                momentValue: value,
                value
            };

        return {
            value: value.format('YYYY-MM-DD'),
            errorMsg: null,
            validateStatus: 'success',
            momentValue: value
        };
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { phone, firstName, secondName, email, date } = this.state;

        const phonePrefixSelector = getFieldDecorator('phone-prefix', {
            initialValue: this.state.phone.prefix
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
                                autoFocus
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
                            validateStatus={date.validateStatus}
                            help={date.errorMsg}
                        >
                            <DatePicker
                                showToday={false}
                                style={{ width: '40%', minWidth: 180, maxWidth: 280 }}
                                disabledDate={FirstStepForm.disabledDate}
                                value={date.momentValue}
                                onChange={this.onDateChange}
                            />
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Form.create<IFirstStepForm>()(FirstStepForm);
