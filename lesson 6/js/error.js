Vue.component('error', {
    data() {
        return {
            errText: '',
        }
    },

    methods: {
        setError(error) {
            this.errText = error;
        }
    },

    computed: {
        isVisible() {
            return this.errText !== '';
        }
    },

    template: `    
    <div class="errModal" v-if="isVisible">
        <button class="closeErrBtn" @click="setError('')">&times;</button>
        <h3>Ошибка!</h3>
        <p class="errMsg">            
            {{errText}}            
        </p>
    </div>`,
});
