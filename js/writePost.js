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

// 글쓰기 폼 제출 처리
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const author = localStorage.getItem("kakaoNickname"); // 로그인 사용자 닉네임 가져오기

  if (!title || !content) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  try {
    await db.collection("posts").add({
      title,
      content,
      author,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("게시글이 성공적으로 등록되었습니다.");
    window.location.href = "board.html"; // 게시판 페이지로 리디렉션
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    alert("게시글 등록에 실패했습니다.");
  }
});
