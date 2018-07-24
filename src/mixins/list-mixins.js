import paramsRecord from "@/util/paramsRecord";

export const listMixin = {
    data: function () {
        return {
            filter: {
                keyword: this.$route.query.keyword || ""
            },
            pageSize: this.$cache.cacheGet("pageSize") || 15,
            pageNo: parseInt(this.$route.query.pageNo) || 1,
            total: 0
        };
    },
    watch: {
        pageNo (val) {
            const param = { pageNo: val };
            paramsRecord(param);
        },
        filter: {
            deep: true,
            handler (newVal, oldVal) {
                paramsRecord(newVal);
            }
        },
        "filter.keyword" (val, oldVal) {
            this.reloadData();
        }
    },
    computed: {},
    methods: {
        /**
         * @overwrite
         * 加载数据方法 用到该mixin的都应该重写该方法 否则无法实现加载数据
         */
        readList () {
            // 每个列表自己的获取数据的方法需要重写
        },
        initeState() {},

        handleSizeChange: function (val) {
            this.$cache.cacheSet("pageSize", val);
            this.pageSize = val;
            this.reloadData();
        },
        handleCurrentChange: function (index) {
            this.pageNo = index;
            this.refreshData();
        }
    },
    // 生命周期函数
    created () {
        // 重置页数，重新加载数据
        this.reloadData = this.$debounce(() => {
            this.pageNo = 1;
            this.readList();
        });
        // 重新加载数据
        this.refreshData = this.$debounce(() => {
            if (this.initeState()) {
                this.initeState().then(() => {
                    this.readList();
                }).catch(() => {});
            } else {
                this.readList();
            }
        });
        this.refreshData();
    }
};
