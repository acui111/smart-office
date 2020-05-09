<template>
  <div id="template-item" @click="selectTemplate">
    <img :src="thumbnail" alt="模板图片">
  </div>
</template>
  
<script type="text/ecmascript-6">
  export default {
    name:'TemplateItem',
    props:['url','fileType','callbackUrl','documentServer','thumbnail'],
    methods:{
      // 选择模板
      selectTemplate(){
        this.$http.post('/api/documents',{fileType:this.fileType})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          window.open(`${this.serverUrl}/editor?${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        })
      }
    },
    mounted(){
      // 获取文件服务器
      this.$http.get('/api/configs')
      .then((response)=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        this.fileServer = result.data.fileServer;
        this.serverUrl = 'http://localhost:8080';
      });
    }
  }
</script>
  
<style scoped>
  #template-item{
    width: 178px;
    height: 190px;
    text-align: center;
  }
  #template-item p{
    font-size:19px;
    color:rgba(102,102,102,1);
    margin-top:2px;
  }
</style>