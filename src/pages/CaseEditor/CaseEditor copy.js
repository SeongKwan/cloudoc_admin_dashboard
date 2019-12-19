import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CaseEditor.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";
import Loader from '../../components/Loader/Loader';

const cx = classNames.bind(styles);

@withRouter
@inject(
  'auth',
  'Case',
  'login',
  'user', 
)
@observer
class CaseEditor extends Component {
  componentDidMount() {
    this._loadCases();
  }

  _loadCases = () => {
    this.props.Case.loadCases();
  }

  render() {
    const cases = this.props.Case.registry || [];
    const { isLoading } = this.props.caseStore;

    return (
      <div className={cx('CaseEditor')}>
        <Helmet>
            <title>Case Editor</title>
        </Helmet>
        Case Editor Page
        <span>
          <button onClick={this._loadCases}>증례 불러오기</button>
          <button 
            className={cx('btn-logout')}
            onClick={() => {
              this.props.login.logout()
              .then(async (res) => {
                if (res) {
                  this.props.history.go('/')
                }
              })
            }}
          >
            로그아웃
          </button>
        </span>
        <div className={cx('wrapper-caselist')}>
          {
            isLoading 
            ? <Loader /> 
            : <ul>
              {cases.map((item, i) => {
                return <li key={i}>#{i} 증례</li>
              })}
            </ul>
          }
        </div>
      </div>
    );
  }
}

export default CaseEditor;