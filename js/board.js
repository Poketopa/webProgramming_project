// Firebase 초기화
/*
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};
*/

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 게시글 목록 렌더링
async function displayPosts() {
  try {
    const postList = document.getElementById("postList");

    // 기존 게시글 목록 초기화
    postList.innerHTML = ""; // 기존 게시물 삭제

    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    snapshot.forEach((doc) => {
      const post = doc.data();

      // 게시글 항목 생성
      const li = document.createElement("li");
      li.dataset.id = doc.id;
      li.textContent = `${post.title} - ${post.author}`;
      li.classList.add("post-item");

      // 클릭 이벤트 추가 (글 상세 보기로 이동)
      li.addEventListener("click", () => {
        viewPostDetail(doc.id);
      });

      // 게시글 추가
      postList.appendChild(li);
    });
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    alert("게시글을 불러오는 데 실패했습니다.");
  }
}

// 게시글 상세 보기로 이동
function viewPostDetail(postId) {
  window.location.href = `view-post.html?id=${postId}`;
}

// DOMContentLoaded 이벤트로 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts(); // 페이지 로드 시 게시글 목록 표시
});
