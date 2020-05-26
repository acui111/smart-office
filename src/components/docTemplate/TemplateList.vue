<template>
  <div id="template-list">
    <div v-for="(template,index) in templateList" :key="index">
      <TemplateItem
        :thumbnail="template.thumbnail"
        :url="template.url"
        :name="template.name"
        :type="template.type"
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
      this.$http.get('http://smart-api.ztzl.com/smart-office/api/templates')
      .then(response=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        this.templateList = _.filter(response.data.data,(template)=>{
          return !_.includes(['新建文档','新建表格','新建演示'],template.name);
        });
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