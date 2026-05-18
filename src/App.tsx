// @ts-nocheck
import { useState, useEffect, useRef } from 'react';

// ===== localStorage SYNC =====
const STORAGE_KEY_NOTICES = 'yellca_notices';
const STORAGE_KEY_COUPONS = 'yellca_coupons';

const loadFromStorage = (key, fallback) => {
try {
const d = localStorage.getItem(key);
return d ? JSON.parse(d) : fallback;
} catch(e) { return fallback; }
};

// ===== DATA =====
const COUPONS = [
{ id: 1, shop: 'スーパー樋口', category: '食品スーパー', title: '200円引きクーポン', desc: '1,000円以上のお買い物で', discount: '200円OFF', expire: '5/31まで', icon: '🛒', color: '#2e7d32', reason: '食品スーパーをよく利用されています', used: false, saved: true, event: false },
{ id: 2, shop: 'ガソリンスタンド柴田SS', category: 'ガソリンスタンド', title: 'ガソリン2円/L引き', desc: 'YELLCA払いで', discount: '2円/L引き', expire: '5/31まで', icon: '⛽', color: '#f57f17', reason: '車をお持ちの方向けクーポン', used: false, saved: false, event: false },
{ id: 3, shop: '柴山リフォーム', category: 'リフォーム', title: 'リフォーム見積り500pt', desc: '無料見積り依頼で', discount: '500pt還元', expire: '6/30まで', icon: '🏠', color: '#1565c0', reason: '不動産をご利用の方にお得情報', used: false, saved: false, event: false },
{ id: 4, shop: '山本ハウスクリーニング', category: 'ハウスクリーニング', title: '初回10%OFF', desc: 'YELLCA払いで', discount: '10%OFF', expire: '6/15まで', icon: '🧹', color: '#00838f', reason: '新生活応援クーポン', used: false, saved: false, event: false },
{ id: 5, shop: '伊藤電力', category: '電力小売', title: '電力切替で1,000pt', desc: '新規ご契約で', discount: '1,000pt', expire: '7/31まで', icon: '⚡', color: '#e65100', reason: 'LPガスご利用者向け特典', used: false, saved: false, event: false },
{ id: 6, shop: '春の感謝祭2026', category: 'イベント', title: '会場限定500円引き', desc: '展示会ご来場者限定', discount: '500円OFF', expire: '5/25まで', icon: '🎪', color: '#6a1b9a', reason: 'イベント限定クーポン', used: false, saved: false, event: true },
{ id: 7, shop: '地域農産物フェア', category: 'イベント', title: '農産物10%OFF', desc: '地域農家応援企画', discount: '10%OFF', expire: '5/20まで', icon: '🌾', color: '#558b2f', reason: 'イベント限定クーポン', used: false, saved: false, event: true },
];

const NOTICES = [
{ id: 1, title: 'LPガスご利用者様へ電力セット割のご案内', body: 'LPガスと電力をセットでご契約いただくと、毎月最大500円分のYELLCAをプレゼント！伊藤電力との組み合わせでさらにお得になります。この機会にぜひご検討ください。', icon: '⚡', color: '#e65100', tag: 'クロスセル', date: '5/8', target: 'LPガス利用者' },
{ id: 2, title: '春の農産物フェア開催のお知らせ', body: '地元農家さんが丹精込めて育てた旬の野菜・果物が大集合！YELLCA払いで10%還元。5月20日（土）開催。', icon: '🌾', color: '#558b2f', tag: 'イベント', date: '5/7', target: '食品スーパー利用者' },
{ id: 3, title: '家事支援サービス新登場', body: '忙しい毎日のお手伝いをします。掃除・洗濯・料理など、家事支援の山本がYELLCAでお得にご利用いただけます。初回体験無料！', icon: '🏡', color: '#00838f', tag: '新サービス', date: '5/6', target: '子育て世代' },
{ id: 4, title: '竹内ガソリンスタンド全店でYELLCA使えます！', body: '竹内ガソリンスタンド全店でYELLCAが使えるようになりました。YELLCA払いでリッター2円引き。ぜひご利用ください。', icon: '⛽', color: '#f57f17', tag: '新機能', date: '5/5', target: 'ガソリン利用者' },
{ id: 5, title: '柴山リフォーム相談会のご案内', body: '築年数の経ったお家のリフォームをお考えの方へ。柴山リフォームの無料相談会を開催中。ご成約でYELLCA5,000pt進呈！', icon: '🏠', color: '#1565c0', tag: 'キャンペーン', date: '5/3', target: '不動産利用者' },
{ id: 6, title: '葬儀の山岡｜事前相談会のご案内', body: '葬儀の山岡では、ご家族が安心して最期のお別れができるよう、事前相談会を随時開催しております。YELLCAをご利用のお客様には特別割引をご用意。どうぞお気軽にご相談ください。', icon: '🕊️', color: '#546e7a', tag: 'ご案内', date: '5/1', target: '全ユーザー' },
];

const TRANSACTIONS = [
{ id: 1, type: 'pay', name: 'スーパー樋口', amount: -1240, date: '05/08 12:30', icon: '🛒' },
{ id: 2, type: 'charge', name: 'チャージ', amount: +5000, date: '05/07 10:00', icon: '⚡' },
{ id: 3, type: 'pay', name: 'ガソリンスタンド柴田SS', amount: -3200, date: '05/06 17:15', icon: '⛽' },
{ id: 4, type: 'pay', name: '山本ハウスクリーニング', amount: -8000, date: '05/05 09:45', icon: '🧹' },
{ id: 5, type: 'charge', name: '電力契約特典', amount: +1000, date: '05/01 11:00', icon: '🎁' },
];

