// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import init from "@/init";
import store from "@/store";
import router from "@/router";

import App from "@/App";
/* eslint-disable no-new */
const vm = new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: { App }
});
Vue.vm = vm;
Vue.logger.log("router:", router);
Vue.logger.log("browser", Vue.utils.browser());
store.dispatch("init").then(data => {
    if (!data.isLogin) {
        // vm.$router.push("/login");
        const path = window.location.pathname;
        if (path !== "" && path.indexOf("/login") === 0) {
            return;
        }
        if (path === "/") {
            return;
        }
        Vue.logger.log("user not login ", path);
        store.dispatch("redirectLogin", path);
    } else {
        Vue.logger.log("user logined");
    }
}).catch(error => {
    Vue.logger.error("dispatch init error", error);
});
window.Vue = Vue;
