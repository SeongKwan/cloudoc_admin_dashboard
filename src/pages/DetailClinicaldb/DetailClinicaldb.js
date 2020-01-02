import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './DetailClinicaldb.module.scss';
// import { Helmet } from "react-helmet";
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
import Components from '../../components/Clinicaldb';
const cx = classNames.bind(styles);

@withRouter
@inject('detailClinicaldb', 'clinicaldb', 'symptom')
@observer
class DetailClinicaldb extends Component {
    componentDidMount() {
        const { section, id } = this.props.match.params;
        this.props.detailClinicaldb.loadClinicaldb({section, id});   
        this.unblock = this.props.history.block((location, action) => {
            if (this.props.detailClinicaldb.isEditing) return '저장되지 않은 수정사항이 있습니다. 정말 떠나실건가요?';
        });
    }
    componentWillUnmount() {
        // 컴포넌트가 언마운트 되면, 그만 물음
        if (this.unblock) {
            this.unblock();
        }
        this.props.detailClinicaldb.clearCurrentClinicaldb();
        
    }

    render() {
        const { section } = this.props.match.params;
        const { currentClinicaldb, isLoading } = this.props.detailClinicaldb;
        let showComponent = currentClinicaldb.hasOwnProperty('_id')
        return (
            <LayoutWithSidebar>
                <div className={cx('DetailClinicaldb')}>
                    <section className={cx('title')}>
                        <h2>에디터 - 임상정보상세</h2>
                    </section>
                    <section className={cx('flexbox-content')}>
                        {showComponent && section === 'symptom' && <Components.Symptom isLoading={isLoading} contents={currentClinicaldb} />}
                        {showComponent && section === 'lab' && <Components.Lab isLoading={isLoading} contents={currentClinicaldb} />}
                        {showComponent && section === 'exam' && <Components.Exam isLoading={isLoading} contents={currentClinicaldb} />}
                        {showComponent && section === 'reference' && <Components.Reference isLoading={isLoading} contents={currentClinicaldb} />}
                        {showComponent && section === 'drug' && <Components.Drug isLoading={isLoading} contents={currentClinicaldb} />}
                        {showComponent && section === 'condition' && <Components.Condition isLoading={isLoading} contents={currentClinicaldb} />}
                    </section>
                </div>
            </LayoutWithSidebar>
        );
    }
}

export default DetailClinicaldb;