import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { isEmpty, get } from 'lodash';
import { numbersAndLetterRegex, numbersRegex, validateIdentityCard, validatePeselNumbers } from '../../helper/helper';
import { Col, Form, Input, Row } from 'antd';

const FormItem = Form.Item;

interface ISecondStepFormProps {
    changeForm: (form: object) => void;
    formState: any;
}

interface SecondStepFormState {
    pesel: any;
    identity: any;
}

type SecondStepFormProps = ISecondStepFormProps & FormComponentProps;

class SecondStepForm extends Component<SecondStepFormProps, SecondStepFormState> {
    constructor(props: SecondStepFormProps) {
        super(props);
        this.state = this.getValues(this.props);
    }

    componentWillReceiveProps(nextProps: Readonly<SecondStepFormProps>, nextContext: any): void {
        this.setState(this.getValues(nextProps));
    }

    getValues = (props: SecondStepFormProps) => ({
        pesel: {
            ...get(props.formState, 'pesel', { value: undefined })
        },
        identity: {
            ...get(props.formState, 'identity', { value: undefined })
        },
    });

    onPeselChange = (event: any) => {
        const { value } = event.target;
        if (!numbersRegex.test(value))
            return;

        const isPeselValid = this.validatePesel(value);

        this.props.changeForm({
            pesel: isPeselValid
        });
    };

    validatePesel = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'PESEL is required',
                validateStatus: 'error',
                value
            };

        if (('' + value).length < 11)
            return {
                errorMsg: 'PESEL is too short',
                validateStatus: 'error',
                value
            };

        return {
            ...this.validatePeselNumbers(value),
            value
        };
    };

    onIdentityChange = (event: any) => {
        const { value } = event.target;
        const upperValue = value.toUpperCase();
        if (!numbersAndLetterRegex.test(upperValue))
            return;

        const isValid = this.validateIdentity(upperValue);

        this.props.changeForm({
            identity: isValid
        });
    };

    validateIdentity = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Identity card is required',
                validateStatus: 'error',
                value: value
            };

        return {
            ...this.validateIdentityValue(value),
            value: value
        };
    };

    validateIdentityValue = (value: string) => {
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

    validatePeselNumbers = (value: any) => {
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
        const { pesel, identity } = this.state;
        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form layout="vertical">
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
                    </Form>
                </Col>
            </Row>);
    };
}

export default Form.create<SecondStepFormProps>()(SecondStepForm);