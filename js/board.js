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

// 게시글 읽기 함수
async function getPosts() {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    alert("게시글 목록을 불러오지 못했습니다.");
  }
}

// 게시글 상세 보기
async function showPostDetail(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();
    if (doc.exists) {
      const post = doc.data();
      const currentNickname = localStorage.getItem("kakaoNickname"); // 현재 로그인 사용자 닉네임

      // 게시글 내용 표시
      document.getElementById("detailTitle").textContent = post.title;
      document.getElementById("detailContent").textContent = post.content;
      document.getElementById(
        "detailAuthor"
      ).textContent = `작성자: ${post.author}`;
      document.getElementById("postDetail").style.display = "block";

      // 수정 및 삭제 버튼 활성화/비활성화
      const editButton = document.getElementById("editPostBtn");
      const deleteButton = document.getElementById("deletePostBtn");

      if (post.author === currentNickname) {
        editButton.style.display = "inline-block"; // 수정 버튼 보이기
        deleteButton.style.display = "inline-block"; // 삭제 버튼 보이기
        deleteButton.dataset.id = postId; // 삭제 버튼에 게시글 ID 저장
        editButton.dataset.id = postId; // 수정 버튼에 게시글 ID 저장
      } else {
        editButton.style.display = "none"; // 수정 버튼 숨기기
        deleteButton.style.display = "none"; // 삭제 버튼 숨기기
      }
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
    alert("게시글 정보를 불러오지 못했습니다.");
  }
}

// 게시글 목록 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // 기존 게시글 목록 초기화

  const posts = await getPosts();
  if (posts) {
    posts.forEach((post) => {
      const li = document.createElement("li");
      li.textContent = `${post.title} - ${post.author}`;
      li.dataset.id = post.id;
      li.onclick = () => showPostDetail(post.id); // 클릭 시 상세 보기
      postList.appendChild(li);
    });
  }
}

// 게시글 삭제
async function deletePost(postId) {
  try {
    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
    displayPosts(); // 게시글 목록 새로고침
    document.getElementById("postDetail").style.display = "none"; // 상세 보기 숨기기
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 오류가 발생했습니다.");
  }
}

// 게시글 수정
async function editPost(postId) {
  const newTitle = prompt("새 제목을 입력하세요:");
  const newContent = prompt("새 내용을 입력하세요:");

  if (newTitle && newContent) {
    try {
      await db.collection("posts").doc(postId).update({
        title: newTitle,
        content: newContent,
      });
      alert("게시글이 수정되었습니다.");
      displayPosts(); // 게시글 목록 새로고침
      document.getElementById("postDetail").style.display = "none"; // 상세 보기 숨기기
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  }
}

// 이벤트 리스너 추가
document.getElementById("deletePostBtn").addEventListener("click", () => {
  const postId = document.getElementById("deletePostBtn").dataset.id;
  if (confirm("정말 삭제하시겠습니까?")) {
    deletePost(postId);
  }
});

document.getElementById("editPostBtn").addEventListener("click", () => {
  const postId = document.getElementById("editPostBtn").dataset.id;
  editPost(postId);
});

// 초기 실행
displayPosts();
