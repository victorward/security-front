import React, { Component } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { isEmpty, get } from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input;

interface IThirdStepForm {
    changeForm: (form: object) => void;
    formState: any;
}

interface IThirdStepFormState {
    statement: any;
}

type ThirdStepFormPageProps = IThirdStepForm & FormComponentProps;

class ThirdStepForm extends Component<ThirdStepFormPageProps, IThirdStepFormState> {
    constructor(props: ThirdStepFormPageProps) {
        super(props);
        this.state = this.getValues(props);
    }

    componentWillReceiveProps(nextProps: Readonly<ThirdStepFormPageProps>, nextContext: any): void {
        this.setState(this.getValues(nextProps));
    }

    getValues = (props: ThirdStepFormPageProps) => ({
            statement: {
                ...get(props.formState, 'statement', { value: undefined })
            }
        });


    onStatementChange = (event: any) => {
        const { value } = event.target;
        const isValid = this.validateStatement(value);

        this.props.changeForm({
            statement: isValid
        });
    };

    validateStatement = (value: any) => {
        if (isEmpty(value))
            return {
                errorMsg: 'Please write your statement. You already do so much steps!',
                validateStatus: 'error',
                value
            };

        return {
            validateStatus: 'success',
            errorMsg: null,
            value
        };
    };

    render() {
        const { statement } = this.state;

        return (
            <Row>
                <Col span={14} offset={5}>
                    <Form layout="vertical">
                        <FormItem
                            label="Now write your statement"
                            hasFeedback
                            validateStatus={statement.validateStatus}
                            help={statement.errorMsg}
                        >
                          <TextArea
                              value={statement.value}
                              onChange={this.onStatementChange}
                              placeholder="Statement"
                              rows={13}
                          />
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Form.create<IThirdStepForm>()(ThirdStepForm);
