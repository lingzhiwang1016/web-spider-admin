/*eslint no-console: 0 */

const rm = require("rimraf");
const axios = require("axios");
const fs = require("fs-promise");
const mkdir = require("mkdir-recursive");
const utils = require("./utils");

const fileDir = "src/generated/";

const dev = "http://dev-vcity.maysatech.com/api";
const test = "http://test-vcity.maysatech.com/api";
const demo = "http://service-demo.maysatech.com/spider-api";
const product = "http://vcity.maysatech.com/api";

//字典类型url
const dict_url = "/sysDict/read/query";
const d_dictList = dev + dict_url;
const t_dictList = test + dict_url;
const demo_dictList = demo + dict_url;
const p_dictList = product + dict_url;

//城市筛选url
const location_city = "/districts/getLocationCity";
const d_locationCity = dev + location_city;
const t_locationCity = test + location_city;
const demo_locationCity = demo + location_city;
const p_locationCity = product + location_city;

const rmDir = (dir) => {
    return new Promise((resolve, reject) => {
        rm(dir, (error) => {
            error ? reject(error) : resolve(true);
        });
    });
};

const mkDir = (dir) => {
    return new Promise((resolve, reject) => {
        mkdir.mkdir(dir, error => {
            error ? reject(error) : resolve(true);
        });
    });
};

const generateDictData = (list) => {
    const json = {};
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const type = item.type;
        if (json[type]) {
            json[type].push(item);
        } else {
            json[type] = [item];
        }
    }
    return json;
};

const generateDict = (env, cb) => {
    const dir = utils.resolve(fileDir);
    console.log("env=>", env);
    let dict;
    env = env || "development";
    let url = p_dictList;
    if (env === "development") {
        url = d_dictList;
    } else if (env === "alpha") {
        url = t_dictList;
    } else if (env === "beta") {
        url = demo_dictList;
    } else {
        url = p_dictList;
    }
    console.log("url ======>", url);
    axios.request({
        url: url,
        method: "post",
        data: {
            "pageNo": 1,
            "pageSize": 1000
        }
    }).then((response) => {
        console.log("response data=====>", response.data);
        dict = response.data.rows;
        return rmDir(fileDir + "dict.json");
    }).then((res) => {
        return mkDir(dir);
    }).then(() => {
        const file = dir + "dict.json";
        const rows = generateDictData(dict);
        const txt = JSON.stringify(rows, null, 4);
        return fs.writeFile(file, txt, "utf8");
    })
        .then((res) => {
            console.log("complete", res);
        })
        .catch((err) => {
            console.log("err", err);
        });
};

const generateDistricts = (env, cb) => {
    const dir = utils.resolve(fileDir);
    console.log("location env=>", env);
    env = env || "development";
    let url = d_locationCity;
    if (env === "development") {
        url = d_locationCity;
    } else if (env === "alpha") {
        url = t_locationCity;
    } else if (env === "beta") {
        url = demo_locationCity;
    } else {
        url = p_locationCity;
    }
    let location;
    env = env || "development";
    console.log("location url ======>", url);
    axios.request({
        url: url,
        method: "get"
    }).then((response) => {
        location = response.data.data;
        console.log("response location data=====>", response.data);
        return rmDir(dir + "location.json");
    }).then((res) => {
        return mkDir(dir);
    }).then(() => {
        const file = dir + "location.json";
        return fs.writeFile(file, JSON.stringify(location, null, 4), "utf8");
    })
        .then((res) => {
            console.log("complete", res);
        })
        .catch((err) => {
            console.log("err", err);
        });
};

// generateDict();
// generateDistricts();

module.exports = {
    generateDict: generateDict,
    generateDistricts: generateDistricts
};
