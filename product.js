///FOR TESTING PURPOSES - REMOVE 'OR' STATEMENT IN PROD
const user = JSON.parse(localStorage.getItem('user')) || { userId : 2 };
const path = 'http://localhost:3000';

let snack = JSON.parse(localStorage.getItem('snack'));

const logoutButton = document.querySelector('#log-out');
logoutButton.addEventListener('click', (e) => {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
});


const snackName = document.querySelector('#snack-name');
const snackPrice = document.querySelector('#snack-price');
const snackImage = document.querySelector('#snack-image');
const snackDesc = document.querySelector('#snack-desc');
snackName.textContent = snack.name;
snackPrice.textContent = `$${snack.price}`;
snackImage.src = snack.img;
snackDesc.textContent = snack.description;

const avgStarRating = document.querySelector('#star-rating');
const reviewCount = document.querySelector('#review-count');

function renderAvgAndCount(snack) {
  if (snack.reviewCount === 1) {
    reviewCount.textContent = `1 review`;
  } else {
    reviewCount.textContent = `${snack.reviewCount} reviews`;
  }
  const stars = avgStarRating.children;
  let roundedRating = Math.round(snack.avgRating*2)/2;
  for (let star of stars) {
    if (roundedRating >= 1) {
      star.className = 'fa fa-star title is-5';
      roundedRating--;
    } else if (roundedRating > 0 && roundedRating < 1) {
      star.className = 'fa fa-star-half-full title is-5';
      roundedRating -= 0.5;
    } else {
      star.className = 'fa fa-star-o title is-5';
    }
  }
}

renderAvgAndCount(snack);

const reviewTab = document.querySelector('#review-tab');
const writeReviewTab = document.querySelector('#write-review-tab');
const reviewForm = document.querySelector('#review-form');

reviewTab.addEventListener('click', (e) => {
  if (!snack.reviews.length) noReviewMessage.style.display = 'block';
  writeReviewTab.parentNode.className = '';
  reviewTab.parentNode.className = 'is-active';
  reviewForm.style.display = 'none';
});

writeReviewTab.addEventListener('click', (e) => {
  if (editForm.style.display === 'block') {
    clearEditForm();
  }
  reviewTab.parentNode.className = '';
  writeReviewTab.parentNode.className = 'is-active';
  reviewForm.style.display = 'block';
  noReviewMessage.style.display = 'none';
});

const reviewSection = document.querySelector('#review-section');

function buildReviewBox(review) {
  const box = document.createElement('div');
  box.className = 'box';

  const media = document.createElement('article');
  media.className = 'media';
  box.appendChild(media);

  const mediaContent = document.createElement('div');
  mediaContent.className = 'media-content';
  media.appendChild(mediaContent);

  const content = document.createElement('div');
  content.className = 'content';
  mediaContent.appendChild(content);

  const p = document.createElement('p');
  p.innerHTML = `<strong>${review.title}</strong> <small>by ${review.first_name} ${review.last_name}`;
  content.appendChild(p);

  if (review.user_id === user.userId) {
    const trash = buildTrashButton(review);
    p.appendChild(trash);
    const edit = buildEditButton(review);
    p.appendChild(edit);
  }

  const br1 = document.createElement('br');
  p.appendChild(br1);

  const reviewRating = document.createElement('span');
  for (let i=0; i<5; i++) {
    if (i <= review.rating-1) {
      const fullStar = document.createElement('i');
      fullStar.className = 'fa fa-star title is-5';
      fullStar.style.color = '#ed6c63';
      reviewRating.appendChild(fullStar);
    } else {
      const emptyStar = document.createElement('i');
      emptyStar.className = 'fa fa-star-o title is-5';
      emptyStar.style.color = '#ed6c63';
      reviewRating.appendChild(emptyStar);
    }
  }
  p.appendChild(reviewRating);

  const br2 = document.createElement('br');
  p.appendChild(br2);

  const reviewText = document.createTextNode(review.text);
  p.appendChild(reviewText);

  return box;
}

const editForm = document.querySelector('#edit-review-form');
const editTitle = document.querySelector('#edit-review-title');
const editText = document.querySelector('#edit-review-text');
const editSubmitButton = document.querySelector('#edit-review-submit');
const editCancelButton = document.querySelector('#edit-review-cancel');

const editStars = document.querySelector('#edit-star-input');
for (let i=1; i<=5; i++) {
  editStars.children[i-1].starVal = i;
}
editStars.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa')) {
    editStars.value = e.target.starVal;
    for (let star of editStars.children) {
      if (star.starVal <= e.target.starVal) {
        star.className = 'fa fa-star title is-4';
      } else {
        star.className = 'fa fa-star-o title is-4';
      }
    }
  }
});


let submitEdits;

