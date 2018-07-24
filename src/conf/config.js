const config = {
    base: {
        mock: "http://dsn.apizza.cc/mock/8b86683fadcdff68217e132842351fe9",
        json: "http://127.0.0.1:8080"
    },
    testing: {
        api: "http://test-vcity.maysatech.com/api"
    },
    local: {
        api: "http://127.0.0.1:8081"
    },
    development: {
        // api: "http://service-d.maysatech.com/spider-api"
        // api: "http://spider-d.maysatech.com/spider-api"
        api: "http://dev-vcity.maysatech.com/api"
    },
    alpha: {
        api: "http://test-vcity.maysatech.com/api"
    },
    beta: {
        api: "http://service-demo.maysatech.com/spider-api"
    },
    production: {
        api: "http://vcity.maysatech.com/api"
    }
};
export default Object.assign(config.base, config[process.env.PACK_ENV]);
