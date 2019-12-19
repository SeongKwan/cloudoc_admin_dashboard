import React, { Component } from 'react';
import styles from './CaseMaster.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

class CaseMaster extends Component {
  render() {
    return (
      <div className={cx('CaseMaster')}>
        <Helmet>
            <title>Case Master</title>
        </Helmet>
      </div>
    );
  }
}

export default CaseMaster;