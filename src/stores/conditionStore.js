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
    @observable staticTeaching = [];
    @observable editableTeaching = [];
    @observable staticPathology = [];
    @observable editablePathology = [];
    @observable staticSymptoms = [];
    @observable editableSymptoms = [];
    @observable staticLabs = [];
    @observable editableLabs = [];
    @observable staticDrugs = [];
    @observable editableDrugs = [];

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

    @action setEditableTeaching(teaching) {
        this.editableTeaching = teaching;
    }
    @action setStaticTeaching(teaching) {
        this.staticTeaching = teaching;
    }

    @action setEditablePathology(pathology) {
        this.editablePathology = pathology;
    }
    @action setStaticPathology(pathology) {
        this.staticPathology = pathology;
    }
    @action setEditableSymptoms(symptoms) {
        this.editableSymptoms = symptoms;
    }
    @action setStaticSymptoms(symptoms) {
        this.staticSymptoms = symptoms;
    }
    @action setEditableLabs(labs) {
        this.editableLabs = labs;
    }
    @action setStaticLabs(labs) {
        this.staticLabs = labs;
    }
    @action setEditableDrugs(drugs) {
        this.editableDrugs = drugs;
    }
    @action setStaticDrugs(drugs) {
        this.staticDrugs = drugs;
    }

    @action handleChange(key, value) {
        this.editableData[key] = value;

        if (this.staticData[key] === value) {
            detailClinicaldbStore.isEditing = false;
        } else { detailClinicaldbStore.isEditing = true; }
    }

    @action handleChangeFunction(type, index, key, value) {
        
        let editableDataType = `editable${type}`;
        let staticsDataType = `static${type}`;
        let editable = this[editableDataType];
        let statics = this[staticsDataType];

        editable[+index][key] = value;
        // this.editableDetail[+index][key] = value;

        let staticLength = statics.length;
        let editableLength = editable.length;
        
        if ( staticLength < editableLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticLength > editableLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticLength === editableLength) {
            
            if (statics[index][key] === value) {
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

    @action addTeaching() {
        this.editableTeaching = [...this.editableTeaching, {
            description: '',
            ref_id: '',
            ref_content: ''
        }];
        let staticTeachingLength = this.staticTeaching.length;
        let editableTeachingLength = this.editableTeaching.length;
        if ( staticTeachingLength === editableTeachingLength) {
            if (this._compareArray()) {
                detailClinicaldbStore.isEditing = false;
            } else detailClinicaldbStore.isEditing = true;
        } else {
            detailClinicaldbStore.isEditing = true;
        }
    }

    @action addPathology() {
        this.editablePathology = [...this.editablePathology, {
            level1: '',
            level2: '',
            level3: '',
            ref_id: '',
            ref_content: ''
        }];
        let staticPathologyLength = this.staticPathology.length;
        let editablePathologyLength = this.editablePathology.length;
        if ( staticPathologyLength === editablePathologyLength) {
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

    @action deleteTeaching(selectedIndex) {
        this.editableTeaching.splice(selectedIndex, 1);
        if (this._compareArray()) {
            detailClinicaldbStore.isEditing = false;
        } else detailClinicaldbStore.isEditing = true;
    }
    @action deletePathology(selectedIndex) {
        this.editablePathology.splice(selectedIndex, 1);
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
    @action clearData() {
        this.staticDetail = [];
        this.editableDetail = [];
        this.staticTeaching = [];
        this.editableTeaching = [];
        this.staticPathology = [];
        this.editablePathology = [];
        this.staticSymptoms = [];
        this.editableSymptoms = [];
        this.staticLabs = [];
        this.editableLabs = [];
        this.staticDrugs = [];
        this.editableDrugs = [];
    }

}

export default new ConditionStore();