// ============== DATABASE ================
var firebaseConfig = {
    apiKey: "AIzaSyDzzJldNrwHP74q04wM9xrXQvD2-yq8MWs",
    authDomain: "buddyapp-7d790.firebaseapp.com",
    databaseURL: "https://buddyapp-7d790.firebaseio.com",
    projectId: "buddyapp-7d790",
    storageBucket: "buddyapp-7d790.appspot.com",
    messagingSenderId: "828020228335",
    appId: "1:828020228335:web:e7744d3bd6cd0bc4"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// ============== FB LOGIN SETUP ================

var provider = new firebase.auth.FacebookAuthProvider();

provider.addScope('id,first_name,last_name,email,picture');

firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
});


// window.fbAsyncInit = function () {
//   FB.init({
//     appId: '314010786217012',
//     cookie: true,
//     xfbml: true,
//     version: 'v3.3'
//   });

  // FB.AppEvents.logPageView();

//   FB.getLoginStatus(function(response) {
//     if (response.status === 'connected') {
//          getFbUserData();
//     }
// });
// };

// (function (d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) { return; }
//   js = d.createElement(s); js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// function fbLogin() {
//   FB.login(function (response) {
//       if (response.authResponse) {
//           getFbUserData();
//       } else {
//           document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
//       }
//   }, {scope: 'email'});
// };

function getFbUserData(){
  FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,picture'},
  function (response) {
      document.getElementById('fbLink').setAttribute("onclick","fbLogout()");
      document.getElementById('fbLink').innerHTML = 'Logout from Facebook';
      document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
      document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> '+response.id+'</p><p><b>Name:</b> '+response.first_name+' '+response.last_name+'</p><p><b>Email:</b> '+response.email+'</p><p><b>Picture:</b> <img src="'+response.picture.data.url+'"/></p>';
      saveUserData(response);
  });
};

$("#event-button").on("click", function (event) {
  event.preventDefault();

  var user_id = '+response.id+';
  var user_name = '+response.first_name+ ' + '+response.last_name+'
  var user_email = '+response.email+'
  var user_pic = '+response.picture.data.url+'

  var newUser = {
    id: user_id,
    name: user_name,
    email: user_email,
    picture: user_pic
  };

  database.ref().push(newUser);

  // $("#train-name-input").val("");
  // $("#train-dest").val("");
  // $("#first-train").val("");
  // $("#train-freq").val("");
});

// function fbLogout() {
//   FB.logout(function() {
//       document.getElementById('fbLink').setAttribute("onclick","fbLogin()");
//       document.getElementById('fbLink').innerHTML = '<img src="fblogin.png"/>';
//       document.getElementById('userData').innerHTML = '';
//       document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
//   });
// };


// =================  BACKGROUND CANVAS LOGIC ================
// from https://codepen.io/LeonGr/pen/yginI#code-area

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 100, // Frames per second
    x = 150, // Number of stars
    mouse = {
      x: 0,
      y: 0
    };  // mouse location

// Push stars to array

for (var i = 0; i < x; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1 + 5,
    vx: Math.floor(Math.random() * 50) - 25,
    vy: Math.floor(Math.random() * 50) - 25
  });
}

// Draw the scene

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
    
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
  
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  ctx.beginPath();
  for (var i = 0, x = stars.length; i < x; i++) {
    var starI = stars[i];
    ctx.moveTo(starI.x,starI.y); 
    if(distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
    for (var j = 0, x = stars.length; j < x; j++) {
      var starII = stars[j];
      if(distance(starI, starII) < 150) {
        //ctx.globalAlpha = (1 / 150 * distance(starI, starII).toFixed(1));
        ctx.lineTo(starII.x,starII.y); 
      }
    }
  }
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.stroke();
}

function distance( point1, point2 ){
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

// Update star locations

function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
  
    s.x += s.vx / FPS;
    s.y += s.vy / FPS;
    
    if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
    if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
  }
}

// Update and draw

function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();


// ==========================================================================================

var token = 'C5PB5LDMQ2KD6MY7AUEO';
var $events = $("#events");
var HTMLTemplate = '';
var queryURL = 'https://www.eventbriteapi.com/v3/events/search/?token='+token
$.ajax({
url: queryURL,
method: "GET"
}).then(function(res){
console.log(res)
if(res.events.length) {
            var s = "<ul class='eventList'>";
            for(var i=0;i<res.events.length;i++) {
                var event = res.events[i];
                console.dir(event);
      // s += "<li><a href='" + event.url + "'>" + event.name.text + "</a> - " + event.description.text + "</li>" + "<img src="+ event.logo.original.url+">";
      HTMLTemplate +=  `
  <div class="card booking-card mb-4">
        
        <!-- Card image -->
        <div class="view overlay">
          <img class="card-img-top" src="${event.logo.url}" alt="Card image cap">
          <a href="#!">
            <div class="mask rgba-white-slight"></div>
          </a>
        </div>
    
        <!-- Card content -->
        <div class="card-body">
    
          <!-- Title -->
          <h4 class="card-title font-weight-bold"><a>${event.name.text}</a></h4>
          <!-- Data -->
          <ul class="list-unstyled list-inline rating">
          </ul>
          <!-- Text -->
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <hr class="my-4">
          <p class="h5 font-weight-bold mb-4">${event.start.local}</p>
      
        </div>
    
      </div>`
            }
            s += "</ul>";
            $events.html(HTMLTemplate);
        } else {
      $events.html("<p>Sorry, there are no upcoming events.</p>");
  
  }

})