import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CountBoard.module.scss';
import Loader from '../Loader';

const cx = classNames.bind(styles);

const CountBoard = ({title, counts, isLoading}) => {
    let refinedCounts = numberFormat(counts);
    return (
        <div className={cx('CountBoard')}>
            { isLoading ? <Loader /> : <div className={cx('counts')}>{refinedCounts}</div> }
            <div className={cx('title')}>{title}</div>
        </div>
    );
};

function numberFormat(inputNumber) {
    return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

CountBoard.propTypes = {
    title: PropTypes.string,
    counts: PropTypes.number
}

export default CountBoard;