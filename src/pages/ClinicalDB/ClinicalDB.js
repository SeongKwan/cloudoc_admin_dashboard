import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './ClinicalDB.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
import CountBoard from '../../components/CountBoard/CountBoard';
import DistributedBoard from '../../components/DistributedBoard/DistributedBoard';
import TableBoard from '../../components/TableBoard/TableBoard';

const cx = classNames.bind(styles);

@withRouter
@inject(
  'auth',
  'Case',
  'login',
  'user', 
  'clinicaldb'
)
@observer
class ClinicalDB extends Component {
  componentDidMount() {
    this.props.clinicaldb.loadClinicaldbs();
  }
  render() {
    const { 
      totalCounts, 
      distributedClinicaldbs, 
      isLoading,
      clinicaldbs
    } = this.props.clinicaldb;
    return (
      <LayoutWithSidebar>
        <div className={cx('ClinicalDB')}>
          <Helmet>
              <title>Cloudoc Admin - Clinical DB</title>
          </Helmet>
          <section className={cx('title')}>
            <h2>에디터 - 임상정보</h2>
            <h6>증례분석에 필요한 증상, 혈액검사, 체질/변증의 자료들 및 진단과 처방 그리고 참고문헌을 관리할 수 있습니다</h6>
          </section>
          <section className={cx('flexbox-content')}>
            <CountBoard isLoading={isLoading} title='전체 임상정보' counts={totalCounts} />
            <DistributedBoard isLoading={isLoading} total={totalCounts} data={distributedClinicaldbs}/>
            <TableBoard isLoading={isLoading} header={['고유번호', '구분', '임상정보명', '생성일시', '마지막 수정일시', '상태']} contents={clinicaldbs} />
          </section>
        </div>
      </LayoutWithSidebar>
    );
  }
}

export default ClinicalDB;