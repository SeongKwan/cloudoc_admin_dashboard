import React, { Component } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link, NavLink } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import brandLogo from '../../styles/img/logo_main.png';

const cx = classNames.bind(styles);

class Header extends Component {

  render() {
    return (
      <Container className={cx('Header')}>
        <Navbar className={cx('navbar')}>
          <Navbar.Brand className={cx('brand')} as={Link} to='/'>
            <img
              className={cx('logo')}
              alt="Cloudoc Logo"
              src={brandLogo}
            />
            <div className={cx('title')}>Cloudoc</div>
          </Navbar.Brand>
          <div className={cx('navlinks-wrapper')}>
            <NavLink to='/login' className={cx('navlink', 'navlink--login')}>시작하기</NavLink>
            <NavLink to='/signup' className={cx('navlink', 'navlink--signup')}>가입</NavLink>
          </div>
        </Navbar>
      </Container>
    );
  }
}

export default Header;