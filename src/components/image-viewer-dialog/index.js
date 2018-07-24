import Vue from "vue";
import { PopupManager } from "element-ui/src/utils/popup";
import Dialog from "./index.vue";
const DialogConstructor = Vue.extend(Dialog);

let seed = 1;

const ImageViewerDialog = function (data) {
    if (Vue.prototype.$isServer) return;
    // if(instance){
    //     alert(instance.dom.style.zIndex);
    //     instance.vm.show(url);
    //     return instance.vm;
    // }
    const id = "image-viewer-dialog_" + seed++;
    const instance = new DialogConstructor();
    instance.id = id;
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);

    instance.dom = instance.vm.$el;
    instance.dom.style.zIndex = PopupManager.nextZIndex();

    instance.vm.show(data);
    // instance.vm.visible = true;
    // instance.vm.url = url;
    return instance.vm;
};
export default ImageViewerDialog;
