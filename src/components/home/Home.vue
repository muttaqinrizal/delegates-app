<template>
  <div>
    <v-container fluid grid-list-lg>
      <v-flex xs12 class="margin-bottom-12" v-if="subscription !== 'blocked' && subscription !== 'granted'">
        <v-card color="blue-grey darken-2" class="white--text">
          <v-card-text>
            <div class="headline text-lg-left text-md-left text-sm-left text-xs-left">Dapatkan pemberitahuan</div>
            <div class="text-lg-left text-md-left text-sm-left text-xs-left">Dengan mengaktifkan pemberitahuan, anda dapat menerima notifikasi update terbaru.</div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="subscribe">Aktifkan pemberitahuan</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <div class="text-xs-left mb-2 title">Acara</div>
      </v-flex>
      <template v-if="!isLoading">
        <v-flex v-if="!(eventData.now && eventData.next)">
          <div>Tidak ada acara mendatang</div>
        </v-flex>
        <v-flex xs12 class="margin-bottom-12" v-if="eventData.now">
          <v-card color="gray darken-2">
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex d-flex xs3>
                  <v-img aspect-ratio="1" contain position="top left" :src="$config.apiBaseUrl + eventData.now.image"/>
                </v-flex>
                <v-flex xs9>
                  <div style="padding-left: 10px;">
                    <h3 class="text-md-left text-sm-left text-xs-left">Sekarang</h3>
                    <div style="text-align: left; margin-bottom: 8px;">
                    <strong>{{eventData.now.title}}</strong>
                      <!-- <span class="now" >Sekarang</span> -->
                    </div>
                    <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      {{eventData.now.dresscode}}
                    </div>
                    <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                        {{eventData.now.start}} - {{eventData.now.end}} WIB
                    </div>
                    <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      {{eventData.now.date}}
                    </div>
                    <div class="bullet location" style="text-align: left;">
                      {{eventData.now.location}}
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline small @click="$router.push(`/event/${eventData.now._id}`)">Detail</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 class="margin-bottom-12" v-if="eventData.next">
          <v-card color="gray darken-2">
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex d-flex xs3>
                  <v-img aspect-ratio="1" contain position="top left" :src="$config.apiBaseUrl + eventData.next.image"/>
                </v-flex>
                <v-flex xs9>
                  <div style="padding-left: 10px;">
                    <h3 class="text-md-left text-sm-left text-xs-left">Selanjutnya</h3>
                    <div style="text-align: left; margin-bottom: 8px;">
                    <strong>{{eventData.next.title}}</strong>
                      <!-- <span class="now" >Sekarang</span> -->
                    </div>
                    <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      {{eventData.next.dresscode}}
                    </div>
                    <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                        {{eventData.next.start}} - {{eventData.next.end}} WIB
                    </div>
                    <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      {{eventData.next.date}}
                    </div>
                    <div class="bullet location" style="text-align: left;">
                      {{eventData.next.location}}
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline small @click="$router.push(`/event/${eventData.next._id}`)">Detail</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </template>

      <div class="text-xs-center">
        <router-link to="/event">
          <v-btn outline color="indigo">Lihat jadwal</v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import localForage from 'localforage'
var eventStorage = localForage.createInstance({name: 'events'})
import '../../styles/timeline.css'
import common from '../../libs/commons'
export default {
  name: 'dashboard',
  data () {
    return {
      time: null,
      subscription: '',
      loadingFailed: false,
      eventData: {},
      rawEventData: {},
      isLoading: true,
    }
  },
  methods: {
    getApiPicture (name) {
      return `${this.$config.apiBaseUrl}/api/static/images/${name}`
    },
    subscribe() {
      Notification.requestPermission().then(permission => {
        this.subscription = permission
        if (permission === 'granted') {
          console.log('granted');
          
          common.pushSubscribe()
        }
      })
      console.log('regsss');
    },
    loadEventData () {
      this.loadingFailed = false
      axios.get(`${this.$config.apiBaseUrl}/api/event/now`)
      .then(response => {
        console.log('from network', response.data);
        eventStorage.setItem('now', response.data)
        this.rawEventData = JSON.parse(JSON.stringify(response.data))
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        eventStorage.getItem('now')
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
  },
  watch: {
    rawEventData (val) {
      ['now', 'next'].forEach(event => {
        console.log(event);
        var eventData = val[event]
        if (val[event]) {
          var start = dayjs(val[event].start * 1000)
          var end = dayjs(val[event].end * 1000)
          eventData.now = event === 'now'
          eventData.date = start.format('DD MMMM YYYY')
          eventData.start = start.format('HH:mm')
          eventData.end = end.format('HH:mm')
        }
        this.eventData[event] = eventData
      })
    },
  },
  mounted () {
    this.$store.commit('setActiveNavigation', 'home')
    this.subscription = Notification.permission
    this.loadEventData()
  }
}
</script>

<style>
  .layout.row.wrap {
    /* height: 100%;
    overflow: auto; */
  }

  .timeline-item {
    /* text-align: left;
    margin: 0 16px 16px 28px; */
  }

  .timeline-item .detail {
    border: solid 2px;
  }

  .timeline-others {
    /* padding: 0; */
    /* height: 40px; */
  }
  .margin-bottom-12 {
    margin-bottom: 12px;
  }
  

</style>
