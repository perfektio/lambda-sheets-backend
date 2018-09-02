const request = require("request");

exports.handler = function(event, context, callback) {
  const key = "YOUR-KEY-HERE";
  const url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";

  request({
    json: true,
    url: url
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) return

    let parsed = body.feed.entry.map( (entry) => {
      let columns = {
        "updated": entry.updated["$t"]
      }

      // Dynamically add all relevant columns from the Sheets to the response
      Object.keys( entry ).forEach( (key) => {
        if ( /gsx\$/.test(key) ) {
          let newKey = key.replace("gsx$", "");
          columns[newKey] = entry[key]["$t"];
        }
      });

      return columns;
    })

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(parsed)
    });
  });
};
