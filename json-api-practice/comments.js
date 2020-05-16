var commentsCounter = [0]; // buttons are 1 - indexed, need a filler zero index

(function (window) {
  'use strict';

  const BUTTON_SELECTOR = '[data-posts="id"]';

  let buttons = document.querySelectorAll(BUTTON_SELECTOR);

  buttons.forEach(function (button, index) {
    'use strict';

    let sectionSelector = `#comments-${button.value}`;
    let commentSection = document.querySelector(sectionSelector);
    commentsCounter.push(0);

    button.addEventListener('click', function (event) {
      if (commentSection.hidden && commentsCounter[this.value] === 0) {
        commentSection.hidden = false;
        button.textContent = 'Hide comments';
        commentsCounter[this.value]++;
      } else {
        commentSection.hidden = true;
        button.textContent = 'Show comments';
      }
      event.preventDefault();
    });
  });
})(window);

window.onload = function () {
  loadPosts();
};

function loadPosts () {
  var post1, post2;
  fetch('https://jsonplaceholder.typicode.com/posts').then(function (response) {
    return response.json();
  }).then(function (json) {
    post1 = json[0];
    post2 = json[1];
    addTitles(post1, post2);
    addBodys(post1, post2);
    addComments(post1);
    addComments(post2);
  }).catch(function (err) {
    console.log('Fetch problem: ' + err.message);
  });
}

function addTitles (p1, p2) {
  let firstTitleH2Elem = document.getElementsByTagName('h2')[0];
  firstTitleH2Elem.innerText = p1.title;
  let secondTitleH2Elem = document.getElementsByTagName('h2')[1];
  secondTitleH2Elem.innerText = p2.title;
}

function addBodys (p1, p2) {
  let firstBodyElem = document.getElementsByTagName('article')[0].getElementsByTagName('p')[0];
  let modifiedBody1 = p1.body.replace('\n', '<br />');
  firstBodyElem.innerHTML = modifiedBody1;

  let secondBodyElem = document.getElementsByTagName('article')[1].getElementsByTagName('p')[0];
  let modifiedBody2 = p2.body.replace('\n', '<br />');
  secondBodyElem.innerHTML = modifiedBody2;
}

function addComments (post) {
  let postID = post.id;
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postID}`).then(function (response) {
    return response.json();
  }).then(function (json) {
    let commentsSection = document.getElementsByClassName('comments')[postID - 1];
    for (let key in json) {
      // Add paragraph element
      let p = document.createElement('p');
      p.dataComments = 'body';
      let modifiedBody = json[key].body.replace('\n', '<br />');
      p.innerHTML = modifiedBody;
      commentsSection.appendChild(p);

      // Add address element
      let address = document.createElement('address');
      address.dataComments = 'name';
      let anchor = document.createElement('a');
      anchor.dataComments = 'email';
      anchor.href = 'mailto:' + json[key].email;
      anchor.innerText = json[key].name;
      address.appendChild(anchor);
      commentsSection.appendChild(address);
    }
  }).catch(function (err) {
    console.log('Fetch problem: ' + err.message);
  });
}
