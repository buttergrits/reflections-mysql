const inProgress = Vue.component('in-progress', {
  props: ['name'],
  template: /*html*/ `
    <div>
      <h3>{{ name }} ...under construction</h3>
    </div>
    `,
  components : {
    'p-button' : button,
  },
  data() { 
    return {
      mode : null,
    } 
  },
  methods {
    myalert: function(text) {
      alert(text);
    },
  },
  computed: {
    thing  :  function() { return this.name },
  },
  mounted() {
    this.myalert('Hello, world!');
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
