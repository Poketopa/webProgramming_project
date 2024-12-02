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
  postList.innerHTML = ""; // 기존 목록 초기화

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
      document.getElementById("detailTitle").textContent = post.title;
      document.getElementById("detailContent").textContent = post.content;
      document.getElementById(
        "detailAuthor"
      ).textContent = `작성자: ${post.author}`;
      document.getElementById("postDetail").style.display = "block";
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
  }
}

// 게시글 삭제
async function deletePost(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();
    const currentUserId = localStorage.getItem("kakaoUserId");

    if (doc.exists && doc.data().userId === currentUserId) {
      await db.collection("posts").doc(postId).delete();
      console.log("게시글 삭제 완료");
      await displayPosts(); // 목록 새로고침
    } else {
      alert("삭제 권한이 없습니다.");
    }
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
  }
}

// 초기 실행
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

document.addEventListener("DOMContentLoaded", displayPosts);
