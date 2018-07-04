<template>
  <div>
    <v-container>
      <!-- <div class="margin-bottom-8">
        <v-card >
          <v-container>
            <p class="text-md-left text-sm-left text-xs-left">Sedang berlangsung</p>
            <div class="detail">
              <v-layout row wrap>
                <v-flex d-flex xs3 sm2 md1>
                  <img :src="getPicture('pembukaan.png')" style="height: 90px;">
                </v-flex>
                <v-flex xs9>
                  <div style="padding-left: 10px;">
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
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-container>
        </v-card>
      </div>

      <div class="margin-bottom-8">
        <v-card >
          <v-container>
            <p class="text-md-left text-sm-left text-xs-left">Berikutnya</p>
            <div class="detail">
              <v-layout row wrap>
                <v-flex d-flex xs3 sm2 md1>
                  <img :src="getPicture('pembukaan.png')" style="height: 90px;">
                </v-flex>
                <v-flex xs9>
                  <div style="padding-left: 10px;">
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
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-container>
        </v-card>
      </div>
       -->
      <v-flex xs12 class="margin-bottom-12">
        <v-card color="gray darken-2">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs4 sm2 md2 lg2>
                <img :src="getPicture('pembukaan.png')" style="height: 90px;">
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
                <img :src="getPicture('pembukaan.png')" style="height: 90px;">
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
export default {
  name: 'dashboard',
  data () {
    return {
      time: null
    }
  },
  methods: {
    getPicture (name) {
      return `http://localhost:3000/api/static/images/${name}`
    }
  },
  mounted () {
    // this.$store.commit('setHeaderTitle', 'FLS Guide')
    this.$store.commit('setActiveNavigation', 'home')
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