// ===== COLORS =====
const C = {
primary: '#2d6a4f',
primary2: '#1b4332',
accent: '#95d5b2',
accent2: '#d8f3dc',
amber: '#f4a261',
amber2: '#e76f51',
white: '#fff',
bg: '#f0f7f4',
text: '#1b4332',
textLight: '#52796f',
textMuted: '#95a89e',
card: '#ffffff',
border: '#d8f3dc',
};

// ===== QR COMPONENT =====
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
ctx.fillStyle = C.primary2;
ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
}
}
}
}, [size]);
return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: 8 }} />;
}

// ===== PAYMENT MODAL =====
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
<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}
onClick={e => e.target === e.currentTarget && onClose()}>
<div style={{ background: C.bg, borderRadius: '28px 28px 0 0', width: '100%', maxWidth: 430, padding: '20px 24px 40px' }}>
<div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
<button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.textMuted, padding: 0, marginRight: 8 }}>‹</button>
<div style={{ flex: 1, height: 4, background: '#ccc', borderRadius: 2, margin: '0 auto' }} />
<button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: C.textMuted, padding: 0, marginLeft: 8 }}>×</button>
</div>

    {step === 'input' && (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center', color: C.text, fontFamily: 'sans-serif' }}>支払い金額を入力</h2>
        <div style={{ background: C.white, borderRadius: 16, padding: '16px 20px', marginBottom: 20, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 4, fontFamily: 'sans-serif' }}>金額</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: amount ? C.text : '#ddd', fontFamily: 'sans-serif' }}>{amount || '0'}</span>
            <span style={{ fontSize: 18, color: C.textMuted, fontFamily: 'sans-serif' }}>円</span>
          </div>
          <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4, fontFamily: 'sans-serif' }}>残高 {balance.toLocaleString()} 円</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {numPad.map((k, i) => (
            <button key={i} onClick={() => handleKey(k)} style={{ padding: '18px 0', background: k === '⌫' ? '#ffe5e5' : k === '' ? 'transparent' : C.white, border: 'none', borderRadius: 14, fontSize: k === '⌫' ? 18 : 22, fontWeight: 600, color: k === '⌫' ? '#e53935' : C.text, cursor: k === '' ? 'default' : 'pointer', boxShadow: k === '' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)', fontFamily: 'sans-serif' }}>{k}</button>
          ))}
        </div>
        <button disabled={!amount || parseInt(amount) === 0 || parseInt(amount) > balance} onClick={() => setStep('qr')} style={{ width: '100%', padding: '16px 0', background: amount && parseInt(amount) > 0 && parseInt(amount) <= balance ? C.primary : '#ddd', color: C.white, border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>QRコードを表示</button>
      </>
    )}

    {step === 'qr' && (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: C.text, fontFamily: 'sans-serif' }}>QRコードを提示</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, fontFamily: 'sans-serif' }}>お店のスキャナーにかざしてください</p>
        <div style={{ background: C.white, borderRadius: 20, padding: 20, display: 'inline-block', marginBottom: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <QRCode size={180} />
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 14, padding: '12px 20px', marginBottom: 20, display: 'inline-block' }}>
          <span style={{ color: C.primary, fontSize: 28, fontWeight: 700, fontFamily: 'sans-serif' }}>¥ {parseInt(amount).toLocaleString()}</span>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: countdown > 20 ? C.primary : '#ff7043', color: C.white, fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontFamily: 'sans-serif' }}>{countdown}</div>
          <div style={{ color: C.textMuted, fontSize: 12, fontFamily: 'sans-serif' }}>秒後に失効</div>
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '14px 0', background: 'transparent', color: C.textMuted, border: '1.5px solid #ddd', borderRadius: 14, fontSize: 15, cursor: 'pointer', fontFamily: 'sans-serif' }}>キャンセル</button>
      </div>
    )}

    {step === 'done' && (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: 'sans-serif' }}>支払い完了</h2>
        <p style={{ color: C.textLight, fontFamily: 'sans-serif', marginBottom: 8 }}>¥{parseInt(amount).toLocaleString()} を支払いました</p>
        <p style={{ color: C.textMuted, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 28 }}>新残高: {(balance - parseInt(amount)).toLocaleString()} 円</p>
        <button onClick={() => { onPay(parseInt(amount)); onClose(); }} style={{ width: '100%', padding: '16px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>閉じる</button>
      </div>
    )}
  </div>
</div>

);
}

