<template>
  <div id="editor">
  </div>
</template>
  
<script type="text/ecmascript-6">
import _ from 'lodash';
  export default {
    name:'Editor',
    methods:{
      getExtname(filename){
        const index = filename.lastIndexOf(".");
        return filename.substr(index+1);
      },
      openDocment(parms){
        const options = {
          "document": {
            // 文件类型
            "fileType":`${this.getExtname(parms.url)}`,
            "key": `${parms.id}`,
            // 文件名
            "title": parms.name,
            // 文件地址
            "url": `http://10.144.176.97:7000/smart-hfs/${parms.url}`,
          },
          // 文档类型
          "documentType": parms.type,
          // 编辑相关配置
          "editorConfig": {
            // 
            "callbackUrl":parms.callbackUrl,
            // 语言
            "lang": "zh-cn",
            // 文档可编辑
            "mode": (parms.writeable)? 'edit':'view',
            // 当前用户
            // "user": {
            //   "id": parms.userId,
            //   "name": parms.username,
            // }
          },
          "height": "100%",
          "width": "100%",
        };
        console.log('文档参数',options);
        const editor = new DocsAPI.DocEditor('editor',options);
      },
    },
    mounted(){
      //截取当前网址的query参数（id）
      const id =  this.$route.params.id;
      const options = {};
      //获取当前id对应的文档
      this.$http.get(`http://smart-api.ztzl.com/smart-office/api/documents/${id}`)
      .then(response=>{
        const result = response.data;
        //合并文档参数
        _.merge(options, result.data);
        options.callbackUrl = 'http://10.144.176.110:8080/smart-office/api/callbackUrl';
      })
      .then(()=>{
        //打开相应的文档
        this.openDocment(options);
      })
      .catch(error=>{
        this.$message.error(error.response.data.message);
      })
    }
  }
</script>
  
<style scoped>
  #editor{
    width: 100%;
    height: 100%;
  }
</style>