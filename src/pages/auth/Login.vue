<template>
  <q-page :class="$q.screen.lt.md ? 'flex flex-center' : 'flex flex-center bg-grey-2'">
    <q-card :class="$q.screen.lt.md ? 'q-pa-md shadow-0 my_card' : 'q-pa-md shadow-2 my_card'" :bordered="$q.screen.lt.md ? false : true" style="min-width: 500px;">
      <q-card-section class="text-center">
        <div>
          <img alt="Home Icon" src="~assets/logo-ddh.png" style="max-width: 300px;" class="lh-1">
        </div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>
      <q-card-section>
        <q-input color="dark" dense outlined v-model="username" label="Username"></q-input>
        <span class="text-red text-caption" v-if="errors && errors.username">
          {{ errors.username[0] }}
        </span>
        <q-input color="dark" dense outlined class="q-mt-md" v-model="password" type="password" label="Password" @keyup.enter="onLogin()"></q-input>
        <span class="text-red text-caption" v-if="errors && errors.password">
          {{ errors.password[0] }}
        </span>
      </q-card-section>
      <q-card-section class="text-center">
        <q-spinner color="primary" size="3em" :thickness="10" v-if="submitted" />
        <q-btn v-else square color="dark" rounded size="md" label="Sign in" no-caps class="full-width" @click="onLogin()"></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">Don't have an account yet?</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  data () {
    return {
      username: 'admin',
      password: null,
      errors: [],
      submitted: false
    }
  },

  methods: {
    onLogin () {
      this.submitted = true
      this.errors = []
      this.$api.post('/login', {
        username: this.username,
        password: this.password
      }).then(response => {
        localStorage.setItem('ddh_token', response.data.ddh_token)
        localStorage.setItem('token', response.data.rweb_token)
        this.$router.push('/dashboard')
        this.submitted = false
      }).catch(error => {
        console.log(error)
        if (error.response.status === 422) {
          this.errors = error.response.data.errors
        }
        this.submitted = false
      })
    }
  }
})
</script>
