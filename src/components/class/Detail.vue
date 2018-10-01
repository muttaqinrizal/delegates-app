<template>
  <v-container fluid grid-list-lg>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <template v-else-if="loadingFailed">
      <p>Gagal memuat pengumuman</p>
      <v-btn color="primary" @click="loadClassData()">Muat ulang</v-btn>
    </template>
    <v-card v-else>
      <v-card-title primary-title>
        <div class="headline">
          {{classData.name}}
        </div>
      </v-card-title>
      <v-card-text class="text-xs-left text-sm-left">
        <div>Panelis: {{classData.panelist}}</div>
        <div>Peserta: {{classData.participants.length}}/{{classData.max}}</div>
        <v-divider></v-divider>
        <div style="margin-bottom: 24px;"></div>
        <div class="preview-md" v-html="classData.description"></div>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import marked from 'marked'
  import localForage from 'localforage'
  import commons from '../../libs/commons.js'
  var classStorage = localForage.createInstance({name: 'class'})
  export default {
    data () {
      return {
        classData:{},
        isLoading: true,
        loadingFailed: false,
      }
    },
    methods: {
      getApiPicture(name) {
        return commons.getApiPicture(name)
      },
      loadClassData () {
        this.loadingFailed = false
        axios.get(`${this.$config.apiBaseUrl}/api/class/${this.$route.params.id}`)
        .then(response => {
          console.log('from network', response.data);
          classStorage.setItem(this.$route.params.id, response.data)
          this.classData = JSON.parse(JSON.stringify(response.data))
          this.classData.description = marked(response.data.description, { sanitize: true })
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
          classStorage.getItem(this.$route.params.id)
          .then(data => {
            if(data) {
              this.classData = data
              this.classData.description = marked(data.content, { sanitize: true })
              console.log('from IndexedDb', data);
            }
            else {
              this.loadingFailed = true
            }
          })
          console.error(err);
        })
      }
    },
    watch: {
      
    },
    mounted () {
      this.loadClassData()
      this.$store.commit('setShowBackBtn', true)
    },
    destroyed () {
      this.$store.commit('setShowBackBtn', false)
    }
  }
</script>
