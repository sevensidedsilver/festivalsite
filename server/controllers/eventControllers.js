var app = require('../server.js')

module.exports = {


// post new events
  newEvent : function (req, res) {
    console.log( (req.body.startTime))
    console.log( (req.body.endTime))

    let title = req.body.title
    let location = req.body.location
    let displaydate = req.body.displayDate
    let date = req.body.date
    let starttime = req.body.startTime
    let endtime = req.body.endTime
    let goal = req.body.goal
    let image = req.body.image
    let fbevent = req.body.fbEvent
    let desc1 = req.body.desc1
    let desc2 = req.body.desc2
    let desc3 = req.body.desc3
    let desc4 = req.body.desc4
    let desc5 = req.body.desc5
    req.app.get('db').add_event(
      [title, location, displaydate, date, starttime, endtime, goal, image, fbevent, desc1, desc2, desc3, desc4, desc5]
    ).then(function(resp){
      res.status(200).send(resp)
    })
  },



// GET ALL events
  getAllEvents : function(req, res){
    req.app.get('db').events_get_all().then(resp => {
      res.status(200).send(resp)
    })
  },

// get one event by id
getEvent : (req, res) => {
  req.app.get('db').get_event([req.params.id]).then(resp => {

    res.status(200).send(resp)
  })

},

//event is over
eventOver: (req, res) => {
  req.app.get('db').event_over([req.params.id]).then(resp=> {
    res.status(200).send(resp)
  })

}












// end of EXPORTS =============================================================
}
