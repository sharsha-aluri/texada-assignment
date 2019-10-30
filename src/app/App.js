import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom';
import { AUTHENTICATED_USER_ID } from '../constants';

import Home from '../home/Home';
import Login from '../user/login/Login';
import AppHeader from '../common/AppHeader';
import LoadingIndicator from '../common/LoadingIndicator';

import { Layout, notification } from 'antd';
import { getCurrentUser } from '../util/APIUtils';
const { Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: localStorage.getItem(AUTHENTICATED_USER_ID) != null,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    const user = getCurrentUser();

    this.setState(
      {
        isLoading : false,
        currentUser : user,
        isAuthenticated : true
      }
    );
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/login", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(AUTHENTICATED_USER_ID);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Texada',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Texada',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} />

        <Content className="app-content">
          <div className="test-container">
            <Switch>
              <Route exact path="/"
                render={(props) => this.state.isAuthenticated ? <Home isAuthenticated={this.state.isAuthenticated}
                  currentUser={this.state.currentUser} {...props} /> :
                  <Redirect to="/login" />}>
              </Route>
              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
              <Route render={(props) => <Redirect to="/" />}></Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Texada ©2019. All Rights Reserved</Footer>
      </Layout>
    );
  }
}

export default withRouter(App);