function initMap() {
    const japanCenter = { lat: 36.204824, lng: 138.252924 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: japanCenter,
        gestureHandling: 'greedy'
    });

    // ★ここから変更：ボトムシート関連の要素を取得
    const bottomSheet = document.getElementById('bottom-sheet');
    const closeSheetButton = document.getElementById('close-sheet-button');
    const sheetCompanyName = document.getElementById('sheet-company-name');
    const sheetDate = document.getElementById('sheet-date');
    const sheetAddress = document.getElementById('sheet-address');
    const sheetLaw = document.getElementById('sheet-law');
    const sheetSummary = document.getElementById('sheet-summary');
    const sheetSourceLink = document.getElementById('sheet-source-link');

    // ★ InfoWindowのコードは不要になったため削除

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            for (const sourceUrl in data) {
                const cases = data[sourceUrl];
                
                cases.forEach(company => {
                    if (company.lat === 0 || company.lng === 0) {
                        return; 
                    }

                    const marker = new google.maps.Marker({
                        position: { lat: company.lat, lng: company.lng },
                        map: map,
                        title: company.name
                    });
                    
                    // ★ここから変更：マーカークリック時の処理をボトムシート用に書き換え
                    marker.addListener('click', () => {
                        // 1. ボトムシートに情報をセット
                        sheetCompanyName.textContent = company.name;
                        sheetDate.textContent = company.date_ad;
                        sheetAddress.textContent = company.address;
                        sheetLaw.textContent = company.law;
                        sheetSummary.textContent = company.summary;
                        sheetSourceLink.href = sourceUrl;

                        // 2. ボトムシートを表示
                        bottomSheet.classList.add('active');
                    });
                });
            }
        })
        .catch(error => {
            console.error('data.json の読み込みに失敗しました:', error);
            alert('データの読み込みに失敗しました。マップを表示できません。');
        });
        
    // ★ここから追加：ボトムシートを閉じる処理
    closeSheetButton.addEventListener('click', () => {
        bottomSheet.classList.remove('active');
    });

    // ★地図をクリックしたときもボトムシートを閉じる
    map.addListener('click', () => {
        bottomSheet.classList.remove('active');
    });
}

// --- メニューボタンの機能 ---
const menuButton = document.getElementById('menu-button');
const navMenu = document.getElementById('nav-menu');
const overlay = document.getElementById('overlay');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('nav-active');
    overlay.classList.toggle('nav-active');
});

overlay.addEventListener('click', () => {
    navMenu.classList.remove('nav-active');
    overlay.classList.remove('nav-active');
});