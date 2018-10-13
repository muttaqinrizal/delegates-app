<template>
  <v-layout fluid grid-list-lg>
    <v-flex>
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <template v-else-if="loadingFailed">
        <p>Gagal memuat pengumuman</p>
        <v-btn color="primary" @click="loadClassData()">Muat ulang</v-btn>
      </template>
      <template v-else>
        <v-container v-if="!isClassOpen">
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
        <v-container>
          <v-card>
            <v-layout row>
              <v-flex xs8 sm10 md10 lg10>
                <v-card-title primary-title>
                  <div class="headline">
                    {{classData.name}}
                  </div>
                </v-card-title>
                <v-card-text class="text-xs-left text-sm-left">
                <div>Panelis: {{classData.panelist}}</div>
                <div>Peserta: {{classData.participants.length}}/{{classData.max}}</div>
                <div>Tempat: {{classData.location}}</div>
                <v-divider></v-divider>
                <div style="margin-bottom: 24px;"></div>
                <div class="preview-md" v-html="classData.description"></div>
              </v-card-text>
              </v-flex>
              <v-flex xs4 sm2 md2 lg2>
                <div class="pa-2">
                  <v-img contain v-if="classData.image" :src="$config.apiBaseUrl + classData.image"></v-img>
                  <v-img contain v-else :src="$config.baseUrl + '/images/logo.png'"></v-img>
                </div>
              </v-flex>
            </v-layout>
            
            <v-card-actions>
              <div style="margin-left: 8px" v-if="inThisClass">
                <v-icon color="green">check_circle</v-icon>
                <span>Terdaftar</span>
              </div>
              <v-spacer></v-spacer>
              <template v-if="$store.state.isRanger">
                <v-btn icon @click="deleteDialog(classData._id)">
                  <v-icon color="red">delete_forever</v-icon>
                </v-btn>
                <v-btn icon @click="$router.push(`/class/edit/${classData._id}`)">
                  <v-icon color="green">edit</v-icon>
                </v-btn>
              </template>
              <v-btn
                v-if="!registered && !$store.state.isRanger"
                :disabled="(classData.max - classData.participants.length) <= 0 || registering || !isClassOpen"
                :loading="registering"
                color="primary"
                @click="registerClass(classData._id)"
              >
                Daftar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </v-flex>
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
  </v-layout>
</template>

<script>
  import {mapActions} from 'vuex'
  import axios from 'axios'
  import marked from 'marked'
  import localForage from 'localforage'
  import commons from '../../libs/commons.js'
  var classStorage = localForage.createInstance({name: 'class'})
  export default {
    data () {
      return {
        classData:{},
        isLoading: true,
        loadingFailed: false,
        me: '',
        registering: false,
        registered: true,
        isClassOpen: false,
        deleteId: null,
        showDelete: false,
        deleteLoading: false,
      }
    },
    methods: {
      ...mapActions(['notify']),
      loadClassData () {
        this.loadingFailed = false
        axios.get(`${this.$config.apiBaseUrl}/api/class/${this.$route.params.id}`)
        .then(response => {
          console.log('from network', response.data);
          classStorage.setItem(this.$route.params.id, response.data)
          this.classData = JSON.parse(JSON.stringify(response.data))
          this.classData.description = marked(response.data.description, { sanitize: true })
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
          classStorage.getItem(this.$route.params.id)
          .then(data => {
            if(data) {
              this.classData = data
              this.classData.description = marked(data.content, { sanitize: true })
              console.log('from IndexedDb', data);
            }
            else {
              this.loadingFailed = true
            }
          })
          console.error(err);
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
          this.$router.replace('/class')
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
      },
      getRegistered () {
        return axios.get(`${this.$config.apiBaseUrl}/api/class/registered`)
        .then(response => {
          this.registered = response.data
        })
      },
    },
    watch: {
      
    },
    computed: {
      inThisClass () {
        if (this.classData) {
          var found = this.classData.participants.find(participant => {
            return participant._id === this.me
          })
          return found ? true : false
        }
        else return false
      },
    },
    mounted () {
      this.getRegistered().then(() => {
        this.loadClassData()
      }).catch(error => {
        this.loadingFailed = true
        this.isLoading = false
        console.error(error.message)
      })
      this.getToggleClass()
      this.$store.commit('setShowBackBtn', true)
      localForage.getItem('apiUserId').then(id => {
        this.me = id
      })
      // localForage.getItem('roles').then(roles => {
      //   if(roles.indexOf('RANGER') >= 0) this.isRanger = true
      //   else this.isRanger = true
      // })
    },
    destroyed () {
      this.$store.commit('setShowBackBtn', false)
    }
  }
</script>
