import moment from 'moment';
import 'moment-timezone';


/**
 * 계산은 utc로 변형해서 한다.
 */

function toUnix(_datetime) {
    return moment(_datetime).unix()*1000;
}

function getLocaleFullDateWithTime(_datetime) {
    let d = new Date(_datetime);
    return moment(d).tz(moment.tz.guess()).format("YYYY/MM/DD HH:mm:ss")
}

export { toUnix, getLocaleFullDateWithTime }