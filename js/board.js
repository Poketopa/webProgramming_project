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

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 게시글 목록 불러오기
async function getPosts() {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    alert("게시글을 불러오는 데 실패했습니다.");
    return [];
  }
}

// 게시글 목록 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // 기존 게시글 초기화

  const posts = await getPosts();

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.textContent = `${post.title} - ${post.author}`;
    li.dataset.id = post.id;
    li.addEventListener("click", () => showPostDetail(post.id));
    postList.appendChild(li);
  });
}

// 게시글 상세 보기
async function showPostDetail(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();

    // Firestore에서 해당 문서가 없는 경우
    if (!doc.exists) {
      alert("해당 게시글이 존재하지 않습니다.");
      return;
    }

    const post = doc.data();
    const currentUserId = localStorage.getItem("kakaoUserId");

    // 상세보기 DOM 업데이트
    document.getElementById("detailTitle").textContent = post.title;
    document.getElementById("detailContent").textContent = post.content;
    document.getElementById(
      "detailAuthor"
    ).textContent = `작성자: ${post.author}`;
    document.getElementById("postDetail").style.display = "block";

    // 삭제 및 수정 버튼 표시
    const deleteButton = document.getElementById("deletePostBtn");
    deleteButton.style.display =
      post.userId === currentUserId ? "inline-block" : "none";
    deleteButton.dataset.id = postId; // 삭제 버튼에 게시글 ID 저장

    const editButton = document.getElementById("editPostBtn");
    if (editButton) {
      editButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";
      editButton.dataset.id = postId; // 수정 버튼에 게시글 ID 저장
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
    alert("게시글을 불러오지 못했습니다.");
  }
}

// 게시글 삭제
async function deletePost(postId) {
  try {
    const currentUserId = localStorage.getItem("kakaoUserId");
    const doc = await db.collection("posts").doc(postId).get();

    if (doc.exists && doc.data().userId === currentUserId) {
      await db.collection("posts").doc(postId).delete();
      alert("게시글이 삭제되었습니다.");
      displayPosts(); // 게시글 목록 새로고침
    } else {
      alert("삭제 권한이 없습니다.");
    }
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 문제가 발생했습니다.");
  }
}

// 페이지 로드 시 게시글 목록 표시
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();

  // 삭제 버튼 클릭 이벤트
  document.getElementById("deletePostBtn").addEventListener("click", (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      if (confirm("정말로 삭제하시겠습니까?")) {
        deletePost(postId);
      }
    }
  });
});
