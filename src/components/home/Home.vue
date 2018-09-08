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

      <v-flex xs12 class="margin-bottom-12">
        <v-card color="gray darken-2">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs4 sm2 md2 lg2>
                <img :src="getApiPicture('pembukaan.png')" style="height: 90px;">
              </v-flex>
              <v-flex xs8>
                <h3 class="text-md-left text-sm-left text-xs-left">Sekarang</h3>
                <div style="text-align: left; margin-bottom: 8px;">
                      <strong>Pembukaan sas sansa</strong>
                      <span class="now" >Sekarang</span>
                    </div>
                    <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      bebas
                    </div>
                    <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                        WIB
                    </div>
                    <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      -
                    </div>
                    <div class="bullet location" style="text-align: left;">
                      -
                    </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 class="margin-bottom-12">
        <v-card color="gray darken-2">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs4 sm2 md2 lg2>
                <img :src="getApiPicture('pembukaan.png')" style="height: 90px;">
              </v-flex>
              <v-flex xs8>
                <h3 class="text-md-left text-sm-left text-xs-left">Berikutnya</h3>
                <div style="text-align: left; margin-bottom: 8px;">
                      <strong>Pembukaan sas sansa</strong>
                      <span class="now" >Sekarang</span>
                    </div>
                    <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      bebas
                    </div>
                    <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                        WIB
                    </div>
                    <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                      -
                    </div>
                    <div class="bullet location" style="text-align: left;">
                      -
                    </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <div class="text-xs-center">
        <router-link to="/event">
          <v-btn outline color="indigo">Lihat jadwal</v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>
<script>
import '../../styles/timeline.css'
import common from '../../libs/commons'
export default {
  name: 'dashboard',
  data () {
    return {
      time: null,
      subscription: ''
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
    }
  },
  mounted () {
    // this.$store.commit('setHeaderTitle', 'FLS Guide')
    this.$store.commit('setActiveNavigation', 'home')
    this.subscription = Notification.permission
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
