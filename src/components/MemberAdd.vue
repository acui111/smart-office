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
        display:flex"
        >

        <!-- 树状图 -->
        <a-tree
          checkable
          v-model="selectedKeys"
          :treeData="groups"
          @check="onCheck"
          style="overflow-y:auto"
          />

        <!-- 已选择的成员 -->
        <div style="width:50%;padding:8px 13px 0;overflow-y:auto">
          <p style="font-size:14px;color:rgba(17,204,212,1);margin:0px">已选择</p>
          <div 
            v-for="(member,index) in selectedMembers" 
            :key="index" 
            style="
              line-height:32px;
              margin-left:8px;
              display:flex;
              "
            > 
            <div style="
              height:22px;
              width:100%;
              font-size:14px;
              color:rgba(102,102,102,1);
              margin-bottom:10px"
              >
              {{member.username}}
            </div>
            <img 
              src="/smart-office/image/choose_del.png" 
              alt="叉号" 
              style="width:16px;height:16px;margin-top:8px"
              @click="delSelectedMember(member.key)"
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
        // 文档id
        documentId:null,
        // 添加成员的对话框
        addMemberVisible:false,
        // 可选择的全部成员
        groups:[],
        // 选中的key
        selectedKeys:[],
        // 右侧展示选中的成员
        selectedMembers:[],
        // 请求回来的原数据
        rawData:[],
        // 已有权限的成员
        permissionMemebers:[],
        selected:[],
      }
    },
    mounted(){
      //展示添加成员遮罩
      this.$events.on('addMember',({addMemberVisible,members,documentId})=>{
        this.addMemberVisible = addMemberVisible;
        this.permissionMemebers = members;
        this.documentId = documentId;
        // 判断已有权限的成员（设置特殊样式）
        _.map(this.permissionMemebers,(permissionMemeber)=>{
          _.forEach(this.groups,(role)=>{
            _.forEach(role.children,(user)=>{
              if (permissionMemeber.username == user.title) {
                role.disabled = true;
                user.disableCheckbox = true;
              }
            })
          })
        })
      });

      //获取所有文档成员
      this.$http.get('http://smart-api.ztzl.com/smart-auth/api/roles')
      .then(response=>{
        const result = response.data;
        if (!result.successful) {
          return this.$message.error(result.message);
        }
        // 请求后的原数据
        this.rawData = result.data;
        // 将数据处理成树状结构
        this.groups = _.map(result.data,role=>{
          const group = {};
          group.key = role.id;
          group.title = role.name;
          group.children = _.map(role.userList,(user)=>{
            return {
              key:`${role.id}-${user.id}`,
              title:user.username,
            };
          })
          return group;
        })
      })
      .catch(error=>{
        this.$message.error(error.response.data.message);
      });
    },
    methods:{
      //选中的key
      onCheck(checkedKeys){
        // 过滤到最外层的key
        const checked = _.filter(checkedKeys,(checkedKey)=>{
          return typeof(checkedKey) == 'string';
        })
        this.selectedKeys = checked;
        //截取到-后面的key
        const key = _.map(checked,(key)=>{
          const index = key.lastIndexOf("-");
          return key.substr(index+1);
        })
        const select = _.uniqBy(key);
        // 根据选择的key找到对应的成员
        const members = [];
        _.forEach(this.rawData,(item)=>{
          _.forEach(select,(key)=>{
            _.forEach(item.userList,(user)=>{
              if (key == user.id) {
                members.push({'key':user.id,'username':user.username});
              }
            })
          })
        })
        this.selectedMembers = _.uniqWith(members, _.isEqual);
      },
      //去除右侧已选中的成员
      delSelectedMember(key){
        _.forEach(this.selectedKeys,(selectKey)=>{
          const selectedKey = selectKey.split('-')[1];
          if (selectedKey == key) {
            const selectedKeys = _.filter(this.selectedKeys,(selectedKey)=>{
              return selectedKey !== selectKey;
            })
            this.selectedKeys = selectedKeys;
          }
        })
        const resetMembers = _.filter(this.selectedMembers,(member)=>{
          return member.key !== key;
        })
        this.selectedMembers = resetMembers;
      },
      //关闭添加成员
      closeAddMember(){
        //关闭添加成员的遮罩
        this.addMemberVisible = false;
        //隐藏共享设置的遮罩
        this.$events.emit('closeSetModal',false);
        this.selectedMembers = [];
        this.selectedKeys = [];
      },
      //确认
      confirm(){
        //关闭添加成员的对话框
        this.addMemberVisible = false;
        //隐藏共享设置的对话框
        this.$events.emit('closeSetModal',false);
        
        _.map(this.selectedMembers,(selectedMember)=>{
          selectedMember.writeable = 0;
          selectedMember.readable = 1;
          selectedMember.documentId = this.documentId;
          selectedMember.userId = selectedMember.key;
          delete selectedMember.key;
        })
        
        this.$http.post(`http://smart-api.ztzl.com/smart-office/api/privileges`,this.selectedMembers)
        .then(response=>{
          const result = response.data;
          if (!result.successful) {
            return this.$message.error(result.message);
          }
          this.$message.success('请求成功');
        })
        .catch(error=>{
          this.$message.error(error.response.data.message);
        })
        this.selectedMembers = [];
        this.selectedKeys = [];
      },
      //取消
      cancel(){
        //关闭添加成员的遮罩
        this.addMemberVisible = false;
        this.selectedMembers = [];
        this.selectedKeys = [];
      },
    },
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
  /deep/ .ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
    background-image: url(/smart-office/image/icon.png);
    background-size: 100% 100%;
  }
  /*滚动条凹槽的颜色，还可以设置边框属性 */
  ::-webkit-scrollbar-track-piece {
    background-color:#eee;
    border-radius: 2em;
  }
  /*滚动条的宽度*/
  ::-webkit-scrollbar {
    width:6px;
  }
  /*滚动条的设置*/
  ::-webkit-scrollbar-thumb {
    background-color:#ccc;
    background-clip:padding-box;
    border-radius: 2em;
  }
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
    margin:0 108px 14px 0;
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
    margin:0 14px 14px 0;
  }
  .cancel:hover{
    background-image: url('/smart-office/image/button_no_s.png');
  }
</style>