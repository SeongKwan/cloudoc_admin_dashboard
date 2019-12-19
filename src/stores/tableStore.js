import { observable, action, computed } from 'mobx';

class TableStore {
    @observable isLoading = false;

    // Search Bar

    // Filter Button
    @observable filter = {
        symptom: true,
        lab: true,
        condition: true,
        exam: true,
        drug: true,
        reference: true
    }

    // Pagination
    @observable currentPage = 1;
    @observable lastPage = null;
    @observable originalContents = [];
    @observable upperLimit = 0;
    @observable rowSize = 10;
    @observable pages = [];
    @observable startPage = null;
    @observable endPage = null;
    @observable startIndex = null;
    @observable endIndex = null;

    @computed get paginatedContents() {
        const { rowSize, originalContents, upperLimit } = this;
        let dataSlice = originalContents.slice((upperLimit - rowSize), upperLimit);
        
        return dataSlice;
    }

    @computed get filterArray() {
        const { symptom, lab, condition, exam, drug, reference } = this.filter;
        let arr = [];
        arr = arr.concat(symptom, lab, condition, exam, drug, reference);
        return arr;
    }

    @action toggleFilter(type) {
        let counter = this.filterArray.filter((item) => {
            return item === true;
        });
        
        if (counter.length > 1) {
            return this.filter[type] = !this.filter[type];
        } else if (counter.length === 1) {
            if (this.filter[type]) {this.clearFilter();}
            else {this.filter[type] = !this.filter[type];}
        }
    }
    
    @action setPage(page, contents = this.originalContents) {
        const { rowSize } = this;
        this.originalContents = contents;
        this.upperLimit = page * rowSize;
        this.lastPage = Math.ceil(this.originalContents.length / rowSize);
        this.pager = this.getPager(this.originalContents.length, page, rowSize);
    }

    @action getPager(totalItems, currentPage, rowSize) {
        this.currentPage = currentPage || 1;
        let totalPages = this.lastPage;

        if (totalPages <= 10) {
            // less than 10 total pages so show all
            this.startPage = 1;
            this.endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                this.startPage = 1;
                this.endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                this.startPage = totalPages - 9;
                this.endPage = totalPages;
            } else {
                this.startPage = currentPage - 5;
                this.endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        this.startIndex = (currentPage - 1) * rowSize;
        this.endIndex = Math.min(this.startIndex + rowSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        this.pages = [...Array((this.endPage + 1) - this.startPage).keys()].map(i => this.startPage + i);
    }

    @action clearFilter() {
        this.filter = {
            symptom: true,
            lab: true,
            condition: true,
            exam: true,
            drug: true,
            reference: true
        }
    }

}
    
export default new TableStore()