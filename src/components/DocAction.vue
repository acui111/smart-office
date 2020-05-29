<template>
  <div id="type-list">
    <!-- 新建文档 -->
    <div 
      class="add-word" 
      @click="toEditWord" 
        >
      <img src="/smart-office/image/icon_word.png" alt="新建文档">
      <span>新建文档</span>
    </div>
    <!-- 新建表格 -->
    <div 
      class="add-excel" 
      @click="toEditExcel" 
        >
      <img src="/smart-office/image/icon_excel.png" alt="新建表格">
      <span>新建表格</span>
    </div>
    <!-- 新建演示 -->
    <div 
      class="add-ppt" 
      @click="toEditPPT" 
        >
      <img src="/smart-office/image/icon_ppt.png" alt="新建演示">
      <span>新建演示</span>
    </div>
    <!-- 上传文件 -->
    <div 
      class="upload-doc" 
      >
      <a-upload
        name="hfs"
        accept='.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf'
        :multiple="false"
        :showUploadList="false"
        action="http://smart.ztzl.com/smart-hfs"
        @change="onUploaded"
        >
      <img src="/smart-office/image/icon_upload.png" alt="上传文件">
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
        templateList:[],
      }
    },
    methods:{
      //新建文档
      toEditWord(){
        const template = _.find(this.templateList,{name:'新建文档.docx'});
        if (!template) {
          this.$message.warning('未匹配到文档模板');
          return;
        }
        this.$http.post('http://smart-api.ztzl.com/smart-office/api/documents',{type:'text',name:template.name,url:template.url})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$events.emit('documentList');
          window.open(`http://smart.ztzl.com/smart-office/#/editor/${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //新建表格
      toEditExcel(){
        const template = _.find(this.templateList,{name:'新建表格.xlsx'});
        if (!template) {
          this.$message.warning('未匹配到表格模板');
          return;
        }
        this.$http.post('http://smart-api.ztzl.com/smart-office/api/documents',{type:'spreadsheet',name:template.name,url:template.url})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$events.emit('documentList');
          window.open(`http://smart.ztzl.com/smart-office/#/editor/${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //新建PPT
      toEditPPT(){
        const template = _.find(this.templateList,{name:'新建演示.pptx'});
        if (!template) {
          this.$message.warning('未匹配到演示模板');
          return;
        }
        this.$http.post('http://smart-api.ztzl.com/smart-office/api/documents',{type:'presentation',name:template.name,url:template.url})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$events.emit('documentList');
          window.open(`http://smart.ztzl.com/smart-office/#/editor/${result.data.id}`);
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      },
      //上传文件
      onUploaded(info){
        const {status,response,name} = info.file
        const type = this.getDocmentType(name);
        if (!type) {
          return this.$message.error('不支持的文件格式');
        }
        if (status === 'done') {
          this.$http.post('http://smart-api.ztzl.com/smart-office/api/documents',{
            type,
            name:response.originalname,
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

      // 获取文件类型
      getDocmentType(filename){
        const index = filename.lastIndexOf(".");
        const extname = filename.substr(index+1);
        switch (extname) {
          case 'docx':
          case 'doc':
          case 'odt':
          case 'txt':
          case 'pdf':
            return 'text';
          
          case 'xlsx':
          case 'xls':
          case 'ods':
          case 'csv':
            return 'spreadsheet';

          case 'pptx':
          case 'ppt':
          case 'odp':
            return 'presentation';

        }
      }
      
    },
    mounted(){
      this.$http.get('http://smart-api.ztzl.com/smart-office/api/templates')
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