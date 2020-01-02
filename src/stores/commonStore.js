import { observable, action } from 'mobx';

class CommonStore {
    @observable textareaSettings = {
        rows: 5,
        minRows: 5,
        maxRows: 10
    }

    @action adjustTextAreaSettings(e) {
        const textareaLineHeight = 24;
        const { minRows, maxRows } = this.textareaSettings;
        
        const previousRows = e.target.rows;
        e.target.rows = minRows; // reset number of rows in textarea 
        
        const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);
    
        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }
            
        if (currentRows >= maxRows) {
            e.target.rows = maxRows;
            e.target.scrollTop = e.target.scrollHeight;
        }

        this.textareaSettings.value = e.target.value;
        this.textareaSettings.rows = currentRows < maxRows ? currentRows : maxRows;
    }

    @action clearTextareaSettings() {
        this.textareaSettings = {
            rows: 5,
            minRows: 5,
            maxRows: 10
        }
    }
}

export default new CommonStore()