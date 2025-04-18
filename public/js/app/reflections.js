var app = new Vue({ 
    el: '#app',
    components: {
        'p-button'       : button       ,
        'p-datatable'    : datatable    ,
        'p-column'       : column       ,
        'p-panel'        : panel        ,
        'p-inputtext'    : inputtext    ,
        'p-dialog'       : dialog       ,
        'p-card'         : card         ,
        'p-inputmask'    : inputmask    ,
        'p-inputnumber'  : inputnumber  ,
        'p-selectbutton' : selectbutton ,
        'p-dropdown'     : dropdown     ,
        'p-autocomplete' : autocomplete ,
        'p-textarea'     : textarea     ,
        'p-checkbox'     : checkbox     ,
    },
    data: {
        message     : 'Hello Vue!',
        title       : 'My test Vue app!',
        ref         : null,
        refTable    : null,
        loading     : null,
        filters     : {},
        dlgEpisode  : null,
        selectedRow : null,
        selectedEp  : null,
        selectedLoc : null,
        selectedScr : null,

        // sql items
        objs        : ["Episodes", "Locations", "Scriptures"] ,
        obj         : "Episodes",
        episodes    : null,
        epfilters   : {},
        selectedepi : null,
        epdlg       : null,

        locations    : null,
        locfilters   : {},
        selectedlocn : null,
        locdlg       : null,
        epOptions    : [{ name : '1', code: 1}],

        scriptures     : null,
        scrfilters     : {},
        selectedscript : null,
        scrdlg         : null,
        scOptions      : [{ name : '1', code: 1}],

        books    : null,
        versions : null,
        filteredSongs : [],
        filteredLocs  : [],
        filteredProvs : [],
        filteredCtrys : [],
        filteredBooks : [],
 
    },
    methods: {
        goHome: function() {
            window.location.href = location.protocol + "//" + location.hostname + "/";
        },
        // for version dropdown -- not used yet
        filterBooks: function(event) {
            console.log(event.query)
            this.filteredBooks = this.books.map(b => b.name).filter(b => b.toUpperCase().startsWith(event.query.toUpperCase()));
        },
        // for version dropdown -- not used yet
        filterVersions: function(event) {
            this.filteredSongs = this.genUniqSorted(this.locations, 'song', event.query);
        },
        // for song dropdown
        filterSongs: function(event) {
            this.filteredSongs = this.genUniqSorted(this.locations, 'song', event.query);
        },
        // for location name dropdown
        filterLocs: function(event) {
            this.filteredLocs = this.genUniqSorted(this.locations, 'locationName', event.query);
        },
        // for location prov dropdown
        filterProvs: function(event) {
            this.filteredProvs = this.genUniqSorted(this.locations, 'locationProv', event.query);
        },
        // for location country dropdown
        filterCtrys: function(event) {
            this.filteredCtrys = this.genUniqSorted(this.locations, event.originalEvent.srcElement.id, event.query);
        },
        // extract unique, sorted values array from object property 
        genUniqSorted: function(data, fldName, qry) {
            //console.log(data, fldName, qry)
            var si = data.map(i => i[fldName]).filter(n => n).sort();
            var ui = [... new Set(si)];
            return ui.filter(i => i.toUpperCase().startsWith(qry.toUpperCase()));
        },
        // save as new
        //saveDoc: function() {
        //    delete this.selectedEp._id
        //    this.loading = true;
        //    this.$http.post('/reflectionsdata',this.selectedEp).then(function(resp) {
        //        this.ref = resp.body;
        //        this.loading = false;
        //        this.refTable = this.genTable(this.ref);
        //        this.dlgEpisode = false;
        //   });
        //},
        // updateDoc: function() {
        //     this.loading = true;
        //     this.$http.put('/reflectionsdata',this.selectedEp).then(function(resp) {
        //         this.ref = resp.body;
        //         this.loading = false;
        //         this.refTable = this.genTable(this.ref);
        //         this.dlgEpisode = false;
        //    });
        // },
        addLocation: function() {
            if(this.selectedEp.locations?.length) {
                //this.selectedEp.locations = [];
                var newNum = Math.max(...this.selectedEp.locations.map(l => l.locationNum)) + 1;
                var newloc = {locationNum : newNum };
                this.selectedEp.locations.push(newloc);
                this.selectedLoc = this.selectedEp.locations.filter(l => l.locationNum == newNum)[0];
            } else {
                this.selectedEp.locations = [];
                this.selectedEp.locations.push({locationNum : 1});
                this.selectedLoc = this.selectedEp.locations[0];
            }
            this.selectedScr = null;
        },
        addScripture: function() {
            if(this.selectedLoc.scriptures?.length) {
                var newNum = Math.max(...this.selectedLoc.scriptures.map(l => l.scriptureNum)) + 1;
                var newscr = {scriptureNum : newNum };
                this.selectedLoc.scriptures.push(newscr);
                this.selectedScr = this.selectedLoc.scriptures.filter(l => l.scriptureNum == newNum)[0];
            } else {
                this.selectedLoc.scriptures = [];
                this.selectedLoc.scriptures.push({locationNum : 1});
                this.selectedScr = this.selectedLoc.scriptures[0];
            }
        },
        
        rowSelected: function() {
            this.selectedEp  = this.ref.filter(e => e._id == this.selectedRow._id)[0];
            var sl = this.selectedEp?.locations;
            this.selectedLoc = sl?.filter(l => l.locationNum == this.selectedRow.locationNum)[0];
            var ss = this.selectedLoc?.scriptures;
            this.selectedScr = ss?.filter(s => s.scriptureNum == this.selectedRow.scriptureNum)[0];
            this.dlgEpisode = true;
        },
        getData: function() {
            this.loading = true;
            Promise.all([
                //this.$http.get('/reflectionsdata'),
                this.$http.get('/api/ref/episode'),
                this.$http.get('/api/ref/location'),
                this.$http.get('/api/ref/scripture'),
                this.$http.get('/api/ref/books'),
                this.$http.get('/api/ref/versions'),
            ]).then(resp => {
                this.ref = resp[0].body;
                this.refTable = this.genTable(this.ref);

                this.loading = false;
                this.episodes   = resp[0].body;
                this.locations  = resp[1].body;
                this.scriptures = resp[2].body;
                this.books      = resp[3].body;
                this.versions   = resp[4].body;
                this.genEpOpts();
                this.genScOpts();
            });
            // this.$http.get('/reflectionsdata').then(function(resp) {
            //      this.ref = resp.body;
            //      this.refTable = this.genTable(this.ref);
            //      this.$http.get('/api/ref/episode').then(function(resp) {
            //         this.loading = false;
            //         this.episodes = resp.body;
            //      });
            // });
        },
        genEpOpts: function(){
            var result = [];
            this.episodes.forEach(e => result.push({ name : e.episodeTag, code : e.id}));
            //var arr = [... new Set(result)].sort();
            //console.log(result);
            this.epOptions = result;

        },
        genScOpts: function(){
            var result = [];
            this.locations.forEach(l => result.push({ name : l.locationTag + ' - ' + l.locationDesc, code : l.id}));
            //console.log(result);
            this.scOptions = result;
        },
        genTable: function(refs) {
            var rv = [];
            var row=0;
            refs.forEach((episode, ei) => {
                var epid = 'S' + ('00' + episode.season  ).slice(-2) +
                           'E' + ('00' + episode.episode ).slice(-2) ;
                var e = {
                    _id         : episode._id,
                    episodeId   : epid              ,
                    season      : episode.season    ,
                    episodeNum  : episode.episodeNum,
                    episode     : episode.episode   ,
                };
                if(episode.locations?.length>0) {
                    episode.locations.forEach((loc,li) => {
                        var locid = epid + '-L' + ('00' + (li+1)).slice(-2);
                        var e1 = JSON.parse(JSON.stringify(e))
                        e1.locationId  = locid                           ;
                        e1.location    = `${locid} - ${loc.locationName}, ${loc.locationProv}, ${loc.locationCountry}` ; 
                        e1.locationNum = loc.locationNum                 ;
                        e1.startTime   = loc.startTime ;

                        if(loc.scriptures?.length>0) {
                            loc.scriptures.forEach((scr,si) => {
                                var e2 = JSON.parse(JSON.stringify(e1))

                                var sid = locid  + '-V' + ('00' + (si+1)).slice(-2);
                                var scrInfo = `${scr.book} ${scr.chapter}:${scr.verse} (${scr.translation})`;
                                e2.scriptureId     = sid               ;
                                e2.scriptureNum    = scr.scriptureNum  ;
                                e2.scripture       = scr.book          ;
                                e2.scriptureInfo   = scrInfo           ;
                                e2.scriptureText   = scr.text          ;
                                
                                e2.rowId = row++;
                                rv.push(e2);
                            })
                        } else {
                            e1.rowId = row++;
                            rv.push(e1);
                        }
                    })
                } else {
                    e.rowId = row++;
                    rv.push(e);
                }
            });

            // sort
            rv.sort((a,b) => (a.episodeId > b.episodeId) ? 1 : ((b.episodeId > a.episodeId) ? -1 : 0))
            return rv;
        },
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
        //--------------------------------------------------------------------------------------
        // Location crud stuff
        //--------------------------------------------------------------------------------------
        updateLocation: function() {
            if(this.selectedlocn?.isnew==true)
                this.saveNewLocation();
            else {
                this.loading = true;
                this.$http.put('/api/ref/location',this.selectedlocn).then(function(resp) {
                    console.log(resp.body);
                    this.loading = false;
                    this.doneSaving();
                });
            }
        },
        newLocation: function() {
            this.locdlg = true;
            //this.selectedlocn = {isnew : !!this.selectedepi};
            if(!!this.selectedepi) {
                this.episodeAddLoc();
            } else {
                this.selectedlocn = {};
            }

        },
        saveNewLocation: function() {
            this.loading = true;
            this.$http.post('/api/ref/location',this.selectedlocn).then(function(resp) {
                console.log(resp.body);
                this.loading = false;
                this.doneSaving();
           });
        },
        doneSaving: function() {
            this.locdlg = false;
            this.scrdlg = false;
            this.getData();
        },
        deleteLocation: function() {
            this.loading = true;
            this.$http.delete(`/api/ref/location/${this.selectedlocn.id}`).then(function(resp) {
                console.log(resp.body);
                this.loading = false;
           });
        },
        locationAddScr: function() {
            this.locdlg = false;
            var initscrnum = 1;
            var tmparr = this.scriptures.filter(l => l.locationId == this.selectedlocn.id);
            if(tmparr?.length>0) {
                initscrnum = Math.max(...tmparr.map(l => l.scriptureNum)) + 1;
            }

            this.selectedscript = {
                isnew : true,
                locationId : this.selectedlocn.id,
                scriptureNum : initscrnum
            };
            this.scrdlg = true;
        },
        //--------------------------------------------------------------------------------------
        // Scripture crud stuff
        //--------------------------------------------------------------------------------------
        freeFormInput: function() {
            //--------------------------------------------------------------------------------------
            // Parse free-form text into :   [book chapter:verse translation]
            //--------------------------------------------------------------------------------------
            const regex      = /((?:\d\s+)?[a-zA-Z]+)\s+(\d+):(\d+\-\d+|\d+)\s+([a-zA-Z]+)/gm;
            const string     = (' ' + this.selectedscript.freeForm).slice(1);  // copy string without reference
            var   matches    = regex.exec(string);
            var   msgResult  = "*** invalid entry - should be [book chapter:verse translation]  ***";

            // to do - update regex to include numeric in translation! e.g. nasb1995

            if (matches) {
                const rBook = matches[1];
                const rChap = matches[2];
                const rVers = matches[3];
                const rTran = matches[4];

                msgResult = `Parms : [${rBook}|${rChap}|${rVers}|${rTran}]`;
            }
            this.selectedscript.freeformResult = msgResult;
        },
        newScripture: function() {
            this.scrdlg = true;
            if(!!this.selectedlocn) {
                this.locationAddScr();
            } else {
                this.selectedscript = {isnew : true};
            }
            //this.selectedscript = {isnew : true};
        },
        lookupScripture: function() {
            var s = this.selectedscript;
            var verse = `${s.book} ${s.chapter}.${s.verse}`;
            var tr = s.translation;
            console.log({verse : verse, tr : tr});
            this.loading = true;
            this.$http.post('/api/ref/scriptureLookup',{verse : verse, tr : tr}).then(function(resp) {
                Vue.set(this.selectedscript, 'text', resp.body.text);
                //this.selectedscript.text = resp.body.text;
                console.log(resp.body);
                this.loading = false;
            });
        },
        updateScripture: function() {
            if(this.selectedscript?.isnew==true)
                this.saveNewScripture();
            else {
                this.loading = true;
                this.$http.put('/api/ref/scripture',this.selectedscript).then(function(resp) {
                    console.log(resp.body);
                    this.loading = false;
                    this.doneSaving();
               });
            }
        },
        saveNewScripture: function() {
            this.loading = true;
            this.$http.post('/api/ref/scripture',this.selectedscript).then(function(resp) {
                console.log(resp.body);
                this.loading = false;
                this.doneSaving();
            });
        },
        deleteScripture: function() {
            this.loading = true;
            this.$http.delete(`/api/ref/scripture/${this.selectedscript.id}`).then(function(resp) {
                console.log(resp.body);
                this.loading = false;
                this.scrdlg = false;
                this.getData();
           });
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        saveFile: function() {
            const data            = JSON.stringify(this.ref)
            const blob            = new Blob([data], {type: 'text/plain'})
            const e               = document.createEvent('MouseEvents'),
            a                     = document.createElement('a');
            a.download            = "reflections.json";
            a.href                = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },
    },
    computed: {
        filtLocations  :  function() { return this.selectedepi ? this.locations.filter(l => l.episodeId == this.selectedepi.id) : this.locations },
        filtLocName    :  function() { return "Locations" + (this.selectedepi ? ` (in episode ${this.selectedepi.episodeTag})` : "") },
        filtScriptures :  function() { 
            if (this.selectedlocn)
                return this.scriptures.filter(l => l.locationId == this.selectedlocn.id);
            else if(this.selectedepi)
                return this.scriptures.filter(l => l.episodeId == this.selectedepi.id) ;
            else
                return this.scriptures
        },
        filtScrName    :  function() { //return "Scriptures" + (this.selectedlocn ? ` (for ${this.selectedlocn.locationDesc} /  ${this.selectedlocn.locationTag} )` : "") 
                                var rv = "Scriptures";
                                if(this.selectedlocn)
                                    rv = "Scriptures" + ` (for ${this.selectedlocn.locationDesc} /  ${this.selectedlocn.locationTag})`
                                else if (this.selectedepi)
                                    rv = "Scriptures" + ` (for ${this.selectedepi.episodeTag})`
                                return rv;
                            },
    },
    
    mounted: function() {
        this.getData();
    },
});