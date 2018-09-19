<template>
  <v-container fluid grid-list-lg>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-card v-else>
      <v-card-title primary-title>
        <div class="headline">
          {{announcementData.title}}
        </div>
      </v-card-title>
      <v-card-text class="text-xs-left text-sm-left">
        <div>{{dayjs(announcementData.createdAt).format('D MMMM YYYY h:mm A')}}</div>
        <div v-if="announcementData.scope !== 'all'">Untuk room {{announcementData.scope}}</div>
        <div v-else>Untuk semua delegates</div>
        <v-divider></v-divider>
        <div style="margin-bottom: 24px;"></div>
        <div class="preview-md" v-html="announcementData.content"></div>

      </v-card-text>
      <v-layout row wrap class="ma-1">
        <v-flex
          v-for="image in announcementData.images"
          :key="image.original"
          xs4
          d-flex
          @click="previewImage(image)"
        >
          <v-card flat tile class="d-flex">
            <v-img
              :src="$config.apiBaseUrl + image.thumbnail"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-1
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="showPreview">
      <v-card>
        <v-img
          :lazy-src="$config.apiBaseUrl + imageToPreview.thumbnail"
          :src="$config.apiBaseUrl + imageToPreview.original"
          aspect-ratio="1"
          :contain="true"
          class="grey lighten-2"
        >
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showPreview = false" color="primary">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import marked from 'marked'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export default {
  name: 'dashboard',
  data () {
    return {
      isLoading: false,
      announcementData: {},
      showPreview: false,
      imageToPreview: '',
    }
  },
  methods: {
    dayjs: dayjs,
    loadAnnouncementData () {
      this.isLoading = true
      axios.get(`${this.$config.apiBaseUrl}/api/announcement/${this.$route.params.id}`)
      .then(response => {
        console.log('from network', response.data);
        this.announcementData = response.data
        this.announcementData.content = marked(response.data.content, { sanitize: true })
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        this.loadingFailed = true
        this.offline = true
        console.log(err);
      })
    },
    previewImage(image) {
      this.imageToPreview = image
      this.showPreview = true
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
