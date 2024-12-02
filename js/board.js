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

// 게시글 추가 함수
async function addPost(title, content) {
  try {
    const userId = localStorage.getItem("kakaoUserId");
    const nickname = localStorage.getItem("kakaoNickname");

    if (!userId || !nickname) {
      alert("로그인이 필요합니다.");
      return;
    }

    await db.collection("posts").add({
      title: title.trim(),
      content: content.trim(),
      author: nickname,
      userId: userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log("게시글 추가 완료");
    await displayPosts();
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
  }
}

// 게시글 목록 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");

  // 기존 게시물 목록 초기화
  postList.innerHTML = "";

  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();

    snapshot.forEach((doc) => {
      const post = doc.data();
      const li = document.createElement("li");
      li.textContent = `${post.title} - ${post.author}`;
      li.dataset.id = doc.id;
      li.addEventListener("click", () => showPostDetail(doc.id));
      postList.appendChild(li);
    });

    console.log("게시글 목록 불러오기 완료");
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
  }
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

      // 삭제 버튼 설정
      const deleteButton = document.getElementById("deletePostBtn");
      deleteButton.dataset.id = postId;
      deleteButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";

      // 수정 버튼 설정
      const editButton = document.getElementById("editPostBtn");
      editButton.dataset.id = postId;
      editButton.style.display =
        post.userId === currentUserId ? "inline-block" : "none";
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
  }
}

// 게시글 삭제
document.getElementById("deletePostBtn").addEventListener("click", async () => {
  const postId = document.getElementById("deletePostBtn").dataset.id;

  try {
    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
    document.getElementById("postDetail").style.display = "none";
    displayPosts();
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
  }
});

// 게시글 추가 이벤트
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("제목과 내용을 입력해주세요.");
    return;
  }

  await addPost(title, content);
  document.getElementById("postForm").reset();
});

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
