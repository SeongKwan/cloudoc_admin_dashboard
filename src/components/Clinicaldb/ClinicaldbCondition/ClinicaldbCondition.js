import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './ClinicaldbCondition.module.scss';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Loader from '../../Loader';
import { getLocaleFullDateWithTime } from '../../../utils/momentHelper';
import { TiPlus, TiMinus } from "react-icons/ti";

const cx = classNames.bind(styles);
@withRouter
@inject('condition', 'common', 'detailClinicaldb')
@observer
class ClinicaldbCondition extends Component {
    componentDidMount() {
        if (!this.props.create) {
            this.props.condition.setEditableData(this.props.contents);
            this.props.condition.setStaticData(this.props.contents);
            this.props.condition.setStaticDetail(JSON.parse(JSON.stringify(this.props.contents.detail)));
            this.props.condition.setEditableDetail(JSON.parse(JSON.stringify(this.props.contents.detail)));
        }
        this.props.condition.loadConditions();
    }
    componentWillUnmount() {
        this.props.condition.clearStaticData();
        this.props.condition.clearEditableData();
        // this.props.condition.clearFormula();
        this.props.detailClinicaldb.clearIsEditing();
        this.props.common.clearTextareaSettings();
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            return this.props.condition.handleChange(name, e.target.checked);
        }
        if (name === 'description') {
            this.props.condition.handleChange(name, value);
            return this.props.common.adjustTextAreaSettings(e);
        }
        this.props.condition.handleChange(name, value);
    }

    handleChangeDetail = (e) => {
        const { name, value, dataset } = e.target;
        this.props.condition.handleChangeDetail(dataset.index, name, value);
    }

    _renderCategoryOption = () => {
        const { optionCategories } = this.props.condition;
        return optionCategories.map((category, i) => {
            return (
                <option key={i} value={category}>{category}</option>
            )
        })
    }

    handleAddupDetail = (e) => {
        this.props.condition.addDetail();
    }
    handleDeleteDetail = (index) => {
        this.props.condition.deleteDetail(index);
    }

    _handleClickButton = (type) => {
        const { id } = this.props.match.params;
        if (type === 'cancel') {
            return this.props.history.push(`/clinicaldb`);
        }
        if (type === 'confirm') {
            if (this.props.create) {
                if (window.confirm('현재 내용으로 생성하시겠습니까?')) {
                    return this.props.condition.createCondition()
                    .then((response) => {
                        this.props.history.push(`/clinicaldb/condition/${response.newArticle._id}`)
                    })
                    .catch((error) => {
    
                    });
                }
            }
            if (window.confirm('수정한 내용을 적용하시겠습니까?')) {
                return this.props.condition.updateCondition(id)
                    .then((response) => {
                        this.props.condition.setEditableData(response.updatedArticle);
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
            if (window.confirm('정말로 해당 진단정보를 삭제하시겠습니까?')) {
                return this.props.condition.deleteCondition(id)
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
            updated_date,
            // section,
            name,
            category,
            // detail,
            // teaching,
            // pathology,
            // linked_symptoms,
            // linked_labs,
            // linked_drugs,
            // symptom_tags,
            // lab_tags,
            // drug_tags,
            // tags,
            status,
            _id
        } = this.props.condition.editableData;
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
            <article className={cx('ClinicaldbCondition')}>
                <Helmet>
                    {this.props.create ? <title>{`임상정보[생성][진단]`}</title> : <title>{`임상정보[상세][진단] - ${name}`}</title>}
                </Helmet>
                {
                    !create && <>
                    <div className={cx('wrapper','wrapper--section')}>
                        <div className={cx('title')}>분류</div>
                        <div className={cx('content','readOnly')}>진단</div>
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
                    <div className={cx('title')}>진단명</div>
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
                <div className={cx('wrapper','wrapper--detail')}>
                    <div className={cx('title')}>질환설명</div>
                    <ul className={cx('content','detail')}>
                        {
                            this.props.condition.editableDetail.map((d, i) => {
                                const { description, ref_id, ref_content} = d;
                                return <li key={i}>
                                    <input 
                                        className={cx('')}
                                        autoComplete="off"
                                        data-index={i}
                                        onChange={this.handleChangeDetail}
                                        name="description"
                                        type="text" 
                                        value={description}
                                        placeholder="설명내용"
                                    />
                                    <input 
                                        className={cx('')}
                                        autoComplete="off"
                                        data-index={i}
                                        onChange={this.handleChangeDetail}
                                        name="ref_id"
                                        type="text" 
                                        value={ref_id}
                                    />
                                    <input 
                                        className={cx('')}
                                        autoComplete="off"
                                        data-index={i}
                                        onChange={this.handleChangeDetail}
                                        name="ref_content"
                                        type="text" 
                                        value={ref_content}
                                    />
                                    <div className={cx('button-delete')} onClick={() => {this.handleDeleteDetail(i)}}><TiMinus /></div>
                                </li>
                            })
                        }
                        <div className={cx('button-addup')} onClick={this.handleAddupDetail}><TiPlus /></div>
                    </ul>
                </div>
                {/* <div className={cx('wrapper')}>
                    <div className={cx('title')}>출전</div>
                    <input 
                        className={cx('content')}
                        autoComplete="off"
                        onChange={this.handleChange}
                        name="reference"
                        type="text" 
                        value={reference}
                    />
                </div> */}
                {/* <div className={cx('wrapper', 'wrapper--formula')}>
                    <div className={cx('title')}>처방구성</div>
                    <div className={cx('content', 'formula')}>
                        <div className={cx('formula-header')}>
                            <div>약초명</div>
                            <div>복용량(g/일)</div>
                        </div>
                        <ul>
                        {
                            this.props.condition.editableFormula.map((herb, i) => {
                                return <li key={i}>
                                    <input 
                                        className={cx('')}
                                        autoComplete="off"
                                        data-index={i}
                                        onChange={this.handleChangeFormula}
                                        name="herbName"
                                        type="text" 
                                        value={herb.herbName}
                                    />
                                    <input 
                                        className={cx('')}
                                        autoComplete="off"
                                        data-index={i}
                                        onChange={this.handleChangeFormula}
                                        name="dose"
                                        type="number" 
                                        value={herb.dose}
                                    />
                                    <div className={cx('button-delete')} onClick={() => {this.handleDelete(i)}}><TiMinus /></div>
                                </li>
                            })
                        }
                        </ul>
                        <div className={cx('button-addup')} onClick={this.handleAddup}><TiPlus /></div>
                    </div>
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>복용법</div>
                    <textarea 
                        name='guide'
                        rows={rows}
                        value={guide || ""}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>주의사항</div>
                    <textarea 
                        name='caution'
                        rows={rows}
                        value={caution || ""}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>처방설명</div>
                    <textarea 
                        name='description'
                        rows={rows}
                        value={description || ""}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>생활지도</div>
                    <textarea 
                        name='lifestyle'
                        rows={rows}
                        value={lifestyle || ""}
                        onChange={this.handleChange}
                    />
                </div> */}
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

export default ClinicaldbCondition;