import { observable, action } from 'mobx';
import agent from '../utils/agent';
import _ from 'lodash';
import userStore from './userStore';
import detailClinicaldbStore from './detailClinicaldbStore';

class ExamStore {
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
        description: '',
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
        description: '',
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
            updated_date,
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

    @action loadExams() {
        this.isLoading = true;
        return agent.loadExams()
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

    @action createExam() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newExamData = {
            name: this.editableData.name,
            category: this.editableData.category,
            section: 'exam',
            description: this.editableData.description,
            user_id: currentUser.user_id || 'admin'
        };

        return agent.createExam(newExamData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action updateExam(id) {
        this.isLoading = true;
        this.editableData.updated_date = parseInt((new Date().getTime()).toFixed(0));
        
        return agent.updateExam(id, this.editableData)
            .then(action((response) => {
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteExam(id) {
        this.isLoading = true;
        return agent.deleteExam(id)
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
            description: '',
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
            description: '',
            status: true,
            _id: ''
        }
    }

}

export default new ExamStore();