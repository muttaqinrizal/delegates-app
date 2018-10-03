<template>
  <v-container fluid grid-list-lg>
    <v-flex xs12>
      <v-card>
        <v-container fluid grid-list-lg>
          <v-form v-model="valid" ref="form">
            <v-layout row>
              <v-flex>
                <v-text-field
                  v-model="title"
                  v-validate="'required'"
                  data-vv-as="Judul"
                  :error-messages="errors.collect('title')"
                  name="title"
                  label="Judul"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 sm6 md4>
                <v-dialog
                  ref="dialog"
                  v-model="showDatepicker"
                  :return-value.sync="date"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="date"
                    v-validate="'required'"
                    data-vv-as="Tanggal"
                    :error-messages="errors.collect('date')"
                    name="date"
                    label="Tanggal"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="showDatepicker = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs11 sm5>
                <v-dialog
                  ref="startTimeDialog"
                  v-model="showStart"
                  :return-value.sync="start"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="start"
                    v-validate="'required'"
                    data-vv-as="Waktu mulai"
                    data-vv-validate-on="change"
                    :error-messages="errors.collect('start')"
                    name="start"
                    key="start-input"
                    label="Waktu mulai"
                    prepend-icon="access_time"
                    readonly
                  ></v-text-field>
                  <v-time-picker
                    format="24hr"
                    v-model="start"
                  >
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="showStart = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.startTimeDialog.save(start)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
              <v-flex xs11 sm5>
                <v-dialog
                  ref="endTimeDialog"
                  v-model="showEnd"
                  :return-value.sync="end"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="end"
                    v-validate="'required'"
                    data-vv-as="Waktu selesai"
                    data-vv-validate-on="change"
                    :error-messages="errors.collect('end')"
                    name="end"
                    label="Waktu selesai"
                    prepend-icon="access_time"
                    readonly
                  ></v-text-field>
                  <v-time-picker
                    format="24hr"
                    v-model="end"
                  >
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="showEnd = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.endTimeDialog.save(end)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
                  prepend-icon="wc"
                  v-model="dresscode"
                  v-validate="'required'"
                  data-vv-as="Dresscode"
                  :error-messages="errors.collect('dresscode')"
                  name="dresscode"
                  label="Dresscode"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
                  prepend-icon="location_on"
                  v-model="location"
                  v-validate="'required'"
                  data-vv-as="Lokasi"
                  :error-messages="errors.collect('location')"
                  name="location"
                  label="Lokasi"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-textarea
                  v-model="description"
                  outline
                  data-vv-as="Deskripsi"
                  label="Deskripsi"
                  hint="Markdown supported"
                  persistent-hint
                ></v-textarea>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="text-xs-left">Preview Deskripsi</v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex >
                <div class="text-xs-left preview-md" v-html="compiledDesc"></div>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row v-if="rawEventData.image">
              <v-flex>
                <div class="text-xs-left">Gambar sekarang</div>
              </v-flex>
              <v-flex xs3>
                <v-img
                  :src="$config.apiBaseUrl + rawEventData.image"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <v-layout
                    slot="placeholder"
                    fill-height
                    align-center
                    justify-center
                    ma-1
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout>
                </v-img>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <file-pond
                  :files="images"
                  v-model="images"
                  name="image"
                  :allow-multiple="false"
                  image-preview-max-height="100"
                  :allow-image-preview="true"
                  accepted-file-types="image/jpeg, image/png"
                  v-on:addfile="addfile"
                  v-on:removefile="removefile"
                  label-idle="Klik untuk menambah/mengganti gambar"
                ></file-pond>
                <div v-if="errors.has('image')" class="text-xs-left caption">Gambar harus diisi</div>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-btn :disabled="isLoading" @click="saveEvent()" color="primary">{{isLoading ? 'Menyimpan..' : 'Simpan'}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import axios from 'axios'
import {mapActions} from 'vuex'
import marked from 'marked'
import {debounce} from 'lodash'
import vueFilePond from 'vue-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
const FilePond = vueFilePond(FilePondPluginImagePreview)
export default {
  name: 'EditEvent',
  data () {
    return {
      title: '',
      date: '',
      start: null,
      end: null,
      dresscode: '',
      location: '',
      images: [],
      description: '',
      showDatepicker: false,
      showStart: false,
      showEnd: false,
      isLoading: false,
      compiledDesc: '',
      valid: false,
      rawEventData: {},
      eventData: {}
    }
  },
  watch: {
    description (val) {
      this.dCompileMarkdown()
    },
    rawEventData (val) {
      var start = dayjs(val.start * 1000)
      var end = dayjs(val.end * 1000)
      var now = new Date()
      this.title = val.title
      this.date = start.format('YYYY-MM-DD')
      this.start = start.format('HH:mm')
      this.end = end.format('HH:mm')
      this.dresscode = val.dresscode
      this.location = val.location
      this.description = val.description
    }
  },
  methods: {
    ...mapActions(['notify']),
    compileMarkdown: function () {
      this.compiledDesc = marked(this.description, { sanitize: true })
    },
    addfile(error, file) {
      this.images.push(file.file)
    },
    removefile(file) {
      this.images = []
    },
    loadEventData () {
      this.loadingFailed = false
      axios.get(`${this.$config.apiBaseUrl}/api/event/${this.$route.params.id}`)
      .then(response => {
        this.rawEventData = response.data
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        this.loadingFailed = true
        console.error(err);
      })
    },
    saveEvent () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.isLoading = true
          var data = new FormData()
          if (this.images) {
            this.images.forEach(image => {
              data.append('image', image, image.name)
            })
          }
          data.append('id', this.$route.params.id)
          data.append('title', this.title)
          data.append('date', this.date)
          var start = new Date(this.date + ' ' + this.start)
          var end = new Date(this.date + ' ' + this.end)
          data.append('timeStart', start/1000)
          data.append('timeEnd', end/1000)
          data.append('dresscode', this.dresscode)
          data.append('location', this.location)
          data.append('description', this.description)
          axios({
            method: 'post',
            url: `${this.$config.apiBaseUrl}/api/event/update`,
            data: data
          })
          .then(response => {
            console.log(response.data);
            this.notify({message: 'Perubahan tersimpan', type: 'success'})
            this.isLoading = false
            this.$router.replace('/event')
          })
          .catch(err => {
            this.isLoading = false
            console.log(err);
            this.notify({message: err.message, type: 'error'})
          })
        }
      })
    }
  },
  created () {
    this.dCompileMarkdown = debounce(this.compileMarkdown, 500)
    if (!this.$store.state.isRanger) {
      this.$router.replace('/event')
    }
  },
  mounted () {
    this.loadEventData()
    this.$store.commit('setShowBackBtn', true)
  },
  destroyed () {
    this.$store.commit('setShowBackBtn', false)
  }
}
</script>