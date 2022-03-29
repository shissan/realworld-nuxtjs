<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="userForm.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userForm.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data () {
    return {
      userForm: {
        email: '',
        password: '',
        username: '',
        bio: '',
        image: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onSubmit () {
      const { data } = await updateUser({ user: this.userForm })
      this.$store.commit('setUser', data.user)
      this.$router.push({ name: 'profile', params: { username: data.user.username } })
    },
    logout () {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    }
  },
  created () {
    for (const key in this.userForm) {
      if (this.user[key]) {
        this.userForm[key] = this.user[key]
      }
    }
  }
};
</script>

<style>
</style>