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
  if (!postList) return;

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

    if (!doc.exists) {
      alert("해당 게시글이 존재하지 않습니다.");
      return;
    }

    const post = doc.data();
    const currentUserId = localStorage.getItem("kakaoUserId");

    const detailTitle = document.getElementById("detailTitle");
    const detailContent = document.getElementById("detailContent");
    const detailAuthor = document.getElementById("detailAuthor");

    if (detailTitle && detailContent && detailAuthor) {
      detailTitle.textContent = post.title;
      detailContent.textContent = post.content;
      detailAuthor.textContent = `작성자: ${post.author}`;
    }

    const postDetail = document.getElementById("postDetail");
    postDetail.style.display = "block";

    const deleteButton = document.getElementById("deletePostBtn");
    const editButton = document.getElementById("editPostBtn");

    if (deleteButton && editButton) {
      deleteButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";
      editButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";

      deleteButton.dataset.id = postId;
      deleteButton.addEventListener("click", () => {
        if (confirm("정말로 삭제하시겠습니까?")) deletePost(postId);
      });

      editButton.addEventListener("click", () => {
        window.location.href = `edit-post.html?postId=${postId}`;
      });
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
    alert("게시글을 불러오지 못했습니다.");
  }
}

// 게시글 삭제 함수
async function deletePost(postId) {
  try {
    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
    displayPosts(); // 게시글 목록 새로고침
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 문제가 발생했습니다.");
  }
}

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
