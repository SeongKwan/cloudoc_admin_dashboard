import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class SymptomStore {
    @observable isLoading = false;
    
    @observable registry = [];
    @observable optionCategories = [];
    
    @observable staticData = {
        user_id: '',
        created_date: '',
        section: '',
        name: '',
        category: '',
        description: '',
        // unit: '',
        updated_date: '',
        status: true,
        _id: ''
    };
    @observable editableData = {
        user_id: '',
        created_date: '',
        section: '',
        name: '',
        category: '',
        description: '',
        // unit: '',
        updated_date: '',
        status: true,
        _id: ''
    }

    @action setEditableData(contents) {
        const {
            user_id,
            created_date,
            section,
            name,
            category,
            description,
            // unit,
            updated_date,
            status,
            _id
        } = contents;

        
        this.editableData = {
            user_id,
            created_date,
            section,
            name,
            category,
            description,
            // unit,
            updated_date,
            status,
            _id
        }
    }
    @action setStaticData(contents) {
        const {
            user_id,
            created_date,
            section,
            name,
            category,
            description,
            // unit,
            updated_date,
            status,
            _id
        } = contents;
        
        this.staticData = {
            user_id,
            created_date,
            section,
            name,
            category,
            description,
            // unit,
            updated_date,
            status,
            _id
        };
    }

    @action handleChange(key, value) {
        this.editableData[key] = value;
        console.log(this.staticData[key], value)
        if (this.staticData[key] === value) {
            detailClinicaldbStore.isEditing = false;
        } else { detailClinicaldbStore.isEditing = true; }
    }

    @action loadSymptoms() {
        this.isLoading = true;
        return agent.loadSymptoms()
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

    @action createSymptom() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newSymptomData = {
            name: this.editableData.name,
            category: this.editableData.category,
            section: 'symptom',
            description: this.editableData.description,
            user_id: currentUser.user_id || 'admin'
        };

        return agent.createSymptom(newSymptomData)
            .then(action((response) => {
                this.isLoading = false;
                console.log(response.data)
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action updateSymptom(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        
        return agent.updateSymptom(id, this.editableData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteSymptom(id) {
        this.isLoading = true;
        return agent.deleteSymptom(id)
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
            section: '',
            name: '',
            category: '',
            description: '',
            // unit: '',
            updated_date: '',
            status: true,
            _id: ''
        }
    }
    @action clearStaticData() {
        this.staticData = {
            user_id: '',
            created_date: '',
            section: '',
            name: '',
            category: '',
            description: '',
            // unit: '',
            updated_date: '',
            status: true,
            _id: ''
        }
    }

}

export default new SymptomStore();