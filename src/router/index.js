import Vue from "vue";
import store from "@/store";
import Router from "vue-router";
Vue.use(Router);

import { CacheKeys } from "@/conf/constants";

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/admin/home"
        },
        {
            path: "/login",
            component: resolve => require(["@/vankely/login.vue"], resolve)
        },
        {
            path: "/admin",
            component: resolve => require(["@/vankely/layout.vue"], resolve),
            children: [
                {
                    path: "home",
                    component: resolve =>
                        require([
                            "@/vankely/company_map/info_list/index.vue"
                        ], resolve)
                },
                {
                    path: "company_map",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "poi",
                            meta: "/admin/company_map/poi",
                            component: resolve =>
                                require([
                                    "@/vankely/company_map/POI/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list",
                            meta: "/admin/company_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/company_map/info_list/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_detail",
                            meta: "/admin/company_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/company_map/info_list/detail.vue"
                                ], resolve)
                        },
                        {
                            path: "report",
                            meta: "/admin/company_map/report",
                            component: resolve =>
                                require([
                                    "@/vankely/company_map/report/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "hotel_map",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "poi",
                            meta: "/admin/hotel_map/poi",
                            component: resolve =>
                                require([
                                    "@/vankely/hotel_map/POI/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list",
                            meta: "/admin/hotel_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/hotel_map/info_list/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_detail",
                            meta: "/admin/hotel_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/hotel_map/info_list/detail.vue"
                                ], resolve)
                        },
                        {
                            path: "report",
                            meta: "/admin/hotel_map/report",
                            component: resolve =>
                                require([
                                    "@/vankely/hotel_map/report/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "apartment_map",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "info_list",
                            meta: "/admin/apartment_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/apartment_map/info_list/index.vue"
                                ], resolve)
                        },
                        {
                            path: "poi",
                            meta: "/admin/apartment_map/poi",
                            component: resolve =>
                                require([
                                    "@/vankely/apartment_map/POI/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "parking_map",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "info_list",
                            meta: "/admin/parking_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/parking_map/info_list/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_detail",
                            meta: "/admin/parking_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/parking_map/info_list/detail.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_edit/:id",
                            meta: "/admin/parking_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/parking_map/info_list_add/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_add",
                            meta: "/admin/parking_map/info_list_add",
                            component: resolve =>
                                require([
                                    "@/vankely/parking_map/info_list_add/index.vue"
                                ], resolve)
                        },
                        {
                            path: "poi",
                            meta: "/admin/parking_map/poi",
                            component: resolve =>
                                require([
                                    "@/vankely/parking_map/POI/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "rent_map",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "info_list",
                            meta: "/admin/rent_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/rent_map/info_list/index.vue"
                                ], resolve)
                        },
                        {
                            path: "info_list_detail",
                            meta: "/admin/rent_map/info_list",
                            component: resolve =>
                                require([
                                    "@/vankely/rent_map/info_list/detail.vue"
                                ], resolve)
                        },
                        {
                            path: "report",
                            meta: "/admin/rent_map/report",
                            component: resolve =>
                                require([
                                    "@/vankely/rent_map/report/index.vue"
                                ], resolve)
                        },
                        {
                            path: "poi",
                            meta: "/admin/rent_map/poi",
                            component: resolve =>
                                require([
                                    "@/vankely/rent_map/POI/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "city_data",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "index",
                            meta: "/admin/city_data/index",
                            component: resolve =>
                                require([
                                    "@/vankely/city_data/index.vue"
                                ], resolve)
                        }
                    ]
                },
                {
                    path: "set",
                    component: resolve =>
                        require(["@/vankely/sub-layout.vue"], resolve),
                    children: [
                        {
                            path: "location",
                            meta: "/admin/set/location",
                            component: resolve =>
                                require(["@/vankely/set/location.vue"], resolve)
                        },
                        {
                            path: "user",
                            meta: "/admin/set/user",
                            component: resolve =>
                                require([
                                    "@/vankely/set/user/index.vue"
                                ], resolve)
                        },
                        {
                            path: "user_add",
                            component: resolve =>
                                require([
                                    "@/vankely/set/user/user_add.vue"
                                ], resolve)
                        }
                    ]
                }
            ]
        },
        {
            path: "/:params*",
            component: require("@/components/not_found.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    let isLogin = Vue.cache.cacheGet(CacheKeys.isLogin);
    if (store.state.inited) {
        isLogin = store.state.isLogin;
    }
    document.body.scrollTop = 0;
    Vue.logger.log("from to =>", from.path, to.path, isLogin);
    // 临时关闭验证
    // isLogin = true;
    if (isLogin) {
        if (to.path === "/login") {
            next("/admin/home");
        } else {
            Vue.logger.log("route from => to", from, to);
            next();
        }
    } else {
        // 判断是否登录，（可以通过接口，Vuex状态 token）
        // 没有登录走下面逻辑
        if (to.path !== "/login" && to.path !== "/users/password/reset") {
            const redirect = to.path;
            Vue.logger.log("redirect url:", redirect);
            // next("/login?redirect=" + redirect);
            store.dispatch("redirectLogin", redirect);
            next(false);
        } else {
            next();
        }
    }
});

export default router;
