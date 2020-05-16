// Authentication:
var provider = new firebase.auth.GoogleAuthProvider();

// Database:
// Adds user to leaderboard.
function signup () {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // console.log("Created User:");
    // console.log(token,user);

    document.getElementsByClassName('signupButton')[0].style.display = 'none';
    return new Promise(function (resolve, reject) {
      resolve(result);
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

function signupFromGame () {
  return new Promise(function (resolve, reject) {
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // console.log("Created User:");
      // console.log(token,user);
      resolve(result);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      reject(errorCode);
    });
  });
}

function submit_score (score) {
  signupFromGame().then((res, err) => {
    if (err) {
      console.log(err);
    }
    var db = firebase.firestore();
    db.collection('leaderboard').doc(res.user.uid).set({
      score: score,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      name: res.user.displayName
    })
      .then(function () {
        console.log('Document successfully written!');
        M.toast({ html: 'You have submitted your score!' });
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  });
}

(function () {
  // your page initialization code here
  // the DOM will be available here
  // Display Leaderboard:
  // Get a reference to the database service
  var db = firebase.firestore();
  var docRef = db.collection('leaderboard');

  db.collection('leaderboard').orderBy('score', 'desc').get().then(function (querySnapshot) {
    // Create Table:
    var board = document.getElementById('tabledata');
    var tableBody = document.createElement('tbody');
    // var row = document.createElement("tr");

    // Iterate Through all Scores:
    querySnapshot.forEach(function (doc) {
      var row = document.createElement('tr');
      var values = doc.data();
      // console.log(values);

      // Name:
      var cell = document.createElement('td');
      var cellText = document.createTextNode(values['name']);
      cell.appendChild(cellText);
      row.appendChild(cell);

      // Score:
      var cell = document.createElement('td');
      var cellText = document.createTextNode(values['score']);
      cell.appendChild(cellText);
      row.appendChild(cell);

      // Date:
      var cell = document.createElement('td');
      var date = new Date(values['date']['seconds'] * 1000).toDateString();
      var cellText = document.createTextNode(date);
      cell.appendChild(cellText);
      row.appendChild(cell);

      tableBody.appendChild(row);
    });
    board.appendChild(tableBody);
  });
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.displayName);
      console.log(user.email);
      // User is signed in.
      // console.log('Can log in!')
      document.getElementsByClassName('signupButton')[0].innerText = 'Signed in!';
      document.getElementsByClassName('signupButton')[0].style.display = 'none';
    } else {
      // User is signed out.
      document.getElementsByClassName('signupButton')[0].innerText = 'Sign in!';
    }
  });
})();
