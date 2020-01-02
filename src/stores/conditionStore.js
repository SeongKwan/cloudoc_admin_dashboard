import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class ConditionStore {
    @observable isLoading = false;
    
    @observable registry = [];
    @observable optionCategories = [];
    
    @observable staticData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: 'condition',
        name: '',
        category: '',
        detail: [
            {description: '', ref_id: '', ref_content: ''}
        ],
        teaching: [
            {description: '', ref_id: '', ref_content: ''}
        ],
        pathology: [
            {level1: '', level2: '', level3: '', ref_id: '', ref_content: ''}
        ],
        linked_symptoms: [
            {name: '', cause: '', ref_id: '', ref_content: ''}
        ],
        linked_labs: [
            {name: '', state: '', cause: '', ref_id: '', ref_content: ''}
        ],
        linked_drugs: [
            {name: '', target_pathology: '', effect: '', ref_id: '', ref_content: ''}
        ],
        symptom_tags: [], // linked_symptoms.name, linked_labs.name, linked_drugs.name // DB 입력시 자동으로 추가되도록
        lab_tags: [],
        drug_tags: [],
        tags: [],
        status: true,
        _id: ''
    };
    @observable editableData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: 'condition',
        name: '',
        category: '',
        detail: [
            {description: '', ref_id: '', ref_content: ''}
        ],
        teaching: [
            {description: '', ref_id: '', ref_content: ''}
        ],
        pathology: [
            {level1: '', level2: '', level3: '', ref_id: '', ref_content: ''}
        ],
        linked_symptoms: [
            {name: '', cause: '', ref_id: '', ref_content: ''}
        ],
        linked_labs: [
            {name: '', state: '', cause: '', ref_id: '', ref_content: ''}
        ],
        linked_drugs: [
            {name: '', target_pathology: '', effect: '', ref_id: '', ref_content: ''}
        ],
        symptom_tags: [], // linked_symptoms.name, linked_labs.name, linked_drugs.name // DB 입력시 자동으로 추가되도록
        lab_tags: [],
        drug_tags: [],
        tags: [],
        status: true,
        _id: ''
    };
    @observable staticDetail = [];
    @observable editableDetail = [];

    @action setEditableData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_labs,
            linked_drugs,
            symptom_tags,
            lab_tags,
            drug_tags,
            tags,
            status,
        } = contents;

        
        this.editableData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_labs,
            linked_drugs,
            symptom_tags,
            lab_tags,
            drug_tags,
            tags,
            status,
        }

    }
    @action setStaticData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_labs,
            linked_drugs,
            symptom_tags,
            lab_tags,
            drug_tags,
            tags,
            status,
        } = contents;
        
        this.staticData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_labs,
            linked_drugs,
            symptom_tags,
            lab_tags,
            drug_tags,
            tags,
            status,
        };
    }

    @action setEditableDetail(detail) {
        this.editableDetail = detail;
    }
    @action setStaticDetail(detail) {
        this.staticDetail = detail;
    }

    @action handleChange(key, value) {
        this.editableData[key] = value;

        if (this.staticData[key] === value) {
            detailClinicaldbStore.isEditing = false;
        } else { detailClinicaldbStore.isEditing = true; }
    }

    @action handleChangeDetail(index, key, value) {
        this.editableDetail[index][key] = value;

        let staticDetailLength = this.staticDetail.length;
        let editableDetailLength = this.editableDetail.length;
        
        if ( staticDetailLength < editableDetailLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticDetailLength > editableDetailLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticDetailLength === editableDetailLength) {
            
            if (this.staticDetail[index][key] === value) {
                return detailClinicaldbStore.isEditing = false;
            } else { return detailClinicaldbStore.isEditing = true; }
        }
    }

    _prepareArray = (arr) => {
        return arr.map((elem) => {
            if (typeof elem === 'object' && elem !== null) {
                return JSON.stringify(elem);
            } else return elem;
        })
    }

    _compareArray = () => {
        let a, b;
        a = this._prepareArray(this.staticDetail);
        b = this._prepareArray(this.editableDetail);
        
        for (let i = 0; i<a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            } else { continue; } 
        }
        return true;
    }

    @action addDetail() {
        this.editableDetail = [...this.editableDetail, {
            description: '',
            ref_id: '',
            ref_content: ''
        }];
        let staticDetailLength = this.staticDetail.length;
        let editableDetailLength = this.editableDetail.length;
        if ( staticDetailLength === editableDetailLength) {
            if (this._compareArray()) {
                detailClinicaldbStore.isEditing = false;
            } else detailClinicaldbStore.isEditing = true;
        } else {
            detailClinicaldbStore.isEditing = true;
        }
        
    }

    @action deleteDetail(selectedIndex) {
        this.editableDetail.splice(selectedIndex, 1);
        if (this._compareArray()) {
            detailClinicaldbStore.isEditing = false;
        } else detailClinicaldbStore.isEditing = true;
    }

    @action loadConditions() {
        this.isLoading = true;
        return agent.loadConditions()
            .then(action((response) => {
                this.registry = response.data || [];
                this.isLoading = false;
                let array;
                array = _.sortBy(response.data, 'category');
                array = _.uniqBy(array, 'category');
                array.forEach((item, i) => {
                    this.optionCategories[i] = item.category;
                });
                return !!response;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    };

    @action createCondition() {
        const { currentUser } = userStore;
        this.isLoading = true;

        let newConditionData = {
            name: this.editableData.name,
            category: this.editableData.category,
            section: 'drug',
            description: this.editableData.description,
            reference: this.editableData.reference,
            caution: this.editableData.caution,
            guide: this.editableData.guide,
            lifestyle: this.editableData.lifestyle,
            user_id: currentUser.user_id || 'admin'
        };

        let formula = this.editableFormula;

        newConditionData = {...newConditionData, formula};

        return agent.createCondition(newConditionData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action updateCondition(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        let updatedData = {...this.editableData, formula: this.editableFormula}
        return agent.updateCondition(id, updatedData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteCondition(id) {
        this.isLoading = true;
        return agent.deleteCondition(id)
            .then(action((response) => {
                this.isLoading = false;
                return response;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action clearEditableData() {
        this.editableData = {
            user_id: '',
            created_date: '',
            updated_date: '',
            section: 'condition',
            name: '',
            category: '',
            detail: [
                {description: '', ref_id: '', ref_content: ''}
            ],
            teaching: [
                {description: '', ref_id: '', ref_content: ''}
            ],
            pathology: [
                {level1: '', level2: '', level3: '', ref_id: '', ref_content: ''}
            ],
            linked_symptoms: [
                {name: '', cause: '', ref_id: '', ref_content: ''}
            ],
            linked_labs: [
                {name: '', state: '', cause: '', ref_id: '', ref_content: ''}
            ],
            linked_drugs: [
                {name: '', target_pathology: '', effect: '', ref_id: '', ref_content: ''}
            ],
            symptom_tags: [], // linked_symptoms.name, linked_labs.name, linked_drugs.name // DB 입력시 자동으로 추가되도록
            lab_tags: [],
            drug_tags: [],
            tags: [],
            status: true,
            _id: ''
        }
    }
    @action clearStaticData() {
        this.staticData = {
            user_id: '',
            created_date: '',
            updated_date: '',
            section: 'condition',
            name: '',
            category: '',
            detail: [
                {description: '', ref_id: '', ref_content: ''}
            ],
            teaching: [
                {description: '', ref_id: '', ref_content: ''}
            ],
            pathology: [
                {level1: '', level2: '', level3: '', ref_id: '', ref_content: ''}
            ],
            linked_symptoms: [
                {name: '', cause: '', ref_id: '', ref_content: ''}
            ],
            linked_labs: [
                {name: '', state: '', cause: '', ref_id: '', ref_content: ''}
            ],
            linked_drugs: [
                {name: '', target_pathology: '', effect: '', ref_id: '', ref_content: ''}
            ],
            symptom_tags: [], // linked_symptoms.name, linked_labs.name, linked_drugs.name // DB 입력시 자동으로 추가되도록
            lab_tags: [],
            drug_tags: [],
            tags: [],
            status: true,
            _id: ''
        }
    }
    @action clearFormula() {
        this.editableFormula = [];
        this.staticFormula = [];
    }

}

export default new ConditionStore();