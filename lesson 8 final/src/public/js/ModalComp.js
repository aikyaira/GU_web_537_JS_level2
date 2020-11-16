
const modal= {
    data() {
        return {
            img: '',
            name: '',
            desc: '',
            price: 0,
            show:false,
        }
    },
    methods: {
        setParameters(img, name, desc, price){
            this.img=img;
            this.price=price;
            this.desc=desc;
            this.name=name;
            this.showModal();

        },
        showModal(){
            this.show=true;
            this.$root.$refs.overlay.showOverlay();
        },
        closeModal(){
            this.show=false;
            this.$root.$refs.overlay.closeOverlay();
        },
    },
    template: `
    <div v-if="this.show" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" @click="closeModal()">&times;</button>
          <h5 class="modal-title">{{this.name}}</h5>
        </div>
        <div class="modal-body">
          <img class="img-responsive aligncenter" :src="this.img" alt="">
          <h4>Description</h4>
          <p class="text-p" v-html="this.desc"></p>
          <h5>Price..........{{this.price}}$</h5>
        </div>
      </div>
    </div>   
  </div>
 </div>
    `
};

export default modal;



