<template>
  <v-container fluid grid-list-lg>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <template v-else-if="loadingFailed">
      <p>Gagal memuat event</p>
      <v-btn color="primary" @click="loadEventData()">Muat ulang</v-btn>
    </template>
    <v-card tile v-else>
      <v-card-text class="text-xs-center">
        <v-container xs12 sm10 md6>
          <v-layout row wrap mb-4>
            <v-flex xs9>
              <div style="padding-left: 10px;">
                <div style="text-align: left; margin-bottom: 8px;">
                  <strong>{{ eventData.title }}</strong>
                  <span class="now" v-if="eventData.now">Sekarang</span>
                </div>
                <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.dresscode }}
                </div>
                <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.start }} - {{ eventData.end }} WIB
                </div>
                <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.date || '-'}}
                </div>
                <div class="bullet location" style="text-align: left;">
                  {{ eventData.location }}
                </div>
              </div>
            </v-flex>
            <v-flex d-flex xs3>
              <v-img aspect-ratio="1" contain position="top left" :src="$config.apiBaseUrl + eventData.image"></v-img>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex class="text-xs-left">
              <div class="preview-md" v-html="compiledDesc"></div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <template v-if="$store.state.isRanger">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog(eventData._id)">
            <v-icon color="red">delete_forever</v-icon>
          </v-btn>
          <v-btn icon @click="$router.push(`/event/edit/${eventData._id}`)">
            <v-icon color="green">edit</v-icon>
          </v-btn>
        </v-card-actions>     
      </template>
    </v-card>
    <v-dialog v-model="showDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Hapus acara?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="deleteLoading" @click.native="closeDelete()">Batal</v-btn>
          <v-btn color="error" :loading="deleteLoading" outline flat @click.native="deleteEvent()">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import dayjs from 'dayjs'
  import marked from 'marked'
  import isBetween from 'dayjs/plugin/isBetween'
  dayjs.extend(isBetween)
  import localForage from 'localforage'
  import commons from '../../libs/commons.js'
  var eventStorage = localForage.createInstance({name: 'events'})
  export default {
    data () {
      return {
        rawEventData: {},
        eventData: {},
        isLoading: true,
        loadingFailed: false,
        compiledDesc: '',
        deleteId: null,
        showDelete: false,
        deleteLoading: false,
      }
    },
    methods: {
      loadEventData () {
        this.loadingFailed = false
        axios.get(`${this.$config.apiBaseUrl}/api/event/${this.$route.params.id}`)
        .then(response => {
          console.log('from network', response.data);
          eventStorage.setItem(this.$route.params.id, response.data)
          this.rawEventData = JSON.parse(JSON.stringify(response.data))
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
          eventStorage.getItem(this.$route.params.id)
          .then(data => {
            if(data) {
              this.rawEventData = data
              console.log('from IndexedDb', data);
            }
            else {
              this.loadingFailed = true
            }
          })
          console.error(err);
        })
      },
      compileMarkdown: function () {
        this.compiledDesc = marked(this.eventData.description, { sanitize: true })
      },
      deleteDialog(id) {
        this.deleteId = id
        this.showDelete = true
      },
      closeDelete() {
        this.deleteId = null
        this.showDelete = false
      },
      deleteEvent () {
        this.deleteLoading = true
        axios({
          method: 'delete',
          url: `${this.$config.apiBaseUrl}/api/event/delete`,
          data: {
            id: this.deleteId
          }
        })
        .then(response => {
          this.deleteLoading = false
          this.closeDelete()
          this.$router.replace('/event')
          this.notify({message: 'Acara dihapus', type: 'success'})
        })
        .catch(error => {
          this.deleteLoading = false
          this.closeDelete()
          this.notify({message: error.message, type: 'error'})
        })
      },
    },
    watch: {
      rawEventData (val) {
        var start = dayjs(val.start * 1000)
        var end = dayjs(val.end * 1000)
        var now = new Date()
        this.eventData = val
        this.eventData.now = dayjs(now).isBetween(start, end)
        this.eventData.date = start.format('DD MMMM YYYY')
        this.eventData.start = start.format('HH:mm')
        this.eventData.end = end.format('HH:mm')
        this.compileMarkdown()
      }
    },
    mounted () {
      this.loadEventData()
      this.$store.commit('setShowBackBtn', true)
      this.$store.commit('setActiveNavigation', 'event')
    },
    destroyed () {
      this.$store.commit('setShowBackBtn', false)
    }
  }
</script>
