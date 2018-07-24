import vkFileUpload from "./vk-file-upload";

/* istanbul ignore next */
vkFileUpload.install = function (Vue) {
    Vue.component(vkFileUpload.name, vkFileUpload);
};

export default vkFileUpload;
