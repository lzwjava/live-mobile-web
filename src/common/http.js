var util = require('./util')

function fetchLive(comp, liveId, callback) {
  comp.$http.get('lives/' + liveId)
  .then((resp) => {
    if (util.filterError(comp, resp)) {
      callback && callback(resp.data.result)
    }
  }, util.httpErrorFn(comp))
}

exports.fetchLive = fetchLive
