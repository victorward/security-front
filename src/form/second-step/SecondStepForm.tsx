import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { isEmpty } from 'lodash';
import { numbersAndLetterRegex, numbersRegex, validateIdentityCard, validatePeselNumbers } from '../../helper/helper';
import { Col, Form, Input, Row, Select } from 'antd';

const FormItem = Form.Item;

interface ISecondStepFormProps {

}

interface SecondStepFormState {
    pesel: any;
    identity: any;
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
        const { getFieldDecorator } = this.props.form;
        const { pesel, identity } = this.state;
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

                        <FormItem label="Now please provide password for access to your statement" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please add password to your statement'
                                    }
                                ]
                            })(<Input placeholder="Password" type="password"/>)}
                        </FormItem>
                    </Form>
                </Col>
            </Row>);
    };
}

export default Form.create<SecondStepFormProps>()(SecondStepForm);