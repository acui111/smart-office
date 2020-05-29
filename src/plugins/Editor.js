export default function (Vue) {
  const editor = new Vue({
    data(){
      return{
        userId:null,
      }
    }, 
  })
  
  Vue.mixin({
    created(){
      this.$editor = editor;
    }
  })
}

