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
    <div className="p-6 max-w-xl mx-auto bg-white shadow-xl rounded-2xl space-y-6">
      <h1 className="text-3xl font-bold text-center">🎯 Tresor Code Challenge</h1>

      <div className="text-center space-y-2">
        <p>Dein persönlicher Code:</p>
        <div className="font-mono text-xl bg-gray-100 inline-block px-4 py-2 rounded">{userId}</div>
        <QRCode value={userId} size={128} className="mx-auto mt-2" />
      </div>

      <div className="border p-4 rounded bg-blue-50 text-center">
        <p className="mb-2 font-semibold">Dein Codefragment:</p>
        <p className="text-3xl font-mono tracking-widest">{userCode[0]} {isLinked ? userCode[1] : '_'}</p>
      </div>

      <div className="text-left">
        <label className="block mb-1 font-medium">Partnercode eingeben:</label>
        <input
          className="border px-3 py-2 rounded w-full shadow-sm"
          type="text"
          placeholder="z. B. abc123"
          value={partnerCode}
          onChange={e => setPartnerCode(e.target.value)}
        />
        <button
          className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
          onClick={handleLinkPartner}
        >
          ✅ Partner verlinken
        </button>
      </div>

      {partnerConfirmed && (
        <div className="p-4 bg-green-100 text-center rounded font-medium">
          ✅ Partner bestätigt! Dein vollständiger Code lautet: <strong className="text-xl">{userCode[0]}{userCode[1]}</strong>
        </div>
      )}
    </div>
  );
}
