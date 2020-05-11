<template>
  <div id="doc-list">

    <!-- 头衔（文档/浏览/创建者） -->
    <div class="doc-list-title">
      <!-- 选择文档（全部/我创建/回收站） -->
      <div class="doc-list-title-left">
        <a-select 
          defaultValue="create"
          style="width:130px;font-size:17px;color:rgba(102,102,102,1)" 
          @change="selectDoc">
          <a-select-option value="create">我创建的文档</a-select-option>
          <a-select-option value="all">全部文档</a-select-option>
          <a-select-option value="recycle">回收站</a-select-option>
        </a-select>
      </div>

      <!-- 最近浏览 -->
      <div class="doc-list-title-center">
        最近浏览
      </div>

      <!-- 创建者 -->
      <div class="doc-list-title-right">
        创建者
      </div>

    </div>

    <!-- 每一项文档 -->
    <div v-for="(document,index) in documentList" :key="index">
      <DocItem
        :id="document.id"
        :fileType="document.fileType"
        :ownerName="document.ownerName"
        :title="document.title"
        :url="document.url"
        :modifyTime="document.modifyTime"
        :status="document.status"
        :permissions="document.permissions"
        />
    </div>

    <!-- 分页器 -->
    <a-pagination
      class="pagination"
      :hideOnSinglePage="true"
      :total="total"
      :pageSize="10"
      @change="changePagination"
      >
    </a-pagination>
    
  </div>
</template>
  
<script type="text/ecmascript-6">
  import DocItem from './DocItem';
  import _ from 'lodash';
  export default {
    name:'DocList',
    components:{
      DocItem
    },
    data(){
      return{
        documentList:[],
        total:0,
        filters:{
          // 我创建的文档
          owner:1,
          // 当前文档是否有效
          status:1, 
        },
      }
    },
    methods: {
      //选择排序方式
      selectDoc(seleted) {
        if (seleted === 'create') {
          console.log('选择我创建的文档');
          this.filters.owner = 1;
          this.filters.status = 1;
          this.changePagination(1,10);
        }
        else if(seleted === 'recycle'){
          console.log('选择回收站');
          this.filters.owner = 1;
          this.filters.status = 0;
          this.changePagination(1,10);
        }
        else{
          console.log('选择全部文档');
          this.filters.owner = 0;
          this.filters.status = 1;
          this.changePagination(1,10);
        }
      },
      //切换分页
      changePagination(page,pageSize){
        const url = `/api/documents?start=${(page - 1)* pageSize}&limit=${pageSize}&owner=${this.filters.owner}&status=${this.filters.status}`;
        this.$http.get(url)
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.total = result.data.total;
          this.documentList = result.data.rows;
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      }
    },
    mounted(){
      //获取所有的文档
      this.changePagination(1,10);
      //上传/新建后再次获取文档
      this.$events.on('documentList',()=>{
        this.changePagination(1,10);
      });
    }
  }
</script>
  
<style scoped>
  #doc-list{
    width: 100%;
    height: calc(100% - 310px);
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 5px 0px rgba(35,35,35,0.08);
    padding: 0 42px;
    position: relative;
  }
  #doc-list .doc-list-title{
    width:100%;
    height: 44px;
    line-height:44px;
    display: flex;
    font-size:17px;
    color:rgba(102,102,102,1);
  }
  #doc-list .doc-list-title .doc-list-title-left{
    width: 55%;
  }
  /deep/.ant-select-selection {
    border: none;
    box-shadow:0 0 0 0px #fff;
  }
  /deep/ .ant-select-selection__rendered{
    margin:0;
  }
  #doc-list .doc-list-title .doc-list-title-center{
    width: 15%;
    text-align: center;
  }
  #doc-list .doc-list-title .doc-list-title-right{
    width: 20%;
    text-align: center;
  }
  .pagination{
    position:absolute;
    right: 10px;
    bottom: 10px;
  }
</style>