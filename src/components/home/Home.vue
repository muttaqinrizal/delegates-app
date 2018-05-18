<template>
  <v-card>
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">Dashboard stuff</div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat dark>Sleep now</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
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
    this.$store.commit('setHeaderTitle', 'FLS Guide')
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

</style>
