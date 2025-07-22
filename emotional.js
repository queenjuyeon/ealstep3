const mainImage = document.getElementById('mainImage');
const youtubeFrame = document.getElementById('youtubeFrame');
const categories = document.querySelectorAll('.category');
const buttons = document.querySelectorAll('.category-buttons button');
const sourceText = document.getElementById('sourceText');

function convertToEmbedUrl(url) {
  if (url.includes('youtu.be/')) {
    return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    return 'https://www.youtube.com/embed/' + url.split('watch?v=')[1].split('&')[0];
  }
  return url;
}

function getYoutubeId(url) {
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0];
  }
  return '';
}

// ✅ 유튜브 썸네일 자동 생성 (최초 1회)
document.querySelectorAll('.thumb[data-type="youtube"]').forEach((thumb) => {
  if (!thumb.querySelector('img')) {
    const videoUrl = thumb.dataset.video;
    const videoId = getYoutubeId(videoUrl);
    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    img.alt = 'YouTube Thumbnail';
    img.classList.add('youtubethumb-img');
    thumb.appendChild(img);
  }
});

// ✅ 모든 썸네일에 클릭 이벤트 1회만 등록
document.querySelectorAll('.thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const type = thumb.dataset.type;
    const selectedCategory = thumb.closest('.category');
    const activeThumbs = selectedCategory.querySelectorAll('.thumb');

    // ✅ 모든 썸네일 상태 초기화
    activeThumbs.forEach((t) => {
      t.classList.remove('active');
      const innerImg = t.querySelector('img');
      if (innerImg) {
        innerImg.style.opacity = '0.5';
        innerImg.style.transform = 'scale(1)';
        innerImg.style.zIndex = '1';
      }
    });

    // ✅ 현재 썸네일 활성화 스타일 적용
    thumb.classList.add('active');
    const img = thumb.querySelector('img');
    if (img) {
      img.style.opacity = '1';
      img.style.transform = 'scale(1.1)';
      img.style.zIndex = '2';
    }

    // ✅ 메인 화면 전환
    if (type === 'youtube') {
      const embedUrl = convertToEmbedUrl(thumb.dataset.video);
      youtubeFrame.src = embedUrl + '?autoplay=1';
      youtubeFrame.style.display = 'block';
      mainImage.style.display = 'none';

      sourceText.textContent = '';
    } else {
      const fullSrc = thumb.dataset.full || thumb.querySelector('img')?.src;
      if (fullSrc) {
        mainImage.src = fullSrc;
        mainImage.style.display = 'block';
        youtubeFrame.style.display = 'none';
        youtubeFrame.src = '';

        // ✅ 이미지 클릭 시 출처 업데이트
      const source = thumb.dataset.source || '';
      sourceText.textContent = source;

      }
    }
  });
});


// ✅ 카테고리 버튼 클릭 이벤트
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.category;

    // 버튼 스타일
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    // 프레임/이미지 초기화
    mainImage.src = '';
    mainImage.style.display = 'none';
    youtubeFrame.src = '';
    youtubeFrame.style.display = 'none';

    // 카테고리 전환
    categories.forEach((cat) => {
      cat.style.display = (cat.id === selected) ? 'block' : 'none';
    });

    // 유튜브 썸네일이 없는 경우만 생성
    const newThumbs = document.querySelectorAll(`#${selected} .thumb`);
    newThumbs.forEach((thumb, i) => {
      const type = thumb.dataset.type;
      if (type === 'youtube' && !thumb.querySelector('img')) {
        const videoUrl = thumb.dataset.video;
        const videoId = getYoutubeId(videoUrl);
        const img = document.createElement('img');
        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        img.alt = 'YouTube Thumbnail';
        img.classList.add('youtubethumb-img');
        thumb.appendChild(img);
      }

      // 첫 썸네일 자동 클릭
      if (i === 0) thumb.click();
    });
  });
});


// ✅ URL 해시(#drama 등)로 카테고리 자동 클릭
if (location.hash) {
  const hash = location.hash.replace('#', '');
  const targetButton = document.querySelector(`[data-category="${hash}"]`);
  if (targetButton) targetButton.click();
}

// 4) 키보드 화살표 이벤트 핸들러
document.addEventListener('keydown', e => {
  // input/textarea 포커스 시 무시
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;

  if (e.key === 'ArrowRight') {
    const next = currentIndex + 1;
    if (next < thumbs.length) thumbs[next].click();
  }
  else if (e.key === 'ArrowLeft') {
    const prev = currentIndex - 1;
    if (prev >= 0) thumbs[prev].click();
  }
});
