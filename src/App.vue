<template>
    <div id='app'>
        <img src='./static/logo.jpg' class='logo-img'>
        <div>{{ title }}</div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    export default {
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
