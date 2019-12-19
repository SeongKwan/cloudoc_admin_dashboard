import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './DistributedBoard.module.scss';
import Loader from '../Loader';

const cx = classNames.bind(styles);

@withRouter
@inject('clinicaldb')
@observer
class DistributedBoard extends Component {
    state = {
        symptom: false,
        lab: false,
        condition: false,
        exam: false,
        drug: false,
        reference: false,
        open: ''
    }
    getWidth = (elem) => {
        const { total } = this.props;
        if (!elem || !total) {
            return '-'
        }
        return String(((elem.length / total) * 100).toFixed(1)) + '%' || '-';
    }

    showPercentage = (type = '') => {
        if (type === 'symptom') this.setState({symptom: !this.state.symptom, open: 'symptom'});
        if (type === 'lab') this.setState({lab: !this.state.lab, open: 'lab'});
        if (type === 'condition') this.setState({condition: !this.state.condition, open: 'condition'});
        if (type === 'exam') this.setState({exam: !this.state.exam, open: 'exam'});
        if (type === 'drug') this.setState({drug: !this.state.drug, open: 'drug'});
        if (type === 'reference') this.setState({reference: !this.state.reference, open: 'reference'});
        if (type === '') this.setState({open: ''})
    }
    render() {
        const { data, isLoading } = this.props;
        const { symptom, lab, condition, exam, drug, reference } = data;
        const elements = [
            {qty: symptom.length, width: this.getWidth(symptom), title: 'symptom', titleKR: '증상'},
            {qty: lab.length, width: this.getWidth(lab), title: 'lab', titleKR: '혈액검사'},
            {qty: condition.length, width: this.getWidth(condition), title: 'condition', titleKR: '진단'},
            {qty: exam.length, width: this.getWidth(exam), title: 'exam', titleKR: '체질/변증'},
            {qty: drug.length, width: this.getWidth(drug), title: 'drug', titleKR: '한약'},
            {qty: reference.length, width: this.getWidth(reference), title: 'reference', titleKR: '문헌'}
        ];

        return (
            <div className={cx('DistributedBoard')}>
                {
                    !isLoading ?
                    <div className={cx('visual-bar')}>
                        {
                            elements.map((elem, i) => {
                                const { width, title, qty } = elem;
                                return <div 
                                    id={title} 
                                    key={i} 
                                    style={{width}} 
                                    className={cx(`${title}`, {active: this.state.open === title})} 
                                    onMouseEnter={() => {this.showPercentage(title)}} 
                                    onMouseLeave={() => {this.showPercentage()}}
                                >
                                    <span className={cx('popup-percentage', {open: this.state.open === title})}>
                                        <p>{width}</p>
                                        <p>( {qty} )</p>
                                    </span>
                                </div>
                            })
                        }
                    </div>
                    : <Loader />
                }
                <ul className={cx('axis-title')}>
                    {
                        elements.map((elem, i) => {
                            const { titleKR, title } = elem;
                            return <li 
                                className={cx(`${title}`, {active: this.state.open === title})}
                                key={i}
                                onMouseEnter={() => {this.showPercentage(title)}} 
                                onMouseLeave={() => {this.showPercentage()}}
                            >
                                <span className={cx(`${title}`)}>{titleKR}</span><span className={cx('color-box', `${title}`)}></span>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
};

export default DistributedBoard;