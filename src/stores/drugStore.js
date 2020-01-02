import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class DrugStore {
    @observable isLoading = false;
    
    @observable registry = [];
    @observable optionCategories = [];
    
    @observable staticData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        name: '',
        category: '',
        reference: '',
        formula: [{herbName: '', dose: 0}],
        guide: '',
        caution: '',
        description: '',
        lifestyle: '',
        status: true,
        _id: ''
    };
    @observable editableData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        name: '',
        category: '',
        reference: '',
        description: '',
        formula: [],
        caution: '',
        guide: '',
        lifestyle: '',
        status: true,
        _id: ''
    };
    @observable staticFormula = [];
    @observable editableFormula = [];

    @action setEditableData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            reference,
            description,
            formula,
            caution,
            guide,
            lifestyle,
            status,
            _id
        } = contents;

        
        this.editableData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            reference,
            description,
            formula,
            caution,
            guide,
            lifestyle,
            status,
            _id
        }

    }
    @action setEditableFormula(formula) {
        this.editableFormula = formula;
    }
    @action setStaticFormula(formula) {
        this.staticFormula = formula;
    }
    @action setStaticData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            reference,
            description,
            formula,
            caution,
            guide,
            lifestyle,
            status,
            _id
        } = contents;
        
        this.staticData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            category,
            reference,
            description,
            formula,
            caution,
            guide,
            lifestyle,
            status,
            _id
        };
    }

    @action handleChange(key, value) {
        this.editableData[key] = value;

        if (this.staticData[key] === value) {
            detailClinicaldbStore.isEditing = false;
        } else { detailClinicaldbStore.isEditing = true; }
    }

    @action handleChangeFormula(index, key, value) {
        this.editableFormula[index][key] = value;

        let staticFormulaLength = this.staticFormula.length;
        let editableFormulaLength = this.editableFormula.length;
        
        if ( staticFormulaLength < editableFormulaLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticFormulaLength > editableFormulaLength) {
            return detailClinicaldbStore.isEditing = true;
        }
        if ( staticFormulaLength === editableFormulaLength) {
            
            if (this.staticFormula[index][key] === value) {
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
        a = this._prepareArray(this.staticFormula);
        b = this._prepareArray(this.editableFormula);
        
        for (let i = 0; i<a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            } else { continue; } 
        }
        return true;
    }

    @action addHerb() {
        this.editableFormula = [...this.editableFormula, {
            herbName: '',
            dose: 0
        }];
        let staticFormulaLength = this.staticFormula.length;
        let editableFormulaLength = this.editableFormula.length;
        if ( staticFormulaLength === editableFormulaLength) {
            if (this._compareArray()) {
                detailClinicaldbStore.isEditing = false;
            } else detailClinicaldbStore.isEditing = true;
        } else {
            detailClinicaldbStore.isEditing = true;
        }
        
    }

    @action deleteHerb(selectedIndex) {
        this.editableFormula.splice(selectedIndex, 1);
        if (this._compareArray()) {
            detailClinicaldbStore.isEditing = false;
        } else detailClinicaldbStore.isEditing = true;
    }

    @action loadDrugs() {
        this.isLoading = true;
        return agent.loadDrugs()
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

    @action createDrug() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newDrugData = {
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

        newDrugData = {...newDrugData, formula};

        return agent.createDrug(newDrugData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action updateDrug(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        let updatedData = {...this.editableData, formula: this.editableFormula}
        return agent.updateDrug(id, updatedData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteDrug(id) {
        this.isLoading = true;
        return agent.deleteDrug(id)
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
            section: '',
            name: '',
            category: '',
            reference: '',
            description: '',
            formula: [],
            caution: '',
            guide: '',
            lifestyle: '',
            status: true,
            _id: ''
        }
    }
    @action clearStaticData() {
        this.staticData = {
            user_id: '',
            created_date: '',
            updated_date: '',
            section: '',
            name: '',
            category: '',
            reference: '',
            description: '',
            formula: [],
            caution: '',
            guide: '',
            lifestyle: '',
            status: true,
            _id: ''
        }
    }
    @action clearFormula() {
        this.editableFormula = [];
        this.staticFormula = [];
    }

}

export default new DrugStore();