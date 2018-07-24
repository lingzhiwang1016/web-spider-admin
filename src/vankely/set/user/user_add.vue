<template lang="html">
    <div class="vk-main-container-gray-back vk-add">
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item class="breadlink" :to="{path: '/admin/set/user'}">账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-main-container">

            <p class="vk-edit-title">
                <el-button type="default" v-on:click="onCancel">取消</el-button>
                <el-button type="primary" v-on:click="onSave">保存</el-button>
            </p>

            <div class="vk-divider-line"></div>

            <el-form ref="basicForm" :model="basicForm" :rules="basicInfoRules">         
                <el-row  style="margin-top: 20px">
                    <el-col :span="3" class="form-left">
                        登录名
                    </el-col>
                    <el-col :span="8">
                        <el-form-item  prop="loginId">
                            <el-input type="text" v-model="basicForm.loginId"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row style="margin-top: 20px">
                    <el-col :span="3" class="form-left">
                        密码
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="password">
                            <el-input
                                type="password" v-model="basicForm.password"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row style="margin-top: 20px">
                    <el-col :span="3" class="form-left">
                        用户姓名
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="userName">
                            <el-input type="text" v-model="basicForm.userName"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row style="margin-top: 20px">
                    <el-col :span="3" class="form-left">
                        手机号
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="phone">
                            <el-input type="text" v-model="basicForm.phone"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row style="margin-top: 20px">
                    <el-col :span="3" class="form-left">
                        所属业务线
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="linesBusiness">
                            <el-select v-model="basicForm.linesBusiness" style="width: 100%;">
                                <el-option v-for="(item, index) in linesBusinessArray" :key="index" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </div>
    </div>

</template>

<script type="text/javascript">
// import api from "@/conf/api.js";
import dict, { SUBSCRIBER_LINE } from "@/net/dict.js";
import { patten } from "@/util/utils.js";

export default {
    // 不要忘记了 name 属性
    name: "RangeSlider",
    // 组合其它组件
    extends: {},

    // 组件属性、变量
    props: {
        // 按字母顺序
    },
    // 变量
    data() {
        return {
            departMents: {},
            //确认密码
            basicForm: {
                loginId: "",
                userName: "",
                password: "",
                phone: "",
                linesBusiness: ""
            },
            basicInfoRules: {
                loginId: [
                    { required: true, message: "请输入登录名", trigger: "change" },
                    { max: 14, message: "长度不能超过14字" }
                ],
                userName: [
                    { required: true, message: "请输入姓名", trigger: "change" },
                    { max: 14, message: "长度不能超过14字" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "change" },
                    {
                        pattern: /^[a-zA-Z0-9]{6,}$/, message: "请输入不小于6位密码", trigger: "blur"
                    },
                    {
                        pattern: patten.password, message: "请输入不大于19位密码", trigger: "blur"
                    }
                ],
                phone: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { pattern: patten.phone, message: "请输入正确的手机号", trigger: "blur" }
                ],
                linesBusiness: [{
                    required: true, message: "请选择所属业务线", trigger: "change"
                }]
            }
        };
    },
    computed: {
        // paramsId: function () {
        //     return this.$route.params.id;
        // }
    },

    asyncComputed: {
        // 所属业务线
        linesBusinessArray: async function () {
            const res = await dict.getDictByType(SUBSCRIBER_LINE);
            if (!res) {
                return [];
            }
            return res.map((item) => {
                return { text: item.codeText, value: item.code };
            });
        }
        // async getRole () {
        //     const res = await this.$request({
        //         url: this.$api.role_list,
        //         method: "get"
        //     });
        //     return res.data;
        // },

        // async getArea() {
        //     return await getSysArea();
        // },

        // async getDept() {
        //     if (this.basicForm.deptParentId) {
        //         return await getCompanyByArea(this.basicForm.deptParentId);
        //     } else {
        //         return [];
        //     }
        // }
    },

    // 使用其它组件
    components: {
    },

    // 方法
    watch: {},
    methods: {
        async onSave() {
            this.$refs.basicForm.validate((valid) => {
                if (valid) {
                    this.$request({
                        url: this.$api.sys_user_add,
                        method: "post",
                        data: this.basicForm
                    }).then(() => {
                        this.$message({
                            type: "success",
                            message: "新增成功",
                            duration: 1000
                        });
                        this.onCancel();
                    }).catch((err) => {
                        this.$message({
                            type: "error",
                            message: err.message,
                            duration: 1000
                        });
                    });
                }
            });
        },
        // deptParentIdChange(e) {
        //     this.basicForm.deptId = "";
        //     this.basicForm.deptParentId = e;
        // },

        // onSelectedDpt(data) {
        //     this.selectPrj = data;
        // },

        // setTreeSelectData(datas) {
        //     const array = datas.map((data) => {
        //         return {
        //             id: 4 + "-" + data
        //         };
        //     });
        //     this.$refs.elTree.setCheckedNodes(array);
        // },

        // onDeleteChoiced(res) {
        //     this.selectPrj = this.selectPrj.filter((prj) => {
        //         return prj !== res;
        //     });
        //     this.$refs.vkTree.setCheckedPrj(this.selectPrj);
        // },
        onCancel() {
            this.$router.push("/admin/set/user");
        },
        async initState() {
            // this.departMents = await getDeptTree();
            // getDeptLeafNodes([this.departMents]).forEach((node) => {
            // //                    node.actId = node.id + "";
            //     node.id = 4 + "-" + node.id;
            // });
            // this.departMents = [this.departMents];
            // if (this.action === DialogType.EDIT) {
            //     const res = await getUserDetail(this.id);
            //     this.basicForm.loginId = res.data.loginId;
            //     this.basicForm.userName = res.data.userName;
            //     this.basicForm.phone = res.data.phone;
            //     this.basicForm.roleIds[0] = res.data.roleId;
            //     this.basicForm.deptId = res.data.deptId;
            //     this.basicForm.deptParentId = res.data.deptParentId;
            //     this.$logger.log("res", res);
            //     //this.setTreeSelectData(res.data.projectList);
            // }
        },
        validateConfirmPwd(rule, value, callback) {
            let checkVal = true;
            if (value !== this.basicForm.password) {
                checkVal = false;
            }
            if (checkVal) {
                return callback();
            } else {
                return callback(new Error(rule.message));
            }
        }
    },

    // 生命周期函数
    created() {
        // if (this.$route.params.id) {
        //     this.action = DialogType.EDIT;
        //     this.id = this.$route.params.id;
        // } else {
        //     this.action = DialogType.ADD;
        // }
        this.initState();
    },
    beforeCreate() {
    },
    mounted() {
    }
};
</script>

<style lang="less">
@import "~@/assets/less/vankely/user/user_add.less";
</style>

