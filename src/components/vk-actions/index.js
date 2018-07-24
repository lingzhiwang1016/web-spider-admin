import VKActionItem from "./vk-action-item";
import VKActions from "./vk-actions";

/* istanbul ignore next */
VKActions.install = function (Vue) {
    Vue.component(VKActions.name, VKActions);
    Vue.component(VKActionItem.name, VKActionItem);
};

export default VKActions;
