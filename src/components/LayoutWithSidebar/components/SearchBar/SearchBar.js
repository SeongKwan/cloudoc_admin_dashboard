import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { FiSearch, FiX } from "react-icons/fi";

const cx = classNames.bind(styles);

@withRouter
@inject('search', 'clinicaldb')
@observer
class SearchBar extends Component {
    state = {
        searchKeyword: ''
    }
    componentDidMount() {
        this.props.clinicaldb.loadClinicaldbs();
        this.setState({ searchKeyword: this.props.search.keyword.searchPanel })
    }
    componentWillUnmount() {
        this.handleClearKeyword();
    }
    handleOnClick = (e) => {
        const { keyword } = this.props.search;
        const { searchKeyword } = this.state;
        if (this.state.searchKeyword === '' || keyword['searchPanel'] === '') {
            this.props.clinicaldb.InitInfiniteStore();
            return this.props.search.setKeyword({name: 'searchPanel', keyword: searchKeyword });
        }
        this.props.clinicaldb.noLoadMore();
        this.props.search.setKeyword({name: 'searchPanel', keyword: searchKeyword });
        
        this.props.clinicaldb.clinicaldbsOnSearching();
    }
    handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ searchKeyword: value });
    }
    handleClearKeyword = () => {
        this.setState({ searchKeyword: '' });
        this.props.search.clearKeyword();
    }
    render() {
        return (
            <div className={cx('SearchBar')}>
                <span className={cx('search')} onClick={this.handleOnClick}><FiSearch /></span>
                <label htmlFor="search-bar">검색창</label>
                <input 
                    name='searchPanel' 
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
            </div>
        );
    }
}

export default SearchBar;