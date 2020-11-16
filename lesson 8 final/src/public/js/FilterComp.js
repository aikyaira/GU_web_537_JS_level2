const search = {
    data(){
        return {
            userSearch: ''
        }
    },
    template: `
            <form action="#" class="search-form" @submit.prevent="$root.$children[2].filter(userSearch)">
                <input type="text" class="search-field" v-model="userSearch">
                    <i class="ion-ios-search og"></i>
            </form>
    `
};
export default search;