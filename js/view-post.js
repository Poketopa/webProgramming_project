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

      // 현재 로그인 사용자와 작성자가 동일한지 확인
      const currentNickname = localStorage.getItem("kakaoNickname");
      if (currentNickname === post.author) {
        document.getElementById("editDeleteButtons").style.display = "block";
      }
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
    const confirmDelete = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    await db.collection("posts").doc(postId).delete();
    alert("게시글이 삭제되었습니다.");
    window.location.href = "board.html";
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글을 삭제하는 데 실패했습니다.");
  }
}

// 게시글 수정
function editPost(postId) {
  const newTitle = prompt("새로운 제목을 입력하세요:");
  const newContent = prompt("새로운 내용을 입력하세요:");

  if (!newTitle || !newContent) {
    alert("제목과 내용을 모두 입력해야 합니다.");
    return;
  }

  db.collection("posts")
    .doc(postId)
    .update({
      title: newTitle,
      content: newContent,
    })
    .then(() => {
      alert("게시글이 수정되었습니다.");
      loadPostDetail(postId); // 새로 로드하여 업데이트된 내용 표시
    })
    .catch((error) => {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("게시글 수정에 실패했습니다.");
    });
}

// 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  const postId = getPostIdFromURL();
  if (postId) {
    loadPostDetail(postId);

    // 삭제 버튼 이벤트
    const deleteButton = document.getElementById("deletePostBtn");
    deleteButton.onclick = () => deletePost(postId);

    // 수정 버튼 이벤트
    const editButton = document.getElementById("editPostBtn");
    editButton.onclick = () => editPost(postId);
  } else {
    alert("잘못된 접근입니다.");
    window.location.href = "board.html";
  }
});
