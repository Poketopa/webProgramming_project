// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAcGdEVkZS8l_w4eczwzFGKL5enLHXJKFk",
  authDomain: "webproject-12c7a.firebaseapp.com",
  projectId: "webproject-12c7a",
  storageBucket: "webproject-12c7a.appspot.com", // ".app"에서 ".com"으로 수정
  messagingSenderId: "169348055607",
  appId: "1:169348055607:web:c0c5440edecc1d0e3a35b2",
  measurementId: "G-8PPXSFGBB3",
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 게시글 추가 함수
async function addPost(title, content, author) {
  try {
    await db.collection("posts").add({
      title: title.trim(), // 공백 제거
      content: content.trim(),
      author: author.trim(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(), // 서버 시간 추가
    });
    console.log("게시글 추가 완료");
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
    alert("게시글 추가 중 오류가 발생했습니다.");
  }
}

// 게시글 읽기 함수
async function getPosts() {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // 문서 ID 포함
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    alert("게시글 목록을 불러오지 못했습니다.");
  }
}

// 게시글 삭제 함수
async function deletePost(postId) {
  try {
    await db.collection("posts").doc(postId).delete();
    console.log("게시글 삭제 완료");
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 문제가 발생했습니다.");
  }
}

// 게시글 수정 함수
async function updatePost(postId, updatedData) {
  try {
    await db.collection("posts").doc(postId).update(updatedData);
    console.log("게시글 수정 완료");
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    alert("게시글 수정 중 오류가 발생했습니다.");
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

      // 삭제 버튼에 게시글 ID 저장
      const deleteButton = document.getElementById("deletePostBtn");
      deleteButton.dataset.id = postId;

      // 수정 버튼 추가
      const editButton = document.createElement("button");
      editButton.textContent = "수정";
      editButton.onclick = () => loadPostForEdit(postId);
      document.getElementById("postDetail").appendChild(editButton);
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
    alert("게시글 상세 정보를 불러올 수 없습니다.");
  }
}

// 게시글 수정 폼 로딩
async function loadPostForEdit(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();
    if (doc.exists) {
      const post = doc.data();
      document.getElementById("editTitle").value = post.title;
      document.getElementById("editContent").value = post.content;
      document.getElementById("editForm").style.display = "block";
      document.getElementById("editForm").dataset.id = postId; // 수정할 게시글 ID 저장
    }
  } catch (error) {
    console.error("게시글 로딩 중 오류 발생:", error);
    alert("게시글 수정 데이터를 불러올 수 없습니다.");
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

// 게시글 추가 이벤트
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const author = document.getElementById("author").value;

  if (!title || !content || !author) {
    alert("모든 필드를 작성해주세요.");
    return;
  }

  await addPost(title, content, author);
  document.getElementById("postForm").reset(); // 입력 폼 초기화
  displayPosts(); // 게시글 목록 새로고침
});

// 게시글 삭제 버튼 이벤트
document.getElementById("deletePostBtn").addEventListener("click", async () => {
  const postId = document.getElementById("deletePostBtn").dataset.id; // 게시글 ID 가져오기
  if (postId) {
    await deletePost(postId);
    document.getElementById("postDetail").style.display = "none"; // 상세 보기 숨기기
    displayPosts(); // 게시글 목록 새로고침
  }
});

// 게시글 수정 저장 버튼 이벤트
document
  .getElementById("saveChangesBtn")
  .addEventListener("click", async () => {
    const postId = document.getElementById("editForm").dataset.id;
    const updatedTitle = document.getElementById("editTitle").value;
    const updatedContent = document.getElementById("editContent").value;

    if (!updatedTitle || !updatedContent) {
      alert("제목과 내용을 모두 작성해주세요.");
      return;
    }

    await updatePost(postId, { title: updatedTitle, content: updatedContent });
    document.getElementById("editForm").style.display = "none"; // 수정 폼 숨기기
    displayPosts(); // 게시글 목록 새로고침
  });

// 게시글 수정 취소 버튼 이벤트
document.getElementById("cancelEditBtn").addEventListener("click", () => {
  document.getElementById("editForm").style.display = "none"; // 수정 폼 숨기기
});

// 초기 실행
displayPosts();
