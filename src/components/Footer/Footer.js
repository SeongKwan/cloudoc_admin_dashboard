import React, { Component } from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    return (
      <footer className={cx('Footer')}>
        <div className={cx('copyright')}>
          IML &copy; Copyright 2019. All rights reserved.
        </div>
        <p>ver 20191212a (alpha)</p>
      </footer>
    );
  }
}

export default Footer;