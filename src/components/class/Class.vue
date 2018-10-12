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
              <v-list-tile-sub-title>Buat Kelas Baru</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar @click="showToggle = true" key="settingclass">
            <v-list-tile-avatar color="teal">
              <v-icon color="white">settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Buka/tutup pemilihan kelas</v-list-tile-title>
              <v-list-tile-sub-title>Kelas dapat dipilih/tidak</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <template v-if="!isClassOpen">
                <v-list-tile-action-text>Ditutup</v-list-tile-action-text>
                <v-icon color="grey" x-large>toggle_off</v-icon>
              </template>
              <template v-else>
                <v-list-tile-action-text>Dibuka</v-list-tile-action-text>
                <v-icon color="teal" x-large>toggle_on</v-icon>
              </template>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="card pt-2" v-if="isOffline">Offline data</div>
      <v-container v-if="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-container>
      <v-container v-else-if="loadingFailed">
        <p>Gagal memuat kelas</p>
        <v-btn color="primary" @click="loadAnnouncementData()">Muat ulang</v-btn>
      </v-container>
      <v-container v-else-if="classData.length === 0">
        <p>Belum ada kelas</p>
      </v-container>
      <template v-else>
        <v-container v-if="!isClassOpen && !$store.state.isRanger">
          <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title>
              Kelas belum dibuka
              <v-spacer></v-spacer>
              <v-btn icon color="white" @click="loadClassData()">
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </v-container>
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
                  <div>Panelis: {{item.panelist}}</div>
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
              <template v-if="$store.state.isRanger">
                <v-btn icon @click="deleteDialog(item._id)">
                  <v-icon color="red">delete_forever</v-icon>
                </v-btn>
                <v-btn icon @click="$router.push(`/class/edit/${item._id}`)">
                  <v-icon color="green">edit</v-icon>
                </v-btn>
              </template>
              <v-btn outline color="orange" @click="$router.push('/class/'+item._id)">Detail</v-btn>
              <v-btn
                v-if="!registered && !$store.state.isRanger"
                :disabled="(item.max - item.participants.length) <= 0 || registering || !isClassOpen"
                color="primary"
                @click="registerClass(item._id)"
              >
                Daftar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
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
    <v-dialog v-model="showDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Hapus kelas?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="deleteLoading" @click.native="closeDelete()">Batal</v-btn>
          <v-btn color="error" :loading="deleteLoading" outline flat @click.native="deleteClass()">
            Hapus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showToggle" persistent max-width="290">
      <v-card>
        <v-card-title class="headline" v-if="!isClassOpen">Buka pemilihan kelas?</v-card-title>
        <v-card-title class="headline" v-else>Tutup pemilihan kelas?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="toggleLoading" outline @click.native="showToggle = false">Batal</v-btn>
          <v-btn color="primary" :loading="toggleLoading" @click.native="toggleClass()">
            {{isClassOpen ? 'Tutup' : 'Buka'}}
          </v-btn>
        </v-card-actions>
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
      classData: {},
      isLoading: true,
      registering: false,
      loadingFailed: false,
      me: '',
      deleteId: null,
      showDelete: false,
      deleteLoading: false,
      isClassOpen: false,
      toggleLoading: false,
      showToggle: false,
      isOffline: false,
    }
  },
  methods: {
    dayjs: dayjs,
    ...mapActions(['notify']),
    loadClassData () {
      this.loadingFailed = false
      this.isLoading = true
      axios.get(`${this.$config.apiBaseUrl}/api/class`)
      .then(response => {
        this.isOffline = false
        console.log('from network', response.data);
        this.classData = JSON.parse(JSON.stringify(response.data))
        classStorage.setItem('index', response.data)
        this.isLoading = false
        this.getToggleClass()
      })
      .catch(err => {
        this.isOffline = true
        this.isLoading = false
        classStorage.getItem('index')
        .then(data => {
          if(data) {
            this.classData = data
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
    },
    deleteDialog(id) {
      this.deleteId = id
      this.showDelete = true
    },
    closeDelete() {
      this.deleteId = null
      this.showDelete = false
    },
    deleteClass () {
      this.deleteLoading = true
      axios({
        method: 'delete',
        url: `${this.$config.apiBaseUrl}/api/class/delete`,
        data: {
          id: this.deleteId
        }
      })
      .then(response => {
        this.deleteLoading = false
        this.closeDelete()
        this.loadClassData()
        this.notify({message: 'Kelas dihapus', type: 'success'})
      })
      .catch(error => {
        this.deleteLoading = false
        this.closeDelete()
        this.notify({message: error.message, type: 'error'})
      })
    },
    toggleClass () {
      axios({
        method: 'post',
        url: `${this.$config.apiBaseUrl}/api/class/toggle`,
        data: {
          isOpen: !this.isClassOpen
        }
      })
      .then(response => {
        this.isClassOpen = response.data.value
        this.showToggle = false
      })
      .catch(error => {
        this.showToggle = false
        this.notify({message: error.message, type: 'error'})
      })
    },
    getToggleClass () {
      axios({
        url: `${this.$config.apiBaseUrl}/api/class/setting`
      })
      .then(response => {
        this.isClassOpen = JSON.parse(JSON.stringify(response.data.value))
        classStorage.setItem('isClassOpen', response.data.value)
      })
      .catch(error => {
        classStorage.getItem('isClassOpen').then(value => {
          this.isClassOpen = value
        })
        console.log(error.message);
      })
    }
  },
  computed: {
    registered () {
      if (this.classData.length > 0) {
        console.log(this.classData);
        
        var r = false
        for (var i = 0; i<this.classData.length; i++) {
          if (this.classData[i].participants.indexOf(this.me) >= 0) {
            r = true
            break
          }
        }
        return r
      }
    },
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Kelas')
    this.loadingFailed = false
    // this.$store.commit('setActiveNavigation', 'a')
    this.loadClassData()
    localForage.getItem('apiUserId').then(id => {
      this.me = id
    })
    //isRanger
    // localForage.getItem('roles').then(roles => {
    //   if(roles.indexOf('RANGER') >= 0) this.isRanger = true
    //   else this.isRanger = true
    // })
  }
}
</script>
