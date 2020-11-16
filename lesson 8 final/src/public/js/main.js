import cartsite from './CartSite'
import cart from './CartComp'
import products from './ProducComp'
import search from './FilterComp'
import error from './ErrorComp'
import modal from './ModalComp'
import overlay from './Overlay'
const app = new Vue({
    el: '#app',
   components: {
        cart,
        products,
        error,
        search,
        cartsite,
        overlay,
        modal,
    },
    data: {
        userSearch: '',
        tabs: ['products', 'cartsite'],
        currentTab: 'products',
    },
    computed: {
        currentComponent() {
            return `${this.currentTab}`;
        },
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    this.$refs.error.setError(error);
                })
        },
        postJson(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.error.setError(error);
              });
        },
        putJson(url, data) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.error.setError(error);
              });
        },
        deleteJson(url, data) {
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.error.setError(error);
              });
        },
    },
    mounted() {
        console.log(this);
    }
});
export default app;
