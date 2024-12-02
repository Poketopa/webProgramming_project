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
    await displayPosts(); // 목록 갱신
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
    return [];
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

      const deleteButton = document.getElementById("deletePostBtn");
      deleteButton.dataset.id = postId;

      let editButton = document.getElementById("editButton");
      if (!editButton) {
        editButton = document.createElement("button");
        editButton.id = "editButton";
        editButton.textContent = "수정";
        editButton.addEventListener("click", () => loadPostForEdit(postId));
        document.getElementById("postDetail").appendChild(editButton);
      }

      if (post.userId === currentUserId) {
        deleteButton.style.display = "inline-block";
        editButton.style.display = "inline-block";
      } else {
        deleteButton.style.display = "none";
        editButton.style.display = "none";
      }
    }
  } catch (error) {
    console.error("게시글 상세 보기 중 오류 발생:", error);
  }
}

// 게시글 목록 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";

  try {
    const posts = await getPosts();
    if (posts) {
      posts.forEach((post) => {
        const li = document.createElement("li");
        li.textContent = `${post.title} - ${post.author}`;
        li.dataset.id = post.id;
        li.onclick = () => showPostDetail(post.id);
        postList.appendChild(li);
      });
    } else {
      postList.innerHTML = "<li>게시글이 없습니다.</li>";
    }
  } catch (error) {
    console.error("게시글 목록 렌더링 중 오류 발생:", error);
  }
}

// DOM 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
