<template>
  <!-- <v-card> -->
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">Annc</div>
            </v-card-title>
            {{ announcementData }}
            <v-card-actions>
              <v-btn flat dark>Sleep now</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  <!-- </v-card> -->
</template>
<script>
import axios from 'axios'
export default {
  name: 'dashboard',
  data () {
    return {
      announcementData: []
    }
  },
  methods: {
    loadAnnouncementData () {
      axios.get(`${this.$config.apiBaseUrl}/api/announcement`)
      .then(response => {
        console.log('from network', response.data);
        this.announcementData = response.data
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
    this.$store.commit('setHeaderTitle', 'Pengumuman')
    // this.$store.commit('setActiveNavigation', 'announcement')
    this.loadAnnouncementData()
  }
}
</script>
