import auth from './authStore';
import Case from './caseStore';
import error from './errorStore';
import login from './loginStore';
import signup from './signupStore';
import user from './userStore';
import clinicaldb from './clinicaldbStore';
import table from './tableStore';
import search from './searchStore';

const stores = {
    auth,
    Case,
    error,
    login,
    signup,
    user,
    clinicaldb,
    table,
    search
}

export default stores;