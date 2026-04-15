// @ts-nocheck
import { useState, useEffect, useRef } from 'react';

const TRANSACTIONS = [
{ id: 1, type: 'pay', name: 'さくら食堂', amount: -850, date: '04/08 12:30', icon: '🍱' },
{ id: 2, type: 'charge', name: 'チャージ', amount: +3000, date: '04/07 10:00', icon: '⚡' },
{ id: 3, type: 'pay', name: 'まちの八百屋', amount: -420, date: '04/06 17:15', icon: '🥦' },
{ id: 4, type: 'pay', name: 'コミュニティカフェ', amount: -580, date: '04/05 09:45', icon: '☕' },
{ id: 5, type: 'charge', name: 'チャージ', amount: +5000, date: '04/01 11:00', icon: '⚡' },
];

function QRCode({ size = 160 }) {
const canvasRef = useRef(null);
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext('2d');
const modules = 21;
const cellSize = size / modules;
const pattern = [
[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
[1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
[1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,1,1,0,1],
[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
[1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
[1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1],
[0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
[1,0,1,0,1,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1],
[0,1,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,1,0,1,0],
[1,0,1,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1],
[0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1,1,1],
[1,0,0,0,0,0,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
[1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,1,1,0,1],
[1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1],
[1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,1,1,0,1],
[1,0,0,0,0,0,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
[1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1,1,1],
];
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, size, size);
for (let r = 0; r < modules; r++) {
for (let c = 0; c < modules; c++) {
if (pattern[r][c]) {
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
}
}
}
}, [size]);
return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: 8 }} />;
}

function BalanceCard({ balance, onPay }) {
const [visible, setVisible] = useState(false);
useEffect(() => {
const t = setTimeout(() => setVisible(true), 100);
return () => clearTimeout(t);
}, []);
return (
<div style={{
background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #0f3460 100%)',
borderRadius: 24, padding: '28px 24px', margin: '0 0 20px 0',
position: 'relative', overflow: 'hidden',
boxShadow: '0 20px 60px rgba(15,52,96,0.4)',
transform: visible ? 'translateY(0)' : 'translateY(20px)',
opacity: visible ? 1 : 0,
transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
}}>
<div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(229,57,53,0.12)' }} />
<div style={{ position: 'absolute', bottom: -30, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(229,57,53,0.08)' }} />
<div style={{ position: 'relative' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: 1 }}>まち地域通貨</span>
<span style={{ background: 'rgba(229,57,53,0.9)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>● MACHI</span>
</div>
<div style={{ marginBottom: 4 }}>
<span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>残高</span>
</div>
<div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
<span style={{ color: '#fff', fontSize: 48, fontWeight: 700, letterSpacing: -1 }}>{balance.toLocaleString()}</span>
<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>円</span>
</div>
<button onClick={onPay} style={{
background: '#e53935', color: '#fff', border: 'none', borderRadius: 14,
padding: '14px 0', width: '100%', fontSize: 16, fontWeight: 700,
cursor: 'pointer', letterSpacing: 2,
boxShadow: '0 8px 24px rgba(229,57,53,0.4)',
}}>
💳 支払う
</button>
</div>
</div>
);
}

function PaymentModal({ balance, onClose, onPay }) {
const [amount, setAmount] = useState('');
const [step, setStep] = useState('input');
const [countdown, setCountdown] = useState(60);

useEffect(() => {
if (step !== 'qr') return;
const t = setInterval(() => {
setCountdown(c => {
if (c <= 1) { clearInterval(t); setStep('done'); return 0; }
return c - 1;
});
}, 1000);
return () => clearInterval(t);
}, [step]);

const numPad = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

const handleKey = (k) => {
if (k === '⌫') setAmount(a => a.slice(0, -1));
else if (k === '') return;
else if (amount.length < 6) setAmount(a => a + k);
};

return (
<div style={{
position: 'fixed', inset: 0,
background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
zIndex: 100,
}} onClick={e => e.target === e.currentTarget && onClose()}>
<div style={{
background: '#f8f7f4', borderRadius: '28px 28px 0 0',
width: '100%', maxWidth: 430, padding: '20px 24px 40px',
}}>
<div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 20px' }} />

  
{step === 'input' && (
<>
<h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center', color: '#1a1a2e' }}>支払い金額を入力</h2>
<div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 20, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
<div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>金額</div>
<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
<span style={{ fontSize: 40, fontWeight: 700, color: amount ? '#1a1a2e' : '#ddd' }}>{amount || '0'}</span>
<span style={{ fontSize: 18, color: '#999' }}>円</span>
</div>
<div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>残高 {balance.toLocaleString()} 円</div>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
{numPad.map((k, i) => (
<button key={i} onClick={() => handleKey(k)} style={{
padding: '18px 0',
background: k === '⌫' ? '#ffe5e5' : k === '' ? 'transparent' : '#fff',
border: 'none', borderRadius: 14,
fontSize: k === '⌫' ? 18 : 22, fontWeight: 600,
color: k === '⌫' ? '#e53935' : '#1a1a2e',
cursor: k === '' ? 'default' : 'pointer',
boxShadow: k === '' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
}}>{k}</button>
))}
</div>
<button
disabled={!amount || parseInt(amount) === 0 || parseInt(amount) > balance}
onClick={() => setStep('qr')}
style={{
width: '100%', padding: '16px 0',
background: amount && parseInt(amount) > 0 && parseInt(amount) <= balance ? '#e53935' : '#ddd',
color: '#fff', border: 'none', borderRadius: 16,
fontSize: 16, fontWeight: 700, cursor: 'pointer',
}}>QRコードを表示</button>
</>
)}

{step === 'qr' && (
<div style={{ textAlign: 'center' }}>
<h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#1a1a2e' }}>QRコードを提示</h2>
<p style={{ color: '#999', fontSize: 13, marginBottom: 20 }}>お店のスキャナーにかざしてください</p>
<div style={{ background: '#fff', borderRadius: 20, padding: 20, display: 'inline-block', marginBottom: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
<QRCode size={180} />
</div>
<div style={{ background: '#fff0f0', borderRadius: 14, padding: '12px 20px', marginBottom: 20, display: 'inline-block' }}>
<span style={{ color: '#e53935', fontSize: 28, fontWeight: 700 }}>¥ {parseInt(amount).toLocaleString()}</span>
</div>
<div style={{ marginBottom: 20 }}>
<div style={{
width: 48, height: 48, borderRadius: '50%',
background: countdown > 20 ? '#e53935' : '#ff7043',
color: '#fff', fontSize: 20, fontWeight: 700,
display: 'flex', alignItems: 'center', justifyContent: 'center',
margin: '0 auto 6px',
}}>{countdown}</div>
<div style={{ color: '#999', fontSize: 12 }}>秒後に失効</div>
</div>
<button onClick={onClose} style={{
width: '100%', padding: '14px 0',
background: 'transparent', color: '#999',
border: '1.5px solid #ddd', borderRadius: 14,
fontSize: 15, cursor: 'pointer',
}}>キャンセル</button>
</div>
)}

{step === 'done' && (
<div style={{ textAlign: 'center', padding: '20px 0' }}>
<div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
<h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>支払い完了</h2>
<p style={{ color: '#666', marginBottom: 8 }}>¥{parseInt(amount).toLocaleString()} を支払いました</p>
<p style={{ color: '#999', fontSize: 13, marginBottom: 28 }}>新残高: {(balance - parseInt(amount)).toLocaleString()} 円</p>
<button onClick={() => { onPay(parseInt(amount)); onClose(); }} style={{
width: '100%', padding: '16px 0',
background: '#e53935', color: '#fff',
border: 'none', borderRadius: 16,
fontSize: 16, fontWeight: 700, cursor: 'pointer',
}}>閉じる</button>
</div>
)}
</div>
</div>

);
}

export default function App() {
const [balance, setBalance] = useState(6150);
const [showPay, setShowPay] = useState(false);
const [activeTab, setActiveTab] = useState('home');

return (
<div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#f0ede8', fontFamily: 'sans-serif', position: 'relative' }}>
<div style={{ background: '#0f3460', padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
<span>9:41</span>
<span>📶 🔋</span>
</div>

<div style={{ background: '#0f3460', padding: '12px 20px 24px', color: '#fff' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<div>
<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>こんにちは</div>
<div style={{ fontSize: 18, fontWeight: 700 }}>田中 さくら さん</div>
</div>
<div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e53935, #ff7043)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌸</div>
</div>
</div>

<div style={{ padding: '20px 16px 100px' }}>
<BalanceCard balance={balance} onPay={() => setShowPay(true)} />

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
{[
{ icon: '📤', label: '送金' },
{ icon: '⚡', label: 'チャージ' },
{ icon: '📋', label: '履歴' },
].map((action, i) => (
<button key={i} style={{ background: '#fff', border: 'none', borderRadius: 16, padding: '16px 8px', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
<div style={{ fontSize: 26, marginBottom: 6 }}>{action.icon}</div>
<div style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>{action.label}</div>
</button>
))}
</div>

<div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>最近の取引</h3>
<span style={{ fontSize: 12, color: '#e53935', cursor: 'pointer' }}>すべて見る</span>
</div>

<div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
{TRANSACTIONS.map((tx, i) => (
<div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
<div style={{ width: 42, height: 42, borderRadius: 14, background: tx.type === 'charge' ? '#e8f5e9' : '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginRight: 12, flexShrink: 0 }}>{tx.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{tx.name}</div>
<div style={{ fontSize: 11, color: '#bbb' }}>{tx.date}</div>
</div>
<div style={{ fontSize: 16, fontWeight: 700, color: tx.amount > 0 ? '#43a047' : '#1a1a2e' }}>
{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}円
</div>
</div>
))}
</div>
</div>

<div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-around', padding: '10px 0 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
{[
{ icon: '🏠', label: 'ホーム', id: 'home' },
{ icon: '💳', label: '支払い', id: 'pay', action: () => setShowPay(true) },
{ icon: '🏪', label: 'お店', id: 'shops' },
{ icon: '👤', label: 'マイページ', id: 'profile' },
].map(tab => (
<button key={tab.id} onClick={() => { setActiveTab(tab.id); tab.action && tab.action(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab.id ? '#e53935' : '#bbb' }}>
<span style={{ fontSize: 22 }}>{tab.icon}</span>
<span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
</button>
))}
</div>

{showPay && (
<PaymentModal
balance={balance}
onClose={() => setShowPay(false)}
onPay={(amount) => setBalance(b => b - amount)}
/>
)}
</div>

);
}
