<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div style="position: relative" :class="propClass">
        <header class="header" @click="onHeaderClick">
            <span>{{label.label}}</span>
            <i class="el-icon-caret-top" :class="{'is-reverse':!isOpen}"></i>
        </header>
        <div class="drop-down-style" v-show="isOpen">
            <ul>
                <li v-for="(option,index) in options" style="cursor: pointer;" @click="onSelect(option)" :key="index">{{option.label}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "vk-select",
    props: {
        options: {
            type: Array,
            default() {
                return [
                ];
            }
        },
        value: [String, Number],
        propLabel: {
            type: String,
            default: ""
        },
        propClass: [Object]
    },

    data() {
        return {
            isOpen: false
        };
    },

    watch: {
        options(val) {
        }
    },

    computed: {
        label() {
            const obj = {};
            if (!this.value || !this.options.length) {
                obj.label = "";
            } else {
                const temp = this.options.find((option) => {
                    return option.value + "" === this.value + "";
                });
                obj.label = temp ? temp.label : "";
            }
            obj.label = obj.label ? obj.label : this.propLabel;
            return obj;
        }
    },
    methods: {
        onHeaderClick() {
            if (!this.propClass.isDisabled) {
                this.isOpen = !this.isOpen;
                this.$emit("onHeaderClick");
            }
        },
        onSelect(e) {
            this.$emit("input", e.value);
            this.isOpen = false;
        }
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
header {
  height: 46px;
  line-height: 46px;
  cursor: pointer;
}

.drop-down-style {
  position: relative;
  z-index: 1000;
  max-height: 200px;
  overflow: scroll;
  float: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-icon-caret-top {
  margin-left: 10px;
}

.is-reverse {
  transform: rotateZ(180deg);
}
</style>
