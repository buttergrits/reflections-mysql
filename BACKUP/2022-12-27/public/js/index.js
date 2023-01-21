var app = new Vue({ 
    el: '#app',
    components: {
        'p-button'    : button   ,
        'p-datatable' : datatable,
        'p-column'    : column   ,
        'p-panel'     : panel    ,
        'p-inputtext' : inputtext,
    },
    data: {
        message : 'Hello Vue!',
        title   : 'My test Vue app!',
        ref     : null,
        refTable: null,
        loading : null,
        filters : {},
    },
    methods: {
        getData: function() {
            this.loading = true;
            this.$http.get('/reflectionsdata').then(function(resp) {
                 this.ref = resp.body;
                 this.loading = false;
                 this.refTable = this.genTable(this.ref);
            });
        },
        genTable: function(refs) {
            var rv = [];
            refs.forEach((episode, ei) => {
                episode.locations.forEach((loc,li) => {
                    loc.scriptures.forEach((scr,si) => {
                        var epid = 'S' + ('00' + episode.season        ).slice(-2) +
                                   'E' + ('00' + episode.episodeNum + 1).slice(-2) ;
                        var locid = epid + '-L' + ('00' + (li+1)).slice(-2);
                        var sid = locid  + '-V' + ('00' + (si+1)).slice(-2);
                        var scrInfo = `${scr.book} ${scr.chapter}:${scr.verse} (${scr.translation})`;
                        var e = {
                            episodeId   : epid              ,
                            season      : episode.season    ,
                            episodeNum  : episode.episodeNum,
                            episode     : episode.episode   ,
                            locationId  : locid             ,
                            location    : locid + ' - ' +loc.locationName  ,
                            locationNum : loc.locationNum   ,
                            scriptureId : sid               ,
                            scriptureNum: scr.scriptureNum  ,
                            scripture   : scr.book          ,
                            scriptureInfo   : scrInfo,
                            scriptureText   : scr.text ,
                        };
                        rv.push(e);
                    })
                })
                
            });
            return rv;
        },
    },
    mounted: function() {
        this.getData();
    },
});