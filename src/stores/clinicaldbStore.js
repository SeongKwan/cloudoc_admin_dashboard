import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
// import momentHelper from '../utils/momentHelper';
import searchStore from './searchStore';
import tableStore from './tableStore';
import Hangul from 'hangul-js';
// import _ from 'lodash';

class ClinicaldbStore {
    @observable isLoading = false;
    @observable registry = [];

    @computed get totalCounts() {
        return this.registry.length;
    }

    @computed get clinicaldbs() {
        const { keyword } = searchStore;
        let database = [];
        database = this._filter(tableStore.filter, this.registry);

        if (keyword['clinicaldb'].length > 0) {
            return database = this._search(keyword['clinicaldb'], database) || [];
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
    _search = (searchKeyword, items) => {
        if (!searchKeyword) return [...items];
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return items.filter((item) => {
            return this._hasSearchKeywordInItem(searcher, item);
        });
    }

    _hasSearchKeywordInItem(searcher, item) {
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