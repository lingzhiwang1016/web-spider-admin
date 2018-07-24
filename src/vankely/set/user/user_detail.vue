<template lang="html">
    <div class="vk-main-container-gray-back">
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item class="breadlink" :to="{path: '/admin/sys/user'}">账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>账号详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class='vk-main-container'>
            <div class="vk-detail-title">
                <el-button type="primary" v-on:click="onEdit"
                           v-if="$store.getters.isPermitted('sys.user.userList', 'edit')&&detailData.loginId!=='admin'">
                    编辑
                </el-button>
            </div>


            <p class="vk-detail-subtitle"><span>账号信息</span></p>

            <el-row :gutter="20" type="flex">
                <el-col :span="8">
                    <vk-detail
                        label="登录名"
                        :description="detailData.loginId"
                    >
                    </vk-detail>
                </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
                <el-col :span="8">
                    <vk-detail
                        label="登录密码"
                        type="enter"
                        enterContent="修改密码"
                        :enterFuc="changePWD"
                    >
                    </vk-detail>
                </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
                <el-col :span="8">
                    <vk-detail
                        label="用户姓名"
                        :description="detailData.userName"
                    >
                    </vk-detail>
                </el-col>

            </el-row>

            <el-row :gutter="20" type="flex">
                <el-col :span="8">
                    <vk-detail
                        label="手机号"
                        :description="detailData.phone"
                    >
                    </vk-detail>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="8">
                    <vk-detail
                        label="用户角色"
                        :description="detailData.roleName"
                    >
                    </vk-detail>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="8">
                    <vk-detail
                        label="公司归属"
                        :description="companyBelong"
                    >
                    </vk-detail>
                </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
                <el-col :span="24">
                    <div
                        class="vk-detail-normal"
                    >
                        <!--<p class="key">已有项目权限 :</p>-->
                        <!--<span  v-for="(item,key) in strArray" :key="key">{{item}}</span>-->
                    </div>
                </el-col>
            </el-row>

        </div>

        <el-dialog v-if="dialogVisible"   class="vk-add" title="修改密码" :visible="dialogVisible" :before-close="handleClose">
            <el-form ref="password" :model="password" :rules="passwordRules" label-position="left">
                <el-row type="flex" justify="center" align="middle" :gutter="20" style="margin-top: 40px">
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" v-model="password.newPassword" placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle" :gutter="20" style="margin-top: 20px;margin-bottom: 40px">
                    <el-col :span="24">
                        <el-form-item label="确认新密码" prop="newPassword">
                            <el-input type="password" v-model="passwordAgain" required placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="handleClose">取消</el-button>
                <el-button type="primary" @click="onEnsure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/javascript">
import { getUserDetail } from "@/net/system";
import { formatUserTree, formatUserTreeStr, getDeptTree } from "@/util/systemUtils";
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
            id: "",
            detailData: {},
            strArray: [],

            dialogVisible: false,

            password: {
                originPassword: "",
                newPassword: ""
            },
            passwordAgain: ""
        };
    },
    computed: {
        passwordRules() {
            return {
                originPassword: [
                    { required: true, message: "请输入原密码", trigger: "blur" },
                    {
                        min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"
                    }
                ],
                newPassword: [
                    { required: true, message: "请输入新密码", trigger: "blur" },
                    {
                        min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"
                    }
                ]
            };
        },

        companyBelong() {
            if (!this.detailData.deptParentName && !this.detailData.deptName) return "--";
            return this.detailData.deptParentName + "/" + this.detailData.deptName;
        }
    },

    asyncComputed: {},

    // 使用其它组件
    components: {},

    // 方法
    watch: {},
    methods: {
        changePWD() {
            this.password = {};
            this.passwordAgain = "";
            this.dialogVisible = true;
        },
        onEnsure() {
            this.$refs.password.validate((valid) => {
                if (valid) {
                    if (this.passwordAgain !== this.password.newPassword) {
                        this.$message({
                            type: "warning",
                            message: "两次密码输入不一致，请重新输入",
                            duration: 1000
                        });
                        return false;
                    }
                    this.$request({
                        url: this.$api.user_change_pwd,
                        method: "put",
                        path: {
                            id: this.id,
                            newPassword: this.password.newPassword
                        }
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: "密码修改成功",
                            duration: 1000
                        });
                        this.dialogVisible = false;
                    }).catch(err => {
                        this.$message({
                            type: "error",
                            message: err.message,
                            duration: 1000
                        });
                    });
                }
            });
        },
        handleClose() {
            this.password = {};
            this.passwordAgain = "";
            this.dialogVisible = false;
        },

        dealDetailTree(tree) {
            const strArray = [];
            tree.forEach((node) => {
                formatUserTreeStr(node, "", strArray);
            });
            this.$logger.log("strarray", strArray);
            this.strArray = strArray;
        },

        onEdit() {
            this.$router.push("/admin/sys/user/edit/" + this.id);
        },

        async initState() {
            Promise.all([getDeptTree(), getUserDetail(this.id)]).then((results) => {
                const tree = [results[0]];
                this.detailData = results[1].data;
                const unitLists = [];
                this.detailData.projectList.forEach((project) => {
                    unitLists.push(project);
                });
                this.$logger.log("unitLists", unitLists);
                const fomatTree = formatUserTree(tree, unitLists);
                this.dealDetailTree(fomatTree);
            }).catch(err => {
                this.$logger.log("err", err);
            });
        }
    },

    // 生命周期函数
    created() {
        this.id = this.$route.params.id;
        this.initState();
    },
    beforeCreate() {
    },
    mounted() {
    }
};

</script>
