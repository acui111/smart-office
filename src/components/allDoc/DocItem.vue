<template>
  <div @click="clickDocItem">
    <div
      :id="id"
      class="doc-item" 
      @contextmenu.prevent="rightClick" 
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      ref="doc-item"
      >

      <!-- 文档名称 -->
      <div class="doc-name" v-if="!inputShow">
        <!-- 文档标记 -->
        <img 
          :src="fileType | formatType" 
          alt="文档标记" 
          style="margin-right:6px;vertical-align:text-bottom;width:20px;height:24px"
          >
        {{title}}
        <!-- 共享标记 -->
        <img 
          src="/image/button_Share.png" 
          v-if="shareShow"
          alt="共享标记"
          style="width:50px;height:19px;margin-left:10px"
          />
      </div>
      
      <!-- 重命名的iuput框 -->
      <div class="doc-name" v-if="inputShow">
        <a-input
          @keyup.enter="submit"
          @focus="focus($event)"
          v-model="resetName"
          :auto-focus=true
          style="width:200px;height:30px;padding:0 4px;font-size:16px"
          />
      </div>

      <!-- 文档创建时间 -->
      <div class="time">{{ modifyTime | formatTime}}</div>

      <!-- 文档创建者 -->
      <div class="creator">{{ownerName}}</div>

      <!-- 右键多功能设置 -->
      <div 
        class="set" 
        v-show="rightClickMenuShow"
        ref="set"
        >
        <p @click="toSetModal">共享设置</p>
        <p @click="toEdit">编辑</p>
        <p @click="download">下载</p>
        <p @click="removeDoc">删除</p>
        <p @click="rename">重命名</p>
        <p @click="shareLink">分享链接</p>
      </div>

      <!-- 多功能按键 -->
      <div @click="clickIconMenu" class="icon-menu">
        <img
          v-if="iconMenu"
          src="/image/icon_menu.png"
          alt="多功能按键"
          >
      </div>
      <!-- 多功能设置 -->
      <div 
        class="icon-menu-set" 
        v-show="clickIconMenuShow" 
        ref="iconMenuSet"
        >
        <p @click="toSetModal">共享设置</p>
        <p @click="toEdit">编辑</p>
        <p @click="download">下载</p>
        <p @click="removeDoc">删除</p>
        <p @click="rename">重命名</p>
        <p @click="shareLink">分享链接</p>
      </div>

    </div>
  </div>
</template>
  
<script type="text/ecmascript-6">
import DocDelete from '../DocDelete';
import moment from 'moment';
moment.locale('zh-cn');
  export default {
    name:'DocItem',
    props:['id','fileType','title','url','modifyTime','ownerName'],
    components:{
      DocDelete
    },
    data(){
      return{
        //多功能按钮
        iconMenu:false,
        //右键
        rightClickMenuShow:false,
        //单击多功能按钮
        clickIconMenuShow:false,
        //重命名的输入框
        inputShow:false,
        //重命名输入框的取值
        resetName:this.title,
        //共享标记
        shareShow:false,
        //文档标记
        docTitleSrc:'',
      }
    },
    methods:{
      //右键显示多功能按键
      rightClick(event){
        this.rightClickMenuShow = true;
        const top = event.currentTarget.getBoundingClientRect().top;
        if (top >= 700 && this.rightClickMenuShow) {
          this.$refs.set.style.top = '-390%';
        };
      },
      //左键隐藏多功能按键
      clickDocItem(){
        this.rightClickMenuShow = false;
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
        this.rightClickMenuShow = false;
      },

       //编辑
      toEdit(){
        window.open(`${this.serverUrl}/editor?${this.id}`);
      },

      //下载
      download(){
        console.log('正在下载文件');
      },

      //删除文档
      removeDoc(){
        this.$events.emit('removeDoc',{'removeDocVisible':true,'id':this.id});
        this.clickIconMenuShow = false;
        this.rightClickMenuShow = false;
      },

      //重命名
      rename(){
        this.resetName = this.title;
        console.log('点击重命名');
        this.inputShow = true;
      },
      //enter键更改名字
      submit(){
        if (this.resetName) {
          console.log('确认更改名字为',this.resetName);
          this.inputShow = false;
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
        this.shareShow = true;
        console.log('正在分享链接');
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
      }
    },

    filters: {
      // 转换时间的显示样式
      formatTime:function(time){
        return moment(time).format('lll'); 
      },
      // 依据文档显示不同的图标
      formatType:function(type) {
        switch(type){
          case 'docx': return '/image/icon_word.png';
          case 'xlsx': return '/image/icon_excel.png';
          case 'pptx': return '/image/icon_ppt.png';
          case 'pdf': return '/image/icon_pdf.png';
        }
      }
    },
    mounted(){
      // 获取文件服务器地址
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