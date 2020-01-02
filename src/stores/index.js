import auth from './authStore';
import common from './commonStore';
import Case from './caseStore';
import error from './errorStore';
import login from './loginStore';
import signup from './signupStore';
import user from './userStore';
import clinicaldb from './clinicaldbStore';
import detailClinicaldb from './detailClinicaldbStore';
import table from './tableStore';
import search from './searchStore';
import symptom from './symptomStore';
import lab from './labStore';
import exam from './examStore';
import reference from './referenceStore';
import drug from './drugStore';
import condition from './conditionStore';
import createClinicaldb from './createClinicaldbStore';

const stores = {
    auth,
    common,
    Case,
    error,
    login,
    signup,
    user,
    clinicaldb,
    detailClinicaldb,
    createClinicaldb,
    table,
    search,
    symptom,
    lab,
    exam,
    reference,
    drug,
    condition
}

export default stores;