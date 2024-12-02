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
    await displayPosts(); // 게시글 목록 새로고침
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
  }
}

// 게시글 목록 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");

  // 게시글 목록 초기화
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
      li.addEventListener("click", () => showPostDetail(doc.id)); // 클릭 시 상세 보기
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
      const currentUserId = localStorage.getItem("kakaoUserId"); // 현재 로그인 사용자 ID

      document.getElementById("detailTitle").textContent = post.title;
      document.getElementById("detailContent").textContent = post.content;
      document.getElementById(
        "detailAuthor"
      ).textContent = `작성자: ${post.author}`;
      document.getElementById("postDetail").style.display = "block";

      // 삭제 버튼 설정
      const deleteButton = document.getElementById("deletePostBtn");
      deleteButton.dataset.id = postId;

      if (post.userId === currentUserId) {
        deleteButton.style.display = "inline-block"; // 삭제 버튼 활성화
      } else {
        deleteButton.style.display = "none"; // 삭제 버튼 비활성화
      }

      // 수정 버튼 처리
      let editButton = document.getElementById("editButton");
      if (!editButton) {
        editButton = document.createElement("button");
        editButton.id = "editButton";
        editButton.textContent = "수정";
        editButton.addEventListener("click", () => loadPostForEdit(postId));
        document.getElementById("postDetail").appendChild(editButton);
      }

      if (post.userId === currentUserId) {
        editButton.style.display = "inline-block"; // 수정 버튼 활성화
      } else {
        editButton.style.display = "none"; // 수정 버튼 비활성화
      }
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
  }
}

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
  document.getElementById("postForm").reset(); // 폼 초기화
});

// 초기 실행 (DOMContentLoaded에서 한 번만 실행)
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
