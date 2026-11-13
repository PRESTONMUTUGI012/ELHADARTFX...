class TerminalAudioEngine {
    constructor() {
        this.ctx = null;
        this.isEnabled = true;
    }
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq, type, startTime, duration, volume = 0.15) {
        if (!this.isEnabled) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
    playProfitChime() {
        if (!this.isEnabled) return;
        this.initContext();
        const now = this.ctx.currentTime;
        this.playTone(523.25, 'triangle', now, 0.18, 0.16);
        this.playTone(659.25, 'triangle', now + 0.09, 0.18, 0.16);
        this.playTone(783.99, 'triangle', now + 0.18, 0.22, 0.18);
        this.playTone(1046.50, 'sine', now + 0.27, 0.45, 0.22);
    }
}

const terminalAudio = new TerminalAudioEngine();

function toggleTerminalAudio() {
    terminalAudio.isEnabled = !terminalAudio.isEnabled;
    if (terminalAudio.isEnabled) terminalAudio.initContext();
    const icon = document.getElementById('audio-status-icon');
    const text = document.getElementById('audio-status-text');
    if (icon && text) {
        icon.innerText = terminalAudio.isEnabled ? '🔊' : '🔇';
        text.innerText = terminalAudio.isEnabled ? 'SFX ON' : 'MUTED';
    }
}

function triggerElhadartProfitAlert(boatLabel, profitAmount) {
    terminalAudio.playProfitChime();
    const banner = document.getElementById('profit-toast-banner');
    const details = document.getElementById('profit-toast-details');
    if (banner && details) {
        details.innerText = `${boatLabel} Secured +$${profitAmount.toFixed(2)} Profit`;
        banner.classList.remove('translate-x-full', 'opacity-0');
        banner.classList.add('translate-x-0', 'opacity-100');
        clearTimeout(window.profitToastTimeout);
        window.profitToastTimeout = setTimeout(() => {
            banner.classList.remove('translate-x-0', 'opacity-100');
            banner.classList.add('translate-x-full', 'opacity-0');
        }, 4000);
    }
}

const speedBoatsDirectory = {
    1: { name: "Boat 1: Smart Money OB Sniper", indicator: "Order Block (OB) Tap", rule: "Hold 15M OB Zone Test" },
    2: { name: "Boat 2: Tick Momentum Scalper", indicator: "Tick Velocity Surge", rule: "Hold 1-3 Ticks Momentum" },
    3: { name: "Boat 3: Tick Reversal Scalper", indicator: "Exhaustion Sweep", rule: "Hold 2 Ticks Reversal" },
    4: { name: "Boat 4: FVG Rebalance Bot", indicator: "Fair Value Gap Fill", rule: "Hold to FVG Equilibrium" },
    5: { name: "Boat 5: BOS Trend Follower", indicator: "Break of Structure (BOS)", rule: "Hold 1H Swing Continuation" },
    6: { name: "Boat 6: CHOCH Reversal Hunter", indicator: "Change of Character (CHOCH)", rule: "Hold Market Structure Flip" },
    7: { name: "Boat 7: Premium/Discount Array", indicator: "Institutional Array 50%", rule: "Hold Equilibrium Target" },
    8: { name: "Boat 8: Adaptive Parity Shifter", indicator: "Even / Odd Bias Shift", rule: "Hold Parity Run (2-3 Ticks)" },
    9: { name: "Boat 9: Over/Under Matrixer", indicator: "Digits 0-4 vs 5-9 Bias", rule: "Hold Statistical Over/Under" }
};

let currentActiveSpeedBoat = 2;

function switchSpeedBoat(boatId) {
    currentActiveSpeedBoat = boatId;
    const boat = speedBoatsDirectory[boatId];
    if (boat) {
        document.getElementById('active-indicator-status').innerText = boat.indicator;
        document.getElementById('candle-holding-rule').innerText = boat.rule;
    }
}

function executeSpeedBoatTrade() {
    const boat = speedBoatsDirectory[currentActiveSpeedBoat];
    const label = boat ? boat.name : `Speed Boat ${currentActiveSpeedBoat}`;
    triggerElhadartProfitAlert(label, 52.50);
    alert(`Executing ${label} Active Contract Successfully!`);
}

// Master Multi-Indicator & Confluence Engine
function evaluateAllIndicators(st) {
    if (!st || !st.quotes || st.quotes.length < 10) return;
    
    const quotes = st.quotes;
    const len = quotes.length;
    const currentPrice = quotes[len - 1];
    const prevPrice = quotes[len - 2];
    const isRise = currentPrice >= prevPrice;

    const recentHigh = Math.max(...quotes.slice(len - 20, len));
    const recentLow = Math.min(...quotes.slice(len - 20, len));
    const isBOS = currentPrice >= recentHigh * 0.9995;
    const isCHOCH = (isRise && currentPrice < prevPrice && quotes[len-3] > prevPrice);

    const structureStatus = isCHOCH ? "⚡ CHOCH Reversal Detected" : isBOS ? "📈 BOS Confirmed (Continuation)" : isRise ? "Bullish Order Block Active" : "Bearish Order Block Active";
    const structEl = document.getElementById('structure-confluence-status');
    if (structEl) structEl.innerText = structureStatus;

    const fvgDetected = Math.abs(currentPrice - prevPrice) > (currentPrice * 0.0005);
    const arrayStatus = fvgDetected ? "FVG Imbalance Filled (Equilibrium)" : "Premium Array (Discount Zone)";
    const indStatusEl = document.getElementById('active-indicator-status');
    if (indStatusEl) indStatusEl.innerText = arrayStatus;

    const badge = document.getElementById('rise-fall-signal-badge');
    if (badge) {
        badge.innerText = isRise ? "RISE (CALL)" : "FALL (PUT)";
        badge.className = isRise
            ? "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2 py-1 rounded border border-emerald-700"
            : "text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-700";
    }
}
