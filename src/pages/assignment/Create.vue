<template>
  <div class="" v-if="role === 'Admin' || role === 'CMS'">
    <div class="fixed-center text-center" v-if="preload">
      <q-spinner-facebook color="dark" size="3em" :thickness="10" />
      <q-tooltip :offset="[0, 8]">Loading..</q-tooltip>
      <div class="q-mt-md">Please wait.</div>
    </div>

    <div v-else>
      <div class="row q-px-sm">
        <div class="col-12 col-md-9 q-py-sm self-center">
          <div class="text-weight-medium">
            <q-icon name="post_add" size="md" class="q-mr-sm" />
            ASSIGN NURSE
          </div>
        </div>
        <div class="col-8 col-md q-py-sm q-pr-sm self-center">
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search" filled>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <q-separator />

      <div class="q-pa-md">
        <q-markup-table dense separator="cell">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th width="5%">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, index) in filteredUsers" :key="index">
              <td>{{ v.username }}</td>
              <td class="text-center">{{ v.name }}</td>
              <td>
                <q-btn v-if="findUser(v.id)" size="sm" icon="add" color="green" @click="addUser(v)" />
                <q-btn size="sm" icon="close" color="red" v-else @click="removeUser(v.id)" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <q-separator />

      <div class="text-right q-pa-md q-gutter-x-md">
        <q-btn label="BACK" flat @click="$router.push('/assignment')" />
        <q-btn label="SUBMIT" :loading="submitted" color="green" @click="store()" />
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AssignCreate',
  data () {
    return {
      preload: true,
      filter: '',
      users: [],
      form: {
        users: []
      },
      submitted: false
    }
  },

  mounted () {
    this.index()
  },

  methods: {
    index () {
      this.$api
        .get('/nurses', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then((response) => {
          this.users.rows = response.data.filter(user =>
            !user.stations.some(station => station.station === this.$route.params.id)
          )
          this.preload = false
        })
    },

    addUser (params) {
      this.form.users.push({
        id: params.id
      })
    },

    removeUser (params) {
      const findIndex = this.form.users.findIndex((v) => v.id === params)
      this.form.users.splice(findIndex, 1)
    },

    findUser (params) {
      const find = this.form.users.find((v) => v.id === params)
      if (find) {
        return 0
      }
      return 1
    },

    store () {
      this.submitted = true
      if (this.form.users.length === 0) {
        this.$q.notify({
          progress: true,
          type: 'negative',
          message: 'No User Selected',
          icon: 'warning'
        })
        this.submitted = false
      } else {
        this.form.users.forEach(user => {
          this.$api
            .post('/stations', {
              station: this.$route.params.id,
              user_id: user.id
            }, {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
              }
            })
            .then((response) => {
              this.$q.notify({
                progress: true,
                type: 'positive',
                message: 'Success',
                icon: 'check'
              })

              this.index()
              this.submitted = false
            })
        })
      }
    }
  },

  computed: {
    role () {
      return localStorage.getItem('role') ?? '-'
    },

    filteredUsers () {
      return this.users.rows.filter(user =>
        user.username.toLowerCase().includes(this.filter.toLowerCase()) ||
      user.name.toLowerCase().includes(this.filter.toLowerCase())
      )
    }
  }
})
</script>
