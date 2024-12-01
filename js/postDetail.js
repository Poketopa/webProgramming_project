// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAcGdEVkZS8l_w4eczwzFGKL5enLHXJKFk",
  authDomain: "webproject-12c7a.firebaseapp.com",
  projectId: "webproject-12c7a",
  storageBucket: "webproject-12c7a.appspot.com",
  messagingSenderId: "169348055607",
  appId: "1:169348055607:web:c0c5440edecc1d0e3a35b2",
  measurementId: "G-8PPXSFGBB3",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 게시글 데이터 불러오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (postId) {
  db.collection("posts")
    .doc(postId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const post = doc.data();
        document.getElementById("postTitle").textContent = post.title;
        document.getElementById("postContent").textContent = post.content;
        document.getElementById(
          "postAuthor"
        ).textContent = `작성자: ${post.author}`;
      } else {
        alert("게시글을 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("게시글 불러오기 중 오류:", error);
    });
} else {
  alert("유효하지 않은 게시글입니다.");
  window.location.href = "board.html";
}
