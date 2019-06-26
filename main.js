require('dotenv').config()

var firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DB_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: SENDER_ID,
  appId: APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firebase = require("firebase/app");

require("firebase/auth");

defaultStorage = firebase.storage();
defaultFirestore = firebase.firestore();

// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', uiConfig);

// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function() {
//       // The widget is rendered.
//       // Hide the loader.
//       document.getElementById('loader').style.display = 'none';
//     }
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: 'popup',
//   signInSuccessUrl: 'https://cfpaige.github.io/BuddyApp/events.html',
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//   ],
//   // Terms of service url.
//   // tosUrl: '<your-tos-url>',
//   // Privacy policy url.
//   // privacyPolicyUrl: '<your-privacy-policy-url>'
// };

// // Temp variable to hold the anonymous user data if needed.
// var data = null;
// // Hold a reference to the anonymous current user.
// var anonymousUser = firebase.auth().currentUser;
// ui.start('#firebaseui-auth-container', {
//   // Whether to upgrade anonymous users should be explicitly provided.
//   // The user must already be signed in anonymously before FirebaseUI is
//   // rendered.
//   autoUpgradeAnonymousUsers: true,
//   signInSuccessUrl: 'https://cfpaige.github.io/BuddyApp/events.html',
//   signInOptions: [
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//   ],
//   callbacks: {
//     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//       // Process result. This will not trigger on merge conflicts.
//       // On success redirect to signInSuccessUrl.
//       return true;
//     },
//     // signInFailure callback must be provided to handle merge conflicts which
//     // occur when an existing credential is linked to an anonymous user.
//     signInFailure: function(error) {
//       // For merge conflicts, the error.code will be
//       // 'firebaseui/anonymous-upgrade-merge-conflict'.
//       if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
//         return Promise.resolve();
//       }
//       // The credential the user tried to sign in with.
//       var cred = error.credential;
//       // If using Firebase Realtime Database. The anonymous user data has to be
//       // copied to the non-anonymous user.
//       var app = firebase.app();
//       // Save anonymous user data first.
//       return app.database().ref('users/' + firebase.auth().currentUser.uid)
//           .once('value')
//           .then(function(snapshot) {
//             data = snapshot.val();
//             // This will trigger onAuthStateChanged listener which
//             // could trigger a redirect to another page.
//             // Ensure the upgrade flow is not interrupted by that callback
//             // and that this is given enough time to complete before
//             // redirection.
//             return firebase.auth().signInWithCredential(cred);
//           })
//           .then(function(user) {
//             // Original Anonymous Auth instance now has the new user.
//             return app.database().ref('users/' + user.uid).set(data);
//           })
//           .then(function() {
//             // Delete anonymnous user.
//             return anonymousUser.delete();
//           }).then(function() {
//             // Clear data in case a new user signs in, and the state change
//             // triggers.
//             data = null;
//             // FirebaseUI will reset and the UI cleared when this promise
//             // resolves.
//             // signInSuccessWithAuthResult will not run. Successful sign-in
//             // logic has to be run explicitly.
//             window.location.assign('https://cfpaige.github.io/BuddyApp/?mode=select&signInSuccessUrl=events.html');
//           });

//     }
//   }
// });

/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.FacebookAuthProvider();
    // [END createprovider]
    // [START addscopes]
    // provider.addScope(
    //   'public_profile',
    //   'email',
    //   );
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // [START_EXCLUDE]
      console.log(token);
      // [END_EXCLUDE]
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [START_EXCLUDE]
  document.getElementById('quickstart-sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-sign-in').textContent = 'Log out';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      console.log("user id is: " + uid);
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-sign-in').textContent = 'Log in with Facebook';
      document.getElementById('quickstart-account-details').textContent = 'null';
      document.getElementById('quickstart-oauthtoken').textContent = 'null';
      // [END_EXCLUDE]
    }
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]
  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}

var user = firebase.auth().currentUser;

if (user != null) {
  user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}

window.onload = function () {
  initApp();
};