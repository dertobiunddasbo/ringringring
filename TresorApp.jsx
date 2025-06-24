import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';

const linkedPairs = new Map();

export default function TresorApp() {
  const [userId, setUserId] = useState(uuidv4().slice(0, 6));
  const [userCode, setUserCode] = useState([4, 7]);
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const partnerFromURL = urlParams.get('partner');
    if (partnerFromURL) {
      setPartnerCode(partnerFromURL);
    }
  }, []);

  function handleLinkPartner() {
    if (!partnerCode) return;
    if (partnerCode === userId) {
      setError('❌ Du kannst deinen eigenen Code nicht als Partner verwenden.');
      return;
    }
    linkedPairs.set(userId, partnerCode);
    linkedPairs.set(partnerCode, userId);
    setPartnerConfirmed(true);
    setError('');
  }

  function copyCode() {
    const link = `${window.location.origin}?partner=${userId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareLink = `${window.location.origin}?partner=${userId}`;
  const isLinked = linkedPairs.has(userId);

  return (
    <div
      className="min-h-screen p-6 bg-black flex items-center justify-center animate-fade-in"
      style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Olympiastadion_Berlin.jpg/640px-Olympiastadion_Berlin.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full max-w-md bg-black/90 text-white shadow-2xl rounded-3xl p-6 space-y-6 border border-white/10 backdrop-blur animate-slide-up">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Ring_Logo_2020.svg/512px-Ring_Logo_2020.svg.png" alt="Ring Logo" className="h-6 mb-2" />

        <h1 className="text-4xl font-extrabold text-center tracking-tight uppercase text-white drop-shadow-md">Tresor Code</h1>

        <div className="text-sm text-gray-300 text-center leading-snug">
          Zeige deinem Teampartner diesen QR-Code oder teile den Link – <br />
          wenn er ihn scannt, wird dein Code automatisch übernommen.
        </div>

        <div className="text-center space-y-3">
          <p className="text-white text-sm font-medium">Dein persönlicher Code:</p>
          <div className="font-mono text-2xl bg-white/10 inline-block px-6 py-3 rounded-xl shadow-inner tracking-widest animate-pulse backdrop-blur-sm">{userId}</div>
          <div className="mx-auto mt-2 bg-white p-3 inline-block rounded-xl shadow-lg">
            <QRCode value={shareLink} size={128} fgColor="#000000" bgColor="#ffffff" />
          </div>
          <button
            onClick={copyCode}
            className="mt-2 text-xs text-[#1991eb] underline hover:text-white"
          >
            {copied ? '✔️ Link kopiert' : '🔗 Link kopieren'}
          </button>
        </div>

        <div className="p-5 rounded-2xl text-center border border-white/20 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: "url('https://i.imgur.com/HQqj3Lc.png')" }}>
          <p className="mb-1 font-semibold text-sm text-white bg-black/60 inline-block px-2 py-1 rounded">Dein Codefragment:</p>
          <p className="text-4xl font-mono tracking-widest text-white bg-black/70 inline-block px-4 py-2 rounded shadow-lg">
            {userCode[0]} {isLinked ? userCode[1] : '_'}
          </p>
        </div>

        <div className="text-left space-y-2">
          <label className="block text-sm font-semibold">Partnercode eingeben:</label>
          <input
            className="border border-white/20 bg-white/10 text-white px-4 py-2 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            type="text"
            placeholder="z. B. abc123"
            value={partnerCode}
            onChange={e => setPartnerCode(e.target.value)}
          />
          <button
            className="w-full py-3 bg-[#1991eb] hover:bg-[#0077cc] text-white font-bold rounded-xl transition duration-200"
            onClick={handleLinkPartner}
          >
            ✅ Partner verlinken
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {partnerConfirmed && (
          <div className="p-4 bg-green-600/90 text-center rounded-xl font-medium text-white border border-green-300 animate-bounce">
            ✅ Partner bestätigt! Dein vollständiger Code lautet: <strong className="text-2xl">{userCode[0]}{userCode[1]}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
