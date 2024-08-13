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
            <q-icon name="list_alt" size="md" class="q-mr-sm" />
            ALL STATIONS
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
        <q-table square :dense="true" :rows="rows" :columns="columns" row-key="index" :filter="filter" v-model:pagination="pagination" separator="cell">
          <template v-slot:body-cell-no="props">
            <q-td :props="props">
              <div>{{ props.rowIndex + 1 }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn-dropdown color="dark" label="Action" size="sm">
                <q-list class="q-pa-xs">
                  <q-item clickable v-close-popup :to="'/assignment/' + props.value.nsstation" class="q-pa-xs">
                    <q-item-section class="bg-green text-center text-white">
                      <q-item-label>VIEW</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup :to="'/assignment/create/' + props.value.nsstation" class="q-pa-xs">
                    <q-item-section class="bg-primary text-center text-white">
                      <q-item-label>ASSIGN</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog v-model="modal">
    <q-card style="width: 700px; max-width: 80vw">
      <form @submit.prevent="ifEdit ? update() : store()">
        <q-card-section>
          <div class="text-h6">{{ ifEdit ? "UPDATE NURSE" : "NEW NURSE" }}</div>
          <div class="text-caption text-red">Required *</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="q-mb-sm">
            <q-input filled color="dark" label="Name *" square="" v-model="form.name" :dense="true" autofocus>
              <template v-slot:after v-if="ifEdit">
                <q-toggle size="sm" class="text-caption text-weight-medium" color="green" label="Active" v-model="form.is_active" :true-value="1" :false-value="0" />
              </template>
            </q-input>
            <div class="text-caption text-red" v-if="errors.form.name && errors.show">
              {{ errors.form.name[0] }}
            </div>
          </div>
          <div class="q-mb-sm" v-if="!ifEdit">
            <q-input filled color="dark" label="Password *" square="" v-model="form.password" :dense="true" type="password" />
            <div class="text-caption text-red" v-if="errors.form.password && errors.show">
              {{ errors.form.password[0] }}
            </div>
          </div>
          <div>
            <q-select filled color="dark" label="Role *" square="" v-model="form.role" :dense="true" :options="['Nurse Supervisor', 'Head Nurse', 'Nurse']" />
            <div class="text-caption text-red" v-if="errors.form.role && errors.show">
              {{ errors.form.role[0] }}
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="bg-white text-right" v-if="!submitted">
          <q-btn square type="submit" :color="ifEdit ? 'primary' : 'green'" :label="ifEdit ? 'Update' : 'Save'" />
        </q-card-section>
        <q-card-section class="text-center" v-if="submitted">
          <q-spinner color="dark" size="md" :thickness="10" />
        </q-card-section>
        <q-separator />
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UsersPage',
  data () {
    return {
      preload: true,
      rows: [],
      columns: [
        {
          name: 'station',
          label: 'STATION',
          field: (row) => row.nsstation,
          align: 'left',
          sortable: true
        },
        {
          name: 'patient_count',
          label: 'PATIENT COUNT',
          field: (row) => row.patient_count,
          align: 'left',
          sortable: true
        },
        {
          name: 'action',
          label: 'ASSIGN NURSE',
          field: (row) => row,
          align: 'center',
          style: 'width: 5%'
        }
      ],
      filter: null,
      pagination: {
        rowsPerPage: 15
      },
      modal: false,
      object: false,
      ifEdit: false,
      ifView: false,
      form: {
        password: null,
        name: null,
        role: null,
        is_active: 1
      },
      errors: {
        show: false,
        form: {
          password: null,
          name: null,
          role: null
        }
      },
      submitted: false
    }
  },
  mounted () {
    this.index()
  },
  methods: {
    index () {
      this.$ddhApi
        .get('/patients/getAllStation', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('ddh_token')
          }
        })
        .then((response) => {
          this.rows = response.data
          this.preload = false
        })
    }
  },

  computed: {
    role () {
      return localStorage.getItem('role') ?? '-'
    }
  }
})
</script>
