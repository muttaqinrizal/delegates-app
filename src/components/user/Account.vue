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
              <div class="headline">Hello, User</div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'account',
  data () {
    return {

    }
  },
  methods: {

  },
  mounted: function(){
    this.$store.commit('setHeaderTitle', 'Account')
    this.$store.commit('setActiveNavigation', 'account')
  },
}
</script>
