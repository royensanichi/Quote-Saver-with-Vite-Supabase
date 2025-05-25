import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  const [quote, setQuote] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const quotes_table = "quotes_db"

  const fetchQuote = async () => {
    const res = await fetch('https://api.api-ninjas.com/v1/quotes',{
      headers: { "X-Api-Key": "OwTV0suhGN4ZyZ2o5LnmeA==ebZJyqE5UDOPiNI2" }
    });
    const data = await res.json();
    setQuote({ content: data[0].quote, author: data[0].author });
  };

  const fetchSavedQuotes = async () => {
    const { data, error } = await supabase.from(quotes_table).select('*')
    // .order('created_at', { ascending: false });
    if (!error) setSavedQuotes(data);
  };

  const saveQuote = async () => {
    if (!quote) return;
    setLoading(true);
    console.log("sending quote to supabase : " + JSON.stringify(quote))
    const { error } = await supabase.from(quotes_table).insert([{ content: quote.content, author: quote.author }]);
    if (!error) {
      console.log('quote saved !')
      fetchSavedQuotes();
    }
    setLoading(false);
  };

  const deleteQuote = async (id) => {
    await supabase.from(quotes_table).delete().eq('id', id);
    fetchSavedQuotes();
  };

  useEffect(() => {
    fetchSavedQuotes();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Quote Saver with SupaBase </h1>

      <button onClick={fetchQuote} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">New Quote</button>
      <button onClick={saveQuote} disabled={!quote || loading} className="bg-green-500 text-white px-4 py-2 rounded">Save Quote</button>

      {quote && (
        <div className="mt-4 p-4 border rounded shadow">
          <p className="text-lg">"{quote.content}"</p>
          <p className="text-sm text-gray-600">— {quote.author}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6">Supabase's Saved Quotes</h2>
      <ul className="mt-2 space-y-2">
        {savedQuotes.map((q) => (
          <li key={q.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="text-sm">"{q.content}"</p>
              <p className="text-xs text-gray-500">— {q.author}</p>
            </div>
            <button onClick={() => deleteQuote(q.id)} className="text-red-500 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
