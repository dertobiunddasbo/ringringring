import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode.react';

export default function TresorApp() {
  const [userId, setUserId] = useState(uuidv4().slice(0, 6));
  const [userCode, setUserCode] = useState([4, 7]); // Fester Code: 47
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [linkedCodes, setLinkedCodes] = useState({});

  function handleLinkPartner() {
    if (!partnerCode) return;
    setLinkedCodes(prev => ({
      ...prev,
      [partnerCode]: true,
      [userId]: true
    }));
    setPartnerConfirmed(true);
  }

  const isLinked = linkedCodes[userId];

  return (
    <div className="min-h-screen p-4 bg-[#f4f6f8] flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-[#1991eb]">🎯 Tresor Code Challenge</h1>

        <div className="text-center space-y-2">
          <p className="text-gray-700">Dein persönlicher Code:</p>
          <div className="font-mono text-xl bg-gray-100 inline-block px-4 py-2 rounded-lg shadow-inner text-[#1991eb]">{userId}</div>
          <QRCode value={userId} size={128} className="mx-auto mt-2" />
        </div>

        <div className="border p-4 rounded-xl bg-[#e6f4ff] text-center">
          <p className="mb-2 font-semibold text-[#1991eb]">Dein Codefragment:</p>
          <p className="text-3xl font-mono tracking-widest text-[#0f172a]">{userCode[0]} {isLinked ? userCode[1] : '_'}</p>
        </div>

        <div className="text-left">
          <label className="block mb-1 font-semibold text-[#0f172a]">Partnercode eingeben:</label>
          <input
            className="border px-3 py-2 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#1991eb]"
            type="text"
            placeholder="z. B. abc123"
            value={partnerCode}
            onChange={e => setPartnerCode(e.target.value)}
          />
          <button
            className="mt-3 w-full py-2 bg-[#1991eb] hover:bg-[#0077cc] text-white font-bold rounded-lg transition duration-200"
            onClick={handleLinkPartner}
          >
            ✅ Partner verlinken
          </button>
        </div>

        {partnerConfirmed && (
          <div className="p-4 bg-green-100 text-center rounded-lg font-medium text-green-800">
            ✅ Partner bestätigt! Dein vollständiger Code lautet: <strong className="text-xl">{userCode[0]}{userCode[1]}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
