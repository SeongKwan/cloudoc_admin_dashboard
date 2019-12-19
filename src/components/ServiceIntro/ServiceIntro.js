import React, { Component } from 'react';
import styles from './ServiceIntro.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Jumbotron, Row, Col, Container } from 'react-bootstrap';

const cx = classNames.bind(styles);

class ServiceIntro extends Component {
  render() {
    return (
      <section className={cx('ServiceIntro')}>
        <Container fluid className={cx('container')}>
          <Jumbotron className={cx('jumbotron')}>
            <Row className={cx('top-wrapper')}>
              <Col>
                <h1>Right evidence, <br/>Better decisions</h1>
              </Col>
            </Row>
            <Row className={cx('bottom-wrapper')}>
              <Col className={cx('col')}>
                <Link className={cx('btn-login')} to='/login'>
                  Cloudoc 시작하기
                </Link>
              </Col>
            </Row>
          </Jumbotron>
        </Container>
      </section>
    );
  }
}

export default ServiceIntro;