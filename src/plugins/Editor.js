export default function (Vue) {
  const editor = new Vue({
    data(){
      return{
        userId:null,
        documentId:null,
      }
    }, 
  })
  
  Vue.mixin({
    created(){
      this.$editor = editor;
    }
  })
}

