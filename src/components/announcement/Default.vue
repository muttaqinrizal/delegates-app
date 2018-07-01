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
export default {
  name: 'dashboard',
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Pengumuman')
    this.$store.commit('setActiveNavigation', 'announcement')
  }
}
</script>
