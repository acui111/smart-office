<template>
  <a-form
    id="components-form-demo-normal-login"
    :form="form"
    class="login-form"
    @submit="handleSubmit"
    style="text-align:center;padding-top:300px"
  >
    <a-form-item>
      <a-input
        style="width:300px"
        v-decorator="[
          'userName',
          { rules: [{ required: true, message: '用户名不能为空!' }] },
        ]"
        placeholder="请输入用户名"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        style="width:300px"
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '密码不能为空' }] },
        ]"
        type="password"
        placeholder="请输入密码"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width:10%">
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$http.post('/api/login',{username:values.userName,password:values.password})
          .then(response=>{
            // 登录后返回到先前访问的页面
            const target = window.location.search.substr(1);
            window.location.href = decodeURIComponent(target);
          })
          .catch(error=>{
            this.$message.error(error.response.data.message);
          })
        }
      });
    },
  },
};
</script>
<style>
</style>