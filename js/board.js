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

// 게시글 목록 초기화 및 렌더링
async function displayPosts() {
  try {
    const postList = document.getElementById("postList");

    // 기존 게시글 목록 초기화
    postList.innerHTML = ""; // 목록을 완전히 비웁니다.

    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    snapshot.forEach((doc) => {
      const post = doc.data();
      const li = document.createElement("li");
      li.dataset.id = doc.id;
      li.textContent = `${post.title} - ${post.author}`;
      li.addEventListener("click", () => viewPostDetail(doc.id));
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

// 게시글 추가
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const author = localStorage.getItem("kakaoNickname"); // 현재 로그인 사용자 닉네임 가져오기

  if (!title || !content) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  try {
    await db.collection("posts").add({
      title,
      content,
      author,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("게시글이 성공적으로 등록되었습니다.");
    displayPosts(); // 목록을 다시 렌더링
    document.getElementById("postForm").reset();
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
    alert("게시글 추가에 실패했습니다.");
  }
});

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts(); // 페이지 로드 시 게시글 목록 표시
});
