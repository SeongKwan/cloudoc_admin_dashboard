import React from 'react';
import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';

const cx = classNames.bind(styles);

const Wrapper = ({classnames, title, content}) => {
    return (
        <div className={cx('Wrapper', classnames)}>
            <div className={cx('title')}>{title}</div>
            <div className={cx('content')}>{content || ' - '}</div>
        </div>
    );
};

export default Wrapper;