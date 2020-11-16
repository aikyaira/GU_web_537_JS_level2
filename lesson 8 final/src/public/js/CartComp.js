const cartitem = {

    props: ['cartitem'],
    computed: {
        total: function () { 
            return this.cartitem.quantity * this.cartitem.price; 
        }
    },
    template: `
                <div class="cart-item">
                    <img :src="cartitem.img" alt="Some image">
                    <div class="product-desc">
                        <p class="product-title">{{cartitem.product_name}}</p>
                        <p class="product-quantity">Qty: {{cartitem.quantity}}</p>
                        <p class="product-single-price">{{cartitem.price}}$ per item</p>
                    </div>
                <div class="right-block">
                    <p class="product-price">Total: {{this.total}}$</p>                    
                </div>
                <button class="buy-btn btn btn-outline-primary" @click="$emit('remove', cartitem)">&times;</button>
            </div>
    `
};
const cart = {
    components:{ cartitem },
    data() {
        return {
            cartItems: [],
            showCart: false,
        }
    },
    methods: {
        addProduct(product) {
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, { quantity: 1 });
                find.quantity++;
            } else {
                let prod = Object.assign({ quantity: 1 }, product);
                this.$parent.postJson('/api/cart', prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod);

                        }
                    });
            }

        },
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id_product}`, { quantity: -1 })
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--

                        }
                    })
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id_product}`, item)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1)
                        }
                    });
            }

        }

    },
    computed: {
        amount: function () { 
            return this.cartItems.reduce((a, b) => a + b.quantity, 0); 
        },
        total: function () { 
                let b=0
                this.cartItems.forEach(function(el){
                let a=0; 
                a+=el.price * el.quantity;
                b+=a;
            }); 
        return b;                    
        }
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for (let el of data.contents) {
                    this.cartItems.push(el);
                }
            });
    },
    template: `
        <div class="">
            <i class="ion-ios-cart og" @click="showCart = !showCart"></i>
            <div class="cart-block" v-show="showCart">
                <p v-if="!cartItems.length">Корзина пуста</p>
                <cartitem 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cartitem="item" 
                @remove="remove">
                </cartitem>
                <div class="totalInCart">
                Quantity: {{this.amount}}<br/>
                Total: {{this.total}}$
                </div>
                <div class="gotoCart"><button class="buy-btn btn btn-outline-primary" @click="$root.currentTab = $root.tabs[1]">Go to cart</button></div>
            </div>
        </div>`
};


export default cart;