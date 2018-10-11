<template>
  <v-layout fluid grid-list-lg>
    <v-flex xs12>
      <v-card flat>
        <v-btn @click="readAll" v-show="hasNotif">Tandai sudah dibaca semua</v-btn>
        <v-list two-line>
          <template v-if="$store.state.isRanger">
            <v-list-tile
              :key="'newAnnc'"
              avatar
              @click="$router.push('/announcement/new')"
            >
              <v-list-tile-avatar color="teal">
                <v-icon color="white">add</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>Buat Pengumuman</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">Buat pengumuman dan kirim notifikasi ke delegates</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-divider/>
          </template>
          <v-subheader>
            Semua Pengumuman 
            <template v-if="isOffline">
              (Offline data)
            </template>
          </v-subheader>
          <template v-if="isLoading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </template>
          <template v-else-if="loadingFailed">
            <p>Gagal memuat pengumuman</p>
            <v-btn color="primary" @click="loadAnnouncementData()">Muat ulang</v-btn>
          </template>
          <template v-else-if="announcementData.length === 0">
            <p>Belum ada pengumuman</p>
          </template>
          <template v-else v-for="(item, index) in announcementData">
            <v-list-tile
              :key="item._id"
              avatar
              @click="$router.push('/announcement/detail?id=' + item._id)"
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
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localForage from 'localforage'
dayjs.extend(relativeTime)
var anncStorage = localForage.createInstance({name: 'announcements'})
export default {
  name: 'dashboard',
  data () {
    return {
      announcementData: [],
      isLoading: true,
      loadingFailed: false,
      isOffline: false,
    }
  },
  methods: {
    dayjs: dayjs,
    loadAnnouncementData () {
      this.loadingFailed = false
      axios.get(`${this.$config.apiBaseUrl}/api/announcement`)
      .then(response => {
        this.isOffline = false
        console.log('from network', response.data);
        this.announcementData = response.data
        anncStorage.setItem('index', response.data)
        this.isLoading = false
      })
      .catch(err => {
        this.isOffline = true
        this.isLoading = false
        anncStorage.getItem('index')
        .then(data => {
          if(data) {
            this.announcementData = data
            console.log('from IndexedDb', data);
          }
          else {
            this.loadingFailed = true
          }
        })
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
    this.loadingFailed = false
    // this.$store.commit('setActiveNavigation', 'a')
    this.loadAnnouncementData()
  }
}
</script>
