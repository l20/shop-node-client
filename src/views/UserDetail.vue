<template>
    <div class="aw-user-detail">
        <p>Hello I am user detail component.</p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {},
    methods: {
        ...mapActions([
            'changeNavBread',    
        ]),
    },
}

</script>
