<template>
  <v-layout fluid grid-list-lg>
    <v-flex xs12>
      <v-card v-if="$store.state.isRanger">
        <v-list two-line>
          <v-list-tile avatar @click="$router.push('/class/new')" key="addnewclass">
            <v-list-tile-avatar color="teal">
              <v-icon color="white">add</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Buat Kelas</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">Buat Kelas Baru</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar @click="$router.push('/class/new')" key="settingclass">
            <v-list-tile-avatar color="teal">
              <v-icon color="white">settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Pengaturan kelas</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">Buka-tutup kelas</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <v-container v-for="item in classData" :key="item._id">
        <v-card>
          <v-layout row>
            <v-flex xs8 sm8 md10 lg10>
              <v-card-text class="text-xs-left">
                <div class="title">
                  {{item.name}}
                </div>
              </v-card-text>
              <v-card-text class="text-xs-left">
                <div>{{item.panelist}}</div>
                <div v-if="(item.max - item.participants.length) > 0">Sisa kuota: {{item.max - item.participants.length}}</div>
                <div v-else>
                  <v-icon color="orange">info</v-icon>
                  Kelas penuh
                </div>
              </v-card-text>
            </v-flex>
            <v-flex xs4 sm4 md2 lg2>
              <div class="pa-2">
                <v-img v-if="item.image" :src="$config.apiBaseUrl + item.image"></v-img>
                <v-img v-else :src="$config.baseUrl + '/images/logo.png'"></v-img>
              </div>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <div style="margin-left: 8px" v-if="item.participants.indexOf(me) >= 0">
              <v-icon color="green">check_circle</v-icon>
              <span>Terdaftar</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn outline color="orange" @click="$router.push('/class/'+item._id)">Detail</v-btn>
            <v-btn
              v-if="!registered"
              :disabled="(item.max - item.participants.length) <= 0 || registering"
              color="primary"
              @click="registerClass(item._id)"
            >
              Daftar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-flex>
    <v-dialog
      v-model="registering"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Mendaftarkan ke kelas...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import {mapActions} from 'vuex'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localForage from 'localforage'
dayjs.extend(relativeTime)
var classStorage = localForage.createInstance({name: 'class'})
export default {
  name: 'Class',
  data () {
    return {
      classData: [],
      isLoading: true,
      registering: false,
      registered: false,
      loadingFailed: false,
      me: ''
    }
  },
  methods: {
    dayjs: dayjs,
    ...mapActions(['notify']),
    loadClassData () {
      this.loadingFailed = false
      axios.get(`${this.$config.apiBaseUrl}/api/class`)
      .then(response => {
        console.log('from network', response.data.class);
        this.classData = response.data.class
        this.registered = response.data.registered
        this.me = response.data.me
        classStorage.setItem('index', response.data)
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        classStorage.getItem('index')
        .then(data => {
          if(data) {
            this.classData = data.class
            this.registered = data.registered
            this.me = data.me
            console.log('from IndexedDb', data);
          }
          else {
            this.loadingFailed = true
          }
        })
        console.log(err);
      })
    },
    registerClass(id) {
      this.registering = true
      axios({
        url: `${this.$config.apiBaseUrl}/api/class/attend`,
        method: 'post',
        data: {
          classId: id
        }
      })
      .then(response => {
        this.registering = false
        this.notify({message: 'Berhasil terdaftar di kelas', type: 'success'})
        this.loadClassData()
      })
      .catch(err => {
        this.registering = false
        console.log(err);
        this.notify({message: err.message, type: 'error'})
      })
    }
  },
  computed: {

  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Kelas')
    this.loadingFailed = false
    // this.$store.commit('setActiveNavigation', 'a')
    this.loadClassData()
  }
}
</script>
