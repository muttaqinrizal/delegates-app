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
            {{eventData.description}}
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import dayjs from 'dayjs'
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
      }
    },
    methods: {
      getApiPicture(name) {
        return commons.getApiPicture(name)
      },
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
      }
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
      }
    },
    mounted () {
      this.loadEventData()
      this.$store.commit('setShowBackBtn', true)
    },
    destroyed () {
      this.$store.commit('setShowBackBtn', false)
    }
  }
</script>