// ===== CHARGE MODAL =====
function ChargeModal({ onClose, onCharge }) {
const [step, setStep] = useState('select');
const [amount, setAmount] = useState(0);
const [method, setMethod] = useState('bank');
const presets = [1000, 3000, 5000, 10000, 30000, 50000];
const methods = [
{ id: 'bank', label: '銀行振込', icon: '🏦', desc: '地域銀行から振込' },
{ id: 'card', label: 'クレジットカード', icon: '💳', desc: 'VISA / Mastercard' },
{ id: 'cash', label: '窓口現金', icon: '💴', desc: '各営業所にて受付' },
{ id: 'coupon', label: '紙商品券', icon: '🎫', desc: '既存商品券をデジタル化' },
];

return (
<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}
onClick={e => e.target === e.currentTarget && onClose()}>
<div style={{ background: C.bg, borderRadius: '28px 28px 0 0', width: '100%', maxWidth: 430, padding: '20px 24px 40px', maxHeight: '85vh', overflowY: 'auto' }}>
<div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
<button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.textMuted, padding: 0, marginRight: 8 }}>‹</button>
<div style={{ flex: 1, height: 4, background: '#ccc', borderRadius: 2, margin: '0 auto' }} />
<button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: C.textMuted, padding: 0, marginLeft: 8 }}>×</button>
</div>

    {step === 'select' && (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center', color: C.text, fontFamily: 'sans-serif' }}>チャージ</h2>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.textLight, fontWeight: 700, marginBottom: 10, fontFamily: 'sans-serif' }}>金額を選択</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {presets.map(p => (
              <button key={p} onClick={() => setAmount(p)} style={{ padding: '14px 0', background: amount === p ? C.primary : C.white, color: amount === p ? C.white : C.text, border: `2px solid ${amount === p ? C.primary : C.border}`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.15s' }}>
                ¥{p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.textLight, fontWeight: 700, marginBottom: 10, fontFamily: 'sans-serif' }}>入金方法</div>
          {methods.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: method === m.id ? '#e8f5e9' : C.white, border: `2px solid ${method === m.id ? C.primary : C.border}`, borderRadius: 14, marginBottom: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: 'sans-serif' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif' }}>{m.desc}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? C.primary : '#ccc'}`, background: method === m.id ? C.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {method === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.white }} />}
              </div>
            </div>
          ))}
        </div>

        <button disabled={amount === 0} onClick={() => setStep('confirm')} style={{ width: '100%', padding: '16px 0', background: amount > 0 ? C.primary : '#ddd', color: C.white, border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: amount > 0 ? 'pointer' : 'not-allowed', fontFamily: 'sans-serif' }}>
          確認画面へ
        </button>
      </>
    )}

    {step === 'confirm' && (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center', color: C.text, fontFamily: 'sans-serif' }}>チャージ確認</h2>
        <div style={{ background: C.white, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          {[
            { label: 'チャージ金額', value: `¥${amount.toLocaleString()}` },
            { label: '入金方法', value: methods.find(m => m.id === method)?.label },
            { label: '手数料', value: '無料' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontFamily: 'sans-serif' }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>合計チャージ額</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>¥{amount.toLocaleString()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setStep('select')} style={{ flex: 1, padding: '14px 0', background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, cursor: 'pointer', color: C.textLight, fontFamily: 'sans-serif' }}>戻る</button>
          <button onClick={() => { onCharge(amount); setStep('done'); }} style={{ flex: 2, padding: '14px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>チャージする</button>
        </div>
      </>
    )}

    {step === 'done' && (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: 'sans-serif' }}>チャージ完了</h2>
        <p style={{ color: C.textLight, fontFamily: 'sans-serif', marginBottom: 28 }}>¥{amount.toLocaleString()} をチャージしました</p>
        <button onClick={onClose} style={{ width: '100%', padding: '16px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>閉じる</button>
      </div>
    )}
  </div>
</div>

);
}

// ===== HOME SCREEN =====
function HomeScreen({ balance, onPay, onCharge, isNewUser }) {
const newUserTransactions = [
{ id: 1, type: 'charge', name: '新規登録特典', amount: +500, date: '本日', icon: '🎁' },
];
const transactions = isNewUser ? newUserTransactions : TRANSACTIONS;
return (
<div style={{ padding: '16px 16px 100px' }}>
{/* Balance Card */}
<div style={{ background: `linear-gradient(135deg, ${C.primary2} 0%, ${C.primary} 60%, #40916c 100%)`, borderRadius: 24, padding: '24px 20px', marginBottom: 16, position: 'relative', overflow: 'hidden', boxShadow: '0 12px 40px rgba(27,67,50,0.35)' }}>
<div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(149,213,178,0.15)' }} />
<div style={{ position: 'absolute', bottom: -20, left: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(149,213,178,0.08)' }} />
<div style={{ position: 'relative' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1 }}>YELLCA（エルカ）</span>
<span style={{ background: 'rgba(149,213,178,0.3)', color: C.accent, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontFamily: 'sans-serif', border: '1px solid rgba(149,213,178,0.5)' }}>● YELLCA</span>
</div>
<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, fontFamily: 'sans-serif' }}>残高</div>
<div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
<span style={{ color: C.white, fontSize: 46, fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: -1 }}>{balance.toLocaleString()}</span>
<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, fontFamily: 'sans-serif' }}>円</span>
</div>
<div style={{ display: 'flex', gap: 10 }}>
<button onClick={onPay} style={{ flex: 1, padding: '13px 0', background: C.amber, color: C.white, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', boxShadow: '0 4px 16px rgba(244,162,97,0.4)' }}>💳 支払う</button>
<button onClick={onCharge} style={{ flex: 1, padding: '13px 0', background: 'rgba(255,255,255,0.15)', color: C.white, border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>⚡ チャージ</button>
</div>
</div>
</div>

  {/* Quick actions */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
    {[
      { icon: '📋', label: '履歴' },
      { icon: '🎁', label: 'クーポン' },
      { icon: '📢', label: 'お知らせ' },
      { icon: '👤', label: 'マイページ' },
    ].map((a, i) => (
      <button key={i} style={{ background: C.white, border: 'none', borderRadius: 16, padding: '14px 8px', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, fontFamily: 'sans-serif' }}>{a.label}</div>
      </button>
    ))}
  </div>

  {/* Notice banner */}
  <div style={{ background: `linear-gradient(135deg, ${C.primary}, #40916c)`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
    <span style={{ fontSize: 24 }}>🌾</span>
    <div>
      <div style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 2 }}>春の農産物フェア開催中！</div>
      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'sans-serif' }}>YELLCA払いで10%還元　5/20（土）まで</div>
    </div>
  </div>

  {/* Transactions */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: 'sans-serif' }}>最近の取引</h3>
    <span style={{ fontSize: 12, color: C.primary, cursor: 'pointer', fontFamily: 'sans-serif' }}>すべて見る</span>
  </div>
  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
    {transactions.map((tx, i) => (
      <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === 'charge' ? '#e8f5e9' : '#fff8e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 12, flexShrink: 0 }}>{tx.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: 'sans-serif', marginBottom: 2 }}>{tx.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif' }}>{tx.date}</div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: tx.amount > 0 ? C.primary : C.text, fontFamily: 'sans-serif' }}>
          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}円
        </div>
      </div>
    ))}
  </div>
</div>

);
}

