import { observable, action, computed, reaction } from 'mobx';
import authStore from './authStore';
import userStore from './userStore';
import agent from '../utils/agent';

class LoginStore {
    @observable loggedIn = false;
    @observable isLoading = false;
    @observable inputValuesForLogin = {
        email: '',
        password: ''
    };
    @observable errors = null;
    @observable errorValues = {
        noIdValue: false,
        noPasswordValue: false,
        inputError: false
    };
    @observable rememberMe = window.localStorage.getItem('rememberMe');
    @observable rememberID = window.localStorage.getItem('rememberID');
    @observable maintainLoginState = window.localStorage.getItem('maintainLoginState');

    constructor() {
        this._initRememberMeID();

        reaction(
            () => this.rememberMe,
            rememberMe => {
                if (rememberMe) {
                    window.localStorage.setItem('rememberMe', rememberMe);
                } else {
                    window.localStorage.removeItem('rememberMe');
                }
            }
        );
        reaction(
            () => this.rememberID,
            rememberID => {
                if (rememberID) {
                    window.localStorage.setItem('rememberID', rememberID);
                } else {
                    window.localStorage.removeItem('rememberID');
                }
            }
        );
        reaction(
            () => this.maintainLoginState,
            maintainLoginState => {
                if (maintainLoginState) {
                    window.localStorage.setItem('maintainLoginState', maintainLoginState);
                } else {
                    window.localStorage.removeItem('maintainLoginState');
                }
            }
        );
    }
    
    @computed get isLoggedIn() {
        const token = window.localStorage.getItem('token') || null;
        if (token) {
            return true;
        }
        if (this.loggedIn) {
            return true;
        }
        return false;
    }

    _initRememberMeID() {
        if (this.rememberMe) {
            this.setRememberMeID(this.rememberMe);
        }
        if (this.maintainLoginState) {
            this.setMaintainLoginState(this.maintainLoginState)
        }
    }

    @action setRememberMeID(rememberMe) {
        this.rememberMe = rememberMe;
    }
    @action setMaintainLoginState(maintainLoginState) {
        this.maintainLoginState = maintainLoginState;
    }
    
    @action changeRememberMe() {
        if (this.rememberMe === 'true') {
            this.destroyRememberID();
            return this.rememberMe = 'false';
        }
        if (this.rememberMe === 'false') {
            return this.rememberMe = 'true';
        }
    }
    @action setRememberID(email) {
        if (this.rememberMe === 'true') {
            return this.rememberID = email;
        }
        if (this.rememberMe === 'false') {
            return this.destroyRememberID();
        }
    }
    @action changeMaintainLoginState() {
        if (this.maintainLoginState === 'true') {
            this.destroyMaintainLoginState();
            return this.maintainLoginState = 'false';
        }
        if (this.maintainLoginState === 'false') {
            return this.maintainLoginState = 'true';
        }
    }

    @action destroyRememberID() {
        this.rememberID = undefined;
    }
    @action destroyMaintainLoginState() {
        this.maintainLoginState = undefined;
    }

    @action changeInput(key, value) {
        this.inputValuesForLogin[key] = value;
        if (key === 'email') {
            if (value === '') {
                return this.errorValues.noIdValue = true;
            }
            this.errorValues.noIdValue = false;
        }
        if (key === 'password') {
            if (value === '') {
                return this.errorValues.noPasswordValue = true;
            }
            this.errorValues.noPasswordValue = false;
        }
    }

    @action errorHandle({email, password, input}) {
        if (email) {
            this.errorValues.noIdValue = true;
        }
        if (password) {
            this.errorValues.noPasswordValue = true;
        }
        if (input) {
            this.errorValues.inputError = false;
        }
    }

    @action login() {
        this.isLoading = true;
        const { email, password } = this.inputValuesForLogin;
        return agent.login({email, password, maintainLoginState: this.maintainLoginState === 'true'})
        .then(action((res) => {
            let { 
                token,
                refreshToken
            } = res.data;
            this.clearErrorValues();
            authStore.setTokenAndEmailAndUserTypeAndType(token, refreshToken, email, res.data.user.name, res.data.user.user_id);

            this.loggedIn = true;
            this.isLoading = false;
            return res.data;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            this.loggedIn = false;
            const { email, password } = err.data.errors || {};
            const { message } = err.data || {};

            if (email && !password) {
                this.errorValues.noIdValue = true;
                throw err;
            } 
            if (!email && password) {
                this.errorValues.noPasswordValue = true;
                throw err;
            } 
            if (email && password) {
                this.errorValues.noIdValue = true;
                this.errorValues.noPasswordValue = true;
                throw err;
            }
            if (message === "unregistered email" || message === "Incorrect password") {
                this.errorValues.inputError = true;
                throw err;
            }
        }));
    }

    @action setLoggedIn(status) {
        this.loggedIn = status;
    }

    _removeItem() {
        window.localStorage.removeItem('caseCounts');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('length');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user_id');
        window.localStorage.removeItem('username');
    }

    @action logout(type) {
        const THIS = this;
        return new Promise(function (resolve, reject) {
            if (type !== 'expiredRefreshToken') {
                const logoutOK = window.confirm('로그아웃 하시겠습니까?');
                if (logoutOK) {
                    THIS._removeItem()
                    THIS.setLoggedIn(false);
                    authStore.destroyTokenAndUuid();
                    userStore.clearUser();
                    return resolve({success: true});
                } else {return false}
            } else THIS._removeItem();
            THIS.setLoggedIn(false);
            authStore.destroyTokenAndUuid();
            userStore.clearUser();
            return resolve({success: true});
        });
    }

    @action clearInputValuesForLogin() {
        this.inputValuesForLogin = {
            email: '',
            password: ''
        };
    }

    @action clearErrorValues() {
        this.errorValues = {
            noIdValue: false,
            noPasswordValue: false,
            inputError: false
        }
    }
}

export default new LoginStore();