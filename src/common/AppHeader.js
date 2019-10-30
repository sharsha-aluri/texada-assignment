import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Button} from 'antd';
const Header = Layout.Header;

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick({ key }) {
        if (key === "logout") {
            this.props.onLogout();
        }
    }

    render() {
        return (
            <Header className="app-header">
                    <div className="container">
                    <Link to="/">
                        <h2 className="app-title">Texada</h2>
                    </Link>
                    {
                        this.renderButton()
                    }
                    </div>
            </Header>
        );
    }

    renderButton() {
        if(this.props.currentUser) {
         return(
            <Button className="logout-button" onClick={this.props.onLogout}>Logout</Button>
         )   
        }
    }
}

export default withRouter(AppHeader);