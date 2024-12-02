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
    displayPosts(); // 글 추가 후 목록 갱신
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
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

// 게시글 목록 렌더링
async function displayPosts() {
  console.log("displayPosts 호출됨"); // 호출 확인
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // 기존 게시글 초기화

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

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  displayPosts(); // 페이지 로드 시 한 번만 호출
});

// 게시글 추가 이벤트
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("제목과 내용을 모두 작성해주세요.");
    return;
  }

  await addPost(title, content);
  displayPosts(); // 게시글 추가 후 목록 갱신
  document.getElementById("postForm").reset(); // 입력 폼 초기화
});
