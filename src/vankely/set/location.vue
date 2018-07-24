<template lang="html">
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>定位点设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="vk-list">
              <ul class="vk-tools-bar">
                  <li class="filter">
                    <el-select class="search-select" v-model="filter.mapType" @input="mapTypeChange"  placeholder="地图类型">
                        <el-option v-for="item in mapTypes" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    <el-select class="search-select" v-model="filter.locationType" @input="locationTypChange"  placeholder="定位类型">
                        <el-option v-for="item in locationTypes" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    <div class="search-input">
                        <i class="tako-icon-search search"></i>
                        <el-input placeholder="名称/地址" class='long' v-model="filter.keyword"/>
                    </div>
                  </li>
                  <li class="vk-btns">
                    <!-- <el-button type="primary" @click="onAdd" v-if="$store.getters.isPermitted('sys.passengerFlow.area', 'edit')"> -->
                    <el-button type="primary" @click="onAdd" >
                        新增
                    </el-button>
                </li>
              </ul>

              <el-table
                  :data="tabelData"
                  row-key="id">
                  <el-table-column prop="locationName" label="定位区域名称"  show-overflow-tooltip ></el-table-column>
                  <el-table-column prop="locationTypeName" label="定位点类型"  show-overflow-tooltip ></el-table-column>
                  <el-table-column prop="locationAddress" label="详细地址"  show-overflow-tooltip ></el-table-column>
                  <el-table-column prop="lng" label="经度"  show-overflow-tooltip ></el-table-column>
                  <el-table-column prop="lat" label="纬度"  show-overflow-tooltip ></el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip >
                    <template scope="scope">
                      {{$utils.formatDate(scope.row.createTime, "YYYY-MM-DD HH:mm:ss")}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"  show-overflow-tooltip  width="152">
                      <template scope="scope">
                        <vk-actions scope="scope">
                            <!-- <vk-action-item
                                v-if="scope.row.uneditable == 0 && $store.getters.isPermitted('sys.passengerFlow.area', 'edit')"
                            > -->
                            <vk-action-item>
                                <el-button class="el-button--table"  v-on:click.stop="onDelete(scope.$index, scope.row)">删除</el-button>
                            </vk-action-item>
                            <vk-action-item>
                                <el-button class="el-button--table" v-on:click.stop="onEdit(scope.$index, scope.row)">修改</el-button>
                            </vk-action-item>

                          <!-- <vk-action-item
                                v-if="scope.row.uneditable == 0 && $store.getters.isPermitted('sys.passengerFlow.area', 'delete')"
                            > -->

                        </vk-actions>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="pagination">
                  <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                  </el-pagination>
              </div>

              <CompanyAdd
              v-if="dialogVisible"
              :visible.sync="dialogVisible"
              @addFinish = "readList"
              :DialogType="DialogType"
              :index="index"
              :row="row"
              :title="title"
              />

          </div>
      </div>
</template>

<script type="text/javascript">
    import dict, { MAP_TYPE, LOCATION_TYPE } from "@/net/dict.js";
    import CompanyAdd from "./add_location.vue";
    import { listMixin } from "@/mixins/list-mixins";

    export default {
        mixins: [listMixin],
        data () {
            return {
                filter: {
                    mapType: this.$route.query.mapType || "",
                    locationType: this.$route.query.locationType || ""
                },
                tabelData: [],
                total: 0,
                dialogVisible: false,
                DialogType: null,
                index: null,
                row: null,
                title: null
            };
        },
        computed: {
            city() {
                return this.$store.state.city || "350200";
            },
            month () {
                return this.$store.state.month || { startMonth: "", endMonth: "" };
            }
        },
        watch: {
            city() {
                this.readList();
            },
            month(val) {
                this.readList();
            }
        },
        asyncComputed: {
            async mapTypes() {
                const res = await dict.getDictByType(MAP_TYPE);
                if (!res) {
                    return [];
                }
                //暂时
                const mapType = res.filter(index => {
                    return index.codeText !== "住宅地图";
                });
                this.filter.mapType = mapType[0].code;
                return mapType.map((item) => {
                    return { code: item.code, codeText: item.codeText };
                });
            },
            async locationTypes() {
                const res = await dict.getDictByType(LOCATION_TYPE);
                if (!res) {
                    return [];
                }
                this.filter.locationType = res[0].code;
                return res.map((item) => {
                    return { codeText: item.codeText, code: item.code };
                });
            }
        },
        // 使用其它组件
        components: {
            CompanyAdd
        },
        methods: {
            onAdd () {
                this.dialogVisible = true;
                this.DialogType = "ADD";
                this.title = "新增定位点";
            },
            mapTypeChange(val) {
                this.$logger.log("onScopeChange", val);
                this.filter.mapType = val;
                this.readList();
            },
            locationTypChange(val) {
                this.$logger.log("locationTypChange", val);
                this.filter.locationType = val;
                this.readList();
            },
            handleCurrentChange(index) {
                this.pageNo = index;
                this.readList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.readList();
            },
            onEdit(index, row) {
                this.dialogVisible = true;
                this.DialogType = "EDIT";
                this.index = index;
                this.row = row;
                this.$logger.log("row", this.row);
                this.title = "编辑定位点";
            },
            onDelete (index, row) {
                const path = {
                    id: row.id
                };
                this.$confirm("确定要删除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async () => {
                    await this.$request({
                        url: this.$api.location_delete,
                        method: "delete",
                        path: path
                    });
                    this.$message({
                        type: "success",
                        message: "删除成功!",
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
            async readList () {
                const path = {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                };
                const res = await this.$request({
                    url: this.$api.location_page,
                    method: "get",
                    path: path,
                    params: {
                        mapType: this.filter.mapType,
                        locationType: this.filter.locationType,
                        keyword: this.filter.keyword,
                        startTime: this.month.startMonth || "",
                        endTime: this.month.endMonth || ""
                    }
                });
                this.$logger.log("res", res);
                this.tabelData = await dict.transDictName(res.rows, "locationType", "locationTypeName", LOCATION_TYPE);
                this.total = res.total;
            }
        },
        created () {}
    };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~@/assets/less-variable/index.less";
    .map {
        width: 100%;
        height: calc(100% - 72px);
    }
    .reset-btn{
      position: absolute;
      right: 100px;
    }
    .vk-style-two-detail{
        .vk-top-title{
          display: flex;
          justify-content: flex-end;
          padding: 20px 0;
        }
        .warn-item{
            margin-top:30px;
            margin-bottom: 11px;
            .warn-item-gray{
              color: @fontColor-label;
            }
            .warn-item-blue{
              color:@fontColor-active;
            }
        }
        .el-col{
        margin-bottom: calc(~"@{marginBottom} - 10px");
      }
    }
</style>
