<template>
  <!-- 当前文档成员 -->
  <div class="doc-member" :id="userId">

    <div style="display:flex;justify-content:space-between;width:100%;height:32px;line-height:32px" v-if="this.userId == this.$editor.userId">
      <p style="font-size:14px;color:rgba(102,102,102,1),margin:0">我</p>
      <p style="font-size:14px;color:rgba(102,102,102,1);margin-right:26px">创建者</p>
    </div>

    <div class="doc-member-item" v-else>
      <div class="name">{{username}}</div>
      <a-select 
        :value="selectedValue" 
        style="width:80px;font-size:14px;color:rgba(102,102,102,1)"
        @change="changeSelect"
        >
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
    props:['id','userId','username','writeable','readable','ownerId'],
    data(){
      return{
        selectedValue:'',
        // 可编辑
        edit:false,
        // 仅浏览
        browse:false,
      }
    },
    mounted(){
      this.selectedValue = (this.writeable)? 'edit':'browse';
    },
    methods:{
      changeSelect(value){
        this.selectedValue = value;
        if (value == 'edit') {
          this.edit = true;
          this.browse = false;
        }else if(value == 'browse'){
          this.edit = false;
          this.browse = true;
        }else{
          // 移除
          this.$http.delete()
        }
        this.$http.put(`http://smart-api.ztzl.com/smart-office/api/documents/${this.id}/privileges`,{writeable:this.edit,readable:this.browse})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      }
    }
  }
</script>
  
<style scoped>
  .doc-member{
    width: 100%;
    height: 100%;
  }
  .doc-member .doc-member-item{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 32px;
    line-height:32px;
  }
  .doc-member .doc-member-item .name{
    font-size:14px;
    color:rgba(102,102,102,1);
  }
  /deep/.ant-select-selection {
    border: none;
    box-shadow:0 0 0 0px #fff;
  }
</style>