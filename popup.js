
function getCurrentTabId(callback){
  var queryInfo = {
    active: true,
    currentWindow: true
  }
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0]
    var id = tab.id
    callback(id)
  })
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  }
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0]
    var url = tab.url
    var id = tab.id
    console.assert(typeof url == 'string', 'tab.url should be a string')
    callback(url)
  })
}

var dummyData = [
  {gender: "male", value: 100},
  {gender: "female", value: 100}
]


var dataset = [
  {gender: "male", value: 1},
  {gender: "female", value: 1}
];


function filterByWomen(){
  chrome.tabs.executeScript(null, {code: `
    filterByWomen()
    `
  })
}

function companyFilter() {
  chrome.tabs.executeScript(null,
    {code: `
      var images = document.querySelectorAll('.lazy-image.loaded')
      images.forEach(image => {
        clarApp.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', image.src)
        .then(
          function(response) {
            var genders = response.outputs[0].data.regions[0].data.face.gender_appearance.concepts
            var percentFemale = 0
            var gender = 'unknown'
            if(genders[0].name === 'feminine'){
              gender = genders[0].name
              percentFemale = genders[0].value
            }else{
              gender = genders[1].name
              percentFemale = genders[1].value
            }
            console.log(image.alt, gender, percentFemale)
            if(percentFemale < .5){
              image.closest('div.search-result__wrapper').remove()
              console.log('REMOVED')
            }else{
              console.log('FEMALE')
            }
          },
        function(err) {
          console.log(err)
          console.log('Error on', image.alt)
        })
      })
      var images = document.querySelectorAll('.lazy-image.ghost-person.loaded')
      images.forEach(image => {
        var firstName = image.alt.split(' ')[0]
        var url = 'https://gender-api.com/get?key=QSDnnVxVVRusljFLBB&name=' + firstName
        fetch(url)
        .then(result => result.json())
        .then(result => {
          console.log(result)
          if (result.accuracy >= 60 && result.gender === 'male') {
            image.closest('div.search-result__wrapper').remove()
            console.log('REMOVED', result.name)
          }else{
            console.log('FEMALE', result.name)
          }
        })
      },
        function(err) {
          console.log(err)
          console.log('Error on', image.alt)
        })
    `})
}




function renderHTML(value) {
  document.getElementById('witLI').innerHTML = value;
}

function cleanFeed() {
  chrome.tabs.executeScript(null,
    {code: `
      window.addEventListener('scroll', function(e){
        [].forEach.call(document.querySelectorAll('.feed-s-connection-updates'),function(e){
          e.parentNode.removeChild(e);
        })
      })
    `})

}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    if(url.indexOf('linkedin.com/mynetwork') > -1){
      renderHTML('Working...')
      // filterByWomen()
    }else if(url.indexOf('linkedin.com/feed') > -1){
      renderHTML('Scroll to clean feed')
      cleanFeed()
    }else if (url.indexOf('linkedin.com/search') > -1){
      renderHTML('Working...')
      companyFilter()
    }else{
      renderHTML('Please navigate to LinkedIn')
    }
  })
})

function setDOMInfo(info) {
  for(var key in info){
    if(key === 'male'){
      dataset[0].value = info.male;
    }
    else{
      dataset[1].value = info.female;
    }
  }
  sendData(dataset)
}


function sendData(data){
  console.log('DATA INSIDE WAIT FOR DATA: ', data)
  setTimeout(function(){
    runD3(dataset)
  }, 5000)
}


// Once the DOM is ready...
document.addEventListener('DOMContentLoaded', function () {
  runD3(dummyData)
});


var $button = document.getElementById('filter')

$button.addEventListener("click", function(){

  filterByWomen()

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...

    // this function should be wrapped inside of an onClick !!!
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called
        //    from the receiving end (content script)
        setDOMInfo);
  });

})


