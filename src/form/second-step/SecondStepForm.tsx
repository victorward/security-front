import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { isEmpty } from 'lodash';
import { numbersRegex, validatePeselNumbers } from '../../helper/helper';
import { Col, Form, Input, Row, Select } from 'antd';

const FormItem = Form.Item;

interface ISecondStepFormProps {

}

interface SecondStepFormState {
    pesel: any;
}

type SecondStepFormProps = ISecondStepFormProps & FormComponentProps;

class SecondStepForm extends Component<SecondStepFormProps, SecondStepFormState> {
    constructor(props: SecondStepFormProps) {
        super(props);
        this.state = {
            pesel: {
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
        const { pesel } = this.state;
        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form onSubmit={this.handleSubmit} layout="vertical">
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
    };
}

export default Form.create<SecondStepFormProps>()(SecondStepForm);