<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue">
              <v-toolbar-title>Login FLS</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field 
                  v-validate="'required|email'"
                  :error-messages="errors.collect('email')"
                  v-model="userEmail"
                  prepend-icon="person"
                  name="email"
                  label="Email"
                  type="text">
                </v-text-field>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('password')"
                  id="password"
                  v-model="userPass"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :loading="loginLoading" :disabled="loginLoading" color="primary" @click="loginFn()">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import {mapActions} from 'vuex'
import localForage from 'localforage'
import axios from 'axios'
import common from '../../libs/commons'
export default {
  name: 'Login',
  data () {
    return {
      userEmail: '',
      userPass: '',
      loginLoading: false
    }
  },
  methods: {
    ...mapActions(['notify']),
    loginFn: async function () {
      this.loginLoading = true
      try {
        var valid = await this.$validator.validate()
        if (valid) {
          let login = await axios({
            method: 'post',
            url: `${this.$config.authServer}/api/auth/login`,
            data: {
              email: this.userEmail,
              password: this.userPass
            }
          })
          let userData = await axios({
            url: `${this.$config.authServer}/api/auth`,
            headers: {
              'Authorization': login.data.token
            }
          })
          let userBackendData = await axios({
            method: 'post',
            url: `${this.$config.apiBaseUrl}/api/user/register`,
            headers: {
              'Authorization': 'Bearer ' + login.data.token
            }
          })
          console.log(userData.data)
          await localForage.setItem('authToken', login.data.token)
          await localForage.setItem('userEmail', userData.data.user.email)
          await localForage.setItem('userName', userData.data.user.info.fullName)
          await localForage.setItem('avatar', userData.data.user.info.avatar)
          await localForage.setItem('apiUserId', userBackendData.data._id || null)
          var roles = [], rooms = []
          userData.data.user.roles.forEach(item => {
            console.log(item);
            roles.push(item.split('_')[0])
            if (item.split('_')[2]) rooms.push(item.split('_')[2])
          })
          await localForage.setItem('roles', roles)
          await localForage.setItem('userRoom', rooms)
          await localForage.setItem('loginStamp', userData.data.user.email + '-' + new Date().getTime())
          // subscribe notif if already granted
          if (Notification.permission === 'granted') {
            common.pushSubscribe()
          }
          this.setLogedIn(true)
          if (this.$route.query.redirect) this.$router.replace({path: this.$route.query.redirect})
          else this.$router.replace({path: '/'})
        }
        this.loginLoading = false
      } catch (error) {
        this.loginLoading = false
        if (error.response) {
          if (error.response.status === 400) {
            this.notify({message: 'Data login salah', type: 'error'})
            return
          }
        }
        this.notify({message: error.message, type: 'error'})
      }
    },
    setLogedIn (val) {
      this.$store.commit('setIsLoggedIn', val)
    }
  }
}
</script>