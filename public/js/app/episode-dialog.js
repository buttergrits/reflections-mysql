const episodeDialog = Vue.component('episode-dialog', {
  props: ['showval', 'selectedepi'],
  template: /*html*/ `
    <div>

      <p-dialog id="epdlg" header="Episode" :visible.sync="show" v-if="selectedepi">
        <p-card >
          <template #content>
            <div class="formgrid grid">
              <div class="field col">
                <label for="season">Season</label>
                <p-inputnumber id="episode" v-model="selectedepi.seasonNum" placeholder="Season" class="w-full"/>
              </div>
              <div class="field col">
                <label for="episode">Episode Sequence</label>
                <p-inputnumber id="episode" v-model="selectedepi.episodeNum" placeholder="Episode Seq" class="w-full"/>
              </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                <label for="done">Done Scriptures</label>
                <p-checkbox id="done" v-model="selectedepi.doneScriptures" :binary="true" class="w-full" ></p-checkbox>
              </div>
              <div class="field col">
                <label for="episode">Episode Number</label>
                <p-inputnumber id="episode" v-model="selectedepi.episodeNumAlt" placeholder="Episode #" class="w-full"/>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col">
                <label for="episode">Notes</label>
                <p-inputtext id="episode" v-model="selectedepi.notes" placeholder="Notes" class="w-full"/>
              </div>
            </div>
          </template>
          <template #footer>
            <p-button icon="pi pi-plus"  label="Save"         v-on:click="updateEpisode"  class="p-button-sm "></p-button>
            <p-button icon="pi pi-times" label="Delete"       v-on:click="deleteEpisode"  class="p-button-sm  p-button-danger"    v-if="!selectedepi.isnew"></p-button>
            <p-button icon="pi pi-plus"  label="Add Location" v-on:click="episodeAddLoc"  class="p-button-sm  p-button-secondary" v-if="!selectedepi.isnew"></p-button>
          </template>
        </p-card>
      </p-dialog>

    </div>
    `,
  components : {
    'p-button'      : button      ,
    'p-datatable'   : datatable   ,
    'p-column'      : column      ,
    'p-panel'       : panel       ,
    'p-inputtext'   : inputtext   ,
    'p-checkbox'    : checkbox    ,
    'p-dialog'      : dialog      ,
    'p-card'        : card        ,
    'p-inputnumber' : inputnumber ,

  },
  data() { 
    return {
      epfilters  : {},
      //selectedepi: null,
      showdlg : null,
    } 
  },
  methods: {
    //--------------------------------------------------------------------------------------
    // Episode crud stuff
    //--------------------------------------------------------------------------------------
    updateEpisode: function() {
        if(this.selectedepi?.isnew==true)
            this.saveNewEpisode();
        else {
            this.loading = true;
            this.$http.put('/api/ref/episode',this.selectedepi).then(function(resp) {
                console.log(resp.body);
                this.loading = false;
                this.show = false;
              });
        }
    },
    newEpisode: function() {
        this.epdlg = true;
        this.selectedepi = {isnew : true};
    },
    saveNewEpisode: function() {
        this.loading = true;
        this.$http.post('/api/ref/episode',this.selectedepi).then(function(resp) {
            console.log(resp.body);
            this.loading = false;
            this.show = false;
        });
    },
    deleteEpisode: function() {
        this.loading = true;
        this.$http.delete(`/api/ref/episode/${this.selectedepi.id}`).then(function(resp) {
            console.log(resp.body);
            this.loading = false;
        });
    },
    episodeAddLoc: function() {
        this.epdlg = false;
        var initlocnum = 1;
        var tmparr = this.locations.filter(l => l.episodeId == this.selectedepi.id);
        if(tmparr?.length>0) {
            initlocnum = Math.max(...tmparr.map(l => l.locationNum)) + 1;
        }

        this.selectedlocn = {
            isnew : true,
            episodeId : this.selectedepi.id,
            locationNum : initlocnum
        };
        this.locdlg = true;
    },
  },
  computed: {
    thing  :  function() { return this.name },
    show: {
      get ()      { return this.showval        },
      set (value) { this.$emit('input', value) }
    },
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
