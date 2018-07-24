/**
 * Created by vyouyou on 18-2-6.
 */
const mixins = {
    data() {
        return {
            //submenu height
            subMenuHeight: 0,
            //翻页
            total: 0,
            pageSize: 10,
            pageNo: 1
        };
    },
    methods: {
        onColumnMouseEnter(e) {
            this.$emit("hoverColumn", e);
        },

        onColumnMouseLeave(e) {
            this.$emit("leaveColumn", e);
        },

        onVkSelectClick() {
            this.closeMenu();
        },

        closeMenu() {
            //当前有选中的 关闭menu
            if (this.curBusinessIndex && this.$refs.elMenu) {
                this.$refs.elMenu.closeMenu(this.curBusinessIndex);
                this.curBusinessIndex = null;
            }
        },

        //重置page的属性
        resetListState() {
            this.pageNo = 1;
        },
        onClose() {
            this.resetListState();
        },

        onOpen(event) {
            this.curBusinessIndex = event;
            this.resetListState();
            this.readList();
        },

        onPageChange(e) {
            this.pageNo = e;
            this.readList();
        }
    },

    mounted() {
        this.subMenuHeight = document.getElementById("container").offsetHeight - 84;
    }
};

export default mixins;
