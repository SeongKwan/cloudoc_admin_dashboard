import React, { Component } from 'react';
import { 
    Switch, 
    Route, 
    withRouter,
    Redirect
} from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Landing from '../../pages/Landing';
import Page404 from '../../pages/Page404';

const CheckAuth = () => (WrappedComponent) => {
    @withRouter
    @inject("login")
    @observer
    class AuthenticatedComponent extends Component {
        render() {
            const { isLoggedIn } = this.props.login;

            return (
                <>
                    {
                        isLoggedIn
                        ? <WrappedComponent {...this.props} />
                        : <Switch> 
                            <Route path="/" exact>
                                <Landing />
                            </Route>
                            <Route path="/clinicaldb">
                                <Redirect to="/" />
                            </Route>
                            <Route>
                                <Page404 />
                            </Route>
                        </Switch>
                    }
                </>
            );
        }
    }
    return AuthenticatedComponent;
};

export default CheckAuth;