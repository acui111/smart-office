<template>
  <!-- 共享设置 -->
  <div id="share-set">
    <a-modal
      :visible="shareSetVisible"
      :closable=false
      :centered=true
      :footer="null"
      width="475px"
      :bodyStyle="{
          'width':'475px',
          'padding':'0',
          'height':'413px',
          'background':'rgba(255,255,255,1)',
          'border':'1px solid rgba(148,148,148,1)',
          'border-radius':'2px'
          }"
      >

      <div style="
          width:100%;
          height:45px;
          line-height:45px;
          text-align:center;
          position:relative;
          border-bottom:1px solid rgba(222,222,222,1)
          "
        >
        <span 
          style="font-size:17px;color:rgba(51,51,51,1);"
        >共享设置</span>
        <div class="close" @click="closeShareSet" />
      </div>

      <div 
        style="width:100%;height:367px;position:relative"
        >
        <div style="width:100%;padding-left:20px">
          <!-- 内容头部 （文档成员） -->
          <div style="
            display:flex;
            height:40px;
            line-height:40px;
            text-align:center;
            border-bottom:2px solid rgba(241,241,241,1);
            justify-content:space-between
            ">
            <p style="font-size:14px;color:rgba(102,102,102,1)">文档成员</p>
            <p style="font-size:14px;color:rgba(17,204,212,1);margin-right:20px;cursor:pointer" @click="addMember">+添加文档成员</p>
          </div>
          
          <!-- 每一个文档成员 -->
          <div style='width:100%;height:280px;padding:0 20px;overflow-y:auto'>
            <div v-for="(docMember,index) in docMembers " :key="index">
              <DocMember
                :id="docMember.id"
                :userId="docMember.userId"
                :username="docMember.username"
                :writeable="docMember.writeable"
                :readable="docMember.readable"
                :ownerId="docMember.ownerId"
                />
            </div>

          </div>
        </div>
      </div>
    </a-modal>
    <MemberAdd/>
  </div>
</template>
  
<script type="text/ecmascript-6">
  import DocMember from './DocMember';
  import MemberAdd from './MemberAdd';
  import _ from 'lodash';
  export default {
    name:'ShareSet',
    data(){
      return{
        shareSetVisible:false,
        docMembers:[],
        documentId:null,
      }
    },
    components:{
      DocMember,
      MemberAdd
    },
    mounted(){
      this.$events.on('docMembers',({docMembers})=>{
        this.docMembers = docMembers;
        console.log(this.docMembers);
      })
      //共享设置显示
      this.$events.on('shareSetVisible',({shareSetVisible,id})=>{
        this.documentId = id;
        this.$editor.documentId = id;
        this.shareSetVisible = shareSetVisible;
        // 获取对该文档有权限的所有成员
        this.$http.get(`http://smart-api.ztzl.com/smart-office/api/documents/${id}/privileges`)
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.docMembers = result.data;
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        });
      });
      //共享设置关闭
      this.$events.on('closeSetModal',(data)=>{
        this.shareSetVisible = data;
      });
    },
    methods:{
      //右上角关闭
      closeShareSet(){
        this.shareSetVisible = false;
      },
      //添加文档成员
      addMember(){
        this.$events.emit('addMember',{'addMemberVisible':true,"members":this.docMembers,'documentId':this.documentId});
      }
    }
  }
</script>
  
<style scoped>
  .close{
    width: 12px;
    height: 12px;
    background-image: url('/smart-office/image/icon_close.png');
    background-size: cover;
    position:absolute;
    right:0;
    top:0;
    margin:12px;
  }
  .confirm{
    width: 66px;
    height: 24px;
    background-image: url('/smart-office/image/button_yes.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 106px 13px 0;
  }
  .confirm:hover{
    background-image: url('/smart-office/image/button_yes_s.png');
  }
  .cancel{
    width: 66px;
    height: 24px;
    background-image: url('/smart-office/image/button_no.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 13px 13px 0;
  }
  .cancel:hover{
    background-image: url('/smart-office/image/button_no_s.png');
  }
</style>