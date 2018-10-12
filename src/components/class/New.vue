<template>
  <v-container fluid grid-list-lg>
    <v-flex xs12>
      <v-card>
        <v-container fluid grid-list-lg>
          <v-form v-model="valid" ref="form">
            <v-layout row>
              <v-flex>
                <v-text-field
                  v-model="name"
                  v-validate="'required'"
                  data-vv-as="Nama Kelas"
                  :error-messages="errors.collect('name')"
                  name="name"
                  label="Nama Kelas"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
                  v-model="panelist"
                  v-validate="'required'"
                  data-vv-as="Panelis"
                  :error-messages="errors.collect('panelist')"
                  name="panelist"
                  label="Panelis"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
                  v-model="max"
                  v-validate="'required|numeric'"
                  data-vv-as="Kapasitas"
                  :error-messages="errors.collect('max')"
                  name="max"
                  label="Kapasitas"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-text-field
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
                  v-validate="'required'"
                  data-vv-as="Deskripsi"
                  :error-messages="errors.collect('description')"
                  name="description"
                  required
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
            <v-layout row>
              <v-flex>
                <file-pond
                  :files="images"
                  v-model="images"
                  name="image"
                  v-validate="'array'"
                  :allow-multiple="false"
                  image-preview-max-height="100"
                  :allow-image-preview="true"
                  accepted-file-types="image/jpeg, image/png"
                  v-on:addfile="addfile"
                  v-on:removefile="removefile"
                  label-idle="Klik untuk menambahkan gambar"
                ></file-pond>
                <div v-if="errors.has('image')" class="text-xs-left caption">Gambar harus diisi</div>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-btn :disabled="isLoading" @click="saveClass" color="primary">{{isLoading ? 'Menyimpan..' : 'Simpan'}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import {mapActions} from 'vuex'
import axios from 'axios'
import {debounce} from 'lodash'
import marked from 'marked'
import vueFilePond from 'vue-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
const FilePond = vueFilePond(FilePondPluginImagePreview)
export default {
  name: 'ClassNew',
  components: {FilePond},
  data () {
    return {
      name: '',
      max: '',
      location: '',
      description: '',
      panelist: '',
      compiledDesc: '',
      images: [],
      valid: false,
      isLoading: false,
    }
  },
  methods: {
    ...mapActions(['notify']),
    addfile(error, file) {
      this.images.push(file.file)
    },
    removefile(file) {
      this.images = []
    },
    saveClass () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.isLoading = true
          var data = new FormData()
          if (this.images) {
            this.images.forEach(image => {
              data.append('image', image, image.name)
            })
          }
          data.append('name', this.name)
          data.append('max', this.max)
          data.append('location', this.location)
          data.append('description', this.description)
          data.append('panelist', this.panelist)
          axios({
            url: `${this.$config.apiBaseUrl}/api/class/create`,
            method: 'post',
            data: data
          })
          .then(response => {
            console.log(response.data);
            this.notify({message: 'Kelas tersimpan', type: 'success'})
            this.isLoading = false
            this.$router.replace('/class')
          })
          .catch(err => {
            this.isLoading = false
            console.log(err);
            this.notify({message: err.message, type: 'error'})
          })
        }
      })
    },
    compiledMarkdown: function () {
      this.compiledContent = marked(this.content, { sanitize: true })
    },
  },
  watch: {
    content () {
      this.dCompiledMarkdown()
    }
  },
  created () {
    this.dCompiledMarkdown = debounce(this.compiledMarkdown, 300)
    if (!this.$store.state.isRanger) {
      this.$router.replace('/class')
    }
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Buat Kelas')
    // this.$store.commit('setActiveNavigation', 'announcement')
    this.$store.commit('setShowBackBtn', true)
    
  },
  destroyed () {
    this.$store.commit('setShowBackBtn', false)
  }
}
</script>
