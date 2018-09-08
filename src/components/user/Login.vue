<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue">
              <v-toolbar-title>Delegates login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model="userId" prepend-icon="person" name="login" label="ID" type="text"></v-text-field>
                <v-text-field id="password" v-model="userPass" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="loginFn()">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import localForage from 'localforage'
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      userId: '',
      userPass: '',
    }
  },
  methods: {
    loginFn: async function () {
      try {
        let login = await axios({
          method: 'post',
          url: `${this.$config.authServer}/api/auth/login`,
          data: {
            email: this.userId,
            password: this.userPass
          }
        })
        let userData = await axios({
          url: `${this.$config.authServer}/api/auth`,
          headers: {
            'Authorization': login.data.token
          }
        })
        console.log(login)
        await localForage.setItem('authToken', login.data.token)
        await localForage.setItem('userId', userData.data.user.email)
        await localForage.setItem('userName', userData.data.user.info.fullName)
        await localForage.setItem('userRoom', 'NOT IMPLEMENTED')
        this.setLogedIn(true)
        if (this.$route.query.redirect) this.$router.replace({path: this.$route.query.redirect})
        else this.$router.replace({path: '/'})
      }
      catch (error) {
        console.log(error)
      }
    },
    setLogedIn (val) {
      this.$store.commit('setIsLoggedIn', val)
    }
  }
}
</script>