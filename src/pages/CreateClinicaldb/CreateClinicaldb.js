import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateClinicaldb.module.scss';
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
import Components from '../../components/Clinicaldb';

const cx = classNames.bind(styles);

@withRouter
@inject('createClinicaldb')
@observer
class CreateClinicaldb extends Component {
    componentDidMount() {
        this.props.createClinicaldb.selectSection('symptom');
    }
    componentWillUnmount() {
        this.props.createClinicaldb.clearSection();
    }
    selectSection = (section) => {
        this.props.createClinicaldb.selectSection(section);
    }
    render() {
        const {
            symptom, lab, condition, exam, drug, reference
        } = this.props.createClinicaldb.currentSection;

        return (
            <LayoutWithSidebar>
                <div className={cx('CreateClinicaldb')}>
                    <Helmet>
                        <title>Cloudoc Admin - 임상정보 생성</title>
                    </Helmet>
                    <section className={cx('title')}>
                        <h2>에디터 - 임상정보 생성</h2>
                    </section>
                    <section className={cx('flexbox-content')}>
                        <div className={cx('section-filter-button')}>
                            <ul>
                                <li><button onClick={()=>{this.selectSection('symptom')}} className={cx({without: !symptom},'symptom')}>증상</button></li>
                                <li><button onClick={()=>{this.selectSection('lab')}} className={cx({without: !lab},'lab')}>혈검</button></li>
                                <li><button onClick={()=>{this.selectSection('condition')}} className={cx({without: !condition},'condition')}>진단</button></li>
                                <li><button onClick={()=>{this.selectSection('exam')}} className={cx({without: !exam},'exam')}>체질</button></li>
                                <li><button onClick={()=>{this.selectSection('drug')}} className={cx({without: !drug},'drug')}>한약</button></li>
                                <li><button onClick={()=>{this.selectSection('reference')}} className={cx({without: !reference},'reference')}>문헌</button></li>
                            </ul>
                        </div>
                        { symptom && <Components.Symptom create /> }
                        { lab && <Components.Lab create /> }
                        { exam && <Components.Exam create /> }
                        { reference && <Components.Reference create /> }
                        { drug && <Components.Drug create /> }
                        { condition && <Components.Condition create /> }
                    </section>
                </div>
            </LayoutWithSidebar>
        );
    }
}

export default CreateClinicaldb;