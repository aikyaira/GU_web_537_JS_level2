Vue.component('search', {
    template: `
    <form action="#" class="search-form" @submit.prevent="$root.$refs.products.filter()">
            <input v-model="searchLine" type="text" class="search-field">
            <button class="btn-search" type="button">
                <i class="fas fa-search"></i>
            </button>
        </div>
        </form>
    `,
    data: () => ({
        searchLine: '',
    }),

})