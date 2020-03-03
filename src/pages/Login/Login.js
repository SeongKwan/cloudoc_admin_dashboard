import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Logo from '../../styles/img/logo_main.png';
import { FiMail, FiLock } from "react-icons/fi";


const cx = classNames.bind(styles);

@withRouter
@inject('user', 'login')
@observer
class Login extends Component {
  componentDidMount() {
    const { rememberMe, rememberID, maintainLoginState } = this.props.login;
    if ( rememberMe === null || rememberMe === undefined || rememberMe === '' ) {
      window.localStorage.setItem('rememberMe', 'false');
    }
    if (maintainLoginState === undefined || maintainLoginState === '' || maintainLoginState === null) {
      window.localStorage.setItem('maintainLoginState', 'false')
    }
    if (rememberMe === "true") {
      if (rememberID !== null && rememberID !== undefined && rememberID !== '') {
        return this.props.login.changeInput('email', rememberID);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  componentWillUnmount() {
    this.props.login.clearInputValuesForLogin();
    this.props.login.clearErrorValues();
  }
  _handleChange = (e) => {
    const { login } = this.props;
    this.props.login.changeInput(e.target.name, e.target.value);
    login.errorHandle({email: false, password: false, input: true});
  }
  _handleChangeRememberMe = () => {
    this.props.login.changeRememberMe();
  }
  _handleChangeMaintainLoginState = () => {
    this.props.login.changeMaintainLoginState();
  }

  _handleClick = (e) => {
    e.preventDefault();
    const { rememberMe } = this.props.login;
    const { email, password } = this.props.login.inputValuesForLogin;
    const { login } = this.props;
    if (email.length > 0 && password.length > 0) {
      return this.props.login.login()
      .then((res) => {
        if (rememberMe === 'true') {
          this.props.login.setRememberID(email);
        } else {
          this.props.login.setRememberID(undefined);
        }
        return this.props.history.replace('/clinicaldb');
      })
      .catch(err => {
      });
    } else if (email.length <= 0) {
      login.errorHandle({email: true, password: false});
    } else if (password.length <= 0) {
      login.errorHandle({email: false, password: true});
    } else {
      login.errorHandle({email: true, password: true});
    }
  }

  render() {
    const { email, password } = this.props.login.inputValuesForLogin;
    const { noIdValue, noPasswordValue, inputError } = this.props.login.errorValues;
    const { isLoading, maintainLoginState } = this.props.login;
    let error = noIdValue || noPasswordValue || inputError;
    let remember = this.props.login.rememberMe === 'true';

    return (
      <Layout>
        <section className={cx('Login')}>
          <Container fluid className={cx('container')}>
            <Row className={cx('row')}>
              <Col className={cx('col')} xs={12} sm={8} md={6} lg={5} xl={4}>
                <div className={cx('brand-logo')}>
                  <img src={Logo} alt="Brand Logo"/>
                  <p>Cloudoc Administrator</p>
                </div>
                  <Form className={cx('form-container')}>
                    <Form.Group controlId="form-basic-email">
                      <Form.Label className={cx('input-label')}>Email address</Form.Label>
                      <span className={cx('input-icon')}>
                        <FiMail />
                      </span>
                      <Form.Control 
                        as='input'
                        className={cx('input-form', {isLoading})} 
                        readOnly={isLoading} 
                        autoFocus={remember ? false : true} 
                        name='email' 
                        type="email" 
                        placeholder="이메일" 
                        value={email} 
                        onChange={this._handleChange}/>
                    </Form.Group>
                    <Form.Group className={cx('form-group', 'password')} controlId="form-basic-password">
                      <Form.Label className={cx('input-label')}>Password</Form.Label>
                      <span className={cx('input-icon')}>
                        <FiLock />
                      </span>
                      <Form.Control 
                        as='input'
                        className={cx('input-form', {isLoading})} 
                        readOnly={isLoading} 
                        autoFocus={remember ? true : false} 
                        type="password" 
                        name ='password' 
                        placeholder="비밀번호" 
                        value={password} 
                        onChange={this._handleChange}/>
                    </Form.Group>
                    <fieldset className={cx('remember')}>
                      <input 
                          onChange={this._handleChangeRememberMe}
                          id="rememberMe"
                          name="rememberme"
                          type="checkbox"
                          checked={remember} 
                          style={{marginRight: '0.4rem'}}
                      />
                      <label htmlFor="rememberMe">이메일 기억하기</label>
                    </fieldset>
                    <fieldset className={cx('maintainLoginState')}>
                      <input 
                          onChange={this._handleChangeMaintainLoginState}
                          id="maintainLoginState"
                          name="maintainLoginState"
                          type="checkbox"
                          checked={maintainLoginState === 'true'} 
                          style={{marginRight: '0.4rem'}}
                      />
                      <label htmlFor="maintainLoginState">로그인 유지하기</label>
                    </fieldset>
                    {
                      error && 
                      <div className={cx('container-error', {isLoading})}>
                        {
                          (noIdValue && noPasswordValue) && <p>이메일과 비밀번호를 입력해 주세요</p>
                        }
                        {
                          noIdValue && !noPasswordValue && <p>이메일을 입력해 주세요</p>
                        }
                        {
                          noPasswordValue && !noIdValue && <p>비밀번호를 입력해 주세요</p>
                        }
                        {
                          inputError && <p>이메일 또는 비밀번호를 확인하여 주세요</p>
                        }
                      </div>
                    }
                    {
                      !isLoading &&
                      <Button className={cx('login-button')} variant="primary" type="submit" onClick={this._handleClick}>
                        로그인
                      </Button>
                    }
                  </Form>
                  {
                    isLoading &&
                    <div className={cx('loading-container')}>
                      <div className={cx("spinner-grow")} role="status">
                        <span className={cx("sr-only")}>loading...</span>
                      </div>
                    </div>
                  }
              </Col>
            </Row>
          </Container>
        </section>
      </Layout>
    );
  }
}

export default Login;