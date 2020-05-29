<template>
  <div>
    <div
      :id="id"
      class="doc-item" 
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      ref="doc-item"
      >

      <!-- 文档名称 -->
      <div class="doc-name" v-if="!inputShow">
        <!-- 文档标记 -->
        <img 
          :src=" url | formatType" 
          alt="文档标记" 
          style="margin-right:6px;vertical-align:text-bottom;width:20px;height:24px"
          >
        {{name}}
        <!-- 共享标记 -->
        <img 
          src="/smart-office/image/button_Share.png" 
          v-if="shareShow"
          alt="共享标记"
          style="width:50px;height:19px;margin-left:10px"
          />
      </div>
      
      <!-- 重命名的iuput框 -->
      <div class="doc-name" v-if="inputShow">
        <a-input
          @focus="focus($event)"
          @blur="blur($event)"
          v-model="resetName"
          :auto-focus=true
          style="width:200px;height:30px;padding:0 4px;font-size:16px"
          />
      </div>

      <!-- 文档创建时间 -->
      <div class="time">{{ createdTime | formatTime}}</div>

      <!-- 文档创建者 -->
      <div class="creator">{{ownerName}}</div>

      <!-- 多功能按键 -->
      <div @click="clickIconMenu" class="icon-menu">
        <img
          v-if="iconMenu"
          src="/smart-office/image/icon_menu.png"
          alt="多功能按键"
          >
      </div>
      <!-- 多功能设置 -->
      <div 
        class="icon-menu-set" 
        v-show="clickIconMenuShow" 
        ref="iconMenuSet"
        >
        <template v-if="status">
          <p @click="toSetModal" v-if="this.ownerId == this.$editor.userId">共享设置</p>
          <p @click="toEdit">编辑</p>
          <p @click="download">下载</p>
          <p @click="removeDoc">删除</p>
          <p @click="resetname">重命名</p>
          <p 
            @click="shareLink"
            :data-clipboard-text="openUrl"
            ref="shareLink"
            >
            分享链接
          </p>
        </template>
        <template v-else>
          <p @click="resetDoc">还原</p>
          <p @click="hardRemoveDoc">删除</p>
        </template>
      </div>

    </div>
  </div>
</template>
  
