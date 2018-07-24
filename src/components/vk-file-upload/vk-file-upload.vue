<template>
    <div ref="addFile">
        <div class="upload-flex">
            <div class="upload-flex" v-if="uploadFile">
                <div v-for="(item, index) in fileArray" class="preview-box" :key="index">
                    <img class="image-style" :style="styleOfFile" src="~@/assets/img/word_annex.png">
                    <el-tooltip effect="dark" :content="item.name" placement="bottom-start">
                        <span class="text-style">{{item.name}}</span>
                    </el-tooltip>
                    <i class="tako-icon-xiangmuqingkong close-style" @click="delFile(index)"></i>
                </div>
            </div>
            <div class="upload-flex" v-if="!uploadFile">
                <div v-for="(item, index) in fileArray" class="preview-box photo-preview" :style="styleOfFile" :key="index">
                    <img class="image-style2" :style="styleOfFile" :src="item.url">
                    <div class="photo-preview-hover" :style="styleOfFile">
                        <div class="icon-position" :style="styleOfFile">
                            <i class="tako-icon-sousuo photo-preview" @click="imgPreview(item.url)"></i>
                            <i class="tako-icon-iconfont-shanchu photo-del" @click="delFile(index)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['add-button', { 'add-button-end': fileArray.length !== (1-1)}]" v-if="fileArray.length!==arrayLength" :style="styleOfFile">
                <input ref="inputFile" class="input-class" :style="styleOfFile" type="file" :accept="fileType" :multiple="multi" @change="printFileInfo" />
                <i class="el-icon-plus"></i>
            </div>
        </div>
    </div>
</template>
<script>
import emitter from "element-ui/src/mixins/emitter";
import alioss from "@/util/alioss.js";
export default {
    name: "vkFileUpload",
    componentName: "vk-fil-upload",
    mixins: [emitter],
    props: {
        uploadFile: {
            type: Boolean,
            default: true // 0：文件上传，1：图片上传
        },
        arrayLength: { // 数据长度，限制上传文件个数
            type: Number,
            default: 100
        },
        multi: { // 是否可以多文件同时上传
            type: Boolean,
            default: false
        },
        fileType: { //选择文件类型
            type: String,
            default: ".xls,.xlsx,.doc,.docx" //支持多类型限制 [".jpg",".png",".rar",".txt",".zip",".doc",".ppt",".xls",".pdf",".docx",".xlsx"];
        },
        fileArray: {
            type: Array,
            default: []
        },
        fileSizeLimit: {
            type: Number,
            default: 5 //默认限制5M内
        },
        styleOfFile: {
            type: Object,
            default() {
                return {
                    width: "240px"
                };
            }
        }
    },
    data() {
        return {};
    },
    methods: {
        printFileInfo(e) {
            const files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.createFile(files);
        },
        createFile(file) {
            if (typeof FileReader === "undefined") {
                this.$message({
                    type: "warning",
                    message: "您的浏览器不支持文件上传，请升级您的浏览器",
                    duration: 2000
                });
                return false;
            }
            let limitLength = this.arrayLength - this.fileArray.length;
            limitLength = Math.min(file.length, limitLength);
            for (let i = 0; i < limitLength; i++) {
                this.$logger.log("文件上传" + i, file[i]);
                const isLimit = (file[i].size) / (1024 * 1024) < this.fileSizeLimit;
                if (!isLimit) {
                    this.$message.error("上传文件大小不能超过" + this.fileSizeLimit + "MB!");
                } else {
                    alioss.putObject(file[i], file[i].name).then(resp => {
                        const imgUrl = "http://" + resp.data.bucket + "." + resp.data.endpoint + "/" + resp.data.alyId;
                        if (this.uploadFile) {
                            this.fileArray.push({
                                name: resp.data.sourceName,
                                url: imgUrl,
                                size: resp.data.size,
                                id: resp.data.id
                            });
                        } else {
                            this.fileArray.push({
                                name: resp.data.sourceName,
                                url: imgUrl,
                                size: resp.data.size,
                                id: resp.data.id
                            });
                        }
                        this.$logger.log("上传返回结果", resp);
                        this.$emit("fileArrayFun", this.fileArray);
                        this.extendChange();
                    }).catch(err => {
                        this.$logger.log(err);
                    });
                }
            }
        },
        delFile(index) {
            if (this.$refs.inputFile) {
                this.$refs.inputFile.value = "";
            }
            this.fileArray.splice(index, 1);
            this.$emit("fileArrayFun", this.fileArray);
            this.extendChange();
        },
        imgPreview(url) {
            this.$vkViewImage(url);
        },
        extendChange() {
            this.$nextTick(() => {
                this.dispatch("ElFormItem", "el.form.change", [this.fileArray]);
            });
        }
    },
    created() {
    },
    mounted() { }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less-variable/index.less";
.upload-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  .preview-box {
    margin: 0px 20px 10px 0px;
    position: relative;
    .image-style {
      width: 100%;
      height: 74px;
      display: block;
    }
    .image-style2 {
      width: 100%;
      height: 120px;
      display: block;
    }
    .text-style {
      width: 120px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .close-style {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 16px;
      color: #ffffff;
      display: none;
      cursor: pointer;
    }
  }
  .preview-box:last-child {
    margin-right: 0px;
  }
  .photo-preview-hover {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    .icon-position {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .photo-preview {
        font-size: 20px;
        color: #ffffff;
      }
      .photo-del {
        font-size: 20px;
        color: #ffffff;
      }
    }
  }
  .preview-box:hover i {
    display: block;
  }
  .photo-preview:hover .photo-preview-hover {
    display: block;
  }
  .add-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    border: 1px solid #e8e8e8;
    background-color: transparent;
    margin: 0px 20px 10px 0px;
    &.add-button-end {
      margin: 0px 0px 10px 20px;
    }
    .input-class {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 99;
      opacity: 0;
      cursor: pointer;
    }
    i {
      font-size: 20px;
      color: #e8e8e8;
    }
  }
  .add-button:hover i {
    color: #5d91f7;
  }
  .add-button:hover {
    border: 1px solid #5d91f7;
  }
}
</style>
