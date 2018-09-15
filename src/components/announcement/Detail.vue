<template>
  <v-layout>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">
          {{announcementData.title}}
        </div>
      </v-card-title>
      <v-card-text>
        <p class="text-xs-left text-sm-left" v-html="announcementData.content"/>
      </v-card-text>
    </v-card>
  </v-layout>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export default {
  name: 'dashboard',
  data () {
    return {
      announcementData: {}
    }
  },
  methods: {
    dayjs: dayjs,
    loadAnnouncementData () {
      axios.get(`${this.$config.apiBaseUrl}/api/announcement/${this.$route.params.id}`)
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
    }
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Pengumuman')
    // this.$store.commit('setActiveNavigation', 'announcement')
    this.loadAnnouncementData()
    this.$store.commit('setShowBackBtn', true)
  },
  destroyed () {
    this.$store.commit('setShowBackBtn', false)
  }
}
</script>
