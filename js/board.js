// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAcGdEVkZS8l_w4eczwzFGKL5enLHXJKFk",
  authDomain: "webproject-12c7a.firebaseapp.com",
  projectId: "webproject-12c7a",
  storageBucket: "webproject-12c7a.firebasestorage.app",
  messagingSenderId: "169348055607",
  appId: "1:169348055607:web:c0c5440edecc1d0e3a35b2",
  measurementId: "G-8PPXSFGBB3",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 게시글 추가 함수
async function addPost(title, content, author) {
  await db.collection("posts").add({
    title,
    content,
    author,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// 게시글 읽기 함수
async function getPosts() {
  const snapshot = await db
    .collection("posts")
    .orderBy("timestamp", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 게시글 삭제 함수
async function deletePost(postId) {
  await db.collection("posts").doc(postId).delete();
}

// 게시글 상세 보기
async function showPostDetail(postId) {
  const doc = await db.collection("posts").doc(postId).get();
  if (doc.exists) {
    const post = doc.data();
    document.getElementById("detailTitle").textContent = post.title;
    document.getElementById("detailContent").textContent = post.content;
    document.getElementById(
      "detailAuthor"
    ).textContent = `작성자: ${post.author}`;
    document.getElementById("postDetail").style.display = "block";
    document.getElementById("deletePostBtn").dataset.id = postId;
  }
}

// 게시글 렌더링
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // 초기화
  const posts = await getPosts();
  posts.forEach((post) => {
    const li = document.createElement("li");
    li.textContent = `${post.title} - ${post.author}`;
    li.dataset.id = post.id;
    li.addEventListener("click", () => showPostDetail(post.id));
    postList.appendChild(li);
  });
}

// 삭제 버튼 이벤트
document.getElementById("deletePostBtn").addEventListener("click", async () => {
  const postId = document.getElementById("deletePostBtn").dataset.id;
  if (postId) {
    await deletePost(postId);
    document.getElementById("postDetail").style.display = "none";
    displayPosts();
  }
});

// 게시글 추가 이벤트
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const author = document.getElementById("author").value;
  await addPost(title, content, author);
  document.getElementById("postForm").reset();
  displayPosts();
});

// 초기 실행
displayPosts();
