import { useState, useEffect } from 'react';

// Eine Map zur Speicherung der Verknüpfungen zwischen User-IDs
const linkedPairs = new Map();

// Funktion zur Generierung eines zufälligen numerischen Codes mit gegebener Länge
function generateNumericId(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export default function TresorApp() {
  // Initialisierung des Zustands
  const [userId, setUserId] = useState(generateNumericId(5)); // Eigene zufällige ID
  const [userCode] = useState([4, 7]); // Eigener Code bestehend aus zwei Zahlen
  const [partnerCode, setPartnerCode] = useState(''); // Code des Partners
  const [partnerConfirmed, setPartnerConfirmed] = useState(false); // Wurde der Partnercode bestätigt?
  const [error, setError] = useState(''); // Fehlermeldungen anzeigen
  const [pressedKey, setPressedKey] = useState(null); // Animation für gedrückte Tasten
  const [countdown, setCountdown] = useState(0); // Countdown für Bestätigung durch Partner
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false); // Status ob auf Bestätigung gewartet wird

  // Tastatureingaben behandeln – ermöglicht auch Eingabe mit echter Tastatur
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleLinkPartner();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [partnerCode]);

  // Countdown runterzählen, bei Ablauf wird zurückgesetzt
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && waitingForConfirmation && !partnerConfirmed) {
      // Prüfen, ob Partner wirklich bestätigt hat
      const confirmed = linkedPairs.get(userId) === partnerCode && linkedPairs.get(partnerCode) === userId;
      if (confirmed) {
        setPartnerConfirmed(true);
        setWaitingForConfirmation(false);
        setError('');
      } else {
        setPartnerCode('');
        setWaitingForConfirmation(false);
        setError('⏱️ Zeit abgelaufen – bitte erneut versuchen.');
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, waitingForConfirmation, partnerConfirmed, partnerCode, userId]);

  // Funktion zur Verknüpfung mit Partnercode
  function handleLinkPartner() {
    if (!partnerCode) return;
    if (partnerCode === userId) {
      setError('❌ Du kannst deinen eigenen Code nicht als Partner verwenden.');
      return;
    }
    const theirLinked = linkedPairs.get(partnerCode);
    const myLinked = linkedPairs.get(userId);

    if (theirLinked === userId || myLinked === partnerCode) {
      linkedPairs.set(userId, partnerCode);
      linkedPairs.set(partnerCode, userId);
      setPartnerConfirmed(true);
      setCountdown(0);
      setWaitingForConfirmation(false);
      setError('');
    } else {
      linkedPairs.set(userId, partnerCode);
      setWaitingForConfirmation(true);
      setCountdown(10);
      setError('⏳ Warten auf Bestätigung des Partners ...');
    }
  }

  // Eingabe über die Keypad-Tasten
  function handleKeypadInput(num) {
    if (partnerCode.length < 5) {
      setPartnerCode(prev => prev + num);
      setPressedKey(num);
      setTimeout(() => setPressedKey(null), 150);
    }
  }

  // Löschen einer Ziffer
  function handleDelete() {
    setPartnerCode(prev => prev.slice(0, -1));
    setPressedKey('del');
    setTimeout(() => setPressedKey(null), 150);
  }

  // Überprüfung, ob gegenseitige Verknüpfung besteht
  const isLinked = linkedPairs.get(userId) === partnerCode && linkedPairs.get(partnerCode) === userId;

  // JSX Struktur mit responsivem Design für Mobile-First
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 sm:px-6 py-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <h1 className="text-xl font-bold text-blue-600">THE ALL STAR DEFENSE FOR YOUR HOME</h1>
        <p className="text-sm text-gray-700">Dein Code: <strong>{userId}</strong></p>

        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button
              key={n}
              className={`rounded-full bg-blue-100 text-blue-800 p-4 text-xl ${pressedKey == n ? 'scale-110 shadow-lg' : ''}`}
              onClick={() => handleKeypadInput(String(n))}
            >
              {n}
            </button>
          ))}
          <button
            className={`rounded-full bg-red-100 text-red-800 p-4 ${pressedKey === 'del' ? 'scale-110 shadow-lg' : ''}`}
            onClick={handleDelete}
          >
            ⌫
          </button>
          <button
            className="col-span-2 rounded-full bg-green-500 text-white py-4"
            onClick={handleLinkPartner}
          >
            ✔
          </button>
        </div>

        <div className="mt-4 text-gray-800">
          {partnerConfirmed && isLinked ? (
            <div className="text-green-600 font-bold text-lg">🔓 Dein Codefragment: {userCode.join('')}</div>
          ) : (
            <div>{error}</div>
          )}
          {waitingForConfirmation && countdown > 0 && (
            <div className="text-sm text-gray-600 mt-2">⏳ {countdown} Sekunden verbleiben</div>
          )}
        </div>
      </div>
    </div>
  );
}
