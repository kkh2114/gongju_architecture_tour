// Mobile Web App for 건축기술인회 공주 탐방
document.addEventListener('DOMContentLoaded', function() {
    
    // 모바일 메뉴 터치 피드백
    const touchElements = document.querySelectorAll('.nav-tab, .nav-item, .back-btn');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
    
    // 전화번호 클릭 시 확인 다이얼로그
    const phoneLinks = document.querySelectorAll('.phone-link');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.textContent.trim();
            const confirmed = confirm(`${phoneNumber}로 전화를 걸겠습니까?`);
            if (!confirmed) {
                e.preventDefault();
            }
        });
    });
    
    // 이미지 로드 에러 처리
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            
            // 대체 텍스트 표시
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = '이미지 준비중';
            placeholder.style.cssText = `
                background: #f0f0f0;
                color: #999;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 200px;
                border-radius: 8px;
                font-size: 0.9rem;
            `;
            
            this.parentNode.insertBefore(placeholder, this.nextSibling);
        });
    });
    
    // 스크롤 시 상단 네비게이션 그림자 효과
    const topNav = document.querySelector('.top-nav');
    if (topNav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 0) {
                topNav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                topNav.style.boxShadow = 'none';
            }
        });
    }
    
    // 타임라인 아이템 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, observerOptions);
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            timelineObserver.observe(item);
        });
    }
    
    // 카드 애니메이션
    const cards = document.querySelectorAll('.attraction-card, .method-card, .prep-category');
    if (cards.length > 0) {
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            cardObserver.observe(card);
        });
    }
    
    // 부드러운 스크롤 (iOS Safari 호환성)
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // 뒤로가기 버튼 기능 강화
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 브라우저 히스토리가 있으면 뒤로가기, 없으면 홈으로
            if (window.history.length > 1) {
                e.preventDefault();
                window.history.back();
            }
            // href가 설정되어 있으면 그대로 진행
        });
    });
    
    // PWA 관련 기능
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        
        // 설치 버튼 표시 (필요시)
        const installButton = document.getElementById('install-button');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', function() {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('앱이 설치되었습니다.');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
    
    // 오프라인 상태 알림
    window.addEventListener('online', function() {
        console.log('인터넷에 연결되었습니다.');
    });
    
    window.addEventListener('offline', function() {
        console.log('인터넷 연결이 끊어졌습니다.');
    });
    
    // 터치 제스처 지원
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // 위로 스와이프 (새로고침 방지)
        if (diff > swipeThreshold && window.scrollY === 0) {
            // 새로고침 동작 방지
            return;
        }
        
        // 아래로 스와이프
        if (diff < -swipeThreshold) {
            // 필요시 추가 동작
        }
    }
    
    // 이미지 지연 로딩
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 성능 최적화: 스크롤 이벤트 스로틀링
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 스크롤 성능 최적화
    const optimizedScrollHandler = throttle(function() {
        // 스크롤 관련 처리
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // 패럴랙스 효과 (필요시)
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    }, 16);
    
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // 접근성 개선
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모달 닫기 등
        if (e.key === 'Escape') {
            // 모달이나 오버레이가 있다면 닫기
        }
        
        // Tab 키 네비게이션 개선
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // 로딩 완료 알림
    console.log('건축기술인회 공주 탐방 웹앱이 로드되었습니다.');
});

// 유틸리티 함수들
const Utils = {
    // 디바이스 감지
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // iOS 감지
    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },
    
    // 안드로이드 감지
    isAndroid: function() {
        return /Android/.test(navigator.userAgent);
    },
    
    // 숫자 포맷팅
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // 전화번호 포맷팅
    formatPhoneNumber: function(phone) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
};

// 전역으로 사용할 수 있도록 내보내기
window.GongjuTourApp = {
    Utils: Utils
};