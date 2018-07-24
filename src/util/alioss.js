import api from "@/conf/api.js";
import Vue from "vue";
// import Progress from "@/components/progress/progress.js";
import { CacheKeys } from "@/conf/constants";

const BUCKET = "thenewwork";
const REGION = "oss-cn-shanghai";
const URL_PREFIX = "vankely_admin_web/";

export default{

    init: async function (sourceName, size) {
        // use cache
        const res = await Vue.request({
            url: api.oss_token,
            method: "post",
            data: {
                uploadType: 1,
                sourceName,
                size: size
            }
        });
        const token = res.data;
        return token;
    },

    getRandomFileName (len) {
        len = len || 32;
        const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        const maxPos = $chars.length;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    async putObject (file, sourceName) {
        return new Promise(async (resolve, reject) => {
            const token = await this.init(sourceName, file.size);
            const formData = new FormData();
            // console.log("token", token);
            formData.append("key", token.key);
            formData.append("policy", token.policy);
            formData.append("OSSAccessKeyId", token.accessId);
            formData.append("success_action_status", "200");
            formData.append("callback", token.callback);
            formData.append("signature", token.signature);
            formData.append("file", file);
            const xhr = new XMLHttpRequest();
            xhr.open("post", token.host, true);
            const headers = {};
            xhr.send(formData);
            xhr.onload = function onload (result) {
                try {
                    const res = JSON.parse(result.currentTarget.response);
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            xhr.onerror = (e) => {
                reject(e);
            };
        });
    }
};
