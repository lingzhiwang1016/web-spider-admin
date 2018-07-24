// import api from "@/conf/api.js";
import Vue from "vue";
import dictData from "@/generated/dict.json";

export const LOCATION_TYPE = "LOCATION_TYPE";
export const MAP_TYPE = "MAP_TYPE";
export const COVERAGE_RADIUSENUM = "COVERAGE_RADIUSENUM";
export const HOUSE_RENT_TYPE_ENUM = "HOUSE_RENT_TYPE_ENUM";
export const HOUSE_LEVEL = "HOUSE_LEVEL";
export const DEPOT_TYPE = "DEPOT_TYPE";
export const DEPOT_QUALITY = "DEPOT_QUALITY";
export const APARTMENT_OPERATION_SUBJECT = "APARTMENT_OPERATION_SUBJECT";
export const SUBSCRIBER_LINE = "SUBSCRIBER_LINE";

export default {
    transDictName: async function(datas, key, nameKey, type) {
        if (!datas) {
            return datas;
        }
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const code = data[key];
            const v = this.getDictNameSync(type, code);
            Vue.set(data, nameKey, v);
        }
        return datas;
    },

    getArrayDictName: async function(array, type) {
        const finalArray = [];
        for (const i in array) {
            finalArray.push(this.getDictNameSync(type, array[i]));
        }
        return finalArray;
    },

    getDictName: async function(type, code) {
        if (code === undefined || code === null) {
            return "";
        }
        //将传入code转化成字符串进行比较
        code += "";
        const list = this.getDictByTypeSync(type);
        for (let i = 0; i < list.length; i++) {
            const dict = list[i];
            if (dict.code === code) {
                return dict.codeText;
            }
        }
        return "";
    },
    getDictByType: async function(type) {
        const val = dictData[type];
        if (val) {
            return val;
        } else {
            return [];
        }
    },
    /**
     * 同步接口
     * @param datas
     * @param key
     * @param nameKey
     * @param type
     * @returns {Promise.<*>}
     */
    transDictNameSync: function(datas, key, nameKey, type) {
        if (!datas) {
            return datas;
        }
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const code = data[key];
            const v = this.getDictNameSync(type, code);
            Vue.set(data, nameKey, v);
        }
        return datas;
    },

    getArrayDictNameSync: function(array, type) {
        const finalArray = [];
        for (const i in array) {
            finalArray.push(this.getDictNameSync(type, array[i]));
        }
        return finalArray;
    },

    getDictNameSync: function(type, code) {
        if (code === undefined || code === null) {
            return "";
        }
        //将传入code转化成字符串进行比较
        code += "";
        const list = this.getDictByTypeSync(type);
        for (let i = 0; i < list.length; i++) {
            const dict = list[i];
            if (dict.code === code) {
                return dict.codeText;
            }
        }
        return "";
    },
    getDictByTypeSync: function(type) {
        const val = dictData[type];
        if (val) {
            return val;
        } else {
            return [];
        }
    }
};
