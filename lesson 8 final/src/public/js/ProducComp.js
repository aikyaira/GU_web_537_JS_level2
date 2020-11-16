const product= {
    props: ['product'],
    data() {
      return {
          cartAPI: this.$root.$refs.cart, 
      };
    },

    template: `
    <div class="catalogItem">
                <a @click="$root.$refs.modal.setParameters(product.img, product.product_name, product.description, product.price)"><img :src="product.img" :alt="product.product_name"></a>
                    <h4>{{product.product_name}}</h4>
                    <span>{{product.price}}$</span>
                    <button class="buy-btn btn btn-outline-primary" @click="cartAPI.addProduct(product)">Buy</button>

            </div>
    `
};
const products= {
    components:{ product },
    data(){
        return {
            catalogUrl: '',
            products: [],
            filtered: [],
        }
    },
    methods: {
        filter(value){
            let regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted(){
        this.$parent.getJson('/api/products')
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
            });
    },
    template: `
<div class="container" id="dishes">
        <div class="row mtb">
            <h3 class="centered">EXCLUSIVE MENU</h3>
            <hr class="aligncenter mb">
            <p class="text-p centered">Enjoy our meals. You can click each menu to display more information.</p>
            <div class="col-md-12 catalogList">
                <product ref="refref" v-for="item of filtered" :key="item.id_product" :product="item"></product>
            </div>
        </div>
    </div>

    `
};
export default products;
