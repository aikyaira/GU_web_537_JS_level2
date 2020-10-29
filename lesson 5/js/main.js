const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        imgCatalog: 'https://placehold.it/200x150',
        searchLine: '',
        filteredProducts: [],
        isVisibleCart: false,
        cartUrl: '/getBasket.json',
        addToBasketURL: '/addToBasket.json',
        deleteFromBasketUrl: '/deleteFromBasket.json',
        cartProducts: [],

    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(id) {
            this.getJson(`${API}${this.addToBasketURL}`)
                .then(data => {
                    if (data.result === 1) {
                        const existedItem = this.cartProducts.find(product => product.id_product === +id);
                        if (existedItem) {
                            existedItem.quantity += 1;
                        } else {
                            const nonExistedItem = this.products.find(product => product.id_product === +id);
                            nonExistedItem.quantity = 1;
                            this.cartProducts.push(nonExistedItem);
                        }
                    }
                    else {
                        alert('Error');
                    }
                });

            //console.log(product.id_product)
        },
        deleteProduct(id) {
            this.getJson(`${API}${this.deleteFromBasketUrl}`)
                .then(data => {
                    if (data.result === 1) {

                        const existedItem = this.cartProducts.find(product => product.id_product === +id)
                        if (existedItem && existedItem.quantity != 1) {
                            existedItem.quantity -= 1;
                        } else {
                            this.cartProducts = this.cartProducts.filter((nextItem) => (nextItem.id_product != id));
                        }
                    }
                    else {
                        alert('Error');
                    }
                });

        },
        search() {
            if (this.searchLine === "") {
                this.filteredProducts = this.products;
            } else {
                let regexp = new RegExp(this.searchLine, 'i');
                this.filteredProducts = this.products.filter(el => regexp.test(el.product_name));
            }

        },
        cartVisibility() {           
                this.isVisibleCart = !this.isVisibleCart           
        },
    },
    computed: {
        isProductsInCart() {
            if (this.cartProducts.length > 0) {
                return true
            } else {
                return false
            }
        }
    },
    beforeCreate() {
        //console.log('beforeCreate');
    },
    created() {
        //console.log('created');
        this.getJson(`${API}${this.catalogUrl}`)
            .then(data => {
                for (el of data) {
                    this.products.push(el);
                }
                this.filteredProducts = this.products;
            });
        this.getJson(`${API}${this.cartUrl}`)
            .then(data => {
                for (el of data.contents) {
                    this.cartProducts.push(el);
                }
            });
    },
    beforeMount() {
        //console.log('beforeMount');
    },
    mounted() {
        //console.log('mounted');
    },
    beforeUpdate() {
        //console.log('beforeUpdate');
    },
    updated() {
        //console.log('updated');
    },
    beforeDestroy() {
        //console.log('beforeDestroy');
    },
    destroyed() {
        //console.log('destroyed');
    },
});
