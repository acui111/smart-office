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
            <div style="display:flex;justify-content:space-between;width:100%;height:32px;line-height:32px">
              <p style="font-size:14px;color:rgba(102,102,102,1),margin:0">我</p>
              <p style="font-size:14px;color:rgba(102,102,102,1);margin-right:26px">创建者</p>
            </div>
            
            <div v-for="(item,index) in docMember " :key="index">
              <DocMember
                :id="item.id"
                :name="item.name"
                />
            </div>

          </div>
        </div>

        <div class="confirm" @click="confirm" />
        <div class="cancel" @click="cancel" />
      </div>
    </a-modal>
    <MemberAdd/>
  </div>
</template>
  
<script type="text/ecmascript-6">
  import DocMember from './DocMember';
  import MemberAdd from './MemberAdd';
  export default {
    name:'ShareSet',
    data(){
      return{
        shareSetVisible:false,
        docMember:[
          {
            id:1,
            name:'成员1',
          },
          {
            id:2,
            name:'成员2',
          },
          {
            id:3,
            name:'成员3',
          },
        ]
      }
    },
    components:{
      DocMember,
      MemberAdd
    },
    mounted(){
      //共享设置显示
      this.$events.on('shareSetVisible',({shareSetVisible,id})=>{
        this.shareSetVisible = shareSetVisible;
        console.log('共享设置显示',id);
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
      //确认
      confirm(){
        this.shareSetVisible = false;
      },
      //取消
      cancel(){
        this.shareSetVisible = false;
      },
      //添加文档成员
      addMember(){
        this.$events.emit('addMember',true);
      }
    }
  }
</script>
  
<style scoped>
  .close{
    width: 12px;
    height: 12px;
    background-image: url('/image/icon_close.png');
    background-size: cover;
    position:absolute;
    right:0;
    top:0;
    margin:12px;
  }
  .confirm{
    width: 66px;
    height: 24px;
    background-image: url('/image/button_yes.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 106px 13px 0;
  }
  .confirm:hover{
    background-image: url('/image/button_yes_s.png');
  }
  .cancel{
    width: 66px;
    height: 24px;
    background-image: url('/image/button_no.png');
    background-size: cover;
    position:absolute;
    right:0;
    bottom:0;
    margin:0 13px 13px 0;
  }
  .cancel:hover{
    background-image: url('/image/button_no_s.png');
  }
</style>