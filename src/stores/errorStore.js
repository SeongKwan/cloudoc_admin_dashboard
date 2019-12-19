import { action } from 'mobx';
import loginStore from './loginStore';
import agent from '../utils/agent';

class ErrorStore {
    @action async authError(error) {
        const { type } = error;
        if (type === "refresh") {
            loginStore.logout('expiredRefreshToken');
            alert("로그인 시간이 만료되었습니다. 다시 로그인하여 주세요.")
            window.location.href = "http://localhost:3000";
        }
        if (type === "expired") {
            return agent.refreshToken()
            .then(action( async (response) => {
                    const { token } = response.data;
                    this.token = token;
                    await window.localStorage.setItem('token', token);
                    return token;
                }))
                .then((res) => {
                    window.location.reload(true);
                    return res;
                })
                .catch((error) => {
                    throw error
                })
        }
        if (type === "error") {
            loginStore.logout('expiredRefreshToken');
            window.location.href = "http://localhost:3000";
        }
    }
}

export default new ErrorStore();