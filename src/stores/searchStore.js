import { action, observable } from 'mobx';

class SearchStore {
    @observable keyword = {
        clinicaldb: '',
        cases: ''
    };

    @action setKeyword({name, keyword}) {
        this.keyword[name] = keyword;
    }

    @action clearKeyword() {
        this.keyword = {
            clinicaldb: '',
            cases: ''
        };
    }
}

export default new SearchStore();