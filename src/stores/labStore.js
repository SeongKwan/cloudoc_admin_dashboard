import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class LabStore {
    @observable isLoading = false;
    
    @observable registry = [];
    @observable optionCategories = [];
    
    @observable staticData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        name: '',
        name_kor: '',
        category: '',
        sex: '',
        unit: '',
        refMin: '',
        optMin: '',
        optMax: '',
        refMax: '',
        alertMin: '',
        alertMax: '',
        description: '',
        alertMessage: '',
        status: true,
        _id: ''
    };
    @observable editableData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        name: '',
        name_kor: '',
        category: '',
        sex: '',
        unit: '',
        refMin: '',
        optMin: '',
        optMax: '',
        refMax: '',
        alertMin: '',
        alertMax: '',
        description: '',
        alertMessage: '',
        status: true,
        _id: ''
    }

    @action setEditableData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            name_kor,
            category,
            sex,
            unit,
            refMin,
            optMin,
            optMax,
            refMax,
            alertMin,
            alertMax,
            description,
            alertMessage,
            status,
            _id
        } = contents;

        
        this.editableData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            name_kor,
            category,
            sex,
            unit,
            refMin,
            optMin,
            optMax,
            refMax,
            alertMin,
            alertMax,
            description,
            alertMessage,
            status,
            _id
        }
    }
    @action setStaticData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            name_kor,
            category,
            sex,
            unit,
            refMin,
            optMin,
            optMax,
            refMax,
            alertMin,
            alertMax,
            description,
            alertMessage,
            status,
            _id
        } = contents;
        
        this.staticData = {
            user_id,
            created_date,
            updated_date,
            section,
            name,
            name_kor,
            category,
            sex,
            unit,
            refMin,
            optMin,
            optMax,
            refMax,
            alertMin,
            alertMax,
            description,
            alertMessage,
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

    @action loadLabs() {
        this.isLoading = true;
        return agent.loadLabs()
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

    @action createLab() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newLabData = {
            user_id: currentUser.user_id || 'admin',
            name: this.editableData.name,
            category: this.editableData.category,
            section: 'lab',
            description: this.editableData.description,
            unit: this.editableData.unit,
            sex: this.editableData.sex,
            refMin: this.editableData.refMin,
            refMax: this.editableData.refMax,
            optMin: this.editableData.optMin,
            optMax: this.editableData.optMax
        };

        return agent.createLab(newLabData)
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

    @action updateLab(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        
        return agent.updateLab(id, this.editableData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteLab(id) {
        this.isLoading = true;
        return agent.deleteLab(id)
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
            name_kor: '',
            category: '',
            sex: '',
            unit: '',
            refMin: '',
            optMin: '',
            optMax: '',
            refMax: '',
            alertMin: '',
            alertMax: '',
            description: '',
            alertMessage: '',
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
            name_kor: '',
            category: '',
            sex: '',
            unit: '',
            refMin: '',
            optMin: '',
            optMax: '',
            refMax: '',
            alertMin: '',
            alertMax: '',
            description: '',
            alertMessage: '',
            status: true,
            _id: ''
        }
    }

}

export default new LabStore();