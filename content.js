/* global Clarifai clarKey clarSecret */


/* ---- new approach --- */

// chrome.runtime.onConnect.addListener(function(port) {
//   port.onMessage.addListener(function(msg) {
//     console.log("MESSAGE: ", msg)
//     port.postMessage({male: maleCount, female: femaleCount});
//   });
// });


// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log("REQUEST: ", request)
//     sendResponse({male: maleCount, female: femaleCount});
//   });

// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
    var domInfo = {
      male: maleCount,
      female: femaleCount
    };

    // Directly respond to the sender (popup),
    // through the specified callback */
    response(domInfo);
  }
});

/* ----- end of message passing ----- */

var clarApp = new Clarifai.App(clarKey, clarSecret)


function filterByWomen(){
        var ghosts = document.querySelectorAll('.lazy-image.EntityPhoto-circle-7.ghost-person.loaded')

      ghosts.forEach(image => {
        var firstName = image.alt.split(' ')[0]
        var url = 'https://gender-api.com/get?key=' + genderKey + '&name=' + firstName
        fetch(url)
        .then(result => result.json())
        .then(result => {
          // console.log(result)
          if (result.accuracy >= 60 && result.gender === 'male') {
            image.closest('li.mn-pymk-list__card').remove()
            console.log('MALE GHOST', result.name)
          }else{
            console.log('FEMALE GHOST', result.name)
          }
        })
      })

      var images = document.querySelectorAll('.lazy-image.EntityPhoto-circle-7.loaded:not(.ghost-person)')
      var data = {}
      var nodeArr = [];

      images.forEach(image => {
        let id = image.parentNode.id
        if(!data[id]){
          nodeArr.push(image)
          data[id] = {
            alt: image.alt,
            node: image,
            src: image.src,
            femalePercent: null
          }
        }
      })

    var data = femalePercent(data, nodeArr)
    return data
}

var maleCount = 0;
var femaleCount = 0;

function femalePercent(data, nodeArr) {
  var i = 0
  var len = nodeArr.length - 1
  function filter() {
    let node = nodeArr[i]
    i++
    if (node) {
      clarApp.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', node.src)
        .then(
        function (response) {
          if (response) {
            let resUrl = response.outputs[0].input.data.image.url
            let nodeUrl = node.src
            if (resUrl === nodeUrl) {
              var genders = response.outputs[0].data.regions[0].data.face.gender_appearance.concepts
              let percentFemale = 0
              if (genders[0].name === 'feminine') {
                percentFemale = genders[0].value
              } else {
                percentFemale = genders[1].value
              }
              if (percentFemale < 0.5) {
                node.closest('li.mn-pymk-list__card').remove()
                // send back + 1 male
                maleCount +=1
                console.log(node.alt, 'MALE')
              }
              else {
                // send back +1 female
                femaleCount+=1;
                console.log(node.alt, 'FEMALE')
              }
            } else {
              console.log('******SYNC_ISSUE********')
              i--
            }
          }
        },
        function (err) {
          console.log(err)
          console.log('Error on', nodeArr[i - 1].alt)
        }
        )
      if (i < len) {
        setTimeout(filter, 600)
      }
    }
  }
  filter()
  return {maleCount: maleCount, femaleCount: femaleCount};
}






