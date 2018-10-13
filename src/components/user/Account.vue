<template>
  <v-card>
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <!-- <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">Hello, User</div>
            </v-card-title>
          </v-card> -->
          <v-avatar :size="128">
            <!-- <img :src="user.avatar" alt="" srcset=""> -->
            <v-img lazy-src="/images/fls-pp.png" :src="user.avatar"></v-img>
          </v-avatar>
          <div class="pt-4">
            {{user.name}}
          </div>
          <div>
            {{user.email}}
          </div>
          <div v-if="user.room.length > 0">
            Room:
            <span v-for="room in user.room">{{room.toLowerCase().replace('-', ' ')}} </span>
          </div>
          <div v-else>
            Ranger
          </div>
          <div>
            <v-btn @click="logoutFn" :loading="logoutLoading" :disabled="logoutLoading">
              Logout
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="grey--text caption">
            Build stamp: {{buildStamp}}
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import commons from '../../libs/commons'
export default {
  name: 'account',
  data () {
    return {
      user: {
        name: '',
        email: '',
        room: '',
        avatar: ''
      },
      logoutLoading: false,
      buildStamp: BUILDSTAMP
    }
  },
  methods: {
    logoutFn() {
      this.logoutLoading = true
      commons.logoutFn()
      .then((e) => {
        console.log(e);
        this.logoutLoading = false
        this.$router.push('/login')
      })
      .catch(() => {
        this.logoutLoading = false
      })
    }
  },
  created: function() {
    commons.getUserDetail()
    .then(user => {
      this.user.name = user.name
      this.user.email = user.email
      this.user.room = user.room
      this.user.avatar = user.avatar
    })
  },
  mounted: function(){
    // this.$store.commit('setHeaderTitle', 'Account')
    this.$store.commit('setActiveNavigation', 'account')
  },
}
</script>
