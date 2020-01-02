import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class ReferenceStore {
    @observable isLoading = false;
    
    @observable registry = [];
    @observable optionCategories = [];
    
    @observable staticData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        reference_id: '',
        name: '',
        category: '',
        method: '',
        author: '',
        year: '',
        publisher: '',
        url: '',
        memo: '',
        description: '',
        methodDetail: '',
        status: true,
        _id: ''
    };
    @observable editableData = {
        user_id: '',
        created_date: '',
        updated_date: '',
        section: '',
        reference_id: '',
        name: '',
        category: '',
        method: '',
        author: '',
        year: '',
        publisher: '',
        url: '',
        memo: '',
        description: '',
        methodDetail: '',
        status: true,
        _id: ''
    }

    @action setEditableData(contents) {
        const {
            user_id,
            created_date,
            updated_date,
            section,
            reference_id,
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail,
            status,
            _id
        } = contents;

        
        this.editableData = {
            user_id,
            created_date,
            updated_date,
            section,
            reference_id,
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail,
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
            reference_id,
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail,
            status,
            _id
        } = contents;
        
        this.staticData = {
            user_id,
            created_date,
            updated_date,
            section,
            reference_id,
            name,
            category,
            method,
            author,
            year,
            publisher,
            url,
            memo,
            description,
            methodDetail,
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

    @action loadReferences() {
        this.isLoading = true;
        return agent.loadReferences()
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

    @action createReference() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newReferenceData = {
            name: this.editableData.name,
            category: this.editableData.category,
            section: 'reference',
            method: this.editableData.method,
            doi: this.editableData.doi,
            year: this.editableData.year,
            publisher: this.editableData.publisher,
            url: this.editableData.url,
            memo: this.editableData.memo,
            methodDetail: this.editableData.methodDetail,
            description: this.editableData.description,
            user_id: currentUser.user_id || 'admin'
        };

        return agent.createReference(newReferenceData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action updateReference(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        
        return agent.updateReference(id, this.editableData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteReference(id) {
        this.isLoading = true;
        return agent.deleteReference(id)
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
            reference_id: '',
            name: '',
            category: '',
            method: '',
            author: '',
            year: '',
            publisher: '',
            url: '',
            memo: '',
            description: '',
            methodDetail: '',
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
            reference_id: '',
            name: '',
            category: '',
            method: '',
            author: '',
            year: '',
            publisher: '',
            url: '',
            memo: '',
            description: '',
            methodDetail: '',
            status: true,
            _id: ''
        }
    }

}

export default new ReferenceStore();