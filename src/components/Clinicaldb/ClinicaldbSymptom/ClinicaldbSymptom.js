import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from './ClinicaldbSymptom.module.scss';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Loader from '../../Loader';
import { getLocaleFullDateWithTime } from '../../../utils/momentHelper';

const cx = classNames.bind(styles);
@withRouter
@inject('symptom', 'common', 'detailClinicaldb')
@observer
class ClinicaldbSymptom extends Component {
    componentDidMount() {
        if (!this.props.create) {
            this.props.symptom.setEditableData(this.props.contents);
            this.props.symptom.setStaticData(this.props.contents);
        }
        this.props.symptom.loadSymptoms();
    }
    componentWillUnmount() {
        this.props.symptom.clearStaticData();
        this.props.symptom.clearEditableData();
        this.props.detailClinicaldb.clearIsEditing();
        this.props.common.clearTextareaSettings();
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            return this.props.symptom.handleChange(name, e.target.checked);
        }
        if (name === 'description') {
            this.props.symptom.handleChange(name, value);
            return this.props.common.adjustTextAreaSettings(e);
        }
        this.props.symptom.handleChange(name, value);
    }

    _renderCategoryOption = () => {
        const { optionCategories } = this.props.symptom;
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
                    return this.props.symptom.createSymptom()
                    .then((response) => {
                        this.props.history.push(`/clinicaldb/symptom/${response.newArticle._id}`)
                    })
                    .catch((error) => {
    
                    });
                }
            }
            if (window.confirm('수정한 내용을 적용하시겠습니까?')) {
                return this.props.symptom.updateSymptom(id)
                    .then((response) => {
                        this.props.symptom.setEditableData(response.updatedArticle);
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
            if (window.confirm('정말로 해당 증상정보를 삭제하시겠습니까?')) {
                return this.props.symptom.deleteSymptom(id)
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
            // unit,
            updated_date,
            status,
            _id
        } = this.props.symptom.editableData;
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
            <article className={cx('ClinicaldbSymptom')}>
                <Helmet>
                    {this.props.create ? <title>{`임상정보[생성][증상]`}</title> : <title>{`임상정보[상세][증상] - ${name}`}</title>}
                </Helmet>
                {
                    !create && <>
                    <div className={cx('wrapper','wrapper--section')}>
                        <div className={cx('title')}>분류</div>
                        <div className={cx('content','readOnly')}>증상</div>
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
                    <div className={cx('title')}>증상명</div>
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
};

export default ClinicaldbSymptom;