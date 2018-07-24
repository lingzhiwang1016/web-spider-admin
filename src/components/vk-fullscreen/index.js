import vkFullScreen from "./vk-full-screen.vue";

/* istanbul ignore next */
vkFullScreen.install = function (Vue) {
    Vue.component(vkFullScreen.name, vkFullScreen);
};

export default vkFullScreen;
