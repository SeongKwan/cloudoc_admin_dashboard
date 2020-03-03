import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './ClinicaldbReference.module.scss';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Loader from '../../Loader';
import { getLocaleFullDateWithTime } from '../../../utils/momentHelper';

const cx = classNames.bind(styles);
@withRouter
@inject('reference', 'common', 'detailClinicaldb')
@observer
class ClinicaldbReference extends Component {
    componentDidMount() {
        if (!this.props.create) {
            this.props.reference.setEditableData(this.props.contents);
            this.props.reference.setStaticData(this.props.contents);
        }
        this.props.reference.loadReferences();
    }
    componentWillUnmount() {
        this.props.reference.clearStaticData();
        this.props.reference.clearEditableData();
        this.props.detailClinicaldb.clearIsEditing();
        this.props.common.clearTextareaSettings();
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            return this.props.reference.handleChange(name, e.target.checked);
        }
        if (name === 'description') {
            return this.props.reference.handleChange(name, value);
            // return this.props.common.adjustTextAreaSettings(e);
        }
        this.props.reference.handleChange(name, value);
    }

    _renderCategoryOption = () => {
        const { optionCategories } = this.props.reference;
        return optionCategories.map((category, i) => {
            return (
                <option key={i} value={category}>{category}</option>
            )
        })
    }

    _handleClickButton = (type) => {
        const { id } = this.props.match.params;
        if (type === 'cancel') {
            return this.props.history.push(`/clinicaldb`);
        }
        if (type === 'confirm') {
            if (this.props.create) {
                if (window.confirm('현재 내용으로 생성하시겠습니까?')) {
                    return this.props.reference.createReference()
                    .then((response) => {
                        this.props.history.push(`/clinicaldb/reference/${response.newArticle._id}`)
                    })
                    .catch((error) => {
    
                    });
                } else return false;
            }
            if (window.confirm('수정한 내용을 적용하시겠습니까?')) {
                return this.props.reference.updateReference(id)
                    .then((response) => {
                        this.props.reference.setEditableData(response.updatedArticle);
                        this.props.detailClinicaldb.clearIsEditing();
                    })
                    .then(() => {
                        this.props.history.goBack();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else return false;
        }
        if (type === 'delete') {
            if (window.confirm('정말로 해당 문헌정보를 삭제하시겠습니까?')) {
                return this.props.reference.deleteReference(id)
                .then((response) => {
                    this.props.history.replace(`/clinicaldb`);
                })
                .catch((error) => {
    
                });
            } else return false;
        }
    }
    render() {
        const {
            user_id,
            created_date,
            updated_date,
            // section,
            // reference_id,
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail,
            status,
            _id
        } = this.props.reference.editableData;
        const { create } = this.props;
        const { rows } = this.props.common.textareaSettings;

        if (this.props.isLoading) {
            return (
                <Loader />
            )
        }

        let momentHelpedUT, momentHelpedCT;

        momentHelpedCT = getLocaleFullDateWithTime(created_date);
        if (updated_date !== null) {
            momentHelpedUT = getLocaleFullDateWithTime(updated_date);
        }
        return (
            <article className={cx('ClinicaldbReference')}>
                <Helmet>
                    {this.props.create ? <title>{`임상정보[생성][문헌]`}</title> : <title>{`임상정보[상세][문헌] - ${name}`}</title>}
                </Helmet>
                {
                    !create && <>
                    <div className={cx('wrapper','wrapper--section')}>
                        <div className={cx('title')}>분류</div>
                        <div className={cx('content','readOnly')}>문헌</div>
                    </div>
                    <div className={cx('wrapper','wrapper--id')}>
                        <div className={cx('title')}>고유번호</div>
                        <div className={cx('content','readOnly')}>{_id}</div>
                    </div>
                    <div className={cx('wrapper','wrapper--userId')}>
                        <div className={cx('title')}>작성자-고유번호</div>
                        <div className={cx('content','readOnly')}>{user_id}</div>
                    </div>
                    <div className={cx('wrapper','wrapper--createdDate')}>
                        <div className={cx('title')}>생성일시</div>
                        <div className={cx('content','readOnly')}>{momentHelpedCT}</div>
                    </div>
                    </>
                }
                {
                    !create && 
                    <div className={cx('wrapper','wrapper--updatedDate')}>
                        <div className={cx('title')}>최종수정일시</div>
                        <div className={cx('content','readOnly')}>{momentHelpedUT || '-'}</div>
                    </div>
                }
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>문헌명</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="name"
                        type="text" 
                        value={name}
                    />
                </div>
                <div className={cx('wrapper','wrapper--category')}>
                    <div className={cx('title')}>구분</div>
                    <select
                        name='category'
                        value={category || ""}
                        onChange={this.handleChange}
                    >
                        <option value="">- 선택 -</option>
                        {this._renderCategoryOption()}
                    </select>
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>연구분류</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="method"
                        type="text" 
                        value={method}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>저자</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="author"
                        type="text" 
                        value={author}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>출판년도</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="year"
                        type="text" 
                        value={year}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>출판사(저널명)</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="publisher"
                        type="text" 
                        value={publisher}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>원문링크</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="url"
                        type="text" 
                        value={url}
                    />
                </div>
                <div className={cx('wrapper','wrapper--description')}>
                    <div className={cx('title')}>참고사항</div>
                    <textarea 
                        name='memo'
                        rows={rows}
                        value={memo || ""}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={cx('wrapper','wrapper--description')}>
                    <div className={cx('title')}>상세설명</div>
                    <textarea 
                        name='description'
                        rows={rows}
                        value={description || ""}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={cx('wrapper','wrapper--description')}>
                    <div className={cx('title')}>연구방법</div>
                    <textarea 
                        name='methodDetail'
                        rows={rows}
                        value={methodDetail || ""}
                        onChange={this.handleChange}
                    />
                </div>
                {
                    !create &&
                    <div className={cx('wrapper','wrapper--status')}>
                        <div className={cx('title')}>상태</div>
                        <div className={cx('content')}>
                            <input 
                                onChange={(e) => {
                                    this.handleChange(e)}
                                }
                                id="switch"
                                name="status"
                                type="checkbox"
                                checked={status} 
                            />
                            <label htmlFor="switch">Toggle</label>
                        </div>
                    </div>
                }
                <div className={cx('wrapper','wrapper--buttons')}>
                    {
                        !create &&
                        <button
                            className={cx('btn', 'btn-delete')}
                            onClick={this._handleClickButton.bind(this,'delete')}
                        >
                            삭제
                        </button>
                    }
                    <div className={cx('btn-cancel-confirm')}>
                        <button onClick={this._handleClickButton.bind(this,'cancel')} className={cx('btn','btn-cancel')}>취소</button>
                        <button disabled={!this.props.detailClinicaldb.isEditing} onClick={this._handleClickButton.bind(this,'confirm')} className={cx('btn','btn-confirm', {disabled: !this.props.detailClinicaldb.isEditing})}>{create ? '생성' : '수정'}</button>
                    </div>
                </div>
                
            </article>
        );
    }
}

export default ClinicaldbReference;