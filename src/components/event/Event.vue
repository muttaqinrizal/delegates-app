<template>
  <v-layout fluid grid-list-lg>
    <v-flex xs12>
      <v-card v-if="$store.state.isRanger">
        <v-list two-line>
          <v-list-tile
              :key="'newAnnc'"
              avatar
              @click="$router.push('/event/new')"
            >
              <v-list-tile-avatar color="teal">
                <v-icon color="white">add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Buat Acara</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">Tambahkan acara ke timeline</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-card>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg>
        <div class="card" v-if="isOffline">Offline data</div>
        <v-layout row wrap>
          <template>
            <v-container v-if="isLoading" class="text-xs-center">
              <v-progress-circular
                indeterminate
                color="primary">
              </v-progress-circular>
            </v-container>
            <v-container v-else-if="loadingFailed">
              <p>Gagal memuat event</p>
              <v-btn color="primary" @click="loadEventData()">Muat ulang</v-btn>
            </v-container>
            <v-container v-else-if="eventData.length <= 0">
              <p>Belum ada acara</p>
            </v-container>
            <timeline v-else id="tl" ref="tl" timeline-theme="#ffbb00">
              <div v-for="item in eventData" :id="'tll' + item._id">
                <timeline-item color="#ffbb00" line-color="#ffffff">
                  <v-card :id="'tl' + item._id">
                    <div class="detail">
                      <v-layout row wrap>
                        <v-flex d-flex xs3>
                          <v-img aspect-ratio="1" contain position="top left" :src="$config.apiBaseUrl + item.image"></v-img>
                        </v-flex>
                        <v-flex xs9>
                          <div style="padding-left: 10px;">
                            <div style="text-align: left; margin-bottom: 8px;">
                              <strong>{{ item.title }}</strong>
                              <span class="now" v-if="item.now">Sekarang</span>
                            </div>
                            <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                              {{ item.dresscode }}
                            </div>
                            <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                              {{ item.start }} - {{ item.end }} WIB
                            </div>
                            <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                              {{ item.date || '-'}}
                            </div>
                            <div class="bullet location" style="text-align: left;">
                              {{ item.location }}
                            </div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </div>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <template v-if="$store.state.isRanger">
                        <v-btn icon @click="deleteDialog(item._id)">
                          <v-icon color="red">delete_forever</v-icon>
                        </v-btn>
                        <v-btn icon @click="$router.push(`/event/edit/${item._id}`)">
                          <v-icon color="green">edit</v-icon>
                        </v-btn>
                      </template>
                      <v-btn outline small @click="$router.push(`/event/${item._id}`)">Detail</v-btn>
                    </v-card-actions>
                  </v-card>
                </timeline-item>
              </div>
            </timeline>
          </template>
        </v-layout>
        <v-dialog v-model="showDelete" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Hapus event?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="deleteLoading" @click.native="closeDelete()">Batal</v-btn>
              <v-btn color="error" :loading="deleteLoading" outline flat @click.native="deleteEvent()">
                Hapus
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import {mapActions} from 'vuex'
import commons from '../../libs/commons'
import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import localForage from 'localforage'
var eventStorage = localForage.createInstance({name: 'events'})
import '../../styles/timeline.css'
export default {
  name: 'dashboard',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      rawEventData: [],
      eventData: [],
      loadingFailed: false,
      isLoading: true,
      showDetail: false,
      detailId: '',
      detailTitle: '',
      nowId: '',
      deleteId: null,
      showDelete: false,
      deleteLoading: false,
      isOffline: false
    }
  },
  computed: {
    // isOnline () {
    //   return navigator.onLine
    // },
  },
  methods: {
    ...mapActions(['notify']),
    loadEventData () {
      this.loadingFailed = false
      axios.get(`${this.$config.apiBaseUrl}/api/event`)
      .then(response => {
        console.log('from network', response.data);
        eventStorage.setItem('index', response.data)
        this.rawEventData = JSON.parse(JSON.stringify(response.data))
        this.isLoading = false
        this.isOffline = false
      })
      .catch(err => {
        this.isLoading = false
        this.isOffline = true
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
        this.loadEventData()
        this.notify({message: 'Event dihapus', type: 'success'})
      })
      .catch(error => {
        this.deleteLoading = false
        this.closeDelete()
        this.notify({message: error.message, type: 'error'})
      })
    }
  },
  mounted () {
    // this.$store.commit('setHeaderTitle', 'Event')
    // this.$store.commit('setShowBackBtn', true)
    this.loadEventData()
    this.$store.commit('setActiveNavigation', 'event')
    this.$nextTick(() => {
      // var selected = document.getElementById('tl-0')
      // console.log(selected)
      // document.location.hash = selected.id
      // this.$vuetify.goTo(this.nowId)
    })
  },
  watch: {
    rawEventData (val) {
      this.eventData = []
      val.forEach(event => {
        console.log(event);
        var start = dayjs(event.start * 1000)
        var end = dayjs(event.end * 1000)
        var now = new Date()
        var eventData = event
        eventData.now = dayjs(now).isBetween(start, end)
        if (eventData.now) this.nowId = event._id
        eventData.date = start.format('DD MMMM YYYY')
        eventData.start = start.format('HH:mm')
        eventData.end = end.format('HH:mm')
        this.eventData.push(eventData)
      })
    },
    nowId (val) {
      this.$nextTick(() => {
        this.$vuetify.goTo(`#tll${val}`, {offset: -100})
      })
    }
  },
}
</script>
