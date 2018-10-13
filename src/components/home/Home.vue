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
        <div class="card" v-if="isOffline">Offline data</div>
      </v-flex>
      <v-flex>
        <div class="text-xs-left mb-2 title">Pengumuman terbaru</div>
      </v-flex>
      <v-flex>
        <v-container v-if="anncLoading">
          <v-progress-circular
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-container>
        <v-container v-else-if="anncFailed">
          <p>Gagal memuat pengumuman terbaru</p>
          <v-btn color="primary" @click="loadAnnouncementData()">Muat ulang</v-btn>
        </v-container>
        <v-container v-else-if="announcementData === null">
          <div>Belum ada pengumuman</div>
        </v-container>
        <v-card v-else color="gray darken-2">
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex d-flex xs2>
                <v-icon large>
                  notifications
                </v-icon>
              </v-flex>
              <v-flex xs10 class="text-xs-left">
                <div class="pl-2">
                  <div class="mb-1">
                    <strong>{{announcementData.title}}</strong>
                  </div>
                  <div>
                    {{dayjs(announcementData.createdAt).fromNow()}}
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" outline small @click="$router.push(`/announcement/detail?id=${announcementData._id}`)">Detail</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <div class="text-xs-left mb-2 mt-3 title">Acara</div>
      </v-flex>
      <template v-if="!isLoading">
        <v-flex v-if="!eventData.now && !eventData.next">
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
              <v-btn color="primary" outline small @click="$router.push(`/event/${eventData.now._id}`)">Detail</v-btn>
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
              <v-btn color="primary" outline small @click="$router.push(`/event/${eventData.next._id}`)">Detail</v-btn>
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
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
import localForage from 'localforage'
var eventStorage = localForage.createInstance({name: 'events'})
var anncStorage = localForage.createInstance({name: 'announcements'})
import '../../styles/timeline.css'
import common from '../../libs/commons'
export default {
  name: 'dashboard',
  data () {
    return {
      time: null,
      subscription: '',
      loadingFailed: false,
      eventData: {
        now: null,
        next: null
      },
      rawEventData: {},
      isLoading: true,
      temp: [],
      isOffline: false,
      announcementData: null,
      anncLoading: true,
      anncFailed: false,
    }
  },
  methods: {
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
      axios.get(`${this.$config.apiBaseUrl}/api/event`)
      .then(response => {
        this.isOffline = false
        console.log('from network', response.data);
        eventStorage.setItem('index', response.data)
        this.rawEventData = JSON.parse(JSON.stringify(response.data))
        this.isLoading = false
      })
      .catch(err => {
        this.isOffline = true
        this.isLoading = false
        eventStorage.getItem('index')
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
    loadAnnouncementData () {
      axios.get(`${this.$config.apiBaseUrl}/api/announcement/latest`)
      .then(response => {
        this.anncLoading = false
        this.announcementData = JSON.parse(JSON.stringify(response.data))
        anncStorage.setItem('latest', response.data)
        if (response.data !== null) anncStorage.setItem(response.data._id, response.data)
      })
      .catch(error => {
        this.anncLoading = false
        anncStorage.getItem('latest').then(data => {
          if(data) {
            this.announcementData = data
          }
          else {
            this.anncFailed = true
          }
        })
      })
    }
  },
  watch: {
    rawEventData (events) {
      var eventData = []
      var eventsCopy = JSON.parse(JSON.stringify(events))
      eventsCopy.forEach(event => {
        var _eventData = event
        if (event) {
          var start = dayjs(event.start * 1000)
          var end = dayjs(event.end * 1000)
          _eventData.date = start.format('DD MMMM YYYY')
          _eventData.start = start.format('HH:mm')
          _eventData.end = end.format('HH:mm')
        }
        eventData.push(event)
      })
      this.temp = eventData
      
      var now = dayjs(new Date())
      if (events.length > 0) {
        var firstStart = dayjs(events[0].start * 1000)
        var lastEnd = dayjs(events[events.length-1].end * 1000)
        // console.log(lastEnd);
        
        if (now.isBefore(firstStart)) {
          this.eventData.now = null
          this.eventData.next = eventData[0]
        }
        else if (now.isAfter(lastEnd)) {
          this.eventData.now = null
          this.eventData.next = null
        }
        else {
          var theOnlyNext = null
          
          events.forEach((event, index) => {
            var start = dayjs(event.start * 1000)
            var end = dayjs(event.end * 1000)
            if (now.isBetween(start, end)) {
              this.eventData.now = eventData[index]
              this.eventData.next = eventData[index+1]
            }
            else if (!theOnlyNext && now.isBefore(start)) {
              this.eventData.next = eventData[index]
            }
          })
        }
        this.temp = eventData
        
      }
      //old
      // ['now', 'next'].forEach(event => {
      //   console.log(event);
      //   var eventData = val[event]
      //   if (val[event]) {
      //     var start = dayjs(val[event].start * 1000)
      //     var end = dayjs(val[event].end * 1000)
      //     eventData.now = event === 'now'
      //     eventData.date = start.format('DD MMMM YYYY')
      //     eventData.start = start.format('HH:mm')
      //     eventData.end = end.format('HH:mm')
      //   }
      //   this.eventData[event] = eventData
      // })
    },
  },
  mounted () {
    this.$store.commit('setActiveNavigation', 'home')
    this.subscription = Notification.permission
    this.loadEventData()
    this.loadAnnouncementData()
  },
  created () {
    this.dayjs = dayjs
  }
}
</script>

<style>
  /* .layout.row.wrap {
    height: 100%;
    overflow: auto;
  } */

  /* .timeline-item {
    text-align: left;
    margin: 0 16px 16px 28px;
  } */

  .timeline-item .detail {
    border: solid 2px;
  }

  /* .timeline-others {
    padding: 0;
    height: 40px;
  } */
  .margin-bottom-12 {
    margin-bottom: 12px;
  }
  

</style>
