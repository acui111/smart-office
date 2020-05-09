<template>
  <div id="editor">
    
  </div>
</template>
  
<script type="text/ecmascript-6">
import _ from 'lodash';
  export default {
    name:'Editor',
    methods:{
      openDocment(parms){
        const options = {
          "document": {
            // 文件类型
            "fileType": parms.fileType,
            "key": parms.id,
            // 文件名
            "title": parms.title,
            // 文件地址
            "url": parms.url
          },
          // 文档类型
          "documentType": parms.documentType,
          // 编辑相关配置
          "editorConfig": {
            // 
            "callbackUrl":parms.callbackUrl,
            // 语言
            "lang": "zh-cn",
            // 文档可编辑
            "mode": "edit"
          },
          "height": "100%",
          "width": "100%",
        };
        console.log('文档参数',options);
        const editor = new DocsAPI.DocEditor('editor',options);
      },
      getDocmentApi(documentServer){
        return new Promise((resolve,reject)=>{
          //动态添加script
          var script = document.createElement("script");
          script.type="text/javascript";
          script.src = `${documentServer}/web-apps/apps/api/documents/api.js`;
          document.getElementsByTagName('head')[0].appendChild(script);
          script.onload = ()=>{
            console.log('[加载文档服务API成功]');
            resolve();
          }
          script.onerror = () =>{
            console.log('[加载文档服务API失败]');
            reject();
          }
        });
      },
    },
    mounted(){
      //截取当前网址的query参数（id）
      const id =  window.location.search.substr(1);
      const options = {};
      //获取当前id对应的文档
      this.$http.get(`/api/documents/${id}`)
      .then(response=>{
        const result = response.data;
        //合并文档参数
        _.merge(options, result.data);
        //获取文档服务器
        return this.$http.get('/api/configs');
      })
      .then(response=>{
        const result = response.data;
        //合并文档参数
        _.merge(options, result.data);
        //获取文档服务的API
        return this.getDocmentApi(options.documentServer);
      })
      .then(()=>{
        //打开相应的文档
        this.openDocment(options);
      })
      .catch(error=>{
        this.$message.error(error);
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