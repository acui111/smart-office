<template>
  <div id="template-item" @click="selectTemplate">
    <img :src="`http://smart.ztzl.com/smart-hfs/${thumbnail}`" alt="模板图片">
    <p>{{name}}</p>  
  </div>
</template>

  
<script type="text/ecmascript-6">
  export default {
    name:'TemplateItem',
    props:['url','name','thumbnail','type'],
    methods:{
      //拿到文件类型
      getExtname(filename){
        const index = filename.lastIndexOf(".");
        return filename.substr(index+1);
      },
      // 选择模板
      selectTemplate(){

        let fileType = null;

        if (this.type == 'text') {
          fileType = "新建文档";

        }else if(this.type == 'spreadsheet'){
          fileType = "新建表格";

        }else if(this.type == 'presentation'){
          fileType = "新建文稿";

        }else{
          return this.$message.error("不支持的模板");
        }
        const exitname = this.getExtname(this.url);
        const filename = `${fileType}.${exitname}`;

        this.$http.post('http://smart-api.ztzl.com/smart-office/api/documents',{type:this.type,name:filename,url:this.url})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          window.open(`http://smart.ztzl.com/smart-office/#/editor/${result.data.id}`);
          this.$events.emit('documentList');
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        })
      }
    },
  }
</script>
  
<style scoped>
  #template-item{
    width: 178px;
    height: 190px;
    text-align: center;
  }
  #template-item p{
    font-size:16px;
    color:rgba(102,102,102,1);
    margin-top:8px;
  }
</style>