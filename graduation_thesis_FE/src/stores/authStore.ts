import { ref } from 'vue';
import { defineStore } from 'pinia';
import authApi from '@/apis/authApi';
export const useAuthStore = defineStore('auth', () => {
    const loggedIn = ref(localStorage.getItem('token') != null);
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'));
    const userType = ref(localStorage.getItem('userType'));

    async function login(user: any) {
        let res = await authApi.login(user);
        if (res && res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));
            localStorage.setItem('userType', JSON.stringify(res.data.userType));
            userInfo.value = res.data.userInfo;
            loggedIn.value = true;
            userType.value = res.data.userType;
            return true;
        }
        return false;
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userType');
        loggedIn.value = false;
        userInfo.value = {};
        userType.value = null;
    }

    async function signUp(user: any) {
        let res = await authApi.signUp(user);
        return res;
    }

    function isFreelancer() {
        return userType.value?.toString() === '1';
    }

    function isClient() {
        return userType.value?.toString() === '0';
    }

    return {
        loggedIn,
        userInfo,
        login,
        logout,
        signUp,
        isFreelancer,
        isClient,
    };
});
