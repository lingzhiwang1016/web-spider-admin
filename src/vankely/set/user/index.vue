<template lang="html">
    <div class="vk-main-container-gray-back">
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-list-main-container">
            <el-row type="flex" justify="space-between" class="vk-list-tool-bar">
                <el-col class="filter">
                    <input @input="onsearch" placeholder="登录名/用户姓名/手机号" v-model="filter.keyword" class="long">
                    <span class="btn">
                     <i class="tako-icon-search"></i>
                 </span>
                </el-col>
                <el-col class="vk-btns">
                    <el-button type="primary" @click="onAdd">
                        新增
                    </el-button>
                </el-col>
            </el-row>

            <el-table
                :data="tableData"
                row-key="id"
                @filter-change="filterChange"
            >
                <el-table-column prop="loginId" label="登录名" show-overflow-tooltip></el-table-column>
                <el-table-column
                    prop="linesBusinessName"
                    label="所属业务线"
                    show-overflow-tooltip
                    filter-placement="bottom-start"
                    column-key="linesBusinessNameKey"
                    :filtered-value="filter.linesBusiness"
                    :filters="linesBusinessArray"
                    :filter-method="filterMethod">
                </el-table-column>
                <el-table-column prop="userName" label="用户姓名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" show-overflow-tooltip>
                    <template scope="scope">
                        <vk-actions scope="scope">
                            <vk-action-item v-if="scope.row.status===1&&scope.row.loginId!=='admin'">
                                <span class="vk-list-action-button">
                                    启用
                                </span>
                            </vk-action-item>
                            <vk-action-item v-else-if="scope.row.status===0&&scope.row.loginId!=='admin'">
                                <span class="vk-list-action-button">
                                    禁用
                                </span>
                            </vk-action-item>
                        </vk-actions>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip width="152">
                    <template scope="scope">
                        <vk-actions scope="scope">
                            <vk-action-item v-if="scope.row.status===1&&scope.row.loginId!=='admin'">
                                <span class="vk-list-action-button blue" v-on:click.stop="onDisable(scope.$index, scope.row)">
                                    禁用
                                </span>
                            </vk-action-item>
                            <vk-action-item v-else-if="scope.row.status===0&&scope.row.loginId!=='admin'">
                                <span class="vk-list-action-button blue" v-on:click.stop="onEnable(scope.$index, scope.row)">
                                    启用
                                </span>
                            </vk-action-item>
                        </vk-actions>
                    </template>
                </el-table-column>
            </el-table>


            <div class="pagination" >
                <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                               :current-page="pageNo">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
// import listMixin from "@/mixins/list-mixins.js";
import dict, { SUBSCRIBER_LINE } from "@/net/dict.js";
export default {
    // 不要忘记了 name 属性
    name: "",
    // 组合其它组件
    extends: {},

    // 组件属性、变量
    props: {},

    // mixins: [listMixin],
    // 变量
    data() {
        return {
            total: null,
            pageNo: parseInt(this.$route.query.pageNo) || 1,
            pageSize: parseInt(this.$route.query.pageSize) || 15,
            tableData: [],
            filter: {
                keyword: this.$route.query.keyword || "",
                lines: ""
            },
            basicForm: {},
            basicInfoRules: {}
        };
    },
    computed: {},
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
    },

    // 使用其它组件
    components: {},

    // 方法
    watch: {},
    methods: {
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.pageNo = 1;
            this.readList();
            this.paramsRecord({ pageSize: val });
        },
        handleCurrentChange: function (index) {
            this.pageNo = index;
            this.readList();
            this.paramsRecord({ pageNo: index });
        },
        paramsRecord(params) {
            let newUrl = this.router.history.current.fullPath.split("?")[0] + "?";
            const urlQuery = this.router.history.current.query;
            params = { ...urlQuery, ...params };
            for (const k in params) {
                if (k && params[k]) {
                    newUrl += k + "=" + encodeURI(params[k]) + "&";
                }
            }
            this.$router.replace(newUrl);
        },
        onAdd() {
            this.$router.push("/admin/set/user_add");
        },

        onsearch() {
            this.readList();
        },
        filterChange(filter) {
            if (filter.linesBusinessNameKey) {
                this.filter.lines = filter.linesBusinessNameKey.join(",");
            } else {
                this.$logger.warn("filterChange 未处理的filter类型");
                return;
            }
            this.readList();
        },

        // handleRowClick(row, event, column) {
        //     this.$router.push("/admin/sys/user/detail/" + row.id);
        // },

        onEnable(index, row) {
            event.stopPropagation();
            const path = {
                id: row.id
            };
            this.$confirm("是否启用？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                await this.$request({
                    url: this.$api.sys_user_enabled_id,
                    method: "put",
                    path: path
                });
                this.$message({
                    type: "success",
                    message: "启用成功",
                    duration: "1000"
                });
                this.readList();
            }).catch((err) => {
                if (err !== "cancel") {
                    this.$message({
                        type: "error",
                        message: err.message,
                        duration: "1000"
                    });
                }
            });
        },

        onDisable(index, row) {
            event.stopPropagation();
            const path = {
                id: row.id
            };
            this.$confirm("是否禁用？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                await this.$request({
                    url: this.$api.sys_user_disabled_id,
                    method: "put",
                    path: path
                });
                this.$message({
                    type: "success",
                    message: "禁用成功",
                    duration: "1000"
                });
                this.readList();
            }).catch((err) => {
                if (err !== "cancel") {
                    this.$message({
                        type: "error",
                        message: err.message,
                        duration: "1000"
                    });
                }
            });
        },

        // 读取列表
        async readList() {
            const path = {
                pageSize: this.pageSize,
                pageNo: this.pageNo
            };
            let res;
            try {
                res = await this.$request({
                    url: this.$api.sys_user_page,
                    method: "get",
                    path: path,
                    params: {
                        keyword: this.filter.keyword,
                        lines: this.filter.lines
                    }
                });
            } catch (err) {
                this.$message.error(err.message);
            }

            this.tableData = res.rows;
            this.total = res.total;
        },
        filterMethod(arr) {
            // this.$logger.log("arr", arr);
        }
    },
    // 生命周期函数
    created() {
        this.readList();
    },
    beforeCreate() {
    },
    mounted() {
    }
};
</script>

<style lang="less">
@import "~@/assets/less/vankely/user/user.less";
</style>
