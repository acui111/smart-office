<template>
  <!-- 当前文档成员 -->
  <div id="doc-member">

    <div style="display:flex;justify-content:space-between;width:100%;height:32px;line-height:32px" v-if="owner">
      <p style="font-size:14px;color:rgba(102,102,102,1),margin:0">{{name}}</p>
      <p style="font-size:14px;color:rgba(102,102,102,1);margin-right:26px">创建者</p>
    </div>

    <div :id="id" class="doc-member-item" v-else>
      <div class="name">{{name}}</div>
      <a-select defaultValue="edit" style="width:80px;font-size:14px;color:rgba(102,102,102,1)">
          <a-select-option value="edit">可编辑</a-select-option>
          <a-select-option value="browse">仅浏览</a-select-option>
          <a-select-option value="remove">移除</a-select-option>
        </a-select>
    </div>
  </div>
</template>
  
<script type="text/ecmascript-6">
  export default {
    name:'DocMember',
    props:['id','name','owner'],
  }
</script>
  
<style scoped>
  #doc-member{
    width: 100%;
    height: 100%;
  }
  #doc-member .doc-member-item{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 32px;
    line-height:32px;
  }
  #doc-member .doc-member-item .name{
    font-size:14px;
    color:rgba(102,102,102,1);
  }
  /deep/.ant-select-selection {
    border: none;
    box-shadow:0 0 0 0px #fff;
  }
</style>