// ===== COUPON SCREEN =====
function CouponScreen() {
const [filter, setFilter] = useState('すべて');
const [coupons, setCoupons] = useState(COUPONS);
const [flipped, setFlipped] = useState(null);

useEffect(() => {
const stored = loadFromStorage(STORAGE_KEY_COUPONS, []);
if (stored.length > 0) setCoupons([...stored, ...COUPONS]);
const interval = setInterval(() => {
const latest = loadFromStorage(STORAGE_KEY_COUPONS, []);
if (latest.length > 0) setCoupons([...latest, ...COUPONS]);
}, 2000);
return () => clearInterval(interval);
}, []);
const categories = ['すべて', 'イベント', '食品スーパー', 'ガソリンスタンド', 'リフォーム', '電力小売'];

const filtered = filter === 'すべて' ? coupons : coupons.filter(c => c.category === filter);

return (
<div style={{ padding: '16px 16px 100px' }}>
{/* Event banner */}
<div style={{ background: 'linear-gradient(135deg, #6a1b9a, #9c27b0)', borderRadius: 18, padding: '16px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
<div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
<div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 4 }}>🎪 開催中イベント</div>
<div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 8 }}>春の感謝祭2026</div>
<div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'sans-serif', marginBottom: 12 }}>ご来場者限定クーポン配布中！5/25まで</div>
<div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', display: 'inline-block', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif' }}>クーポンを受け取る →</div>
</div>

  {/* AI banner */}
  <div style={{ background: `linear-gradient(135deg, ${C.primary2}, ${C.primary})`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
    <span style={{ fontSize: 22 }}>🤖</span>
    <div>
      <div style={{ color: C.white, fontSize: 12, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 1 }}>AIがあなたに合わせて選びました</div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'sans-serif' }}>ご利用履歴から{filtered.filter(c => !c.used).length}枚のクーポンをピックアップ</div>
    </div>
  </div>

  {/* Category filter */}
  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
    {categories.map(cat => (
      <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: filter === cat ? C.primary : C.white, color: filter === cat ? C.white : C.textLight, fontSize: 12, fontWeight: filter === cat ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'sans-serif', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>{cat}</button>
    ))}
  </div>

  {/* Coupon list */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {filtered.map(coupon => (
      <div key={coupon.id} onClick={() => !coupon.used && setFlipped(flipped === coupon.id ? null : coupon.id)} style={{ borderRadius: 18, overflow: 'hidden', cursor: coupon.used ? 'default' : 'pointer', opacity: coupon.used ? 0.6 : 1 }}>
        {flipped !== coupon.id ? (
          <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ background: coupon.color, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{coupon.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'sans-serif' }}>{coupon.shop}</div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif' }}>{coupon.title}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif' }}>{coupon.discount}</div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.textLight, fontFamily: 'sans-serif', marginBottom: 3 }}>{coupon.desc}</div>
                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: 'sans-serif' }}>🤖 {coupon.reason}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: 'sans-serif', marginBottom: 4 }}>{coupon.expire}</div>
                {coupon.event && <span style={{ background: '#f3e5f5', color: '#6a1b9a', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontFamily: 'sans-serif', fontWeight: 700 }}>イベント限定</span>}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: coupon.color, borderRadius: 18, padding: 20, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'sans-serif', marginBottom: 6 }}>{coupon.shop} で提示</div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 14 }}>{coupon.title}</div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} style={{ width: i % 3 === 0 ? 3 : 1.5, height: i % 5 === 0 ? 36 : 26, background: C.primary2, borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'sans-serif' }}>タップして戻る</div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

);
}

