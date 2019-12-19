import { observable, action } from 'mobx';
import agent from '../utils/agent';
import momentHelper from '../utils/momentHelper';

class CaseStore {
    @observable isLoading = false;
    @observable registry = [];
    
    @action loadCases() {
        this.isLoading = true;
        return agent.loadCases()
                .then(action((response) => {
                    this.isLoading = false;
                    this.registry = response.data.cases;
                    this.registry = this.registry.sort(function (a, b) { 
                        let unixA = momentHelper.toUnix(a.created_date);
                        let unixB = momentHelper.toUnix(b.created_date);
                        return unixA > unixB ? -1 : unixA < unixB ? 1 : 0;
                    });
                }))
                .catch(error => {
                    
                });
    }

}
    
export default new CaseStore()