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

// URL에서 게시글 ID 가져오기
function getPostIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// 게시글 상세 보기 로드
async function loadPostDetail(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();
    if (doc.exists) {
      const post = doc.data();
      document.getElementById("detailTitle").textContent = post.title;
      document.getElementById("detailContent").textContent = post.content;
      document.getElementById(
        "detailAuthor"
      ).textContent = `작성자: ${post.author}`;
    } else {
      alert("게시글을 찾을 수 없습니다.");
      window.location.href = "board.html";
    }
  } catch (error) {
    console.error("게시글 로딩 중 오류 발생:", error);
    alert("게시글을 불러오는 데 실패했습니다.");
    window.location.href = "board.html";
  }
}

// 게시글 삭제
async function deletePost(postId) {
  try {
    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
    window.location.href = "board.html";
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글을 삭제하는 데 실패했습니다.");
  }
}

// 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  const postId = getPostIdFromURL();
  if (postId) {
    loadPostDetail(postId);
    document.getElementById("deletePostBtn").onclick = () => deletePost(postId);
  } else {
    alert("잘못된 접근입니다.");
    window.location.href = "board.html";
  }
});