// ===== GROUP POINTS SCREEN =====
function PointsScreen() {
const pointCards = [
{ id: 1, name: 'SRKポイント', org: 'ISHIKAWAグループ', points: 3240, expire: '2027/03/31', color: '#1565c0', rate: '1pt = 1円相当のYELLCAに交換可' },
{ id: 2, name: 'エネルギーポイント', org: '伊藤電力・ガス', points: 870, expire: '2026/12/31', color: '#e65100', rate: '100pt = 100円相当のYELLCAに交換可' },
];

return (
<div style={{ padding: '16px 16px 100px' }}>
<div style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
<span style={{ fontSize: 26 }}>💎</span>
<div>
<div style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 2 }}>グループポイント</div>
<div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'sans-serif' }}>ポイントをYELLCAに交換してご利用いただけます</div>
</div>
</div>

  {pointCards.map(card => (
    <div key={card.id} style={{ background: C.white, borderRadius: 20, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 2 }}>{card.org}</div>
        <div style={{ color: C.white, fontSize: 16, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 8 }}>{card.name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ color: C.white, fontSize: 36, fontWeight: 700, fontFamily: 'sans-serif' }}>{card.points.toLocaleString()}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'sans-serif' }}>pt</span>
        </div>
      </div>
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: C.textMuted, fontFamily: 'sans-serif' }}>有効期限</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: 'sans-serif' }}>{card.expire}</span>
        </div>
        <div style={{ background: '#f0f7f4', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, fontFamily: 'sans-serif' }}>🔄 {card.rate}</div>
        </div>
        <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 14, marginBottom: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif', marginBottom: 8 }}>バーコード</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, marginBottom: 6 }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} style={{ width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1, height: i % 7 === 0 ? 44 : 36, background: '#1a1a2e' }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif', letterSpacing: 2 }}>4521-8834-{card.id}291-0042</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '12px 0', background: card.color, color: C.white, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>YELLCAに交換</button>
          <button style={{ flex: 1, padding: '12px 0', background: '#f0f7f4', color: C.primary, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>履歴を見る</button>
        </div>
      </div>
    </div>
  ))}
</div>

);
}

