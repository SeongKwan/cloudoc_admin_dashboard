import moment from 'moment';

import 'moment-timezone';

/**
 * 계산은 utc로 변형해서 한다.
 */

class MomentHelper {
    constructor() {
        this.moment = moment();
        this.timezone = moment.tz.guess();
    }

    toUnix = (_datetime) => {
        return this.moment(_datetime).unix()*1000;
    }

    getLocaleDatetime = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("MM/DD HH:mm")
    }
    
    getLocaleHourMinute = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("HH:mm")
    }

    getLocaleDateWithMM = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("MM/DD")
    }

    getLocaleDateWithYY = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("YY/MM/DD")
    }

    getLocaleDateWithYYYY = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("YYYY/MM/DD")
    }

    getLocaleFullDateWithTime = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("YYYY/MM/DD HH:mm:ss")
    }

    calculateDueDateFromToday = (_datetime) => {
        const utcNowDate = this.moment.utc().toDate().toUTCString();
        const utcNow = this.moment(utcNowDate);
        const expirationDate = this.moment(_datetime);
        let restDays = this.moment.duration(expirationDate - utcNow).asDays();
        restDays = restDays.toString().split('.')[0];
        if (restDays.indexOf('-') !== -1) {
            return 0;
        } else {
            return restDays;
        }
    }
}

const momentHelper = new MomentHelper();

console.log(momentHelper.getLocaleDateWithYYYY(new Date()));

export default momentHelper;