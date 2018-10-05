<template>
  <v-container fluid grid-list-lg>
    <v-flex xs12>
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-card v-else>
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
            <v-layout row>
              <v-flex>
                <v-autocomplete
                  v-model="scope"
                  v-validate="'required'"
                  data-vv-as="Room"
                  :error-messages="errors.collect('scope')"
                  name="scope"
                  label="Room"
                  required
                  :items="scopes"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-textarea
                  v-model="content"
                  outline
                  v-validate="'required'"
                  data-vv-as="Konten"
                  :error-messages="errors.collect('content')"
                  name="content"
                  required
                  label="Konten"
                  hint="Markdown supported"
                  persistent-hint
                ></v-textarea>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="text-xs-left">Preview Konten</v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex >
                <div class="text-xs-left preview-md" v-html="compiledContent"></div>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex>
                <file-pond
                  :files="images"
                  :allow-multiple="true"
                  image-preview-max-height="100"
                  :allow-image-preview="true"
                  accepted-file-types="image/jpeg, image/png"
                  v-on:addfile="addfile"
                  label-idle="Klik untuk menambahkan gambar"
                ></file-pond>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex>
                <v-btn :disabled="saveLoading" :loading="saveLoading" @click="saveAnnouncement" color="primary">Kirim</v-btn>
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
  name: 'dashboard',
  components: {FilePond},
  data () {
    return {
      title: '',
      content: '',
      compiledContent: '',
      scope: '',
      scopes: ['semua', 'digital'],
      images: [],
      valid: false,
      isLoading: false,
      saveLoading: false,
    }
  },
  methods: {
    ...mapActions(['notify']),
    addfile(error, file) {
      this.images.push(file.file)
    },
    saveAnnouncement () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.saveLoading = true
          var data = new FormData()
          if (this.images) {
            this.images.forEach(image => {
              data.append('images', image, image.name)
            })
          }
          data.append('title', this.title)
          data.append('scope', this.scope === 'semua' ? 'all' : this.scope)
          data.append('content', this.content)
          axios({
            url: `${this.$config.apiBaseUrl}/api/announcement/create`,
            method: 'post',
            data: data
          })
          .then(response => {
            console.log(response.data);
            this.notify({message: 'Pengumuman terkirim', type: 'success'})
            this.saveLoading = false
            this.$router.replace('/announcement')
          })
          .catch(err => {
            this.saveLoading = false
            console.log(err);
            this.notify({message: err.message, type: 'error'})
          })
        }
      })
    },
    loadRoomList () {
      this.isLoading = true
      axios({
        url: `${this.$config.apiBaseUrl}/api/user/rooms`,
      }).then(response => {
        this.scopes = response.data
        this.scopes.push('semua')
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        console.log('[X]', error.message);
      })
    },
    compiledMarkdown () {
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
      this.$router.replace('/announcement')
    }
  },
  mounted () {
    this.$store.commit('setHeaderTitle', 'Pengumuman')
    // this.$store.commit('setActiveNavigation', 'announcement')
    this.$store.commit('setShowBackBtn', true)
    this.loadRoomList()
    
  },
  destroyed () {
    this.$store.commit('setShowBackBtn', false)
  }
}
</script>
