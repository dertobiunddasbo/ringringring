import { useState, useEffect } from 'react';

const linkedPairs = new Map();

function generateNumericId(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export default function TresorApp() {
  const [userId, setUserId] = useState(generateNumericId(5));
  const [userCode, setUserCode] = useState([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [pressedKey, setPressedKey] = useState(null);

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

  function handleKeypadInput(num) {
    if (partnerCode.length < 5) {
      setPartnerCode(prev => prev + num);
      setPressedKey(num);
      setTimeout(() => setPressedKey(null), 150);
    }
  }

  function handleDelete() {
    setPartnerCode(prev => prev.slice(0, -1));
    setPressedKey('del');
    setTimeout(() => setPressedKey(null), 150);
  }

  const isLinked = linkedPairs.has(userId);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-black flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md bg-black/90 text-white shadow-2xl rounded-3xl p-4 sm:p-6 space-y-6 border border-white/10 backdrop-blur animate-slide-up">
        <div className="flex justify-between items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Ring_logo.svg" alt="Ring Logo" className="h-8 sm:h-10" />
          <img src="/keypad.png" alt="Ring Pad" className="h-14 sm:h-20 ml-4 rounded" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight uppercase text-white drop-shadow-md">Tresor Code</h1>

        <div className="text-xs sm:text-sm text-gray-300 text-center leading-snug">
          Zeige deinem Teampartner diesen Zahlencode –<br />
          wenn er ihn nutzt, wird dein Code automatisch übernommen.
        </div>

        <div className="text-center space-y-2">
          <p className="text-white text-xs sm:text-sm font-medium">Dein persönlicher Zahlencode:</p>
          <div className="font-mono text-xl sm:text-2xl bg-white/10 inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-inner tracking-widest animate-pulse backdrop-blur-sm">{userId}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl text-center border border-white/20 bg-black/30">
          <p className="mb-1 font-semibold text-xs sm:text-sm text-white bg-black/60 inline-block px-2 py-1 rounded">Dein Codefragment:</p>
          <p className="text-3xl sm:text-4xl font-mono tracking-widest text-white bg-black/70 inline-block px-4 py-2 rounded shadow-lg">
            {userCode[0]} {isLinked ? userCode[1] : '_'}
          </p>
        </div>

        <div className="text-left space-y-2">
          <label className="block text-xs sm:text-sm font-semibold">Partner-Zahlencode eingeben:</label>
          <div className="flex justify-center mb-2">
            <div className="font-mono text-2xl bg-white/10 px-4 py-2 rounded-xl tracking-widest w-full text-center">{partnerCode}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => (
              <button
                key={idx}
                className={`bg-[#1991eb] hover:bg-[#0077cc] text-white py-2 rounded-xl text-xl font-bold transition transform duration-150 ${pressedKey === num ? 'scale-90 bg-white text-black' : ''}`}
                onClick={() => handleKeypadInput(num.toString())}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className={`col-span-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition transform duration-150 ${pressedKey === 'del' ? 'scale-90 bg-white text-black' : ''}`}
            >
              ⌫ Löschen
            </button>
          </div>
          <button
            className="w-full mt-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition duration-200 text-sm"
            onClick={handleLinkPartner}
          >
            ✅ Partner verlinken
          </button>
          {error && <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>}
        </div>

        {partnerConfirmed && (
          <div className="p-3 sm:p-4 bg-green-600/90 text-center rounded-xl font-medium text-white border border-green-300 animate-bounce text-sm">
            ✅ Partner bestätigt! Dein vollständiger Code lautet: <strong className="text-xl sm:text-2xl">{userCode[0]}{userCode[1]}</strong>
          </div>
        )}
      </div>
    </div>
  );
}