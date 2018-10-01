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
            <img :src="getPicture('logo.png')" alt="" srcset="">
          </v-avatar>
          <div>
            {{user.name}}
          </div>
          <div>
            {{user.email}}
          </div>
          <div v-if="user.room.length > 0">
            Room:
            <span v-for="room in user.room">{{room}} </span>
          </div>
          <div v-else>
            Ranger
          </div>
          <div>
            <v-btn @click="logoutFn">
              Logout
            </v-btn>
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
      }
    }
  },
  methods: {
    getPicture(path) {
      return commons.getPicture(path)
    },
    getApiPicture(path) {
      return commons.getApiPicture(path)
    },
    logoutFn() {
      commons.logoutFn()
      .then(() => {
        this.$router.push('/login')
      })
    }
  },
  created: function() {
    commons.getUserDetail()
    .then(user => {
      this.user.name = user.name
      this.user.email = user.email
      this.user.room = user.room
    })
  },
  mounted: function(){
    // this.$store.commit('setHeaderTitle', 'Account')
    this.$store.commit('setActiveNavigation', 'account')
  },
}
</script>
