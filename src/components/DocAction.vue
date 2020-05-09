<template>
  <div id="type-list">
    <!-- 新建文档 -->
    <div 
      class="add-word" 
      @click="toEditWord" 
      :class="{active:this.selected == 'word'}"
        >
      <img src="/image/icon_word.png" alt="新建文档">
      <span>新建文档</span>
    </div>
    <!-- 新建表格 -->
    <div 
      class="add-excel" 
      @click="toEditExcel" 
      :class="{active:this.selected == 'excel'}"
        >
      <img src="/image/icon_excel.png" alt="新建表格">
      <span>新建表格</span>
    </div>
    <!-- 新建演示 -->
    <div 
      class="add-ppt" 
      @click="toEditPPT" 
      :class="{active:this.selected == 'ppt'}"
        >
      <img src="/image/icon_ppt.png" alt="新建演示">
      <span>新建演示</span>
    </div>
    <!-- 上传文件 -->
    <div 
      class="upload-doc" 
      :class="{active:this.selected == 'upload'}"
      >
      <a-upload
        name="hfs"
        accept='.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf'
        :multiple="false"
        :showUploadList="false"
        :action="fileServer"
        @change="uploadDoc"
        >
      <img src="/image/icon_upload.png" alt="上传文件">
      <span>上传文件</span>
      </a-upload>
    </div>

  </div>
</template>
  
<script type="text/javascript">
  import _ from 'lodash';
  export default {
    name:'TypeList',
    data(){
      return{
        selected: "",
        fileServer:'',
        serverUrl:'',
      }
    },
    methods:{
      //新建文档
      toEditWord(){
        this.$http.post('/api/documents',{fileType:'docx'})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$message.success("新建文档成功");
          this.$events.emit('documentList');
          window.open(`${this.serverUrl}/editor?${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //新建表格
      toEditExcel(){
        this.$http.post('/api/documents',{fileType:'xlsx'})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$message.success("新建表格成功");
          this.$events.emit('documentList');
          window.open(`${this.serverUrl}/editor?${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //新建PPT
      toEditPPT(){
        this.$http.post('/api/documents',{fileType:'pptx'})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$message.success("新建演示成功");
          this.$events.emit('documentList');
          window.open(`${this.serverUrl}/editor?${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //上传文件
      uploadDoc(info){
        const {status,response,name} = info.file
        if (status === 'done') {
          this.$http.post('/api/documents',{
            title:response.originalname,
            url:response.filename
            })
          .then(response=>{
            this.$message.success(`${name}上传成功`);
            this.$events.emit('documentList');
          })
          .catch(error=>{
            this.$message.error(error.response.data.message);
          })

        } else if (status === 'error') {
          this.$message.error(`${name}上传失败`);
        }
      },
    },
    mounted(){
      this.$http.get('/api/configs')
      .then((response)=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        this.fileServer = result.data.fileServer;
        this.serverUrl = 'http://localhost:8080';
      });
    }
  }
</script>
  
<style scoped>
  #type-list{
    width: 20%;
    height: 100%;
    padding: 37px;
    display: flex;
    flex-direction:column;
    justify-content: space-around;
  }
  #type-list div{
    width:100%;
    height: 44px;
    background-color:rgba(255,255,255,1);
    box-shadow:0px 1px 5px 0px rgba(35,35,35,0.2);
    border-radius:2px;
    text-align: center;
    line-height: 44px;
  }
  #type-list div:hover{
    background-color:#E9E9E9;
  }
  .active{
    background-color:#E9E9E9 !important;
  }
  #type-list div img{
    width: 17px;
    height: 19px;
    margin:-4px 6px 0;
  }
  #type-list div span{
    font-size: 17px;
    font-weight: 400;
    color:rgba(51,51,51,1);
  }
</style>