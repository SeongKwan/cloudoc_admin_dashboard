import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.scss';
import classNames from 'classnames/bind';
import Footer from '../Footer'

const cx = classNames.bind(styles);

class Layout extends Component {

  render() {
    const { children } = this.props;
    
    return (
      <div className={cx('Layout')}>
        <div className={cx('cover')}></div>
        <main className={cx('main-container')}>
          {children}
        </main>
        <footer className={cx('footer-container')}>
          <Footer />
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object
}

export default Layout;