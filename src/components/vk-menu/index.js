import vkMenuItem from "./vk-menu-item.vue";

/* istanbul ignore next */
vkMenuItem.install = function (Vue) {
    Vue.component(vkMenuItem.name, vkMenuItem);
};

export default vkMenuItem;
