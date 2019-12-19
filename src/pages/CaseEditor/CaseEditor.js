import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
import useStores from '../../stores/useStores';
import { observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import classNames from 'classnames/bind';
import styles from './CaseEditor.module.scss';
import Loader from '../../components/Loader/Loader';

const cx = classNames.bind(styles);

const CaseEditor = observer(() => {
  const { history } = useReactRouter();
  const { login, Case } = useStores();

  useEffect(() => {
    Case.loadCases();
  }, [Case])

  return (
    <div className={cx('CaseEditor')}>
        <Helmet>
            <title>Case Editor</title>
        </Helmet>
        Case Editor Page
        <span>
          <button onClick={() => {Case.loadCases();}}>증례 불러오기</button>
          <button 
            className={cx('btn-logout')}
            onClick={() => {
              login.logout().then(async (res) => {if (res) history.go('/')});
            }}
          >
            로그아웃
          </button>
        </span>
        <div className={cx('wrapper-caselist')}>
          {
            Case.isLoading 
            ? <Loader /> 
            : <ul>
              {Case.registry.map((item, i) => {
                return <li key={i}>#{i} 증례</li>
              })}
            </ul>
          }
        </div>
      </div>
  );
});

export default CaseEditor;