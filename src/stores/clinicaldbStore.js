import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
// import momentHelper from '../utils/momentHelper';
import searchStore from './searchStore';
import tableStore from './tableStore';
import Hangul from 'hangul-js';
import _ from 'lodash';

class ClinicaldbStore {
    @observable isLoading = false;
    @observable registry = [];

    @observable references = [];
    @observable infiniteStore = [];
    @observable searchedInfiniteStore = [];
    @observable currentPage = 1;
    @observable lastPage = 0;
    @observable lastPageForSearching = 0;
    @observable rest = 0;
    @observable restForSearch = 0;
    @observable loadMore = true;

    @computed get totalCounts() {
        return this.registry.length;
    }

    @computed get clinicaldbs() {
        const { keyword } = searchStore;
        let database = [];
        database = this._filter(tableStore.filter, this.registry);

        if (keyword['clinicaldb'].length > 0) {
            return database = this._search('', keyword['clinicaldb'], database) || [];
        } else {
            return database || [];
        }

    }

    @computed get distributedClinicaldbs() {
        let symptom, lab, condition, exam, drug, reference;
        symptom = this.registry.filter(clinical => clinical.section === 'symptom')
        lab = this.registry.filter(clinical => clinical.section === 'lab')
        condition = this.registry.filter(clinical => clinical.section === 'condition')
        exam = this.registry.filter(clinical => clinical.section === 'exam')
        drug = this.registry.filter(clinical => clinical.section === 'drug')
        reference = this.registry.filter(clinical => clinical.section === 'reference')
        
        return {symptom, lab, condition, exam, drug, reference};
    }

    @computed get referencesForSearchPanel() {
        // const { keyword } = searchStore;
        // let references = this.registry.filter(clinical => clinical.section === 'reference')
        let references = this.infiniteStore;

        // if (keyword['searchPanel'](.length > 0) {
        //     return references = this._search('searchPanel',keyword['searchPanel'], references) || [];
        // } else {
        // }
        return references || [];
    }

    @action clinicaldbsOnSearching() {
        const { keyword } = searchStore;

        let database = [];
        this.searchedInfiniteStore = [];
        database = this.references;
        database = this._search('searchPanel', keyword['searchPanel'], database);
        // database = this._filter(this.filterKeyword, database);
        database = _.sortBy(database, 'section', 'name')

        this.lastPageForSearching = Math.floor(database.length / 9) + 1;
        this.restForSearch = database.length%9;
        this.currentPage = 1;
        
        if (this.lastPageForSearching > 1) {
            this.loadMore = true
        } else {
            this.loadMore = false;
        }
        
        this.searchedInfiniteStore = database.slice(0, ((this.currentPage) * 9));
        this.registryForSearching = database;
        
        return database || [''];
    };
    
    @action loadClinicaldbs() {
        this.isLoading = true;
        return agent.loadClinicaldbs()
            .then(action((response) => {
                this.isLoading = false;
                this.registry = response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
            }))
    }

    @action loadReferences() {
        this.isLoading = true;
        agent.loadReferences()
            .then(action((response) => {
                this.isLoading = false;
                this.references = response.data;
                this.InitInfiniteStore(this.references);
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    };





    @action InitInfiniteStore() {
        let database = this.references;
        // database = this._filter(filterKeyword, this.registry);
        this.lastPage = Math.floor(database.length / 9) + 1;
        this.rest = database.length%9;
        this.currentPage = 1;
        this.loadMore = true;
        this.infiniteStore = [];
        this.infiniteStore = database.slice(0, ((this.currentPage) * 9));
    }

    @action addToInfiniteStore() {
        console.log('addToInfinite')
        let clinicaldbs = [];
        console.log(this.registry.length)
        clinicaldbs = this.references;
        // clinicaldbs = this._filter({reference: true}, this.registry);
        if ((this.currentPage + 1) < this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...clinicaldbs.slice(this.currentPage * 9, ((this.currentPage + 1) * 9))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...clinicaldbs.slice(this.currentPage * 9, ((this.currentPage) * 9 + this.rest))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPage) {
            return this.loadMore = false;
        }
    }

    @action addToSearchedStore() {
        let clinicaldbs = [];
        clinicaldbs = this._filter({reference: true}, this.registryForSearching);
        if ((this.currentPage + 1) < this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...clinicaldbs.slice(this.currentPage * 9, ((this.currentPage + 1) * 9))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...clinicaldbs.slice(this.currentPage * 9, ((this.currentPage) * 9 + this.restForSearch))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPageForSearching) {
            return this.loadMore = false;
        }
    }

    @action noLoadMore() {
        this.loadMore = false;
    }



    @action clearPage() {
        this.currentPage = 1;
        this.infiniteStore = [];
    }
    @action clearForSearch() {
        this.searchedInfiniteStore = [];
        this.registryForSearching = [];
        this.loadMore = true;
    }












    _filter = (filterBoolean, items) => {
        const { symptom, lab, condition, exam, drug, reference } = this.distributedClinicaldbs;

        let database = [];
        if (filterBoolean.symptom) database = database.concat(symptom);
        if (filterBoolean.lab) database = database.concat(lab);
        if (filterBoolean.condition) database = database.concat(condition);
        if (filterBoolean.exam) database = database.concat(exam);
        if (filterBoolean.drug) database = database.concat(drug);
        if (filterBoolean.reference) database = database.concat(reference);
        
        return database;
    }

    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
    _search = (type, searchKeyword, items) => {
        if (!searchKeyword) return [...items];
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return items.filter((item) => {
            return this._hasSearchKeywordInItem(type, searcher, item);
        });
    }

    _hasSearchKeywordInItem(type, searcher, item) {
        if (type === 'searchPanel') {
            return (
                this._hasSearchKeywordInProperty(searcher, item.name || '') 
                || this._hasSearchKeywordInProperty(searcher, item.author || '') 
                || this._hasSearchKeywordInProperty(searcher, item.year || '') 
                || this._hasSearchKeywordInProperty(searcher, item.publisher || '') 
                || this._hasSearchKeywordInProperty(searcher, item.category || '') 
                || this._hasSearchKeywordInProperty(searcher, item.description || '') 
            )
        }
        return (
                this._hasSearchKeywordInProperty(searcher, item._id || '') 
                || this._hasSearchKeywordInProperty(searcher, item.name || '') 
            ) ? true : false;
    }

    _hasSearchKeywordInProperty(searcher, property_string) {
        return searcher.search(property_string.toLowerCase()) >= 0 ? true : false;
    }

    translateSection(section) {
        let sectionKR;
        switch ( section ) {
            case 'symptom':
                sectionKR = '증상'
                break;
            case 'lab':
                sectionKR = '혈액검사'
                break;
            case 'condition':
                sectionKR = '진단'
                break;
            case 'exam':
                sectionKR = '체질/변증'
                break;
            case 'drug':
                sectionKR = '한약'
                break;
            case 'reference':
                sectionKR = '문헌'
                break;
            default:
                return '-'
            }
        return sectionKR;
    }
}
    
export default new ClinicaldbStore()