// ===== BENEFITS SCREEN =====
function BenefitsScreen() {
const [received, setReceived] = useState([]);
const benefits = [
{ id: 1, title: 'LPガス新規契約特典', org: '伊藤エネルギー', amount: 3000, desc: 'LPガス新規ご契約のお客様に3,000円分のYELLCAをプレゼント', icon: '🔥', color: '#e65100', available: true, expire: '2026/06/30' },
{ id: 2, title: '電力切替特典', org: '伊藤電力', amount: 2000, desc: '電力をご契約いただいたお客様に2,000円分のYELLCAをプレゼント', icon: '⚡', color: '#f57f17', available: true, expire: '2026/07/31' },
{ id: 3, title: 'リフォーム成約特典', org: '柴山リフォーム', amount: 5000, desc: 'リフォーム工事ご成約のお客様に5,000円分のYELLCAをプレゼント', icon: '🏠', color: '#1565c0', available: false, expire: '受取済み' },
{ id: 4, title: '地域銀行口座開設特典', org: 'OWAバンク', amount: 1000, desc: '提携銀行の口座開設で1,000円分のYELLCAをプレゼント', icon: '🏦', color: '#2e7d32', available: true, expire: '2026/12/31' },
{ id: 5, title: '家事支援サービス初回特典', org: '家事支援の山本', amount: 500, desc: '家事支援サービス初回ご利用で500円分のYELLCAをプレゼント', icon: '🏡', color: '#00838f', available: true, expire: '2026/08/31' },
];

return (
<div style={{ padding: '16px 16px 100px' }}>
<div style={{ background: `linear-gradient(135deg, ${C.amber2}, ${C.amber})`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
<span style={{ fontSize: 26 }}>🎁</span>
<div>
<div style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 2 }}>契約・利用特典</div>
<div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'sans-serif' }}>各事業のご契約・ご利用でYELLCAがもらえます</div>
</div>
</div>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
    <div style={{ background: C.white, borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif', marginBottom: 4 }}>受取可能な特典</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, fontFamily: 'sans-serif' }}>{benefits.filter(b => b.available && !received.includes(b.id)).length}件</div>
    </div>
    <div style={{ background: C.white, borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif', marginBottom: 4 }}>受取可能額合計</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.amber2, fontFamily: 'sans-serif' }}>¥{benefits.filter(b => b.available && !received.includes(b.id)).reduce((s, b) => s + b.amount, 0).toLocaleString()}</div>
    </div>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {benefits.map(benefit => {
      const isReceived = received.includes(benefit.id) || !benefit.available;
      return (
        <div key={benefit.id} style={{ background: C.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', opacity: isReceived ? 0.7 : 1 }}>
          <div style={{ background: `linear-gradient(135deg, ${benefit.color}, ${benefit.color}aa)`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{benefit.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'sans-serif' }}>{benefit.org}</div>
              <div style={{ color: C.white, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif' }}>{benefit.title}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 12px', color: C.white, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif' }}>¥{benefit.amount.toLocaleString()}</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: C.textLight, fontFamily: 'sans-serif', lineHeight: 1.6, marginBottom: 12 }}>{benefit.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif' }}>期限：{benefit.expire}</span>
              {isReceived ? (
                <span style={{ background: '#f0f7f4', color: C.primary, fontSize: 12, padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontFamily: 'sans-serif' }}>✓ 受取済み</span>
              ) : (
                <button onClick={() => setReceived(prev => [...prev, benefit.id])} style={{ background: benefit.color, color: C.white, border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>受け取る</button>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

);
}

// ===== NOTICE SCREEN =====
function NoticeScreen() {
const [selected, setSelected] = useState(null);
const [notices, setNotices] = useState(NOTICES);

useEffect(() => {
    fetch('http://18.183.91.57:3000/api/notices')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setNotices([...data, ...NOTICES]);
        }
      })
      .catch(err => {
        console.log('API接続失敗、ローカルデータを使用:', err);
      });
  }, []);

return (
<div style={{ padding: '16px 16px 100px' }}>
{/* Personalize banner */}
<div style={{ background: `linear-gradient(135deg, ${C.amber2}, ${C.amber})`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
<span style={{ fontSize: 26 }}>✨</span>
<div>
<div style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 2 }}>あなたの利用状況から厳選</div>
<div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'sans-serif' }}>LPガス・食品スーパーご利用の方向けお知らせ</div>
</div>
</div>

  {/* Usage summary */}
  <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10, fontFamily: 'sans-serif' }}>あなたのご利用サービス</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {['LPガス', '食品スーパー', 'ガソリンスタンド'].map(s => (
        <span key={s} style={{ background: '#e8f5e9', color: C.primary, fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 600, fontFamily: 'sans-serif' }}>{s}</span>
      ))}
    </div>
  </div>

  {/* Notice list */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {notices.map(notice => (
      <div key={notice.id} onClick={() => setSelected(selected === notice.id ? null : notice.id)} style={{ background: C.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer', border: notice.isNew ? `2px solid ${C.primary}` : 'none' }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${notice.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{notice.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {notice.isNew && <span style={{ background: C.primary, color: C.white, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, fontFamily: 'sans-serif' }}>NEW</span>}
                <span style={{ background: `${notice.color}18`, color: notice.color, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, fontFamily: 'sans-serif' }}>{notice.tag}</span>
                <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'sans-serif' }}>{notice.date}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'sans-serif', lineHeight: 1.4 }}>{notice.title}</div>
            </div>
          </div>
          {selected === notice.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 13, color: C.textLight, lineHeight: 1.7, fontFamily: 'sans-serif', marginBottom: 12 }}>{notice.body}</p>
              <button style={{ background: notice.color, color: C.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>くわしく見る →</button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

);
}

// ===== MAIN APP =====
// ===== LOGIN SCREEN =====
function LoginScreen({ onLogin, testUser }) {
const [mode, setMode] = useState('login');
const [step, setStep] = useState(1);
const [error, setError] = useState('');
const [form, setForm] = useState({
name: '', phone: '', email: '', password: '',
address: '', services: [],
});

const services = [
{ id: 'lpgas', label: 'LPガス', icon: '🔥' },
{ id: 'electric', label: '電力', icon: '⚡' },
{ id: 'realestate', label: '不動産', icon: '🏘️' },
{ id: 'super', label: '食品スーパー', icon: '🛒' },
{ id: 'gas_stand', label: 'ガソリンスタンド', icon: '⛽' },
{ id: 'reform', label: 'リフォーム', icon: '🏠' },
{ id: 'cleaning', label: 'ハウスクリーニング', icon: '🧹' },
{ id: 'housework', label: '家事支援', icon: '🏡' },
{ id: 'funeral', label: '葬祭', icon: '🕊️' },
];

const toggleService = (id) => {
setForm(f => ({
...f,
services: f.services.includes(id)
? f.services.filter(s => s !== id)
: [...f.services, id],
}));
};

return (
<div style={{ minHeight: '100vh', background: C.primary2, display: 'flex', flexDirection: 'column' }}>
<style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::placeholder { color: rgba(255,255,255,0.3); }`}</style>

  {/* Logo area */}
  <div style={{ padding: '60px 32px 40px', textAlign: 'center' }}>
    <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #40916c, #2d6a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', fontSize: 40 }}>🌿</div>
    <div style={{ color: C.accent, fontSize: 28, fontWeight: 700, letterSpacing: 4, marginBottom: 6 }}>YELLCA</div>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>エルカ　地域をつなぐ、暮らしを豊かに</div>
  </div>

  {/* Form area */}
  <div style={{ flex: 1, background: C.bg, borderRadius: '28px 28px 0 0', padding: '28px 24px 40px', overflowY: 'auto' }}>

    {/* Tab */}
    <div style={{ display: 'flex', background: '#e8f5e9', borderRadius: 14, padding: 4, marginBottom: 24 }}>
      {['login', 'register'].map(m => (
        <button key={m} onClick={() => { setMode(m); setStep(1); }} style={{ flex: 1, padding: '10px 0', background: mode === m ? C.white : 'transparent', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: mode === m ? 700 : 400, color: mode === m ? C.primary : C.textMuted, cursor: 'pointer' }}>
          {m === 'login' ? 'ログイン' : '新規登録'}
        </button>
      ))}
    </div>

    {mode === 'login' && (
      <>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.textLight, fontWeight: 700, marginBottom: 6 }}>電話番号またはメールアドレス</div>
          <input placeholder="090-0000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={{ width: '100%', padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 15, outline: 'none', background: C.white, color: C.text }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.textLight, fontWeight: 700, marginBottom: 6 }}>パスワード</div>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ width: '100%', padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 15, outline: 'none', background: C.white, color: C.text }} />
        </div>
        <button onClick={() => {
          if (form.phone === testUser.id && form.password === testUser.pass) {
            setError('');
            onLogin(testUser.name);
          } else {
            setError('IDまたはパスワードが正しくありません');
          }
        }} style={{ width: '100%', padding: '16px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 14, boxShadow: '0 4px 16px rgba(45,106,79,0.3)' }}>ログイン</button>
        {error && <div style={{ color: '#e53935', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>{error}</div>}
        <div style={{ textAlign: 'center', fontSize: 13, color: C.primary, cursor: 'pointer' }}>パスワードをお忘れの方</div>
      </>
    )}

    {mode === 'register' && step === 1 && (
      <>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 20, textAlign: 'center' }}>基本情報を入力してください</div>
        {[
          { label: 'お名前', key: 'name', placeholder: '山田 太郎' },
          { label: '電話番号', key: 'phone', placeholder: '090-0000-0000' },
          { label: 'メールアドレス', key: 'email', placeholder: 'example@email.com' },
          { label: 'パスワード', key: 'password', placeholder: '8文字以上', type: 'password' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.textLight, fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
            <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, outline: 'none', background: C.white, color: C.text }} />
          </div>
        ))}
        <button onClick={() => setStep(2)} style={{ width: '100%', padding: '16px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8, boxShadow: '0 4px 16px rgba(45,106,79,0.3)' }}>次へ</button>
      </>
    )}

    {mode === 'register' && step === 2 && (
      <>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 16, textAlign: 'center' }}>ご利用中のサービスを選択してください</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, textAlign: 'center' }}>選択したサービスに合わせたお得な情報をお届けします</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {services.map(s => (
            <div key={s.id} onClick={() => toggleService(s.id)} style={{ background: form.services.includes(s.id) ? '#e8f5e9' : C.white, border: `2px solid ${form.services.includes(s.id) ? C.primary : C.border}`, borderRadius: 14, padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: form.services.includes(s.id) ? C.primary : C.textLight }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px 0', background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, cursor: 'pointer', color: C.textLight }}>戻る</button>
          <button onClick={() => setStep(3)} style={{ flex: 2, padding: '14px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>次へ</button>
        </div>
      </>
    )}

    {mode === 'register' && step === 3 && (
      <>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6, textAlign: 'center' }}>あなたの価値観を教えてください</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, textAlign: 'center' }}>あてはまるものをすべて選択してください</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { id: 'cospa', label: 'コスパ重視', icon: '💰', desc: '価格・お得さを大切に' },
            { id: 'timpa', label: 'タイパ重視', icon: '⏱️', desc: '時間効率を大切に' },
            { id: 'sdgs', label: 'SDGs・環境', icon: '🌍', desc: '環境・社会貢献を意識' },
            { id: 'local', label: '地産地消', icon: '🌾', desc: '地元の産品を応援' },
            { id: 'health', label: '健康・安心', icon: '💪', desc: '健康・安全を最優先' },
            { id: 'family', label: '家族・子育て', icon: '👨‍👩‍👧', desc: '家族の暮らしを大切に' },
            { id: 'comfort', label: '快適・利便性', icon: '✨', desc: '便利で快適な生活' },
            { id: 'community', label: '地域貢献', icon: '🤝', desc: '地域のつながりを大切に' },
            { id: 'premium', label: 'プレミアム', icon: '👑', desc: '品質・ブランドを重視' },
            { id: 'simple', label: 'シンプル', icon: '🍃', desc: 'シンプルな暮らし' },
          ].map(v => (
            <div key={v.id} onClick={() => setForm(f => ({ ...f, values: f.values ? (f.values.includes(v.id) ? f.values.filter(x => x !== v.id) : [...f.values, v.id]) : [v.id] }))} style={{ background: (form.values || []).includes(v.id) ? '#e8f5e9' : C.white, border: `2px solid ${(form.values || []).includes(v.id) ? C.primary : C.border}`, borderRadius: 14, padding: '12px', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{v.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: (form.values || []).includes(v.id) ? C.primary : C.text }}>{v.label}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{v.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px 0', background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, cursor: 'pointer', color: C.textLight }}>戻る</button>
          <button onClick={() => setStep(4)} style={{ flex: 2, padding: '14px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>次へ</button>
        </div>
      </>
    )}

    {mode === 'register' && step === 4 && (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>登録完了！</h2>
        <p style={{ color: C.textLight, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>YELLCAへようこそ！</p>
        <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>新規登録特典として<br />500円分のYELLCAをプレゼント🎁</p>
        <div style={{ background: '#e8f5e9', borderRadius: 14, padding: '14px 20px', marginBottom: 28, display: 'inline-block' }}>
          <span style={{ color: C.primary, fontSize: 24, fontWeight: 700 }}>+500円</span>
        </div>
        <br />
        <button onClick={() => onLogin(form.name || 'ゲスト', true)} style={{ width: '100%', padding: '16px 0', background: C.primary, color: C.white, border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(45,106,79,0.3)' }}>
          YELLCAをはじめる
        </button>
      </div>
    )}
  </div>
</div>

);
}

// ===== MYPAGE SCREEN =====
function MyPageScreen({ onLogout }) {
const profile = {
name: '石原 ゆうや',
phone: '090-1234-5678',
email: 'yuya@example.com',
address: '○○県○○市○○町1-2-3',
services: ['LPガス', '食品スーパー', 'ガソリンスタンド'],
joined: '2025年10月1日',
totalPaid: 28400,
transactions: 24,
};

const menuItems = [
{ icon: '👤', label: 'プロフィール編集', sub: '名前・住所・連絡先' },
{ icon: '🔔', label: '通知設定', sub: 'お知らせ・クーポン配信' },
{ icon: '🔒', label: 'セキュリティ', sub: 'パスワード・生体認証' },
{ icon: '🏢', label: 'ご利用サービス設定', sub: '契約中のサービス管理' },
{ icon: '💳', label: '入金方法の管理', sub: 'クレカ・銀行口座' },
{ icon: '📋', label: '利用規約', sub: '' },
{ icon: '❓', label: 'よくある質問', sub: '' },
{ icon: '📞', label: 'お問い合わせ', sub: 'チャット・電話サポート' },
];

return (
<div style={{ padding: '16px 16px 100px' }}>
{/* Profile card */}
<div style={{ background: `linear-gradient(135deg, ${C.primary2}, ${C.primary})`, borderRadius: 20, padding: '20px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
<div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(149,213,178,0.1)' }} />
<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
<div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #40916c, #2d6a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '2px solid rgba(149,213,178,0.4)', flexShrink: 0 }}>🌸</div>
<div>
<div style={{ color: C.white, fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{profile.name}</div>
<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{profile.email}</div>
</div>
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
{[
{ label: '登録日', value: '2025/10/01' },
{ label: '取引回数', value: `${profile.transactions}回` },
{ label: '累計利用額', value: `¥${profile.totalPaid.toLocaleString()}` },
].map(item => (
<div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 4 }}>{item.label}</div>
<div style={{ color: C.white, fontSize: 13, fontWeight: 700 }}>{item.value}</div>
</div>
))}
</div>
</div>

  {/* Services */}
  <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>ご利用中のサービス</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {profile.services.map(s => (
        <span key={s} style={{ background: '#e8f5e9', color: C.primary, fontSize: 12, padding: '5px 12px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
      ))}
      <span style={{ background: '#f0f7f4', color: C.textMuted, fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer' }}>+ 追加</span>
    </div>
  </div>

  {/* Menu */}
  <div style={{ background: C.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 }}>
    {menuItems.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderBottom: i < menuItems.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</div>
          {item.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{item.sub}</div>}
        </div>
        <span style={{ color: C.textMuted, fontSize: 18 }}>›</span>
      </div>
    ))}
  </div>

  {/* Logout */}
  <button onClick={onLogout} style={{ width: '100%', padding: '16px 0', background: C.white, color: '#e53935', border: '1.5px solid #ffcdd2', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
    ログアウト
  </button>

  <div style={{ textAlign: 'center', marginTop: 16, color: C.textMuted, fontSize: 11 }}>
    YELLCA ver 1.0.0　©2026 ISHIKAWAグループ
  </div>
</div>

);
}

const TEST_USER = { id: '1234', pass: '1234', name: '石原 ゆうや' };

export default function App() {
return <UserApp />;
}

function UserApp() {
const [isLoggedIn, setIsLoggedIn] = useState(() => {
try { return localStorage.getItem('yellca_loggedin') === 'true'; } catch(e) { return false; }
});
const [userName, setUserName] = useState(() => {
try { return localStorage.getItem('yellca_username') || '石原 ゆうや'; } catch(e) { return '石原 ゆうや'; }
});
const [isNewUser, setIsNewUser] = useState(false);
const [balance, setBalance] = useState(6150);
const [showPay, setShowPay] = useState(false);
const [showCharge, setShowCharge] = useState(false);
const [activeTab, setActiveTab] = useState('home');

const tabs = [
{ id: 'home', icon: '🏠', label: 'ホーム' },
{ id: 'coupon', icon: '🎁', label: 'クーポン' },
{ id: 'notice', icon: '📢', label: 'お知らせ' },
{ id: 'points', icon: '💎', label: 'ポイント' },
{ id: 'mypage', icon: '👤', label: 'マイページ' },
];

const handleLogin = (name, newUser = false) => {
if (name) {
setUserName(name);
try { localStorage.setItem('yellca_username', name); } catch(e) {}
}
setIsNewUser(newUser);
if (newUser) setBalance(500);
setIsLoggedIn(true);
try { localStorage.setItem('yellca_loggedin', 'true'); } catch(e) {}
};

if (!isLoggedIn) {
return <LoginScreen onLogin={handleLogin} testUser={TEST_USER} />;
}

return (
<div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: C.bg, fontFamily: 'sans-serif', position: 'relative' }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

  {/* Status bar */}
  <div style={{ background: C.primary2, padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
    <span>9:41</span><span>📶 🔋</span>
  </div>

  {/* Header */}
  <div style={{ background: C.primary2, padding: '12px 20px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>こんにちは</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>{userName} さん</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, #40916c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid rgba(149,213,178,0.4)' }}>🌸</div>
    </div>
  </div>

  {/* Content */}
  {activeTab === 'home' && <HomeScreen balance={balance} onPay={() => setShowPay(true)} onCharge={() => setShowCharge(true)} isNewUser={isNewUser} />}
  {activeTab === 'coupon' && <CouponScreen />}
  {activeTab === 'notice' && <NoticeScreen />}
  {activeTab === 'points' && <PointsScreen />}
  {activeTab === 'benefits' && <BenefitsScreen />}
  {activeTab === 'mypage' && <MyPageScreen onLogout={() => { setIsLoggedIn(false); try { localStorage.removeItem('yellca_loggedin'); } catch(e) {} }} />}

  {/* Bottom Nav */}
  <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
    {tabs.map(tab => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab.id ? C.primary : C.textMuted }}>
        <span style={{ fontSize: 22 }}>{tab.icon}</span>
        <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400 }}>{tab.label}</span>
      </button>
    ))}
  </div>

  {showPay && <PaymentModal balance={balance} onClose={() => setShowPay(false)} onPay={amt => setBalance(b => b - amt)} />}
  {showCharge && <ChargeModal onClose={() => setShowCharge(false)} onCharge={amt => setBalance(b => b + amt)} />}
</div>

);
}