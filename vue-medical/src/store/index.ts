import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    isMobile: false, // 移动端状态
    isCollapse: localStorage.getItem('isCollapse') === 'true' || false, // 垂直导航栏折叠状态
    isLoading: false, // 加载状态
    userInfo: JSON.parse(localStorage.getItem('userInfo')!)
  }),
  actions: {
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    setLoading(isLoading: boolean) { 
      this.isLoading = isLoading;
    },
    setUser(userInfo:object){
      Object.assign(this.userInfo, userInfo)
    }
  },
});