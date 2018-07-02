<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="card" v-if="offline">Offline mode</div>
    <v-layout row wrap>
      <template>
        <timeline id="tl" ref="tl" timeline-theme="#ffbb00" v-if="!isLoading">
          <div v-for="item in eventData" :key="item._id" :id="'tll' + item._id">
            <timeline-item color="#ffbb00" line-color="#ffffff">
              <v-card :id="'tl-' + item.id">
                <div class="detail">
                  <v-layout row wrap>
                    <v-flex d-flex xs3>
                      <img :src="getPicture(item.image)" style="height: 90px;">
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
        <div v-if="isLoading">
          Loading...
        </div>
        <div v-if="loadingFailed">
          Offline
        </div>
      </template>
    </v-layout>
  </v-container>
</template>
<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import commons from '../../libs/commons'
import axios from 'axios'
import localForage from 'localforage'
export default {
  name: 'dashboard',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      eventData: [],
      offline: false,
      loadingFailed: false,
      isLoading: true,
      items: [
        {
          id: 1,
          title: 'Pre-event',
          image: 'pre_event_new.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '08.00 - 12.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Semarang Digital Kreatif',
          now: false
        },
        {
          id: 2,
          title: 'Idea Summit dadakan',
          image: 'idea_summit.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '14.00 - 16.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Rumah Sasongko',
          now: true
        },
        {
          id: 3,
          title: 'Pre-event',
          image: 'pre_event_new.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '08.00 - 12.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Semarang Digital Kreatif',
          now: false
        },
        {
          id: 4,
          title: 'Idea Summit',
          image: 'idea_summit.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '14.00 - 16.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Rumah Sasongko',
          now: false
        },
        {
          id: 5,
          title: 'Pre-event',
          image: 'pre_event_new.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '08.00 - 12.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Semarang Digital Kreatif',
          now: false
        },
        {
          id: 6,
          title: 'Idea Summit',
          image: 'idea_summit.png',
          dresscode: 'Bebas, rapi, bersepatu, sopan.',
          time: '14.00 - 16.00 WIB',
          date: 'Sabtu, 19 Mei 2018',
          location: 'Rumah Sasongko',
          now: false
        },
      ]
    }
  },
  computed: {
    events() {
      
    }
  },
  methods: {
    getPicture (name) {
      return `http://localhost:3000/api/static/images/${name}`
    },
    loadEventData () {
      axios.get('http://localhost:3000/api/event')
      .then(response => {
        console.log('from network', response.data);
        
        localForage.setItem('events', JSON.stringify(response.data))
        this.eventData = response.data
        this.isLoading = false
      })
      .catch(err => {
        localForage.getItem('events')
        .then(events => {
          console.log('from localforage', events);
          if (events) {
            this.eventData = JSON.parse(events)
            this.offline = true
          }
          else {
            this.loadingFailed = true
          }
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
          this.loadingFailed = true
          this.isLoading = false
        })
      })
    }
  },
  mounted () {
    // this.$store.commit('setHeaderTitle', 'Event')
    this.loadEventData()
    this.$store.commit('setActiveNavigation', 'event')
    this.$nextTick(() => {
      // var selected = document.getElementById('tl-0')
      // console.log(selected)
      // document.location.hash = selected.id
      // this.$vuetify.goTo('#tll2')
    })
  }
}
</script>

<style>
  .timeline-item .detail {
    padding: 8px;
    border: none !important;
  }

  .timeline-item {
    min-width: 300px;
  }

  .timeline {
    margin-right: 10px;
  }

  .d-flex > img {
    flex: 0 !important;
  }
  
  .now {
    background-color: #FFB74D;
    padding: 4px;
    font-size: 10px;
    border-radius: 4px;
  }

  .bullet::before {
    position: absolute;
    font-family: "Material Icons";
    margin-left: -1.3em;
    margin-top: 0;
    font-size: 15px;
  }

  .bullet.dresscode::before {
    content: "wc";
  }
  .bullet.time::before {
    content: "access_time";
  }
  .bullet.date::before {
    content: "event";
  }
  .bullet.location::before {
    content: "location_on";
  }
</style>
