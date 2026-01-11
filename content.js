 
const darkKeywords = {
  "urgency": ["마감", "임박", "남음", "오늘만"],
  "social": ["보고 있음", "구매함", "인기"],
  "shaming": ["비싸게", "포기", "손해"]
};

function detectAndProtect() {
  const checkbox = document.getElementById('guardianMode');
  // 체크박스가 없거나 꺼져있으면 아예 실행 안 함
  if (!checkbox || !checkbox.checked) return;

  const allElements = document.querySelectorAll('p, span, b, i, h1, h2, h3, h4, button');
  
  allElements.forEach(el => {
    // 이미 탐지된 건 다시 검사 안 함
    if (el.dataset.detected === "true") return;

    for (let type in darkKeywords) {
      if (darkKeywords[type].some(word => el.innerText.includes(word))) {
        
        // 1. 요소 스타일 변경
        el.style.border = "2px solid #FF0000"; 
        el.style.position = "relative";
        el.style.backgroundColor = "rgba(255, 255, 0, 0.2)"; 
        
        // 2. 뱃지 생성 및 설정
        const badge = document.createElement('span');
        badge.className = "guardian-badge"; // 지우기 위해 필수!!
        
        // 3. 내용 및 배경색 분기 (팩트체크)
        badge.innerText = `⚠️ ${type} 패턴 탐지!`;
        if (el.innerText.includes("10,000명")) {
            badge.innerText = `🚨 거짓 데이터 감지: 실제 구매 50건 미만`;
            badge.style.background = "red";
            el.style.textDecoration = "line-through"; // 글자에 취소선 긋기
            el.title = "거짓 데이터 감지: 실제 판매량과 일치하지 않습니다.";
        } else {
            // 일반적인 패턴일 때
            badge.innerText = `⚠️ ${type} 패턴 탐지!`;
            badge.style.background = "red";
        }


        
        // 4. 공통 스타일 (style.속성 하나씩 지정해야 안 꼬임)
        badge.style.position = "absolute";
        badge.style.top = "-25px";
        badge.style.left = "0";
        badge.style.color = "white";
        badge.style.fontSize = "10px";
        badge.style.padding = "2px 5px";
        badge.style.borderRadius = "3px";
        badge.style.zIndex = "9999";
        badge.style.whiteSpace = "nowrap";
        
        el.appendChild(badge);
        el.dataset.detected = "true";
      }
    }
  });
}

function clearGuardianEffects() {
    const checkbox = document.getElementById('guardianMode');
    // 체크박스가 꺼져 있을 때만 청소
    if (checkbox && !checkbox.checked) {
        // 모든 '탐지됨' 요소 원상복구
        document.querySelectorAll('[data-detected="true"]').forEach(el => {
            el.style.border = "none";
            el.style.backgroundColor = "transparent";
            el.style.textDecoration = "none";
            el.dataset.detected = "false"; // 상태 리셋
        });
        
        // 모든 뱃지 일괄 삭제
        const allBadges = document.querySelectorAll('.guardian-badge');
        allBadges.forEach(b => b.remove());
    }
}

// 최종 통합 실행부 (window.onload는 딱 하나만!)
window.onload = () => {
    setInterval(() => {
        detectAndProtect();    // 켜져 있으면 감지
        clearGuardianEffects(); // 꺼져 있으면 청소
    }, 500); 
};
