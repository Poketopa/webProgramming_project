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
async function addPost(title, content, author) {
  try {
    const userId = localStorage.getItem("kakaoUserId"); // 로그인한 사용자 ID
    const nickname = localStorage.getItem("kakaoNickname"); // 로그인한 사용자 닉네임

    if (!userId || !nickname) {
      alert("로그인이 필요합니다.");
      return;
    }

    await db.collection("posts").add({
      title: title.trim(),
      content: content.trim(),
      author: nickname, // 닉네임 저장
      userId: userId, // 사용자 ID 저장
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log("게시글 추가 완료");
    displayPosts();
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
    alert("게시글 추가 중 문제가 발생했습니다.");
  }
}

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

// 게시글 삭제 함수
async function deletePost(postId) {
  try {
    const doc = await db.collection("posts").doc(postId).get();
    const currentUserId = localStorage.getItem("kakaoUserId");

    if (doc.exists && doc.data().userId === currentUserId) {
      await db.collection("posts").doc(postId).delete();
      console.log("게시글 삭제 완료");
      displayPosts();
    } else {
      alert("삭제 권한이 없습니다.");
    }
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 문제가 발생했습니다.");
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

      // 수정 버튼 처리 (중복 방지)
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
});

// 초기 실행
displayPosts();
