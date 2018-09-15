<template>
  <v-layout>
    <v-card>
      <v-btn @click="readAll" v-show="hasNotif">Tandai sudah dibaca semua</v-btn>
      <v-list two-line>
        <template v-for="(item, index) in announcementData">
          <v-list-tile
            :key="item._id"
            avatar
            @click="$router.push('/announcement/' + item._id)"
          >
            <v-list-tile-avatar>
              <v-icon>notifications</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">Room {{item.scope}} - {{dayjs(item.createdAt).fromNow()}}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-html="item.content"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider/>
        </template>
      </v-list>
    </v-card>
  </v-layout>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localForage from 'localforage'
dayjs.extend(relativeTime)
export default {
  name: 'dashboard',
  data () {
    return {
      announcementData: []
    }
  },
  methods: {
    dayjs: dayjs,
    loadAnnouncementData () {
      axios.get(`${this.$config.apiBaseUrl}/api/announcement`)
      .then(response => {
        console.log('from network', response.data);
        this.announcementData = response.data
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        this.loadingFailed = true
        this.offline = true
        console.log(err);
      })
    },
    readAll () {
      localForage.setItem('notif', 0)
      this.$store.commit('setHasNotif', 0)
    }
  },
  computed: {
    hasNotif () {
      return this.$store.state.hasNotif
    },
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Pengumuman')
    // this.$store.commit('setActiveNavigation', 'announcement')
    this.loadAnnouncementData()
  }
}
</script>
