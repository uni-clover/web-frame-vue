<template>
  <div class="container">
    <div class="el-card login-card is-always-shadow">
      <div class="login-header">
        <p class="login-title">管理系统</p>
      </div>
      <el-form :model="loginInfo" ref="login" :rules="rules" class="form-box">
        <el-form-item prop="phone">
          <base-input
            v-model.trim="loginInfo.phone"
            label-name="手机号"
            form-type="phone"
            class="input-item"
            prefix-icon="el-icon-s-custom"
            :show-word-limit="false"
          ></base-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model.trim="loginInfo.pass"
            placeholder="请输入密码"
            show-password
            maxlength="20"
            @keyup.enter.native="validate"
            class="input-item"
          >
            <template #prefix>
              <svg-icon icon-class="lock" class="icon-class" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button :loading="loading" type="primary" class="btn-login" @click="validate">登&emsp;录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      loginInfo: {
        phone: '13636363636',
        pass: 'admin'
      },
      loading: false,
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        pass: [
          {
            required: true,
            message: '请输入密码'
          }
        ]
      }
    }
  },
  methods: {
    // 验证表单
    validate() {
      this.$refs.login.validate(valid => {
        if (!valid) {
          return
        }
        // this.login();
        this.$store.commit('user/SET_LOGIN', { token: 'sc156266cas' })
        this.$store.commit('user/SET_MENU')
        this.$router.push(this.$route.query.redirect || '/')
      })
    },
    // 登录处理
    login() {
      this.loading = true
      this.$_http
        .post(this.$_API.INTERFACE_LOGIN, this.loginInfo)
        .then(
          res => {
            if (!res.data) return
            this.$store.commit('user/SET_LOGIN', res.data)
            this.loadMenus()
          },
          () => {
            this.loading = false
          }
        )
        .catch(it => {
          this.loading = false
        })
    },
    // 获取菜单
    loadMenus() {
      this.$_http
        .get(this.$_API.INTERFACE_USER_MENUS)
        .then(res => {
          if (!res.data) return
          this.$store.commit('user/SET_MENU', res.data)
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch(e => {
          let status = e && e.response && e.response.status
          // 401在共通已处理
          if (status !== 401) this.$store.dispatch('user/logout')
        })
        .finally(it => {
          this.loading = false
        })
    },
    // 清空
    clear() {
      this.loginInfo.phone = ''
    }
  }
}
</script>
<style lang="scss" scoped>
$card-height: 63vh;
$card-width: 31.5vw;
$input-height: 3vw;
.container {
  position: relative;
  background-size: cover;
  background-color: #589cbc;
  height: 100vh;
  width: 100vw;
}
.login-card {
  position: absolute;
  top: 50vh - $card-height / 2;
  left: 50vw - $card-width / 2;
  width: 31.5vw;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 5.6vw 5vw;
}
.login-header {
  text-align: center;
  .login-title {
    font-size: 1.5vw;
    letter-spacing: 2px;
    color: #444444;
  }
}
.form-box {
  padding: 1.8vw 1.1vw;
  .input-item {
    width: 100%;
    max-width: unset;
    font-size: 1.2vw;
    .el-icon-circle-close {
      cursor: pointer;
    }
  }
}
.btn-login {
  width: 100%;
  height: $input-height;
  font-size: 1vw;
  margin-top: 1.6vw;
}
</style>
<style lang="scss">
$input-height: 3vw;
.input-item {
  input {
    color: black;
    border-radius: 0.4vw;
    font-size: 1vw;
  }
  &.el-input--prefix .el-input__inner {
    height: $input-height;
    padding-left: 2vw;
  }
  &.el-input .el-input__clear {
    font-size: unset;
  }
  .el-input__prefix {
    height: 100%;
    line-height: 36px;
    width: 1.5vw;
    .el-input__icon {
      color: #7f7f7f;
      width: unset;
    }
  }
  .el-input__suffix .el-input__icon {
    color: #7f7f7f;
  }
  .icon-class {
    color: #7f7f7f;
    height: 100% !important;
    line-height: 36px;
  }
}
</style>
