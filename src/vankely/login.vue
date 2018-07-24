<template>
    <div class="login-container">
        <img class="scoped-login-image" src="../assets/img/login.png"/>
        <main class="login-main">

            <section class="login-content">
                <p class="form-logo"></p>
                <el-form :model="ruleForm" ref="loginForm" :rules="rules" label-position="top" label-width="0px">
                    <el-form-item label="" prop="loginId">
                        <el-input v-model="ruleForm.loginId" required placeholder="登录名"></el-input>
                        <i class="tako-icon-login_icon_mine"></i>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
                        <i class="tako-icon-login_icon_lock"></i>
                    </el-form-item>
                    <el-form-item label="" prop="captcha">
                        <el-input v-model="ruleForm.captcha" @keyup.enter.native="login" type="type" placeholder="验证码"></el-input>
                        <i class="tako-icon-login_icon_verify"></i>
                        <img @click="handleCaptcha" class="checkCode_img" :src="captcha" alt="验证码" title="点击刷新验证码" />
                    </el-form-item>

                    <el-form-item class="login-btn-form">
                        <el-button type="primary" @click="login">登&ensp;录</el-button>
                    </el-form-item>
                    <!-- <p @click="password_reset">忘记密码</p> -->
                </el-form>
            </section>

        </main>
        <!-- <footer>2018 © vcity.com 版权所有 备案号：</footer> -->

    </div>
</template>

<script>
export default {
    name: "hello",
    data() {
        return {
            status: "login",
            ruleForm: {
                loginId: "",
                password: "",
                captcha: ""
            },

            resetForm: {
                loginId: "",
                newPassword: "",
                smsCode: "",
                captcha: ""
            },

            captcha: "",

            rules: {
                loginId: [
                    { required: true, message: " ", trigger: "blur" },
                    {
                        min: 1, max: 16, message: " ", trigger: "blur"
                    }
                ],
                password: [
                    { required: true, message: " ", trigger: "blur" },
                    {
                        min: 6, max: 16, message: " ", trigger: "blur"
                    }
                ],
                captcha: [
                    { required: true, message: " ", trigger: "blur" }
                ]
            }

        };
    },

    methods: {
        onBlur: function () {
            if (this.ruleForm.loginId.length < 1) {
                this.$message({
                    message: "请输入登录名",
                    type: "warning"
                });
            } else if (this.ruleForm.loginId.length > 16) {
                this.$message({
                    message: "长度在 1 到 16 个字符",
                    type: "warning"
                });
            } else if (this.ruleForm.password.length < 1) {
                this.$message({
                    message: "请输入密码",
                    type: "warning"
                });
            } else if (this.ruleForm.password.length < 6 || this.ruleForm.password.length > 16) {
                this.$message({
                    message: "长度在 6 到 16 个字符",
                    type: "warning"
                });
            } else if (this.ruleForm.captcha.length < 1) {
                this.$message({
                    message: "请输入验证码",
                    type: "warning"
                });
            } else {
                return true;
            }
        },

        handleCaptcha: function () {
            this.captcha = this.$api.captcha_type + "?" + Date.parse(new Date());
        },
        password_reset: function () {
            // this.$router.push("/users/password/reset");
        },

        login: function () {
            return new Promise((resolve, reject) => {
                this.$refs.loginForm.validate((valid) => {
                    this.$logger.log("[validate] ", valid);
                    if (valid) {
                        let redirect = this.$route.query.redirect;
                        redirect = !redirect ? "/admin/home" : decodeURIComponent(redirect);
                        const data = {
                            ...this.ruleForm,
                            redirect: redirect
                        };
                        return this.$store.dispatch("login", data).then((res) => {
                            this.$logger.log("login view res", res);
                            resolve(res);
                        }).catch((err) => {
                            this.$logger.warn("login err:", err);
                            this.$message({
                                message: err.message,
                                type: "error"
                            });
                            reject(err);
                            this.handleCaptcha(); //解决:登录错误后，验证码要自动刷新一下 --lyd-9-5
                        });
                    } else {
                        this.$logger.log("error submit!!");
                        this.onBlur();
                        reject();
                    }
                });
            });
        }
    },
    created: function () {
        this.handleCaptcha();
    },
    mounted() {
        // this.$logger.log("style", document.head.childNodes[0].tagName);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "~@/assets/less/login.less";
</style>
