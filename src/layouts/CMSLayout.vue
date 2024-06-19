<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-1 text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <img
            alt="Home Icon"
            src="~assets/logo-ddh.png"
            style="max-width: 300px;"
          >
        </q-toolbar-title>
        <q-btn icon="logout" label="Logout" class="btn-logout bg-dark" @click="onLogout()" flat v-if="$q.screen.gt.xs" />
        <q-btn icon="logout" color="dark" @click="onLogout()" flat v-else />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="150"
      :behavior="$q.screen.gt.sm ? 'desktop' : 'mobile'"
    >
      <q-scroll-area class="fit">
        <div class="">
          <q-tabs vertical>
            <q-route-tab :class="$route.name === 'Dashboard' ? 'bg-dark text-white' : 'text-dark'" to="/dashboard">
              <div class="q-py-sm">
                <q-icon name="fa-solid fa-house" size="md" />
                <div class="text-caption text-weight-medium lh-1 q-pt-xs">Dashboard</div>
              </div>
            </q-route-tab>
            <q-route-tab :class="$route.name === 'Doctors' ? 'bg-dark text-white' : 'text-dark'" to="/doctors">
              <div class="q-py-sm">
                <q-icon name="fa-solid fa-user-doctor" size="md" />
                <div class="text-caption text-weight-medium lh-1 q-pt-xs">Doctors</div>
              </div>
            </q-route-tab>
            <q-route-tab :class="$route.name === 'Nurses' ? 'bg-dark text-white' : 'text-dark'" to="/nurses">
              <div class="q-py-sm">
                <q-icon name="fa-solid fa-user-nurse" size="md" />
                <div class="text-caption text-weight-medium lh-1 q-pt-xs">Nurses</div>
              </div>
            </q-route-tab>
          </q-tabs>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  data () {
    return {
      name: null
    }
  },

  mounted () {
    this.getAuthUser()
  },

  methods: {
    getAuthUser () {
      this.$api.get('/user', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.name = response.data.name
        localStorage.setItem('name', response.data.name)
        localStorage.setItem('portal', response.data.portal)
        localStorage.setItem('role', response.data.role)
        this.preload = false
      })
    },

    onLogout () {
      this.preload = true
      this.$api.post('/logout', {
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.preload = false
        localStorage.removeItem('ddh_token')
        localStorage.removeItem('token')
        this.$router.push('/')
      }).catch(error => {
        console.log(error)
      })
    }
  }
})
</script>
