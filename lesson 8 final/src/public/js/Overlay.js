const overlay= {
    data(){
      return{
          show:false
      }
    },
    methods:{
      showOverlay(){
        this.show=true;
    },
      closeOverlay(){
        this.show=false;
    },
    },
    template: `<div v-if="show" class="overlay"></div>`,
  };
  export default overlay;