import {v4 as uuidv4} from 'uuid';

export default function (Vue) {

    const bus = new Vue({});

    Vue.mixin({
        beforeCreate() {
            this.sourceId = uuidv4();
            this.eventMap = {};
            this.$events = {};
            this.$events.emit = (type, data) => {
                bus.$emit(type, {id: this.sourceId, data});
            };
            this.$events.on = (type, fn) => {
                this.eventMap[type] = ({id, data}) => {
                    if (id != this.sourceId) {
                        fn(data);
                    }
                };
                bus.$on(type, this.eventMap[type]);
            };
        },
        beforeDestroy() {
            for (let type in this.eventMap) {
                bus.$off(type, this.eventMap[type]);
            }
        },
        methods: {}
    });
}