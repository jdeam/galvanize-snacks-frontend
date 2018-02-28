const path = 'http://localhost:3000';

const logoutButton = document.querySelector('#log-out');
logoutButton.addEventListener('click', (e) => {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
});

function buildSnackCard(snack) {
  const col4 = document.createElement('div');
  col4.className = 'column is-4';

  const card = document.createElement('div');
  card.className = 'card';
  col4.appendChild(card);

  const header = document.createElement('header');
  header.className = 'card-header';
  card.appendChild(header);

  const title = document.createElement('p');
  title.className = 'card-header-title';
  header.appendChild(title);

  const textLink = document.createElement('a');
  textLink.className = 'title-link';
  textLink.textContent = snack.name;
  textLink.addEventListener('click', (e) => {
    localStorage.setItem('snack', JSON.stringify(snack));
    window.location.href = 'product.html';
  });
  title.appendChild(textLink);

  const cardImage = document.createElement('div');
  cardImage.className = 'card-image';
  card.appendChild(cardImage);

  const figure = document.createElement('figure');
  figure.className = 'image is-4by3';
  cardImage.appendChild(figure);

  const imgLink = document.createElement('a');
  imgLink.addEventListener('click', (e) => {
    localStorage.setItem('snack', JSON.stringify(snack));
    window.location.href = 'product.html';
  });
  figure.appendChild(imgLink);

  const image = document.createElement('img');
  image.src = snack.img;
  image.alt = snack.name;
  imgLink.appendChild(image);

  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';
  card.appendChild(cardContent);

  const panel = document.createElement('div');
  panel.className = 'panel-block-item';
  cardContent.appendChild(panel);

  const likes = document.createElement('span');
  likes.className = 'likes';
  likes.textContent = `Rating: ${parseFloat(snack.avgRating) || 'N/A'}`;
  panel.appendChild(likes);

  if (snack.avgRating) {
    const likesIcon = document.createElement('span');
    likesIcon.className = 'icon';
    likes.appendChild(likesIcon);

    const faStar = document.createElement('i');
    faStar.className = 'fa fa-star';
    likesIcon.appendChild(faStar);
  }

  const comments = document.createElement('span');
  comments.className = 'comments';
  comments.textContent = `${snack.reviewCount} Reviews`;
  panel.appendChild(comments);

  const commentsIcon = document.createElement('span');
  commentsIcon.className = 'icon';
  comments.appendChild(commentsIcon);

  const faComment = document.createElement('i');
  faComment.className = 'fa fa-comment';
  commentsIcon.appendChild(faComment);

  return col4;
}

const snackGrid = document.querySelector('#snack-grid');

axios.get(`${path}/api/snacks`)
  .then(response => {
    let snacks = response.data.data;
    snacks.forEach(snack => {
      const snackCard = buildSnackCard(snack);
      let targetRow = snackGrid.lastElementChild;
      if (targetRow.children.length < 3) {
        targetRow.appendChild(snackCard);
      } else {
        targetRow = document.createElement('div');
        targetRow.className = 'columns';
        snackGrid.appendChild(targetRow);
        targetRow.appendChild(snackCard);
      }
    });
  });
