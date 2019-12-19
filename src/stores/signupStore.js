import { observable, action } from 'mobx';
import agent from '../utils/agent';

class SignupStore {
    @observable userInfo = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        inviteCode: ''
    };
    @observable errors = null;
    @observable errorValues = {
        noUsernameValue: false,
        noIdValue: false,
        noPasswordValue: false,
        noConfirmPasswordValue: false,
        noInviteCode: false,
        inValidEmail: false,
        inValidPassword: false,
        inValidConfirm: false,
        inValidInviteCode: false
    }

    @action changeInput(key, value) {
        this.userInfo[key] = value;
        if (key === 'name') {
            if (value === '') {
                return this.errorValues.noUsernameValue = true;
            }
            this.errorValues.noUsernameValue = false;
        }
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
            if (value.length >= 8) {
                this.errorValues.inValidPassword = false;
            } else if (value.length < 8) {
                this.errorValues.inValidPassword = true;
            }
            this.errorValues.noPasswordValue = false;
        }
        if (key === 'confirmPassword') {
            if (value === '') {
                return this.errorValues.noConfirmPasswordValue = true;
            }
            this.errorValues.noConfirmPasswordValue = false;
        }
        if (key === 'inviteCode') {
            if (value === '') {
                return this.errorValues.noInviteCode = true;
            }
            this.errorValues.noInviteCode = false;
        }
    }

    @action manageError(type) {
        if (type === 'name') return this.errorValues.noUsernameValue = true;
        if (type === 'email') return this.errorValues.noIdValue = true;
        if (type === 'password') return this.errorValues.noPasswordValue = true;
        if (type === 'inValidEmail') return this.errorValues.inValidEmail = true;
        if (type === 'inValidPassword') return this.errorValues.inValidPassword = true;
        if (type === 'inValidConfirm') return this.errorValues.inValidConfirm = true;
        if (type === 'inviteCode') return this.errorValues.noInviteCode = true;
        if (type === 'inValidInviteCode') return this.errorValues.inValidInviteCode = true;
    }

    @action signup() {
        return agent.signup(this.userInfo)
        .then((res) => {
            this.clearErrorValues();
            return res;
        })
        .catch(err => {
            throw err;
        })
    }

    @action signupCaseMaster() {
        return agent.signupCaseMaster(this.userInfo)
        .then((res) => {
            this.clearErrorValues();
            return res;
        })
        .catch((err) => {
            throw err;
        })
    }

    @action clear() {
        this.userInfo = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            inviteCode: ''
        };
    }

    @action clearValidation() {
        this.validated = false;
    }

    @action clearErrorValues() {
        this.errorValues = {
            noUsernameValue: false,
            noIdValue: false,
            noPasswordValue: false,
            noConfirmPasswordValue: false,
            noInviteCode: false,
            inValidEmail: false,
            inValidPassword: false,
            inValidConfirm: false,
            inValidInviteCode: false
        }
    }
}

export default new SignupStore();