document.addEventListener('DOMContentLoaded', () => {
    const genInput = document.getElementById('generatedPassword');
    const checkInput = document.getElementById('checkInput');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthVal = document.getElementById('lengthVal');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const crackTimeText = document.getElementById('crackTime');
    const toggleView = document.getElementById('toggleView');

    function generate() {
        let L = lengthSlider.value, C = "";
        if(document.getElementById('useUpper').checked) C += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if(document.getElementById('useLower').checked) C += "abcdefghijklmnopqrstuvwxyz";
        if(document.getElementById('useNumbers').checked) C += "0123456789";
        if(document.getElementById('useSymbols').checked) C += "!@#$%^&*()";
        if(!C) return genInput.value = "Error";
        let P = "";
        const r = new Uint32Array(L); window.crypto.getRandomValues(r);
        for(let i=0; i<L; i++) P += C.charAt(r[i] % C.length);
        genInput.value = P;
    }

    function getTimeToCrack(p) {
        if(!p) return "0s";
        let charsetSize = 0;
        if(/[a-z]/.test(p)) charsetSize += 26;
        if(/[A-Z]/.test(p)) charsetSize += 26;
        if(/[0-9]/.test(p)) charsetSize += 10;
        if(/[!@#$%^&*()]/.test(p)) charsetSize += 10;
        
        const entropy = Math.log2(Math.pow(charsetSize || 1, p.length));
        const combinations = Math.pow(2, entropy);
        const hashesPerSec = 1e10; // Assume 10 Billion guesses/sec
        const seconds = combinations / hashesPerSec;

        if (seconds < 60) return "Instantly";
        if (seconds < 3600) return Math.floor(seconds/60) + " mins";
        if (seconds < 86400) return Math.floor(seconds/3600) + " hours";
        if (seconds < 31536000) return Math.floor(seconds/86400) + " days";
        if (seconds < 31536000000) return Math.floor(seconds/31536000) + " years";
        return "Centuries";
    }

    function check(p) {
        if(!p) { update("0%", "Enter password", "#cbd5e1"); crackTimeText.innerText = "Time to crack: 0s"; return; }
        
        let score = 0;
        if(p.length >= 8) score++;
        if(p.length >= 12) score++;
        if(/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
        if(/[0-9]/.test(p)) score++;
        if(/[!@#$%^&*()]/.test(p)) score++;

        const colors = ["#ef4444", "#f59e0b", "#eab308", "#3b82f6", "#22c55e"];
        const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
        const s = Math.min(score, 5);
        
        update((s/5)*100 + "%", labels[s-1], colors[s-1]);
        crackTimeText.innerText = "Crack Time: " + getTimeToCrack(p);
    }

    function update(w, t, c) {
        strengthBar.style.width = w;
        strengthBar.style.background = c;
        strengthText.innerText = t;
        strengthText.style.color = c;
    }

    // Toggle Eye Logic
    toggleView.onclick = () => {
        checkInput.type = checkInput.type === "password" ? "text" : "password";
        toggleView.innerText = checkInput.type === "password" ? "👁️" : "🙈";
    };

    lengthSlider.oninput = () => { lengthVal.innerText = lengthSlider.value; generate(); };
    document.getElementById('generateBtn').onclick = generate;
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(genInput.value);
        document.getElementById('copyBtn').innerText = "Saved";
        setTimeout(() => { document.getElementById('copyBtn').innerText = "Copy"; }, 1000);
    };
    checkInput.oninput = (e) => check(e.target.value);
    generate();
});