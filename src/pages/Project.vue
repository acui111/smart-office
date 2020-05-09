<template>
  <div id="project">
    <div class="project-header">
      <DocAction />
      <TemplateList/>
    </div>
    <DocList />
    <ShareSet />
    <DocDelete />
  </div>
</template>

<script type="text/ecmascript-6">
import DocAction from '../components/DocAction'
import TemplateList from '../components/docTemplate/TemplateList'
import DocList from '../components/allDoc/DocList'
import ShareSet from '../components/ShareSet'
import DocDelete from '../components/DocDelete'
  export default {
    name:'Project',
    data(){
      return {
        
      }
    },
    components:{
      DocAction,
      TemplateList,
      DocList,
      ShareSet,
      DocDelete
    },

    mounted(){
       //获取config配置
      this.$http.get('/api/configs')
      .then((response)=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        //加载文档服务API
          var script = document.createElement("script");
          script.type="text/javascript";
          script.src = `${result.data.documentServer}/web-apps/apps/api/documents/api.js`;
          document.getElementsByTagName('head')[0].appendChild(script);
          script.onload = ()=>{
            console.log('[加载文档服务API成功]');
          }
          script.onerror = () =>{
            console.log('[加载文档服务API失败]');
          }
      })
      .catch(error=>{
          this.$message.error(error.response.data.message);
      });
    }
  }
</script>

<style scoped>
#project {
  width: 100%;
  height: 100%;
}
#project .project-header {
  width: 100%;
  height: 310px;
  background: #f5f5f5;
  display: flex;
}
</style>
