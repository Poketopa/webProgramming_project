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

// 게시글 상세 보기 함수
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

      // 수정 및 삭제 버튼 처리
      const editButton = document.getElementById("editPostBtn");
      const deleteButton = document.getElementById("deletePostBtn");

      if (post.userId === currentUserId) {
        editButton.style.display = "inline-block";
        deleteButton.style.display = "inline-block";

        // 수정 버튼 클릭 이벤트
        editButton.onclick = () => loadPostForEdit(postId);

        // 삭제 버튼 클릭 이벤트
        deleteButton.onclick = async () => {
          if (confirm("정말로 삭제하시겠습니까?")) {
            await deletePost(postId);
            document.getElementById("postDetail").style.display = "none";
            displayPosts(); // 목록 새로고침
          }
        };
      } else {
        editButton.style.display = "none";
        deleteButton.style.display = "none";
      }

      document.getElementById("postDetail").style.display = "block";
    } else {
      alert("게시글을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
  }
}

// 게시글 삭제 함수
async function deletePost(postId) {
  try {
    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 문제가 발생했습니다.");
  }
}

// 게시글 수정 로드 함수
function loadPostForEdit(postId) {
  const newTitle = prompt("새 제목을 입력하세요:");
  const newContent = prompt("새 내용을 입력하세요:");
  if (newTitle && newContent) {
    updatePost(postId, newTitle, newContent);
  }
}

// 게시글 수정 함수
async function updatePost(postId, title, content) {
  try {
    await db.collection("posts").doc(postId).update({
      title: title.trim(),
      content: content.trim(),
    });
    alert("게시글이 수정되었습니다.");
    displayPosts(); // 목록 새로고침
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    alert("게시글 수정 중 문제가 발생했습니다.");
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
    li.onclick = () => showPostDetail(post.id);
    postList.appendChild(li);
  });
}

// 게시글 데이터 가져오기
async function getPosts() {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    return [];
  }
}

// 초기 실행
displayPosts();
