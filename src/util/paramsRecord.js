import Vue from "vue";

export default function paramsRecord (params) {
    let newUrl = Vue.router.history.current.fullPath.split("?")[0] + "?";
    const urlQuery = Vue.router.history.current.query;
    params = { ...urlQuery, ...params };
    for (const k in params) {
        if (k && params[k]) {
            newUrl += k + "=" + encodeURI(params[k]) + "&";
        }
    }
    Vue.router.replace(newUrl);
}

export function stringToArray (data) {
    if (data) {
        data = data.split(",");
    } else {
        data = [];
    }
    return data;
}
