import React, { Component } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;
const { TextArea } = Input;

interface IThirdStepForm {
}

interface IThirdStepFormState {
    text: any;
}

type ThirdStepFormPageProps = IThirdStepForm & FormComponentProps;

class ThirdStepForm extends Component<ThirdStepFormPageProps, IThirdStepFormState> {
    constructor(props: ThirdStepFormPageProps) {
        super(props);
        this.state = {
            text: {
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

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form onSubmit={this.handleSubmit} layout="vertical">
                        <FormItem label="Now write your statement" hasFeedback>
                            {getFieldDecorator('statement', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please write your statement. You already do so much steps!'
                                    }
                                ]
                            })(<TextArea placeholder="Statement" rows={13}/>)}
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Form.create<IThirdStepForm>()(ThirdStepForm);
