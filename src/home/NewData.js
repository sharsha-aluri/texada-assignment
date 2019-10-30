import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Modal,
    notification,
    InputNumber
} from 'antd';
import { addAirplaneData, updateAirplaneData } from '../util/APIUtils';

class NewData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            isLoading: false
        }
        this.handleOkClick = this.handleOkClick.bind(this);
    }

    handleOkClick = () => {
        const isEdit = this.props.isEdit

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.setState({
                confirmLoading: true,
                isLoading: true
            });

            const airplaneData = Object.assign({}, values);
            airplaneData.tableId = this.props.id;

            if (isEdit) {
                updateAirplaneData(airplaneData);
                this.setState({
                    confirmLoading: false,
                    isLoading: false
                });
                this.props.form.resetFields();
                this.props.onCreate();
            } else {
                addAirplaneData(airplaneData);
                this.setState({
                    confirmLoading: false,
                    isLoading: false
                });
                this.props.form.resetFields();
                this.props.onCreate();
            }
        });
    }

    checkNumber = (rule, value, callback) => {
        console.log("Value " + value)
        if (value > 0) {
          callback();
          return;
        }
        callback('This field should be number!');
    };

    render() {
        const { visible, onCancel, form } = this.props;
        const { getFieldDecorator } = form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <Modal
                width="600px"
                title={this.props.isEdit ? "Edit Airplane Data" : "Add Airplane Data"}
                visible={visible}
                onOk={this.handleOkClick}
                onCancel={onCancel}
                confirmLoading={this.state.confirmLoading}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button type="primary" key="submit" loading={this.state.isLoading} onClick={this.handleOkClick}>
                        Submit
                    </Button>,
                ]}>
                <Form {...formItemLayout}>
                    <Form.Item
                        label="Description">
                        {getFieldDecorator('description', {
                            rules: [
                                { required: true, message: 'Please input description!' },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label="Longitude">
                        {getFieldDecorator('longitude', {
                            rules: [
                                { required: true, message: 'Please input longitude!' },
                                { validator: this.checkNumber },
                            ],
                        })(<InputNumber />)}
                    </Form.Item>
                    <Form.Item label="Latitude">
                        {getFieldDecorator('latitude', {
                            rules: [
                                { required: true, message: 'Please input latitude!' },
                                { validator: this.checkNumber },
                            ]
                        })(<InputNumber />)}
                    </Form.Item>
                    <Form.Item label="Elevation">
                        {getFieldDecorator('elevation', {
                            rules: [
                                { required: true, message: 'Please input elevation!' },
                                { validator: this.checkNumber },
                            ]
                        })(<InputNumber />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default NewData;