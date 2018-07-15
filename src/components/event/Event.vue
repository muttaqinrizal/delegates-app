<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="card" v-if="!isOnline">Offline mode</div>
    <v-layout row wrap>
      <template>
        <timeline id="tl" ref="tl" timeline-theme="#ffbb00" v-if="!isLoading">
          <div v-for="(item, idx) in eventData" :key="item._id" :id="'tll' + item._id">
            <timeline-item color="#ffbb00" line-color="#ffffff">
              <v-card :id="'tl-' + item.id">
                <div class="detail" @click="openDetail(idx)">
                  <v-layout row wrap>
                    <v-flex d-flex xs3>
                      <img :key="new Date().getTime()" :src="getPicture(item.image)" style="height: 90px; width: auto;">
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
                          {{ item.time.start }} - {{ item.time.end }} WIB
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
              </v-card>
            </timeline-item>
          </div>
        </timeline>
        <v-container v-if="isLoading" class="text-xs-center">
          <v-progress-circular
            :width="6"
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-container>
        <v-container v-if="loadingFailed">
          Can't load data. Check connection.
        </v-container>
      </template>
    </v-layout>
    <detail 
      :show="showDetail" 
      @close-fn="closeDetail" 
      :title="detailTitle" 
      :event-id="detailId">
    </detail>
  </v-container>
</template>
<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import commons from '../../libs/commons'
import Detail from './EventDetail.vue'
import axios from 'axios'
import localForage from 'localforage'
import '../../styles/timeline.css'
export default {
  name: 'dashboard',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
    Detail
  },
  data () {
    return {
      eventData: [],
      offline: false,
      loadingFailed: false,
      isLoading: true,
      showDetail: false,
      detailId: '',
      detailTitle: '',
    }
  },
  computed: {
    isOnline () {
      return navigator.onLine
    },
    events() {
      
    }
  },
  methods: {
    getPicture (name) {
      return `${this.$config.apiBaseUrl}/api/static/images/${name}`
    },
    openDetail (idx) {
      this.detailId = this.eventData[idx]._id
      this.detailTitle = this.eventData[idx].title
      this.showDetail = true
    },
    closeDetail () {
      this.showDetail = false
    },
    loadEventData () {
      axios.get(`${this.$config.apiBaseUrl}/api/event`)
      .then(response => {
        console.log('from network', response.data);
        this.eventData = response.data
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
    // this.$store.commit('setHeaderTitle', 'Event')
    // this.$store.commit('setShowBackBtn', true)
    this.loadEventData()
    this.$store.commit('setActiveNavigation', 'event')
    this.$nextTick(() => {
      // var selected = document.getElementById('tl-0')
      // console.log(selected)
      // document.location.hash = selected.id
      // this.$vuetify.goTo('#tll2')
    })
  },
  destroyed () {
    this.$store.commit('setShowBackBtn', false)
  }
}
</script>
