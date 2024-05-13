<template>
    <div class="com">
        {{ com }}
    </div>
</template>

<script>
    import { ref } from 'vue';
    export default {
        setup() {
            const com = ref('world');
            return { com };
        }
    }
</script>

<style>
    .com {
        color: green;
    }
</style>