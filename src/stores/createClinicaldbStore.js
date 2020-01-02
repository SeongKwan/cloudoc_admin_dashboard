import { observable, action } from 'mobx';
import agent from '../utils/agent';
import userStore from './userStore';
import symptomStore from './symptomStore';

class CreateClinicaldbStore {
    @observable isLoading = false;
    @observable currentSection = {
        symptom: false,
        lab: false,
        condition: false,
        exam: false,
        drug: false,
        reference: false
    }

    @action selectSection(section) {
        this.clearSection();
        this.currentSection[section] = !this.currentSection[section];
    }
    
    @action createSymptom() {
        const { currentUser } = userStore;
        this.isLoading = true;
        

        let newSymptomData = {
            name: symptomStore.editableData.name,
            category: symptomStore.editableData.category,
            section: 'symptom',
            description: symptomStore.editableData.description,
            user_id: currentUser.user_id || 'admin'
        };

        return agent.createSymptom(newSymptomData)
            .then(action((response) => {
                this.isLoading = false;
                console.log(response)
                return response;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }
    @action clearSection() {
        this.currentSection = {
            symptom: false,
            lab: false,
            condition: false,
            exam: false,
            drug: false,
            reference: false
        }
    }

}
    
export default new CreateClinicaldbStore()