<template>
  <!-- 删除文档 -->

  <div id="doc-delete">
    <a-modal
      :visible="deleteDocVisible"
      :closable=false
      :centered=true
      :footer="null"
      width="570"
      :bodyStyle="{
        'width':'570px',
        'padding':'0',
        'height':'192px',
        'background':'rgba(255,255,255,1)',
        'border':'1px solid rgba(148,148,148,1)',
        'border-radius':'2px'
        }"
      >
      <div
        style="
          width:100%;
          height:42px;
          line-height:45px;
          text-align:center;
          position:relative;
          border-bottom:1px solid rgba(222,222,222,1)
          "
        >
        <span 
          style="font-size:17px;color:rgba(51,51,51,1);"
        >删除文档</span>
      </div>
      <div style="width:100%;height:150px;position:relative">
        <div style="font-size:19px;color:rgba(102,102,102,1);padding:45px 0 0 60px">是否确定删除此文档？</div>
        <div class="confirm" @click="confirm" />
        <div class="cancel" @click="cancel" />
      </div>
    </a-modal>
  </div>

</template>
  
<script type="text/ecmascript-6">
  export default {
    name:'DocDelete',
    data(){
      return{
        deleteDocVisible:false,
        id:0,
      }
    },
    mounted(){
      // 是否展示删除遮罩/文档id
      this.$events.on('removeDoc',({removeDocVisible,id})=>{
        this.deleteDocVisible = removeDocVisible;
        this.id = id;
      })
    },
    methods:{
      //确定删除
      confirm(){
        this.deleteDocVisible = false;
        //发送id对应的文档
        this.$events.emit('deleteDoc',{'id':this.id})
        this.$http.delete(`/api/documents/${this.id}`)
        .then(response=>{
          this.$message.success('删除成功');
          //获取所有文档
          this.$http.get('/api/documents')
          .then(response=>{
            if (!result.successful) {
              return this.$message.error(result.message);
            }
            const result = response.data.rows;
            this.$events.emit('documentList',result);
            console.log('删除后刷新文档');
          })
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        })
      },
      //取消删除
      cancel(){
        this.deleteDocVisible = false;
      },
    }
  }
</script>
  
<style scoped>
  .confirm{
    width: 65px;
    height: 24px;
    background-image: url('/image/button_yes.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 108px 14px 0;
  }
  .confirm:hover{
    background-image: url('/image/button_yes_s.png');
  }
  .cancel{
    width: 65px;
    height: 24px;
    background-image: url('/image/button_no.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 14px 14px 0;
  }
  .cancel:hover{
    background-image: url('/image/button_no_s.png');
  }
</style>