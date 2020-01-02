import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './ClinicaldbExam.module.scss';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Loader from '../../Loader';
import { getLocaleFullDateWithTime } from '../../../utils/momentHelper';

const cx = classNames.bind(styles);
@withRouter
@inject('exam', 'common', 'detailClinicaldb')
@observer
class ClinicaldbExam extends Component {
    componentDidMount() {
        if (!this.props.create) {
            this.props.exam.setEditableData(this.props.contents);
            this.props.exam.setStaticData(this.props.contents);
        }
        this.props.exam.loadExams();
    }
    componentWillUnmount() {
        this.props.exam.clearStaticData();
        this.props.exam.clearEditableData();
        this.props.detailClinicaldb.clearIsEditing();
        this.props.common.clearTextareaSettings();
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            return this.props.exam.handleChange(name, e.target.checked);
        }
        if (name === 'description') {
            return this.props.exam.handleChange(name, value);
            // return this.props.common.adjustTextAreaSettings(e);
        }
        this.props.exam.handleChange(name, value);
    }

    _renderCategoryOption = () => {
        const { optionCategories } = this.props.exam;
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
                    return this.props.exam.createExam()
                    .then((response) => {
                        this.props.history.push(`/clinicaldb/exam/${response.newArticle._id}`)
                    })
                    .catch((error) => {
    
                    });
                }
            }
            if (window.confirm('수정한 내용을 적용하시겠습니까?')) {
                return this.props.exam.updateExam(id)
                    .then((response) => {
                        this.props.exam.setEditableData(response.updatedArticle);
                        this.props.detailClinicaldb.clearIsEditing();
                    })
                    .then(() => {
                        this.props.history.goBack();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
        if (type === 'delete') {
            if (window.confirm('정말로 해당 변증/체질정보를 삭제하시겠습니까?')) {
                return this.props.exam.deleteExam(id)
                .then((response) => {
                    this.props.history.replace(`/clinicaldb`);
                })
                .catch((error) => {
    
                });
            }
        }
    }
    render() {
        const {
            user_id,
            created_date,
            // section,
            name,
            category,
            description,
            updated_date,
            status,
            _id
        } = this.props.exam.editableData;
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
            <article className={cx('ClinicaldbExam')}>
                <Helmet>
                    {this.props.create ? <title>{`임상정보[생성][변증/체질]`}</title> : <title>{`임상정보[상세][변증/체질] - ${name}`}</title>}
                </Helmet>
                {
                    !create && <>
                    <div className={cx('wrapper','wrapper--section')}>
                        <div className={cx('title')}>분류</div>
                        <div className={cx('content','readOnly')}>변증/체질</div>
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
                <div className={cx('wrapper','wrapper--name')}>
                    <div className={cx('title')}>변증/체질명</div>
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
                <div className={cx('wrapper','wrapper--description')}>
                    <div className={cx('title')}>상세설명</div>
                    <textarea 
                        name='description'
                        rows={rows}
                        value={description || ""}
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

export default ClinicaldbExam;