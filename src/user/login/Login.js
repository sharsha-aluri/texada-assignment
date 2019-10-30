import React, { Component } from 'react';
import { loginUser } from '../../util/APIUtils';
import './Login.css';
import { AUTHENTICATED_USER_ID } from '../../constants';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        loading: false
    };

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });

                const loginRequest = Object.assign({}, values);

                const user = loginUser(loginRequest);

                this.setState({ loading: false });
                if(user) {
                    localStorage.setItem(AUTHENTICATED_USER_ID, user.userid);
                    this.props.onLogin()
                } else {
                    notification.error({
                        message: 'Texada',
                        description: 'Your Username or Password is incorrect. Please try again!'
                    });
                };
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username' }],
                    })(
                        <Input
                            prefix={<Icon type="user" />}
                            size="large"
                            name="username"
                            placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" />}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button" loading={this.state.loading}>Login</Button>
                </FormItem>
            </Form>
        );
    }
}


export default Login;