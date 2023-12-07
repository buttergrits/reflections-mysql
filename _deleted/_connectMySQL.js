var mysql = require('mysql');

    var con = mysql.createConnection({
        host         : "fizzypi.lan",
        user         : "monty",
        password     : "some_pass",
        database     : "reflections",
        insecureAuth : true
    });

    con.connect(function(err) {
      if (err) throw err;
      console.log("Connection Succeeded!");
      console.log("Show Datamases:");
      con.query("SHOW DATABASES", function(err, result) {
        if (err) throw err;
        console.log(result);
      });
      con.query("SELECT * FROM v_episodes", function(err, result) {
        if (err) throw err;
        console.log(result);
      });
      con.query("SELECT * FROM v_scriptures", function(err, result) {
        if (err) throw err;
        console.log(result);
      });
    });
