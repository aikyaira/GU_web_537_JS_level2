const cartsiteitem= {
    props: ['cartsiteItem'],
    computed: {
        total: function () {
            return this.cartsiteItem.quantity * this.cartsiteItem.price;
        }
    },
    template: `
                <div class="row cartSiteItem">
                    <div class="col-md-3"><img :src="cartsiteItem.img" alt="Some image"></div>
                    <div class="col-md-3 textCartItem">{{cartsiteItem.product_name}}</div>                        
                    <div class="col-md-2 textCartItem"><button @click="$root.$refs.cart.remove(cartsiteItem)" class="plusMinus">-</button><span >{{cartsiteItem.quantity}}</span><button @click="$root.$refs.cart.addProduct(cartsiteItem)" class="plusMinus">+</button></div>
                    <div class="col-md-2 textCartItem">{{cartsiteItem.price}}$</div>                
                    <div class="col-md-2 textCartItem">{{this.total}}$</div> 
                                  
                </div>
    `
};
//export default cartsiteitem;
const cartsite = {
    components:{ cartsiteitem },
    template: `
    <div class="container">
    <div class="row mtb">
        <h3 class="centered">CART</h3>
        <hr class="aligncenter mb">
        <div class="col-md-12">
        <div class="row cartSiteHeader">
            <div class="col-md-3">Image</div>
            <div class="col-md-3">Name</div>                        
            <div class="col-md-2">Quantity</div>
            <div class="col-md-2">Per item</div>                
            <div class="col-md-2">Total</div>    
        </div> 
        <hr class="aligncenter mb" style="width: 100%">
        <cartsiteitem 
            v-for="item of this.$root.$refs.cart.cartItems" 
            :key="item.id_product"
            :cartsiteItem="item" 
            >
        </cartsiteitem>
        <hr class="aligncenter mb" style="width: 100%">
           
           <div class="gTotal">Grand total {{this.$root.$refs.cart.total}}$</div>
        </div>
    </div>
</div>
    `
};
export default cartsite;
