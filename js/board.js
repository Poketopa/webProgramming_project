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
    if (doc.exists) {
      const post = doc.data();
      const currentUserId = localStorage.getItem("kakaoUserId");

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

      const editButton = document.getElementById("editPostBtn");
      editButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
    alert("게시글을 불러오지 못했습니다.");
  }
}

// 페이지 로드 시 게시글 목록 표시
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
