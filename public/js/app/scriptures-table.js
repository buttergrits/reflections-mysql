const scripturesTable = Vue.component('scriptures-table', {
  props: ['name', 'scriptures', 'loading'],
  template: /*html*/ `
    <div>
    <p-datatable :value="scriptures" :loading="loading" :filters.sync="scrfilters" removable-sort :auto-layout="true" :rows="8"
            ref="dt" :selection.sync="selectedscript" @row-select="$emit('selscr',selectedscript)" selection-mode="single"
            data-key="id" :paginator="true"
            paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rows-per-page-options="[8,20,50]"
            current-page-report-template="Showing {first} to {last} of {totalRecords}">

        <template #header>
          <div >
            <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <p-inputtext v-model="scrfilters['global']" placeholder="Keyword Search" />
            </span>
            <p-button icon="pi pi-external-link"     label="Export"        @click="$refs.dt.exportCSV()" ></p-button>
            <p-button icon="pi pi-plus"              label="New Scripture" @click="$emit('newscr',false)" ></p-button>
            <label style="margin-left: 1em;font-size: 1.5em;">{{ name }}</label>
          </div>
        </template>

        <p-column sortable field="id"             header="ID"         ></p-column>
        <p-column sortable field="scriptureNum"   header="#"          ></p-column>
        <p-column sortable field="scriptureTag"   header="Tag"        ></p-column>
        <p-column sortable field="locationDesc"   header="Location"   ></p-column>
        <p-column sortable field="scriptureDesc"  header="Description"></p-column>
        <p-column sortable field="text"           header="Text"       ></p-column>

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
      scrfilters  : {},
      selectedscript: null,
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
