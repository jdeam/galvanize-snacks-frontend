///FOR TESTING PURPOSES - REMOVE 'OR' STATEMENT IN PROD
const user = JSON.parse(localStorage.getItem('user')) || { userId : 2 };
const path = 'http://localhost:3000';

const logoutButton = document.querySelector('#log-out');
logoutButton.addEventListener('click', (e) => {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
});

const snack = JSON.parse(localStorage.getItem('snack'));

const snackName = document.querySelector('#snack-name');
const snackPrice = document.querySelector('#snack-price');
const snackImage = document.querySelector('#snack-image');
const snackDesc = document.querySelector('#snack-desc');
const avgStarRating = document.querySelector('#star-rating');
const reviewCount = document.querySelector('#review-count');

snackName.textContent = snack.name;
snackPrice.textContent = `$${snack.price}`;
snackImage.src = snack.img;
snackDesc.textContent = snack.description;
reviewCount.textContent = `${snack.reviewCount} reviews`;

function renderStars(rating, el) {
  const stars = el.children;
  let roundedRating = Math.round(rating*2)/2;
  for (let star of stars) {
    if (roundedRating >= 1) {
      star.className = 'fa fa-star title is-5';
      roundedRating--;
    } else if (roundedRating > 0 && roundedRating < 1) {
      star.className = 'fa fa-star-half-full title is-5';
      roundedRating -= 0.5;
    }
  }
}

renderStars(snack.avgRating, avgStarRating);

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

function buildEditButton(review) {
  const span = document.createElement('span');
  span.className = 'icon is-right';

  const a = document.createElement('a');
  span.appendChild(a);

  const i = document.createElement('i');
  i.className = 'fa fa-edit';
  a.appendChild(i);

  a.addEventListener('click', (e) => {
    //FORM MANIPULATION GOES HERE
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
        clearReviews();
        renderReviews();
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

function renderReviews() {
  axios.get(`${path}/api/snacks/${snack.id}/reviews`)
    .then(response => {
      const reviews = response.data.data;
      snack.reviews = reviews;
      if (!reviews.length) {
        noReviewMessage.style.display = 'block';
      }
      reviews.forEach(review => {
        const newReview = buildReviewBox(review);
        reviewSection.appendChild(newReview);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

renderReviews();
