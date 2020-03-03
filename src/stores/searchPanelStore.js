import { action, observable } from 'mobx';

class SearchPanelStore {
    @observable currentListContents = {};
    @observable openListPanel = false;
    @observable openListItemPanel = false;
    @observable currentIndex = null;
    @observable currentDataType = '';

    @action setCurrentListContents(contents) {
        this.currentListContents = contents;
    }
    @action toggleListPanel() {
        this.openListPanel = !this.openListPanel;
    }
    @action togglePanel() {
        this.openListItemPanel = !this.openListItemPanel;
    }
    @action setCurrentIndex(index) {
        this.currentIndex = index;
    }
    @action setCurrentDataType(type) {
        this.currentDataType = type;
    }

    @action clear() {
        this.currentListContents = {};
        this.openListPanel = false;
        this.openListItemPanel = false;
        this.currentIndex = null;
        this.currentDataType = ''
    }
}

export default new SearchPanelStore();