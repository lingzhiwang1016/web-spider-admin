/**
 * Created by vyouyou on 17-8-4.
 */

import "babel-polyfill";
// import "babel-runtime";
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.less";
import "@/assets/fonts/iconfont.css";
import "@/assets/css/style-icon.css";

// less
import "@/assets/less/style-vankely.less";
import "@/assets/less/style-list.less";
import "@/assets/less/vk-style-two_tabs.less";
import "@/assets/less/style-element-theme.less";
import "@/assets/less/map.less";
import "@/assets/less/vk-style-one.less";
Vue.use(ElementUI);

import AsyncComputed from "vue-async-computed";

Vue.use(AsyncComputed);
import NetPlugin from "@/plugin/net";

Vue.use(NetPlugin);

import logger from "@/util/logger";
import api from "@/conf/api";
import * as constants from "@/conf/constants";
import cache from "@/util/cache";
import utils from "@/util/utils";
import debounce from "throttle-debounce/debounce";
import vkActions from "@/components/vk-actions";
import vkMenu from "@/components/vk-menu";
import vkFullScreen from "@/components/vk-fullscreen";
import vkDaterange from "@/components/vk-daterange";
import vkSelect from "@/components/vk-select";
import vkFileUpload from "@/components/vk-file-upload";
import imageViewerDialog from "@/components/image-viewer-dialog";
import vkDetail from "@/components/vk-detail";
import vkAddLocation from "@/components/vk-add-location";

// import "./lib/baiduMap/TextIconOverlay.js";
// import "./lib/baiduMap/MarkerClusterer.js";

const install = function (VueClass, opts = {}) {
    /* istanbul ignore if */
    //componet method

    [vkMenu, vkActions, vkDaterange, vkFullScreen, vkSelect, vkFileUpload, vkDetail, vkAddLocation].forEach((cmp) => {
        VueClass.use(cmp);
    });
    //method
    VueClass.utils = utils;
    VueClass.prototype.$utils = utils;

    VueClass.logger = logger;
    VueClass.prototype.$logger = logger;

    VueClass.api = api;
    VueClass.prototype.$api = api;

    VueClass.constants = constants;
    VueClass.prototype.$constants = constants;

    VueClass.cache = cache;
    VueClass.prototype.$cache = cache;

    VueClass.prototype.$vkViewImage = imageViewerDialog;

    const deb = (...args) => {
        if (args.length === 2) {
            return debounce.call(this, args[1], args[0]);
        } else {
            return debounce.call(this, 300, args[0]);
        }
    };
    VueClass.debounce = deb;
    VueClass.prototype.$debounce = deb;
};

Vue.use(install);

import store from "@/store";
import router from "@/router";

Vue.store = store;
Vue.router = router;

import Axios from "axios";
// set server response cookie save
Axios.defaults.withCredentials = true;

export default { store, router };
