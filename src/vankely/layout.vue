<template>
    <div>
        <div class="vk-header">
                <div class="cityMark">
                    <div class="logo-icon">
                    </div>
                </div>
                <div class="city">
                    <el-select
                        popper-class="layout-city-select"
                        :value="$store.state.city"
                        @input="onCityChange"
                        @visible-change="clickCityChange"
                        :class="{ 'green': isGreen }"
                        class="qqq"
                        style="height: 48px;line-height: 48px;">
                        <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value">
                            <span style="color:#1CBCB4">{{ item.label }}</span>
                        </el-option>
                    </el-select>
                </div>
                <vkDaterange
                    v-show="showDateRange"
                    :propClass="dateRangeClass"
                    type="month"
                    @change="onDateChange"
                    :dateOptions="dateOptions"
                    :propDate="dateOptions"
                ></vkDaterange>
                <div style="width: 1px;height: 100%;background:#000000;opacity: 0.3;margin:0 20px"></div>
                <!--<div style="width: 93px"></div>-->
           <!-- <li class="header admin-style" v-if="$route.query.layout !== 'onlyview'">
                admin
           </li> -->
           <ul>
             <li class="header" v-if="$route.query.layout !== 'onlyview'">
               <el-dropdown class='header-user' trigger='click' @command='handleHeader'>
                 <span class='el-dropdown-link admin-style'>
                   {{loginName}}
                   <i class='tako-icon-triangle'></i>
                 </span>
                 <el-dropdown-menu slot='dropdown'>
                   <!-- <el-dropdown-item command='user_info'>个人信息</el-dropdown-item> -->
                   <el-dropdown-item command='logout'>退出</el-dropdown-item>
                 </el-dropdown-menu>
               </el-dropdown>
             </li>
           </ul>
        </div>

        <div class="container">
            <div class='siderbar' v-if="$route.query.layout !== 'onlyview'">
                <el-menu theme='dark' @open='handleOpen' @close='handleClose' @select='handleSelect' router :default-active="activeMenu" :unique-opened="true">
                    <vk-menu-item v-for='item in vankelyMenus' :key="item.id" :item='item'></vk-menu-item>
                </el-menu>
                <div class="sidebar_blank"></div>
            </div>

            <router-view class='subviews'></router-view>
        </div>

    </div>
</template>

<script>
import { city, province, month } from "../store/mutation-types.js";
import location from "../generated/location.json";
export default {
    name: "layout",
    data() {
        return {
            percentage: 0,
            speed: 5,
            selectedOptions: [350000, 350200],
            dateRangeClass: {
                "data-range-style": true
            },
            dateOptions: {
                startDate: "2017-12",
                endDate: this.$utils.formatDate(new Date(), "YYYY-MM")
            },
            isGreen: false
        };
    },
    computed: {
        showDateRange() {
            if (this.$route.path.indexOf("/admin/company_map") >= 0 || this.$route.path.indexOf("/admin/rent_map") >= 0) {
                return true;
            } else {
                return false;
            }
        },
        logoRes: function () {
            return require("@/assets/img/sidebar_logo.png");
        },
        loginName: function () {
            return this.$store.state.loginUser.userName;
        },
        vankelyMenus: function () {
            const vankelyMenus = this.$store.getters.layoutMenus;
            return vankelyMenus;
        },
        activeMenu: function () {
            this.$logger.log("route", this.$route.meta);
            const meta = this.$route.meta;
            if (typeof meta === "string") {
                return meta;
            }
            return "";
        },
        fullscreenLoading: function () {
            this.onPercentage();
            return this.$store.state.fullscreenLoading;
        },
        cityOptions() {
            return location.map((cityTemp) => {
                return { label: cityTemp.districts.name, value: cityTemp.districts.id };
            });
        }
    },
    methods: {
        handleHeader(command) {
            if (command === "user_info") {
                this.$router.push("/users/current/basic/info");
            } else if (command === "logout") {
                this.$confirm("确认退出吗?", "提示", {
                    type: "warning"
                }).then(async () => {
                    await this.$store.dispatch("logout");
                }).catch((err) => {
                    if (err === "cancel") {
                        return;
                    }
                    this.$message("" + err);
                });
            }
        },
        handleProject(command) {
            // this.$message('handleProject:' + command)
        },
        handleOpen(index) {
            // this.$message('handleOpen:' + index)
        },
        handleClose(index) {
            // this.$message('handleClose:' + index)
        },
        handleSelect(index) {
            // this.$message('handleSelect:' + index)
        },

        onCityChange(e) {
            this.$store.commit(city, e);
            location.forEach((item) => {
                if (item.districts.id === e) this.$store.commit(province, item.districts.parentId);
            });
        },

        onDateChange(e) {
            const a = {};
            a.startMonth = e.start;
            a.endMonth = e.end;
            this.$store.commit(month, a);
        },

        // 设置加载的样式
        onPercentage() {
            this.percentage = 0;
            setInterval(() => {
                if (this.percentage < 100) {
                    this.percentage += this.speed;
                    this.speed = (100 - this.percentage) / 1000;
                } else {
                    this.percentage = 0;
                }
            }, 30);
        },

        async cascaderChange(val) {
            if (val.length === 2) {
                const adCodes = val[1].toString().slice(0, 4);
                this.$store.commit(city, adCodes);
            }
        },

        clickCityChange(val) {
            if (val) {
                this.isGreen = true;
            } else {
                this.isGreen = false;
            }
        }
    },
    created: function () {
        this.$store.commit(city, 350200);
        this.$store.commit(province, 350000);
        const timeFrame = { startMonth: "2017-12", endMonth: this.$utils.formatDate(new Date(), "YYYY-MM") };
        this.$store.commit(month, timeFrame);
    },

    components: {}

};
</script>

<style lang='less'>
@import "~@/assets/less/layout.less";
.green .el-input__inner,
.green i {
  color: #1cbcb4 !important;
}
</style>
