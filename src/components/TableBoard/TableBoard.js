import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './TableBoard.module.scss';
import Loader from '../Loader';
import moment from 'moment';
import { FiChevronLeft, FiChevronsLeft, FiChevronsRight, FiChevronRight, FiSearch, FiX } from "react-icons/fi";

const cx = classNames.bind(styles);

@withRouter
@inject('table', 'search', 'clinicaldb')
@observer
class TableBoard extends Component {
    state = {
        searchKeyword: ''
    }
    componentDidMount() {
        this.setState({ searchKeyword: this.props.search.keyword.clinicaldb })
        this.props.table.setPage(1, this.props.contents);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.contents !== this.props.contents) {
            return this.props.table.setPage(1, this.props.contents);
        } else return null
    }
    componentWillUnmount() {
        this.handleClearKeyword();
    }
    getLocaleFullDateWithTime = (_datetime) => {
        return moment(_datetime).tz(moment.tz.guess()).format("YYYY/MM/DD HH:mm:ss")
    }
    handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ searchKeyword: value });
    }
    handleOnClick = (e) => {
        const { searchKeyword } = this.state;
        this.props.search.setKeyword({name: 'clinicaldb', keyword: searchKeyword });
    }
    handleClearKeyword = () => {
        this.setState({ searchKeyword: '' });
        this.props.search.clearKeyword();
    }
    createClinicaldb = () => {
        this.props.history.push('/clinicaldb/create');
    }
    handleClickOnListItem = ({category, _id, section}) => {
        this.handleClearKeyword();
        this.props.history.push(`/${category}/${section}/${_id}`);
    }
    render() {
        const { 
            currentPage, 
            lastPage, 
            paginatedContents, 
            pages, 
            filter 
        } = this.props.table;
        const { isLoading } = this.props;
        const category = this.props.location.pathname.split("/")[1];
        
        return (
            <div className={cx('TableBoard')}>
                <div className={cx('search-bar')}>
                    <span className={cx('search')} onClick={this.handleOnClick}><FiSearch /></span>
                    <label htmlFor="search-bar">검색창</label>
                    <input 
                        name='clinicaldb' 
                        className={cx({keyword: this.state.searchKeyword.length > 0})} 
                        id="search-bar" 
                        type="text" 
                        onChange={this.handleOnChange} 
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.handleOnClick();
                            }
                        }
                        }
                        value={this.state.searchKeyword} 
                    />
                    <span className={cx('clear-search-keyword', {keyword: this.state.searchKeyword.length > 0})} onClick={this.handleClearKeyword}>
                        <FiX />
                    </span>
                    <div onClick={this.createClinicaldb} className={cx('button-create')}>생성 +</div>
                </div>
                <div className={cx('section-filter-button')}>
                    <ul>
                        <li><button onClick={()=>{this.props.table.toggleFilter('symptom')}} className={cx({without: !filter.symptom},'symptom')}>증상</button></li>
                        <li><button onClick={()=>{this.props.table.toggleFilter('lab')}} className={cx({without: !filter.lab},'lab')}>혈검</button></li>
                        <li><button onClick={()=>{this.props.table.toggleFilter('condition')}} className={cx({without: !filter.condition},'condition')}>진단</button></li>
                        <li><button onClick={()=>{this.props.table.toggleFilter('exam')}} className={cx({without: !filter.exam},'exam')}>체질</button></li>
                        <li><button onClick={()=>{this.props.table.toggleFilter('drug')}} className={cx({without: !filter.drug},'drug')}>한약</button></li>
                        <li><button onClick={()=>{this.props.table.toggleFilter('reference')}} className={cx({without: !filter.reference},'reference')}>문헌</button></li>
                    </ul>
                </div>
                <div className={cx('table-header')}>
                    {this.props.header.map((th, i) => {return <div className={cx('table-header-data', `${i + 1}`)} key={i}>{th}</div>})}
                </div>
                <ul className={cx('table-body', {isLoading})}>
                    {
                        !isLoading ? paginatedContents.length > 0 ? paginatedContents.map((item, i) => {
                            const { _id, name, section, created_date, updated_date, status } = item;
                            let formatedCreatedDate = this.getLocaleFullDateWithTime(created_date) || '-';
                            let formatedUpdatedDate = this.getLocaleFullDateWithTime(updated_date) || '-';
                            let sectionKR = this.props.clinicaldb.translateSection(section);
                                return <li key={i} onClick={() => {this.handleClickOnListItem({category, _id, section})}}>
                                    {/* <div>#{upperLimit - rowSize + i + 1}</div> */}
                                    <div>{_id}</div>
                                    <div>{sectionKR}</div>
                                    <div className={cx('table-body-data--name')}>{name}</div>
                                    <div>{formatedCreatedDate}</div>
                                    {   updated_date === null ? <div>-</div> :
                                        <div>{formatedUpdatedDate}</div>
                                    }
                                    <div>{status ? '활성화' : '비활성화'}</div>
                                </li>
                            })
                        : <div className={cx('no-results')}>
                            <span>{this.props.search.keyword['clinicaldb']}</span> 가 포함된 정보를 찾을 수 없습니다
                        </div>
                        : <Loader />
                    }
                </ul>
                <ul className={cx('pagination')}>
                    <li className={cx({disabled: currentPage === 1})}>
                        <button onClick={() => this.props.table.setPage(1)} disabled={currentPage === 1}><FiChevronsLeft /></button>
                    </li>
                    <li className={cx({disabled: currentPage === 1})}>
                        <button onClick={() => this.props.table.setPage(currentPage - 1)} disabled={currentPage === 1}><FiChevronLeft /></button>
                    </li>
                    {pages.map((page, index) =>
                        <li key={index} className={cx({active: currentPage === page})}>
                            <button onClick={() => this.props.table.setPage(page)}>{page}</button>
                        </li>
                    )}
                    <li className={cx({disabled: currentPage === lastPage || paginatedContents.length === 0})}>
                        <button onClick={() => this.props.table.setPage(currentPage + 1)} disabled={currentPage === lastPage || paginatedContents.length === 0}><FiChevronRight /></button>
                    </li>
                    <li className={cx({disabled: currentPage === lastPage || paginatedContents.length === 0})}>
                        <button onClick={() => this.props.table.setPage(lastPage)} disabled={currentPage === lastPage || paginatedContents.length === 0}><FiChevronsRight /></button>
                    </li>
                </ul>
            </div>
        );
    }
}

TableBoard.propTypes = {
    header: PropTypes.arrayOf(PropTypes.string),
    contents: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
}

export default TableBoard;