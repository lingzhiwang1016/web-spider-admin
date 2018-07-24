/*eslint no-console: 0 */

const buildConfigFunc = require("./buildConfigFunc");

buildConfigFunc.generateDict(process.env.PACK_ENV, (txt) => {
    console.log("generateDict end");
});