<script type="text/ecmascript-6">
import moment from 'moment';
moment.locale('zh-cn');
import ClipboardJS from 'clipboard';
import _ from 'lodash';
  export default {
    name:'DocItem',
    props:['id','type','name','url','createdTime','ownerName','status','ownerId'],
    data(){
      return{
        //多功能按钮
        iconMenu:false,
        //单击多功能按钮
        clickIconMenuShow:false,
        //重命名的输入框
        inputShow:false,
        //重命名输入框的取值
        resetName:'',
        //共享标记
        shareShow:false,
        //文档标记
        docTitleSrc:'',
        //
        openUrl:`http://smart.ztzl.com/smart-office/#/editor/${this.id}`,
      }
    },
    methods:{
      getDocmentType(url){
        const index = url.lastIndexOf(".");
        return url.substr(index+1);
      },

      //点击按钮显示多功能按键
      clickIconMenu(event){
        this.clickIconMenuShow = !this.clickIconMenuShow;
        const top = event.currentTarget.getBoundingClientRect().top;
        if (top >= 700 && this.clickIconMenuShow) {
          this.$refs.iconMenuSet.style.top = '-390%';
        }
      },

      //共享设置
      toSetModal(){
        this.$events.emit('shareSetVisible',{'shareSetVisible':true,'id':this.id});
        this.clickIconMenuShow = false;
      },

      //编辑
      toEdit(){
        window.open(`http://smart.ztzl.com/smart-office/#/editor/${this.id}`);
        this.clickIconMenuShow = false;
      },

      //下载
      download(){
        this.downloadUrlFile(this.url,this.name);
        this.clickIconMenuShow = false;
      },
      // 下载文件
      downloadUrlFile(url,name) {
        const type = this.getDocmentType(url);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://smart.ztzl.com/smart-hfs/${url}`, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            var url = URL.createObjectURL(xhr.response);
            var a = document.createElement('a');
            a.href = url;
            a.download = name; 
            a.click();
          }
        };
        xhr.send();
      },

      //删除文档
      removeDoc(){
        this.$warning({
          title:'提示',
          content: '删除后的文档可从回收站找回',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            this.$http.post(`http://smart-api.ztzl.com/smart-office/api/documents/${this.id}/status`,{status:0})
            .then(response=>{
              const result = response.data;
              if (!result.successful) {
                return this.$message.error(result.message);
              }
              //获取所有文档
              this.$events.emit('documentList');
            })
            .catch(error=>{
              this.$message.error(error.response.data.message);
            })
          },
          onCancel() {},
        });
        this.clickIconMenuShow = false;
      },

      //重命名
      resetname(){
        this.resetName = _.replace(this.name,`.${this.getDocmentType(this.url)}`,'');
        console.log('点击重命名');
        this.inputShow = true;
        this.clickIconMenuShow = false;
      },
      //更改名字
      blur(){
        this.resetName = _.trim(this.resetName);
        if (this.resetName) {
          this.resetName = `${this.resetName}.${this.getDocmentType(this.url)}`
          this.$http.put(`http://smart-api.ztzl.com/smart-office/api/documents/${this.id}`,{name:this.resetName})
          .then(response=>{
            const result = response.data;
            if (!result.successful) {
              return this.$message.error(result.message);
            }
            this.inputShow = false;
            this.$events.emit('documentList');
          })
          .catch(error=>{
            this.$events.emit('documentList');
            this.$message.error(error.response.data.message);
          })
        }else{
          this.$message.error('文档名不能为空');
        }
      },
      //获取焦点选中文字
      focus(event) {
        event.currentTarget.select();
      },

      //分享链接
      shareLink(){
        this.clickIconMenuShow = false;
      },

      //回收站强制删除
      hardRemoveDoc(){
        this.$warning({
          title:'提示',
          content: '文件将会被永久删除',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            this.$http.delete(`http://smart-api.ztzl.com/smart-office/api/documents/${this.id}`)
            .then(response=>{
              const result = response.data;
              if (!result.successful) {
                return this.$message.error(result.message);
              }
              //获取所有文档
              this.$events.emit('documentList');
            })
            .catch(error=>{
              this.$message.error(error.response.data.message);
            })
          },
          onCancel() {},
        });
      },

      //回收站还原文档
      resetDoc(){
        this.$http.post(`http://smart-api.ztzl.com/smart-office/api/documents/${this.id}/status`,{status:1})
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          //获取所有文档
          this.$events.emit('documentList');
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        })
      },

      //鼠标移入时
      mouseenter(){
        this.iconMenu = true ;
        this.$refs['doc-item'].style.background = '#DEFBFC';
      },
      //鼠标移除时
      mouseleave(){
        this.iconMenu = false ;
        this.$refs['doc-item'].style.background = '';
      },
    },

    filters: {
      // 转换时间的显示样式
      formatTime:function(time){
        return moment(time).format('lll'); 
      },
      // 依据文档显示不同的图标
      formatType:function(url){
        const index = url.lastIndexOf(".");
        const type = url.substr(index+1);
        switch(type){
          case 'docx': return '/smart-office/image/icon_word.png';
          case 'xlsx': return '/smart-office/image/icon_excel.png';
          case 'pptx': return '/smart-office/image/icon_ppt.png';
          case 'pdf': return '/smart-office/image/icon_pdf.png';
        }
      }
    },
    
    mounted(){
      if (this.status) {
        const clipboard = new ClipboardJS(this.$refs['shareLink']);
        clipboard.on('success',(e)=> {
          this.$message.success('链接已复制到剪切板');
          e.clearSelection();
        });
      }else{

      }
    },
  }
</script>
  
<style scoped>
  .doc-item{
    width: 100%;
    height: 52px;
    line-height: 52px;
    border-top: 1px solid #E9E9E9;
    display: flex;
    position: relative;
  }
  .doc-item .doc-name{
    width: 55%;
    height: 100%;
    font-size:17px;
    color:rgba(51,51,51,1);
  }
  .doc-item .time{
    width: 15%;
    height: 100%;
    text-align: center;
    font-size:17px;
    color:rgba(102,102,102,1);
  }
  .doc-item .creator{
    width: 20%;
    height: 100%;
    font-size:17px;
    color:rgba(102,102,102,1);
    text-align: center;
  }
  .doc-item .icon-menu{
    width: 10%;
    height: 100%;
  }
  .doc-item .icon-menu img{
    width: 18px;
    height: 14px;
  }
  .doc-item .set,.doc-item .icon-menu-set{
    width: 120px;
    text-align: center;
    z-index:10;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:2px;
    position:absolute;
    left: 40%;
    top:40%;
  }
  .doc-item .icon-menu-set{
    position:absolute;
    left: 90%;
    top: 70%;
  }
  .doc-item .set p, .doc-item .icon-menu-set p{
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size:17px;
    margin: 0px;
    color:rgba(51,51,51,1)
  }
  .doc-item .set p:hover,.doc-item .icon-menu-set p:hover{
    background:rgba(233,233,233,1);
    font-weight: 700;
  }

</style>