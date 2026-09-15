import React, { useEffect, useState } from 'react';
import { API_URL } from "../api";

function SavedWords() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch saved words for the logged-in user (session-based)
  useEffect(() => {
    const fetchWords = async () => {
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/savedwords`, {
          credentials: 'include',
        });
        if (!res.ok) {
          const msg = `Failed to fetch saved words (${res.status})`;
          setError(msg);
          setWords([]);
          return;
        }
        const data = await res.json();
        setWords(Array.isArray(data) ? data : data.words || []);
      } catch (err) {
        console.error('Error fetching words:', err);
        setError('Network error while fetching saved words.');
        setWords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  // Add a new word
  const addWord = async () => {
    setError('');
    if (!newWord.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/savedwords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ word: newWord, translation, notes }),
      });
      if (!res.ok) {
        const msg = `Failed to add word (${res.status})`;
        setError(msg);
        return;
      }
      const data = await res.json();
      setWords(prev => [...prev, data]);
      setNewWord('');
      setTranslation('');
      setNotes('');
    } catch (err) {
      console.error('Error adding word:', err);
      setError('Network error while adding word.');
    }
  };

  // Delete a word
  const deleteWord = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/savedwords/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const msg = `Failed to delete word (${res.status})`;
        setError(msg);
        return;
      }
      setWords(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error('Error deleting word:', err);
      setError('Network error while deleting word.');
    }
  };

  return (
    <div>
      <h2>Saved Words</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading saved words...</p>
      ) : words.length === 0 ? (
        <p>No saved words yet. Add some below!</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginBottom: '20px', width: '100%' }}>
          <thead>
            <tr>
              <th>Word</th>
              <th>Translation</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {words.map(w => (
              <tr key={w._id}>
                <td><strong>{w.word}</strong></td>
                <td>{w.translation}</td>
                <td>{w.notes}</td>
                <td>
                  <button onClick={() => deleteWord(w._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Add New Word</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Word"
          value={newWord}
          onChange={e => setNewWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="Translation"
          value={translation}
          onChange={e => setTranslation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button onClick={addWord}>Add</button>
      </div>
    </div>
  );
}

export default SavedWords;
