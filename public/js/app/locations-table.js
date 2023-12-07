const locationsTable = Vue.component('locations-table', {
  props: ['name', 'locations', 'loading'],
  template: /*html*/ `
    <div>
      <p-datatable :value="locations" :loading="loading" :filters.sync="locfilters" removable-sort :auto-layout="true" :rows="8"
            ref="dt" :selection.sync="selectedlocn" @row-select="$emit('selrow',selectedlocn)" selection-mode="single"
            @row-unselect="$emit('selrow',selectedlocn)"
            :meta-key-selection="false"
            data-key="id" :paginator="true"
            paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rows-per-page-options="[8,20,50]"
            current-page-report-template="Showing {first} to {last} of {totalRecords}">

        <template #header>
        <div>
            <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <p-inputtext v-model="locfilters['global']" placeholder="Keyword Search" />
            </span>
            <p-button icon="pi pi-external-link"     label="Export"       @click="$refs.dt.exportCSV()" ></p-button>
            <p-button icon="pi pi-plus"              label="New Location" @click="$emit('newloc',false)" ></p-button>
            <label style="margin-left: 1em;font-size: 1.5em;">{{ name }}</label>
          </div>
        </template>

        <p-column sortable field="id"            header="ID"           ></p-column>
        <p-column sortable field="locationNum"   header="Seq #"        ></p-column>
        <p-column sortable field="numScriptures" header="Scrs"         ></p-column>
        <p-column sortable field="locationTag"   header="Tag"          ></p-column>
        <p-column sortable field="startTime"     header="Start Time"   ></p-column>
        <p-column sortable field="duration"      header="Duration"     ></p-column>
        <p-column sortable field="song"          header="Song"         ></p-column>
        <p-column sortable field="locationDesc"  header="Description"  ></p-column>
        <p-column :exportable="false" :styles="{'min-width':'8rem'}">
        <template #body="slotProps">
            <p-button icon="pi pi-pencil" class="p-button-sm" style="padding:4px;" @click="$emit('opendlg', slotProps.data)" ></p-button>
        </template>
    </p-column>            

      </p-datatable>

    </div>
    `,
  components : {
    'p-button'      : button      ,
    'p-datatable'   : datatable   ,
    'p-column'      : column      ,
    'p-panel'       : panel       ,
    'p-inputtext'   : inputtext   ,
  },
  data() { 
    return {
      locfilters  : {},
      selectedlocn: null,
    } 
  },
  methods: {
    myalert: function(text) {
      alert(text);
    },
  },
  computed: {
    thing  :  function() { return this.name },
  },
});