function populateEditForm(review) {
  editTitle.value = review.title;
  editText.value = review.text;
  editStars.value = review.rating;
  for (let star of editStars.children) {
    if (star.starVal <= editStars.value) {
      star.className = 'fa fa-star title is-4';
    } else {
      star.className = 'fa fa-star-o title is-4';
    }
  }
  submitEdits = function(e) {
    e.preventDefault();
    let title = editTitle.value;
    let rating = editStars.value;
    let text = editText.value;
    let user_id = user.userId

    if (title && rating && text && user_id) {
      const formData = { title, rating, text, user_id };
      axios.put(`${path}/api/snacks/${snack.id}/reviews/${review.id}`, formData)
        .then(response => {
          return axios.get(`${path}/api/snacks/${snack.id}`);
        })
        .then(response => {
          snack = response.data.data;
          localStorage.setItem('snack', JSON.stringify(snack));
          clearReviews();
          renderReviews(snack.reviews);
          renderAvgAndCount(snack);
          clearEditForm();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      ///DISPLAY ERROR MESSAGE HERE
    }
  }
  editSubmitButton.addEventListener('click', submitEdits);
}

function clearEditForm() {
  editTitle.value = '';
  editText.value = '';
  editStars.value = undefined;
  for (let star of editStars.children) {
    star.className = 'fa fa-star-o title is-4';
  }
  editSubmitButton.removeEventListener('click', submitEdits);
  editForm.style.display = 'none';
}

editCancelButton.addEventListener('click', (e) => {
  clearEditForm();
});

function buildEditButton(review) {
  const span = document.createElement('span');
  span.className = 'icon is-right';

  const a = document.createElement('a');
  span.appendChild(a);

  const i = document.createElement('i');
  i.className = 'fa fa-edit';
  a.appendChild(i);

  a.addEventListener('click', (e) => {
    writeReviewTab.parentNode.className = '';
    reviewTab.parentNode.className = 'is-active';
    reviewForm.style.display = 'none';
    populateEditForm(review);
    editForm.style.display = 'block';

  });

  return span;
}

function buildTrashButton(review) {
  const span = document.createElement('span');
  span.className = 'icon is-right';

  const a = document.createElement('a');
  span.appendChild(a);

  const i = document.createElement('i');
  i.className = 'fa fa-trash-o';
  a.appendChild(i);

  a.addEventListener('click', (e) => {
    axios.delete(`${path}/api/snacks/${snack.id}/reviews/${review.id}`)
      .then(response => {
        return axios.get(`${path}/api/snacks/${snack.id}`);
      })
      .then(response => {
        snack = response.data.data;
        localStorage.setItem('snack', JSON.stringify(snack));
        clearReviews();
        renderReviews(snack.reviews);
        renderAvgAndCount(snack);
      })
      .catch(err => {
        console.log(err);
      })
  });

  return span;
}

function clearReviews() {
  while (reviewSection.children.length > 2) {
    reviewSection.removeChild(reviewSection.lastChild);
  }
}

const noReviewMessage = document.querySelector('#no-reviews');
const noReviewLink = document.querySelector('#review-text-link');

noReviewLink.addEventListener('click', (e) => {
  reviewTab.parentNode.className = '';
  writeReviewTab.parentNode.className = 'is-active';
  reviewForm.style.display = 'block';
  noReviewMessage.style.display = 'none';
});

const starInput = document.querySelector('#star-input');
for (let i=1; i<=5; i++) {
  starInput.children[i-1].starVal = i;
}
starInput.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa')) {
    starInput.value = e.target.starVal;
    for (let star of starInput.children) {
      if (star.starVal <= e.target.starVal) {
        star.className = 'fa fa-star title is-4';
      } else {
        star.className = 'fa fa-star-o title is-4';
      }
    }
  }
});

function clearStarInput() {
  starInput.value = undefined;
  for (let star of starInput.children) {
    star.className = 'fa fa-star-o title is-4';
  }
}

const titleField = document.querySelector('#review-title');
const textField = document.querySelector('#review-text');

const cancelButton = document.querySelector('#review-cancel');
cancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  titleField.value = '';
  textField.value = '';
  clearStarInput();
  if (!snack.reviews.length) noReviewMessage.style.display = 'block';
  writeReviewTab.parentNode.className = '';
  reviewTab.parentNode.className = 'is-active';
  reviewForm.style.display = 'none';
});

const submitButton = document.querySelector('#review-submit');
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  let title = titleField.value;
  let text = textField.value;
  let rating = starInput.value;
  let user_id = user.userId;
  let snack_id = snack.id;

  if (title && text && rating && user_id && snack_id) {
    const formData = { title, text, rating, user_id, snack_id }
    axios.post(`${path}/api/snacks/${snack.id}/reviews`, formData)
      .then(response => {
        return axios.get(`${path}/api/snacks/${snack.id}`);
      })
      .then(response => {
        snack = response.data.data;
        writeReviewTab.parentNode.className = '';
        reviewTab.parentNode.className = 'is-active';
        reviewForm.style.display = 'none';
        renderAvgAndCount(snack);;
        clearReviews();
        renderReviews(snack.reviews);
        localStorage.setItem('snack', JSON.stringify(snack));
        titleField.value = '';
        textField.value = '';
        clearStarInput();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    ///DISPLAY ERROR MESSAGE HERE
  }
});

function renderReviews(reviews) {
  reviews.forEach(review => {
    const reviewBox = buildReviewBox(review);
    reviewSection.appendChild(reviewBox);
  });
}

axios.get(`${path}/api/snacks/${snack.id}/reviews`)
  .then(response => {
    const reviews = response.data.data;
    snack.reviews = reviews;
    if (!reviews.length) {
      noReviewMessage.style.display = 'block';
    } else {
      renderReviews(reviews);
    }
  })
  .catch(err => {
    console.log(err);
  });
