<template>
  <div id="template-list">
    <div v-for="(template,index) in templateList" :key="index">
      <TemplateItem
        :thumbnail="template.thumbnail"
        :url="template.url"
        :fileType="template.fileType"
        />
    </div>
  </div>
</template>
  
<script type="text/ecmascript-6">
import _ from 'lodash';
import TemplateItem from './TemplateItem'
  export default {
    name:'TemplateList',
    components:{
      TemplateItem
    },
    data(){
      return{
        templateList:[],
      }
    },
    mounted(){
      // 获取所有的模板
      this.$http.get('/api/templates')
      .then(response=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        this.templateList = response.data.data;
      })
      .catch(error=>{
        this.$message.error(error.response.data.message);
      })
    }
  }
</script>
  
<style scoped>
  #template-list{
    width: 80%;
    height: 100%;
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
</style>