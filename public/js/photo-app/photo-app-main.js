const photoAppMain = Vue.component('photo-app-main', {
  props: ['name', 'episodes', 'loading'],
  template: /*html*/ `
    <div>

      <div style="margin-bottom:1em;">
        <p-button @click="getData"       icon="pi pi-caret-right" type="button" class="p-button-sm" label="Load Data"      ></p-button>
      </div>
      <h3>Photo Library</h3>
      <div class="grid">
        <div class="col-2">
          <p-tree :value="nodes" selectionMode="single" :selectionKeys.sync="selectedKey1"></p-tree>
        </div>
        <div class="col">
          <p-tree :value="nodes2" selectionMode="single" :selectionKeys.sync="selectedKey2"></p-tree>
        </div>
      </div>
      <!-- <p-tree :value="nodes" ></p-tree> -->

    </div>
    `,
  components : {
    'p-button'      : button      ,
    'p-datatable'   : datatable   ,
    'p-column'      : column      ,
    'p-panel'       : panel       ,
    'p-inputtext'   : inputtext   ,
    'p-tree'        : tree        ,
  },
  data() { 
    return {
      nodes  : null,
      nodes2 : null,
      selectedKey1:{},
      selectedKey2:{},
    } 
  },
  methods: {
    myalert: function(text) {
      alert(text);
    },
    getData: function() {
      alert('Photo app');
    }
  },
  computed: {
    //thing  :  function() { return this.name },
  },
  mounted() {
    //this.myalert('Hello, world!');
    this.$http.get('/treenodes.json').then(function(resp) {
      this.nodes = resp.body.root;
    });
    this.$http.get('/treenodes2.json').then(function(resp) {
      this.nodes2 = resp.body.root;
    });

  },
  watch: {
    // name: {
    //   handler: function(newValue) {
    //     if(newValue == 'fiz')
    //       alert('Fiz!');
    //   }
    // },
  },
});
