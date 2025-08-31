function initMap() {
    const japanCenter = { lat: 36.204824, lng: 138.252924 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: japanCenter,
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // ★データがリストから辞書に変わったので、ループ方法を変更★
            // sourceUrlにはPDFのURLが、casesにはそのPDFの事案リストが入る
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
                    
                    const infoWindowContent = `
                        <div class="popup-content">
                            <h3>${company.name}</h3>
                            <p><strong>公表日:</strong> ${company.date_ad}</p>
                            <p><strong>所在地:</strong> ${company.address}</p>
                            <p><strong>違反法令:</strong> ${company.law}</p>
                            <p><strong>事案概要:</strong> ${company.summary}</p>
                            <p><a href="${sourceUrl}" target="_blank">情報源PDFを見る</a></p>
                        </div>
                    `;
                    const infoWindow = new google.maps.InfoWindow({
                        content: infoWindowContent
                    });
                    
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data.json:', error);
        });
}