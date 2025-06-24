import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function TresorApp() {
  const [userId, setUserId] = useState(uuidv4().slice(0, 6));
  const [userCode, setUserCode] = useState(generateCode());
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [linkedCodes, setLinkedCodes] = useState({});

  function generateCode() {
    const first = Math.floor(Math.random() * 10);
    const second = Math.floor(Math.random() * 10);
    return [first, second];
  }

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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 Tresor Code Challenge</h1>
      <p className="mb-2">Dein persönlicher Link: <code>{userId}</code></p>
      <div className="border p-4 rounded bg-gray-100 mb-4">
        <p><strong>Dein Codefragment:</strong></p>
        <p className="text-xl">{userCode[0]} {isLinked ? userCode[1] : '_'} </p>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Partnercode eingeben:</label>
        <input
          className="border px-2 py-1 rounded w-full"
          type="text"
          value={partnerCode}
          onChange={e => setPartnerCode(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleLinkPartner}
        >
          Partner verlinken
        </button>
      </div>

      {partnerConfirmed && (
        <div className="p-4 bg-green-100 rounded">
          ✅ Partner bestätigt! Dein vollständiger Code lautet: <strong>{userCode[0]}{userCode[1]}</strong>
        </div>
      )}
    </div>
  );
}
