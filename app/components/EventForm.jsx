import { useState } from 'react';

export default function EventForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('イベントが追加されました');
        setFormData({ title: '', date: '', location: '', description: '' });
      } else {
        throw new Error('イベントの追加に失敗しました');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="イベントタイトル"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="開催場所"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="イベントの説明"
        required
        className="w-full p-2 border rounded"
      ></textarea>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        イベントを追加
      </button>
    </form>
  );
}