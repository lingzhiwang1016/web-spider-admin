/**
 * Created by lijinchao(joshua) on 17/3/16.
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import * as types from "@/store/mutation-types";
import api from "@/conf/api";
import { CacheKeys } from "@/conf/constants";
import menus from "@/conf/menus";

import rentalMapModule from "./modules/rentalMap";

const debug = process.env.NODE_ENV !== "production";

const traversalMenu = (menuDatas, parent, callback) => {
    const newMenus = [];
    for (let i = 0; i < menuDatas.length; i++) {
        const menu = { ...menuDatas[i] };
        if (menu.hasChild) {
            menu.children = traversalMenu(menu.children || [], menu, callback);
        }
        if (callback(menu, parent)) {
            newMenus.push(menu);
        }
    }
    return newMenus;
};

const isPermitted = (permissions, menuCode, action) => {
    return true;
    // // 没有配置的是不需要检验的
    // if (!menuCode) {
    //     return true;
    // }
    // // 未登录的时候可能为空
    // if (!permissions) {
    //     return false;
    // }
    // const filterPermissions = permissions.filter((p) => {
    //     if (!action) {
    //         return p.menuCode === menuCode;
    //     } else {
    //         return p.menuCode === menuCode && p.permission === action;
    //     }
    // });
    // return filterPermissions.length > 0;
};

export default new Vuex.Store({
    state: {
        inited: false,

        isLogin: false,
        loginUser: {},
        //市
        city: "",
        //省
        province: "",
        month: {
            startMonth: "",
            endMonth: ""
        },

        fullscreenLoading: false,
        fullscreenLoadingContent: ""
    },
    getters: {
        layoutMenus: state => {
            if (!state.isLogin) {
                return [];
            }
            const permissionList = state.loginUser.permissionList;
            // Vue.logger.log("layoutMenus menus", menus);
            Vue.logger.log("layoutMenus permissionList", permissionList);
            const newDatas = traversalMenu(menus, "", (item, parent) => {
                // Vue.logger.log("layoutMenus item", item, parent);
                item.hidden = !isPermitted(
                    permissionList,
                    item.menuCode,
                    "read"
                );
                if (item.hasChild && item.children.length === 0) {
                    item.hidden = true;
                }
                return !item.isHide && !item.hidden;
            });
            Vue.logger.log("layoutMenus newDatas", newDatas);
            return newDatas;
        }
    },
    mutations: {
        [types.init](state, payload) {
            state.isLogin = payload.isLogin;
            state.loginUser = payload.loginUser;
            state.inited = true;
        },
        [types.loginSuccess](state, payload) {
            state.isLogin = true;
            state.loginUser = payload.loginUser;
        },
        [types.logoutSuccess](state, payload) {
            state.isLogin = false;
            state.loginUser = {};
        },
        [types.fullscreenLoading](state, { fullscreenLoading, content }) {
            if (fullscreenLoading) {
                state.fullscreenLoading = true;
                state.fullscreenLoadingContent = content;
            } else {
                state.fullscreenLoading = false;
            }
        },
        [types.city](state, content) {
            state.city = content;
        },
        [types.province](state, content) {
            state.province = content;
        },
        [types.month](state, content) {
            state.month = content;
        }
    },
    actions: {
        async init({ dispatch, commit }, obj) {
            let data = {
                isLogin: false,
                loginUser: {}
            };
            try {
                data = {
                    isLogin: Vue.cache.cacheGet(CacheKeys.isLogin),
                    loginUser: Vue.cache.cacheGet(CacheKeys.loginUser)
                };
            } catch (err) {
                Vue.logger.warn("init", err);
            }
            try {
                if (data.isLogin) {
                    const user = await Vue.request({
                        url: api.sysUser_getCurrentUser,
                        method: "get"
                    });
                    Vue.logger.log("init user info", user.data);
                    data.loginUser = user.data;
                    Vue.cache.cacheSet(
                        CacheKeys.isLogin,
                        true,
                        24 * 3600 * 1000
                    );
                    Vue.cache.cacheSet(
                        CacheKeys.loginUser,
                        user.data,
                        24 * 3600 * 1000
                    );
                }
            } catch (err) {
                Vue.logger.warn("init with net", err);
                Vue.cache.cacheRemove(CacheKeys.isLogin);
                Vue.cache.cacheRemove(CacheKeys.loginUser);
                data = {
                    isLogin: false,
                    loginUser: {}
                };
            }
            commit({
                type: types.init,
                ...data
            });
            return data;
        },
        async redirectLogin({ dispatch, commit }, path) {
            Vue.logger.log("redirectLogin", path);
            const redirect = encodeURIComponent(path);
            // Vue.router.push("login?redirect=" + path);
            Vue.router.push({
                path: "/login",
                query: {
                    redirect: redirect
                }
            });
        },
        async login({ dispatch, commit }, obj) {
            Vue.logger.log("login action", obj, api.login);
            let res;
            try {
                res = await Vue.request({
                    url: api.login,
                    method: "post",
                    data: obj
                });
            } catch (err) {
                // commit("closeLoading");
                throw err;
            }
            Vue.logger.log("store login res:", JSON.stringify(res));
            Vue.cache.cacheSet(CacheKeys.isLogin, true, 24 * 3600 * 1000);
            Vue.cache.cacheSet(CacheKeys.loginUser, res.data, 24 * 3600 * 1000);
            commit({
                type: types.loginSuccess,
                loginUser: res.data
            });
            // commit("closeLoading");
            const redirect = obj.redirect;
            if (redirect) {
                Vue.router.replace(redirect);
            } else {
                Vue.router.push("/admin/home");
            }
            return res;
        },
        async clearLogin({ dispatch, commit }, obj) {
            Vue.logger.log("clearLogin action:", obj);
            Vue.cache.cacheRemove(CacheKeys.isLogin);
            Vue.cache.cacheRemove(CacheKeys.loginUser);
            commit({
                type: types.logoutSuccess
            });
        },
        async logout({ dispatch, commit }, obj) {
            Vue.logger.log("logout action:", obj);
            Vue.cache.cacheRemove(CacheKeys.isLogin);
            Vue.cache.cacheRemove(CacheKeys.loginUser);
            await Vue.request({
                url: api.logout,
                method: "post"
            });
            commit({
                type: types.logoutSuccess
            });
            Vue.router.push("/login");
        },

        fullscreenLoading({ commit, dispatch }, fullscreenLoading) {
            if (fullscreenLoading === false) {
                setTimeout(() => {
                    commit({
                        type: types.fullscreenLoading,
                        fullscreenLoading
                    });
                }, 500);
            } else {
                if (fullscreenLoading === true) {
                    commit({
                        type: types.fullscreenLoading,
                        fullscreenLoading: true
                    });
                } else {
                    commit({
                        type: types.fullscreenLoading,
                        fullscreenLoading: true,
                        content: fullscreenLoading
                    });
                }
            }
        }
    },
    modules: {
        rentalMapModule
    },
    strict: false && debug
});
