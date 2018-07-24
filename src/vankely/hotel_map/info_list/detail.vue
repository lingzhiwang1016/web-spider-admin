<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>酒店地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item class="breadlink" :to="{path: '/admin/hotel_map/info_list?tab='+ this.$route.query.tab}">{{tabName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{detailTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-list">
          <ul class="vk-tools-bar">
              <li class="filter">
                <!-- <div class="search-input">
                    <i class="tako-icon-search search"></i>
                    <el-input placeholder="企业名称" class='long' v-model="filter.keyword"/>
                </div> -->
              </li>
              <li class="vk-btns">
                    <el-button style="color: #999999;padding: 0px 13px 0 9px;" @click="toReturn"><i class="tako-icon-back"></i> 返回</el-button>
                    <el-button type="primary" @click="exportTabel">
                        导出
                    </el-button>
              </li>
          </ul>
          <el-table :data="tabelData" ref="singleTable" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="28" align="right"></el-table-column>
              <el-table-column label="酒店名称" property="hotelName" show-overflow-tooltip></el-table-column>
              <el-table-column label="酒店地址" property="address" show-overflow-tooltip></el-table-column>
              <el-table-column label="房间数/间" property="roomNum" show-overflow-tooltip></el-table-column>
              <el-table-column label="最低房价/元" property="lowestPrice" show-overflow-tooltip></el-table-column>
              <el-table-column label="酒店评分" property="customerScore" show-overflow-tooltip>
                  <template scope="scope">{{Number(scope.row.customerScore).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column label="评论数量/条" property="commentNum" show-overflow-tooltip></el-table-column>
              <el-table-column label="有无会厅" property="meetingRoom" show-overflow-tooltip>
                <template scope="scope">{{scope.row.meetingRoom === 1 ? "有":"无"}}</template>
              </el-table-column>
              <el-table-column label="推荐率/%" property="recommendRate" show-overflow-tooltip>
                <template scope="scope">{{scope.row.recommendRate}}</template>
              </el-table-column>
              <el-table-column label="关闭率/%" property="closeRate" show-overflow-tooltip>
                <template scope="scope">{{Number(scope.row.closeRate).toFixed(2)}}</template>
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                             :current-page="pageNo">
              </el-pagination>
          </div>
      </div>
  </div>
</template>

<script type="text/javascript">
    import { listMixin } from "@/mixins/list-mixins";
    import dict, { COVERAGE_RADIUSENUM } from "@/net/dict.js";

    export default {
        mixins: [listMixin],
        data () {
            return {
                filter: {
                    coverageRadius: "",
                    enterpriseIds: []
                },
                activeTab: "enterprise",
                tabelData: [],
                total: 0
            };
        },
        computed: {
            city () {
                return this.$store.state.city || "350200";
            },
            startMonth () {
                return this.$store.state.month.startMonth || "";
            },
            endMonth () {
                return this.$store.state.month.endMonth || "";
            },
            tabName () {
                if (this.$route.query.tab === "1") {
                    return "按类型统计";
                } else if (this.$route.query.tab === "2") {
                    return "按区(县)统计";
                } else if (this.$route.query.tab === "3") {
                    return "按商圈统计";
                } else if (this.$route.query.tab === "4") {
                    return "按交通枢纽统计";
                }
            },
            detailTitle () {
                if (this.$route.query.tab === "1") {
                    return this.$route.query.hotelType;
                } else if (this.$route.query.tab === "2") {
                    return this.$route.query.countyName;
                } else if (this.$route.query.tab === "3") {
                    return this.$route.query.locationName;
                } else if (this.$route.query.tab === "4") {
                    return this.$route.query.locationName;
                }
            }
        },
        watch: {
            city (val) {
                this.readList();
            },
            startMonth(val) {
                this.readList();
            },
            endMonth(val) {
                this.readList();
            }
        },
        methods: {
            //返回
            toReturn () {
                window.history.go(-1);
            },
            handleSelectionChange(selection) {
                this.filter.enterpriseIds = [];
                selection.forEach((item) => {
                    this.filter.enterpriseIds.push(item.id);
                });
            },
            //导出
            exportTabel() {
                let params = {};
                let api = null;
                if (this.$route.query.tab === "1") {
                    api = this.$api.hotel_export;
                    params = {
                        city: this.city,
                        hotelType: this.$route.query.hotelType,
                        keyword: this.filter.keyword
                    };
                } else if (this.$route.query.tab === "2") {
                    //按区(县)统计
                    api = this.$api.hotel_export;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        keyword: this.filter.keyword
                    };
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    //按商圈统计、按交通枢纽统计
                    api = this.$api.hotel_export_location_detail;
                    const locationType = this.$route.query.tab === "4" ? "traffic_hub" : "trading_area";
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius || "2",
                        locationId: this.$route.query.locationId,
                        city: this.city,
                        locationType: locationType
                    };
                }
                //导出请求
                // params.startTime = this.startMonth;
                // params.endTime = this.endMonth;
                params.hotelIds = this.filter.enterpriseIds + "";
                if (this.tabelData.length !== 0) {
                    const url = this.$utils.addParamsForUrl(api, params);
                    this.$utils.downloadExcel(url);
                } else {
                    this.$message({
                        type: "warning",
                        message: "当前没有可导出的数据!",
                        duration: 1000
                    });
                }
            },
            async readList () {
                this.$logger.log("this.city", this.city);
                let url;
                let params;
                if (this.$route.query.tab === "1") {
                    url = this.$api.hotel_page_type_detail;
                    params = {
                        city: this.city,
                        hotelType: this.$route.query.hotelType,
                        keyword: this.filter.keyword
                    };
                }
                if (this.$route.query.tab === "2") {
                    url = this.$api.hotel_page_county_detail;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        keyword: this.filter.keyword
                    };
                }
                if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    url = this.$api.hotel_page_location_detail;
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius,
                        locationId: this.$route.query.locationId,
                        city: this.city
                    };
                }
                // params.startTime = this.startMonth;
                // params.endTime = this.endMonth;
                const res = await this.$request({
                    url: url,
                    method: "get",
                    path: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo
                    },
                    params: params
                });
                this.$logger.log("res", res);
                this.tabelData = res.rows;
                this.total = res.total;
            }
        }
    };
</script>
<style lang="less">
    .el-table__expand-icon{
        text-align: center;
    }
    .props-table tr{
        background-color: #FAFAFA;
    }
    .props-table th div.cell{
        color: #666;
        font-weight: 700!important;
    }
</style>
