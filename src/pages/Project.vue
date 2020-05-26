<template>
  <div id="project">
    <div class="project-header">
      <DocAction />
      <TemplateList/>
    </div>
    <DocList />
    <ShareSet />
  </div>
</template>

<script type="text/ecmascript-6">
import DocAction from '../components/DocAction'
import TemplateList from '../components/docTemplate/TemplateList'
import DocList from '../components/allDoc/DocList'
import ShareSet from '../components/ShareSet'
  export default {
    name:'Project',
    components:{
      DocAction,
      TemplateList,
      DocList,
      ShareSet
    },
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
