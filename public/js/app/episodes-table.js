const episodesTable = Vue.component('episodes-table', {
  props: ['name', 'episodes', 'loading'],
  template: /*html*/ `
    <div>
      <p-datatable :value="episodes" :loading="loading" :filters.sync="epfilters" removable-sort :auto-layout="true" :rows="6"
            ref="dt" :selection.sync="selectedepi" @row-select="$emit('selrow',selectedepi)" selection-mode="single"
            @row-unselect="$emit('unselrow',selectedepi)"
            :meta-key-selection="false"
            data-key="id" :paginator="true"
            paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rows-per-page-options="[6,20,50]"
            current-page-report-template="Showing {first} to {last} of {totalRecords}">

            <template #header>
              <div >
                <span class="p-input-icon-left">
                    <i class="pi pi-search"></i>
                    <p-inputtext v-model="epfilters['global']" placeholder="Keyword Search" />
                </span>
                <p-button icon="pi pi-external-link"     label="Export"      @click="$refs.dt.exportCSV()" ></p-button>
                <p-button icon="pi pi-plus"              label="New Episode" @click="$emit('newepi',false)" ></p-button>
                <label style="margin-left: 1em;font-size: 1.5em;">{{ name }}</label>
              </div>
            </template>

            <!-- <p-column sortable field="id"                header="ID"         ></p-column>  -->
            <!-- <p-column sortable field="seasonNum"         header="Season"     ></p-column>  -->
            <!-- <p-column sortable field="episodeNum"        header="Episode Seq"></p-column>  -->
            <!-- <p-column sortable field="episodeNumAlt"     header="Episode Num"></p-column>  -->
            <p-column sortable field="episodeTag"        header="Episode Tag"></p-column>
            <!-- <p-column sortable field="locationCount"     header="# Locations"></p-column>
            <p-column sortable field="numLocsWithScrs"   header="# Locs W/Scrs"></p-column>
            <p-column sortable field="locationCount"     header="# Locations"></p-column> -->
            <p-column sortable field="locationCount"   header="Locs / wScr">
              <template #body="slotProps">
                  {{slotProps.data.locationCount}} / {{slotProps.data.numLocsWithScrs}}
              </template>
            </p-column>
            <p-column sortable field="doneScriptures"   header="Done Scr">
              <template #body="slotProps">
                  {{slotProps.data.doneScriptures ? 'Y' : 'N'}}
              </template>
            </p-column>
            <p-column sortable field="notes"             header="Notes"      ></p-column>
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
    'p-checkbox'    : checkbox    ,
  },
  data() { 
    return {
      epfilters  : {},
      selectedepi: null,
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
  mounted() {
    //this.myalert('Hello, world!');
  },
  watch: {
    name: {
      handler: function(newValue) {
        if(newValue == 'fiz')
          alert('Fiz!');
      }
    },
  },
});
