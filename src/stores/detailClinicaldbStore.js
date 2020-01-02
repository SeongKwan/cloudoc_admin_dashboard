import { observable, action } from 'mobx';
import agent from '../utils/agent';

class DetailClinicaldbStore {
    @observable isLoading = false;
    @observable isEditing = false;

    @observable currentClinicaldb = {};
    
    @action loadClinicaldb({section, id}) {
        this.isLoading = true;
        return agent.loadClinicaldb({section, id})
            .then(action((response) => {
                this.isLoading = false;
                this.currentClinicaldb = response.data;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }))
    }

    @action clearCurrentClinicaldb() {
        this.currentClinicaldb = {};
    }

    @action clearIsEditing() {
        this.isEditing = false;
    }

}
    
export default new DetailClinicaldbStore()