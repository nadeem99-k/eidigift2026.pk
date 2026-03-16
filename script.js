let shareCount = 0;
let channelJoined = false;
let selectedBank = "";

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
    showSection('tasks');
}

function markJoined() {
    channelJoined = true;
    alert('آپ نے چینل فالو کر لیا ہے۔ اب شیئر کرنے والا ٹاسک مکمل کریں۔');
    checkCompletion();
}

function shareWa() {
    shareCount++;
    if (shareCount > 10) shareCount = 10;
    
    const progress = (shareCount / 10) * 100;
    document.getElementById('shareProgress').style.width = progress + '%';
    document.getElementById('shareCount').innerText = `${shareCount}/10 تکمیل`;
    
    // Dynamic sharing text
    const shareText = encodeURIComponent(`🌙 عید مبارک! ✨ \n\nمجھے پاکستان حکومت کی عیدی اسکیم 2026 سے 50,000 روپے مل رہے ہیں! 😍 \n\nاگر آپ بھی عیدی حاصل کرنا چاہتے ہیں تو ابھی اس لنک پر کلک کریں اور اپنا نمبر درج کریں: \n\n${window.location.href}`);
    
    window.open(`whatsapp://send?text=${shareText}`, '_blank');
    
    checkCompletion();
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
    "اسد نے ابھی 50،000 روپے وصول کیے",
    "فوزیہ نے ابھی 50،000 روپے وصول کیے",
    "عرفان نے ابھی 50،000 روپے وصول کیے",
    "شمائلہ نے ابھی 50،000 روپے وصول کیے",
    "کامران نے ابھی 50،000 روپے وصول کیے",
    "بلال نے ابھی 50،000 روپے وصول کیے",
    "زینب نے ابھی 50،000 روپے وصول کیے",
    "حمزہ نے ابھی 50،000 روپے وصول کیے",
    "عائشہ نے ابھی 50،000 روپے وصول کیے",
    "عثمان نے ابھی 50،000 روپے وصول کیے",
    "مریم نے ابھی 50،000 روپے وصول کیے",
    "رضوان نے ابھی 50،000 روپے وصول کیے",
    "طاہرہ نے ابھی 50،000 روپے وصول کیے",
    "شان نے ابھی 50،000 روپے وصول کیے",
    "اقرا نے ابھی 50،000 روپے وصول کیے",
    "فیصل نے ابھی 50،000 روپے وصول کیے",
    "صباء نے ابھی 50،000 روپے وصول کیے",
    "نوید نے ابھی 50،000 روپے وصول کیے",
    "حنا نے ابھی 50،000 روپے وصول کیے",
    "زوہیب نے ابھی 50،000 روپے وصول کیے",
    "انعم نے ابھی 50،000 روپے وصول کیے",
    "شهزاد نے ابھی 50،000 روپے وصول کیے",
    "ماہم نے ابھی 50،000 روپے وصول کیے",
    "وقاص نے ابھی 50،000 روپے وصول کیے",
    "نمرہ نے ابھی 50،000 روپے وصول کیے",
    "عدیل نے ابھی 50،000 روپے وصول کیے",
    "ثانیہ نے ابھی 50،000 روپے وصول کیے",
    "عقبہ نے ابھی 50،000 روپے وصول کیے",
    "مبشر نے ابھی 50،000 روپے وصول کیے",
    "سعدیہ نے ابھی 50،000 روپے وصول کیے",
    "طلحہ نے ابھی 50،000 روپے وصول کیے",
    "فرح نے ابھی 50،000 روپے وصول کیے",
    "جنید نے ابھی 50،000 روپے وصول کیے",
    "مہوش نے ابھی 50،000 روپے وصول کیے",
    "ساجد نے ابھی 50،000 روپے وصول کیے"
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
