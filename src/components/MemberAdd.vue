<template>
  <!-- 添加文档成员 -->
  <div id="member-add">
    <a-modal
      :visible="addMemberVisible"
      :closable=false
      :centered=true
      :footer="null"
      width="475px"
      :bodyStyle="{
        'width':'475px',
        'padding':'0',
        'height':'447px',
        'background':'rgba(255,255,255,1)',
        'border':'1px solid rgba(148,148,148,1)',
        'border-radius':'2px'
        }"
      >

      <div 
        style="
          width:100%;
          height:38px;
          line-height:38px;
          text-align:center;
          position:relative;
          border-bottom:1px solid rgba(222,222,222,1)
          "
        >
        <span 
          style="font-size:17px;color:rgba(51,51,51,1);"
        >添加成员</span>
        <div class="close" @click="closeAddMember" />
      </div>

      <!-- 选择添加的成员 -->
      <div style="
        width:100%;
        height:370px;
        overflow-y:auto;
        display:flex"
        >

        <!-- 树状图 -->
        <a-tree
          checkable
          :treeData="members"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          v-model="checkedKeys"
          @expand="onExpand"
          />

        <!-- 已选择的成员 -->
        <div style="width:50%;padding:8px 13px 0">
          <p style="font-size:14px;color:rgba(17,204,212,1);margin:0px">已选择</p>
          <div 
            v-for="(item,index) in selectedMember" 
            :key="index" 
            style="
              line-height:32px;
              margin-left:8px;
              display:flex
              "
            > 
            <div style="
              height:22px;
              width:100%;
              font-size:14px;
              color:rgba(102,102,102,1);
              margin-bottom:10px"
              >
              {{item.title}}
            </div>
            <img 
              src="/image/choose_del.png" 
              alt="叉号" 
              style="width:16px;height:16px;margin-top:8px"
              @click="delSelectedMember(item.key)"
              >
          </div>
        </div>
        
      </div>

      <div class="confirm" @click="confirm" />
      <div class="cancel" @click="cancel" />
    </a-modal>
  </div>
</template>
  
<script type="text/ecmascript-6">
  import _ from 'lodash';
  export default {
    name:'MemberAdd',
    data(){
      return{
        addMemberVisible:false,
        //可选择的全部成员
        members:[],
        //展开指定的树节点
        expandedKeys: [],
        // 自动展开父节点
        autoExpandParent: true,
        //选中的要添加的成员(key值)
        checkedKeys: [],
        //右侧展示选中的成员
        selectedMember:[],
      }
    },
    mounted(){
      //展示添加成员遮罩
      this.$events.on('addMember',(addMemberVisible)=>{
        this.addMemberVisible = addMemberVisible;
      });
      //获取所有文档成员
      this.$http.get('/api/members')
      .then(response=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        this.members = result.data;
      })
      .catch(error=>{
        this.$message.error(error.response.data.message);
      })
    },
    methods:{
      //关闭添加成员
      closeAddMember(){
        //关闭添加成员的遮罩
        this.addMemberVisible = false;
        //隐藏共享设置的遮罩
        this.$events.emit('closeSetModal',false);
      },
      //确认
      confirm(){
        //关闭添加成员的遮罩
        this.addMemberVisible = false;
        //隐藏共享设置的遮罩
        this.$events.emit('closeSetModal',false);
        console.log('发送请求前选中的key',this.checkedKeys);
      },
      //取消
      cancel(){
        //关闭添加成员的遮罩
        this.addMemberVisible = false;
      },
      //展开/收起节点
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      //点击复选框
      onCheck(checkedKeys) {
        this.checkedKeys = checkedKeys;
      },
      //去除右侧已选中的成员
      delSelectedMember(key){
        const k = _.split(key,'-',1);
        _.forEach(this.checkedKeys,(checkedKey,index)=>{
          if (checkedKey == key || checkedKey == k) {
            this.checkedKeys.splice(index,1);
          }
        });
      },
    },
    //深度监视选中框的状态
    watch: {
      checkedKeys(key) {
        const members = _.map(this.members,(member,index)=>{
          return member.children;
        });
        const memberList = [];
        _.forEach(members,(members,index)=>{
          _.forEach(members,(member,index)=>{
            memberList.push(member);
          })
        })
        const selectedMember = [];
        _.forEach(key,(key,index)=>{
          _.forEach(memberList,(member,index)=>{
            if (key == member.key) {
              selectedMember.push(member);
            }
          })
        })
        this.selectedMember = _.uniq(selectedMember);
      }
    }
  }
</script>
  
<style scoped>
  /deep/ .ant-tree{
    display:inline-block;
    width: 50%;
    height: 370px;
    border-right: 1px solid rgba(233,234,238,1);
  }
  /* 改变默认勾选框的颜色 */
  /deep/ .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: #11CCD4;
    border-color: #11CCD4;
  }
  /deep/ .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after{
    background-color: #11CCD4;
  }
  /deep/ .ant-tree-checkbox-inner:hover{
    border-color: #11CCD4;
  }
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
    margin:0 108px 14px 0;
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
    margin:0 14px 14px 0;
  }
  .cancel:hover{
    background-image: url('/image/button_no_s.png');
  }
</style>