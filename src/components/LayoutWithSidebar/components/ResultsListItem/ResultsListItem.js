import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './ResultsListItem.module.scss';
import Wrapper from './Wrapper';

const cx = classNames.bind(styles);

@withRouter
@inject('search', 'clinicaldb','searchPanel')
@observer
class ResultsListItem extends Component {
    render() {
        const {
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail
        } = this.props.searchPanel.currentListContents || {};


        return (
            <div className={cx('ResultsListItem')}>
                <Wrapper classnames='name' title='문헌명' content={name} />
                <Wrapper classnames='category' title='분류' content={category} />
                <Wrapper classnames='method' title='연구분류' content={method} />
                <Wrapper classnames='author' title='저자' content={author} />
                <Wrapper classnames='year' title='출판연도' content={year} />
                <Wrapper classnames='publisher' title='출판사' content={publisher} />
                <Wrapper classnames='url' title='참조링크' content={url} />
                <Wrapper classnames='description' title='주요내용' content={description} />
                <Wrapper classnames='methodDetail' title='연구방법' content={methodDetail} />
                <Wrapper classnames='memo' title='참고사항' content={memo} />
            </div>
        );
    }
}

export default ResultsListItem;