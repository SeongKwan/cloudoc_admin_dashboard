import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './ResultsList.module.scss';
import $ from 'jquery';
import Loader from '../../../Loader';

const cx = classNames.bind(styles);

@withRouter
@inject('search', 'clinicaldb', 'searchPanel', 'condition')
@observer
class ResultsList extends Component {
    state = {
        loadingState: false,
        selectedList: '',
        dataType: ''
    };
    componentDidMount() {
        this.searchPanel.addEventListener("scroll", () => {
            this.loadReferences();
        });
    }
    componentWillUnmount() {
        this.searchPanel.removeEventListener("scroll", () => {
            this.loadReferences();
        });
        this.setState({selectedList: '', loadingState: false, dataType: ''})
        this.props.clinicaldb.InitInfiniteStore();
    }
    loadReferences = async () => {
        const { loadMore } = this.props.clinicaldb;
        const totalHeight = Math.floor($(this.searchPanel).prop('scrollHeight'));
        const windowHeight = Math.floor($(this.searchPanel).height());
        const offset = 100;

        // IE에서는 document.documentElement 를 사용.
        const scrollTop = $(this.searchPanel).scrollTop();
        if (totalHeight - windowHeight - scrollTop < offset) {
            if(!this.state.loadingState) {
            if (loadMore) {
                await this.setState({ loadingState: true });
                if (this.props.search.keyword['searchPanel'] === '') {
                this.props.clinicaldb.addToInfiniteStore();
                } else if (this.props.search.keyword['searchPanel'] !== '') {
                this.props.clinicaldb.addToSearchedStore();
                }
            }
            }
        } else {
            if (this.state.loadingState) {
                this.setState({ loadingState: false });
            }
        }
    }
    _handleClickList = (ref) => {
        if (!this.props.searchPanel.openListItemPanel) {
            this.props.searchPanel.togglePanel();
        }
        this.props.searchPanel.setCurrentListContents(ref);
    }
    _addRef = (e, ref) => {
        e.stopPropagation();
        const { currentIndex, currentDataType } = this.props.searchPanel;
        setTimeout(() => {
            this.props.condition.handleChangeFunction(currentDataType, currentIndex, 'ref_id', ref.reference_id)
        }, 50);
        setTimeout(() => {
            this.props.condition.handleChangeFunction(currentDataType, currentIndex, 'ref_content', ref.description)
        }, 100);
        this.props.searchPanel.clear();
    }
    render() {
        const { isLoading, loadMore } = this.props.clinicaldb;
        let clinicaldbs = 
            this.props.search.keyword['searchPanel'].length > 0 
            ? this.props.clinicaldb.searchedInfiniteStore
            : this.props.clinicaldb.infiniteStore;
        let { length } = clinicaldbs;
        return (
            <ul id="ResultsList" className={cx('ResultsList')} ref={ref => {
            this.searchPanel = ref;
            }}>
                {
                    isLoading && <Loader />
                }
                {
                    clinicaldbs.length > 0 && clinicaldbs.map((ref, i) => {
                        const { name, year, category, method } = ref;
                        return <li 
                                className={cx({selected: this.state.selectedList === ref._id})}
                                key={i} 
                                onClick={(e) => {
                                    this._handleClickList(ref);
                                    this.setState({selectedList: ref._id})
                                }}
                            >
                            <div className={cx('name')}>
                                {name}
                            </div>
                            {
                                this.state.selectedList === ref._id ?
                                <button onClick={(e) => {this._addRef(e, ref)}}>추가하기</button>
                                :
                                <div className={cx('category-method-year')}>
                                    <div className={cx('category')}>
                                        {category}
                                    </div>
                                    <div className={cx('method')}>
                                        {method}
                                    </div>
                                    <div className={cx('year')}>{year}</div>
                                </div>
                            }
                        </li>
                    })
                }
                {
                    length > 0 ? loadMore ? 
                    <div 
                        className={cx('status','load-more')}
                        onClick={() => {
                            if (this.props.search.keyword['searchPanel'].length > 0) {
                                this.props.clinicaldb.addToSearchedStore();
                            } else {
                                this.props.clinicaldb.addToInfiniteStore();
                            }
                        }}
                    >
                        더 불러오기
                    </div>
                    : <div className={cx('status', 'no-more')}>
                        마지막입니다
                    </div>
                    : <div></div>
                }
                {
                    this.props.search.keyword['searchPanel'].length > 0 && length === 0 && 
                    <div className={cx('status','no-results')}>
                        {`${this.props.search.keyword['searchPanel']}의 검색결과가 없습니다`}
                    </div>
                }
            </ul>
        );
    }
}

export default ResultsList;