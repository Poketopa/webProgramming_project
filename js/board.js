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

// 게시글 불러오기
async function getPosts() {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    alert("게시글 목록을 불러오는 데 실패했습니다.");
    return [];
  }
}

// 게시글 목록 표시
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // 기존 목록 초기화

  const posts = await getPosts();
  if (posts && posts.length > 0) {
    posts.forEach((post) => {
      const li = document.createElement("li");
      li.textContent = `${post.title} - ${post.author}`;
      li.className = "post-item";
      li.onclick = () => {
        window.location.href = `view-post.html?id=${post.id}`; // 게시글 상세 보기 페이지로 이동
      };
      postList.appendChild(li);
    });
  } else {
    postList.innerHTML = "<li>게시글이 없습니다.</li>";
  }
}
