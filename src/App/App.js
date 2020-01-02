import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { inject, observer } from 'mobx-react';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';

const cx = classNames.bind(styles);

@inject('auth', 'login')
@observer
class App extends Component {
  render() {
    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc Administrator`}</title>
          <meta name="description" content="Admin Dashboard" />
        </Helmet>
        <main className={cx('App')}>
          <Routes />
        </main>
      </Router>
    );
  }
}

export default App;
