import { action, observable } from 'mobx';

class SearchStore {
    @observable keyword = {
        searchPanel: '',
        clinicaldb: '',
        cases: ''
    };

    @action setKeyword({name, keyword}) {
        this.keyword[name] = keyword;
    }

    @action clearKeyword() {
        this.keyword = {
            searchPanel: '',
            clinicaldb: '',
            cases: ''
        };
    }
}

export default new SearchStore();