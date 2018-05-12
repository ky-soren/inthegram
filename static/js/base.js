document.addEventListener('DOMContentLoaded', () => {

  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";

  function formatPost(post) {
    //grabs the post list div
    const postList = document.getElementById('postList')

    //creates the post items to be populated
    const postElement = document.createElement('article');
    const postHeader = document.createElement('p');
    const postHeaderWrapper = document.createElement('div');
    const postImage = document.createElement('img');
    const postImageWrapper = document.createElement('div');
    const postCaption = document.createElement('p');
    const postCaptionWrapper = document.createElement('div');
    const postComments = document.createElement('div');
    const postCommentsHeader = document.createElement('p');

    const commentText = document.createElement('input');
    const commentBorder = document.createElement('div');
    const commentWrapper = document.createElement('div');



    commentText.setAttribute('type', 'text');
    commentText.setAttribute('placeholder', 'Add a comment...');
    commentText.setAttribute('id', `commentText${post.id}`);
    commentText.setAttribute('class', 'comment-text');
    commentBorder.setAttribute('class', 'comment-border');
    commentWrapper.setAttribute('class', 'comment-input');

    commentWrapper.appendChild(commentBorder);
    commentWrapper.appendChild(commentText);

    //populates the elements with the response data
    postCaption.innerHTML = post.caption;
    postHeader.innerHTML = post.author;
    postImageWrapper.setAttribute('class', 'image-wrapper');
    postImage.setAttribute('src', post.image);
    postComments.setAttribute('id', `${post.id}`);
    postComments.setAttribute('class', 'comment-wrapper')
    postCommentsHeader.setAttribute('id', `commentHeader${post.id}`);
    postCommentsHeader.setAttribute('class', 'comment-details');
    postCommentsHeader.innerHTML = 'View all comments';
    postHeaderWrapper.setAttribute('class', 'header-wrapper')
    postCaptionWrapper.setAttribute('class', 'caption-wrapper')


    postComments.appendChild(postCommentsHeader);
    postComments.appendChild(commentWrapper);
    postImageWrapper.appendChild(postImage);
    postHeaderWrapper.appendChild(postHeader);
    postCaptionWrapper.appendChild(postCaption);

    // appends elements to the body
    postElement.appendChild(postHeaderWrapper);
    postElement.appendChild(postImageWrapper);
    postElement.appendChild(postCaptionWrapper);
    postElement.appendChild(postComments);
    postList.prepend(postElement);

    const commentDetail = document.querySelector(`#commentHeader${post.id}`);
    const event = { target: commentDetail };
    commentText.addEventListener('focus', () => showComments(event));
  };


  function loadPosts() {

    // loads all posts
    axios.get("/post")
      .then(res => {
        const posts = res.data;

        posts.forEach(post => formatPost(post));
        loadComments();
      })
  };

  //checks if current page is index view
  if (window.location.pathname == '/') {
    loadPosts();
  };


  //creates modal functionality
  function setupModal() {
    const postModal = document.getElementById('i-compose');
    const postCancel = document.getElementById('cancel');
    const postDialog = document.getElementById('postDialog');

    //post modal opens a modal dialog window
    postModal.addEventListener('click', function() {
      // postDialog.showModal();
      postDialog.classList.add('open')
    });

    //Cancel button closes the dialog
    postCancel.addEventListener('click', function() {
      // postDialog.close();
      postDialog.classList.remove('open')
    });
  };

  if (window.location.pathname == '/') {
    setupModal();
  };

  //creates a new post
  function setupPost() {
    const postSubmit = document.getElementById('postSubmit');
    const postDialog = document.getElementById('postDialog');
    const postList = document.getElementById('postList');

    postSubmit.addEventListener('click', function() {
      const postSubmitImage = document.querySelector('#postSubmitImage').files[0];
      const postSubmitCaption = document.querySelector('#postSubmitCaption').value;
      let postAuthor = document.querySelector('#currentUserId').value;

      const data = new FormData();

      data.append('caption', postSubmitCaption);
      data.append('image-file', postSubmitImage);

      //sends a post request to the post model serializer API
      axios.post("/post/", data)
        .then(res => {
          const post = res.data;
          formatPost(post);
          loadComments();
          //closes the dialog
          postDialog.classList.remove('open');
        })
        .catch(function(error) {
          console.log(error.response);
        })
    });
  };

  if (window.location.pathname == '/') {
    setupPost();
    setUploadFile();
  };

  //loads comments for a specific post
  function loadComments() {
    const commentView = document.querySelectorAll('.comment-details');
    commentView.forEach(comment => {
      comment.addEventListener('click', showComments);
    })
  };


  //comment view functionality
  function showComments(e) {
    e.target.classList.add('show-comments');
    const postId = e.target.parentElement.id;
    const headerId = document.getElementById(`commentHeader${postId}`)
    axios.get(`post/${postId}/comments`)
      .then(res => {
        comments = res.data;
        e.target.removeEventListener('click', showComments);
        //clears the header
        headerId.innerHTML = '';

        //displays the comments in list format
        comments.forEach(comment => formatComment(comment));

        document.querySelector(`#commentText${postId}`).addEventListener('keydown', function (e) {
          if (e.keyCode !== 13) return;
          const comment_text = document.querySelector(`#commentText${postId}`);
          const post = postId;
          axios.post("/comment/", {
            comment_text: comment_text.value,
            post: post
          })
          .then(res =>  {
            comment = res.data;
            formatComment(comment);
          })
          comment_text.value = '';
        })
      });

      //formats the comments
      function formatComment(comment)  {
        const commentElement = document.createElement('li')
        const commentUser = document.createElement('span')
        const commentText = document.createElement('p')

        commentUser.innerHTML = comment.author;
        commentText.innerHTML = comment.comment_text;

        commentElement.appendChild(commentUser);
        commentElement.appendChild(commentText);
        e.target.appendChild(commentElement);
      }
  };

  function setUploadFile() {
    const label = document.querySelector('.label')
    const fileInput = document.getElementById('postSubmitImage')

    fileInput.addEventListener('change', e => {
      const name = e.target.files[0].name;
      label.innerHTML = name;
    })
  }
});
