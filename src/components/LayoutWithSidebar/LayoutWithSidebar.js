import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styles from './LayoutWithSidebar.module.scss';
import classNames from 'classnames/bind';
import { NavLink, withRouter } from 'react-router-dom';
import LogoBlack from '../../styles/img/logo_main_bk.png';
import { FiUsers, FiFileText, FiHelpCircle, FiBook, FiInfo, FiUser, FiChevronDown, FiChevronUp, FiLogOut } from "react-icons/fi";

const cx = classNames.bind(styles);
const menus = [
  {title: '사용자', url: `/user`, icon: <FiUsers />},
  {title: '진단-처방전', url: `/editorCase`, icon: <FiFileText />},
  {title: '임상정보', url: `/clinicaldb`, icon: <FiBook />},
  {title: '컨설팅', url: `/user`, icon: <FiInfo />},
  {title: '문의내역', url: `/cs`, icon: <FiHelpCircle />},
];
let timer = null;
@withRouter
@inject(
  'auth',
  'Case',
  'login',
  'user', 
)
@observer
class LayoutWithSidebar extends Component {
  state = {
    openDropdown: false
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    
    timer = setInterval(() => {
      this.checkToken();
    }, 3600000)
  }
  
  componentWillUnmount() {
    clearInterval(timer);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  checkToken = () => {
    this.props.auth.validateToken();
  }

  handleClickOutside = (event) => {
      if (this.dropdown && !this.dropdown.contains(event.target)) {
          return this.setState({openDropdown: false});
      }
  }
  toggleDropdown = () => {
    this.setState({openDropdown: !this.state.openDropdown});
  }
  render() {
    const { children } = this.props;
    const category = this.props.location.pathname.split("/")[1];
    
    return (
      <div className={cx('LayoutWithSidebar')}>
        {/* <div className={cx('db-search-panel-container')}>
          
        </div> */}
        <div className={cx('sidebar-container')}>
          <div>
            <div className={cx('brand-logo')}>
              <img src={LogoBlack} alt={'brand logo black'}/>
              <p>Cloudoc Administrator</p>
            </div>
            <ul className={cx('list-menus')}>
              {menus.map((menu, i) => {
                const { title, url, icon } = menu;
                const active = category === url.split("/")[1];
                return <li key={i}>
                  <NavLink
                    className={cx({active})}
                    to={url}
                  >
                    {icon}
                    {title}
                    <span className={cx('vert-bar', {active})}></span>
                  </NavLink>
                </li>
              })}
            </ul>
          </div>
        </div>
        <main className={cx('main-container')}>
          <div 
            className={cx('dropdown-container')}
            ref={(ref) => {
              this.dropdown = ref;
            }}
          >
            <div 
              className={cx('dropdown-button')}
              onClick={this.toggleDropdown}
            >
              <span className={cx('icon', 'icon--user')}><FiUser /></span>
              <span>Dr.Kim</span>
              {!this.state.openDropdown ? <span className={cx('icon', 'icon--chevron-down')}><FiChevronDown /></span> : <span className={cx('icon', 'icon--chevron-up')}><FiChevronUp /></span>}
            </div>
            <ul className={cx('dropdown-content', {openDropdown: this.state.openDropdown})}>
              <li>
                <span className={cx('icon', 'icon--logout')}><FiLogOut /></span>
                <span>
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
              </li>
            </ul>
          </div>
          {children}
        </main>
      </div>
    );
  }
}

LayoutWithSidebar.propTypes = {
  children: PropTypes.object
}

export default LayoutWithSidebar;