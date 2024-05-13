<template>
    <div id='app'>
        <img src='./static/logo.jpg' class='logo-img'>
        <div>{{ title }}</div>
        <com></com>
    </div>
</template>

<script>
    import { ref, defineComponent } from 'vue';
    import Com from './components/Com.vue';
    export default {
        components: {
            Com
        },
        setup() {
            const title = ref('hello world');
            return { title };
        }
    }
</script>

<style>
    #app {
        color: red;
    }
    .logo-img {
        width: 80px;
        height: 80px;
    }
</style>
