"use client";
import React from "react";
import * as ReactGoogleMaps from "@vis.gl/react-google-maps";
import EventForm from './components/EventForm';

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [events, setEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [center, setCenter] = React.useState({ lat: 35.6762, lng: 139.6503 });
  const [searchInput, setSearchInput] = React.useState("");
  const [searchDate, setSearchDate] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState("");
  const mapRef = React.useRef(null);
  const [user, setUser] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/events")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Received data is not an array:", data);
          setEvents([]);
        }
        setIsLoaded(true);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setIsLoaded(true);
      });
  }, []);

  const handleSearch = () => {
    if (!mapRef.current) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
      }
    });
  };

  const handleEventSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newEvent = Object.fromEntries(formData.entries());

    fetch("/api/db/323", {
      method: "POST",
      body: JSON.stringify({
        query:
          "INSERT INTO `events` (name, date, time, location, details, lat, lng, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        values: [
          newEvent.name,
          newEvent.date,
          newEvent.time,
          newEvent.location,
          newEvent.details,
          newEvent.lat,
          newEvent.lng,
          newEvent.category,
        ],
      }),
    })
      .then(() => {
        setEvents([...events, newEvent]);
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    fetch("/api/db/323", {
      method: "POST",
      body: JSON.stringify({
        query: "SELECT * FROM `users` WHERE username = ? AND password = ?",
        values: [userData.username, userData.password],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setUser(data[0]);
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => console.error("Error logging in:", error));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">最新イベント</h2>
            <ul>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="mb-2 p-2 bg-gray-100 rounded cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="font-bold">{event.name}</h3>
                  <p>
                    {event.date} - {event.location}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">地図</h2>
              <ReactGoogleMaps.APIProvider
                apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <ReactGoogleMaps.Map
                  id="home-map"
                  mapId="map"
                  center={center}
                  zoom={12}
                  className="w-full h-64"
                >
                  {events.map((event) => (
                    <ReactGoogleMaps.AdvancedMarker
                      key={event.id}
                      position={{ lat: event.lat, lng: event.lng }}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </ReactGoogleMaps.Map>
              </ReactGoogleMaps.APIProvider>
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">イベントカレンダー</h2>
            <div className="bg-gray-200 p-4 text-center">
              カレンダーコンポーネント（実装時にカレンダーを表示）
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">イベント投稿</h3>
              <EventForm />
            </div>
          </div>
        );
      case "map":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">地図検索</h2>
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="場所を検索"
                className="border p-2 w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <input
                type="date"
                className="border p-2 w-full"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="カテゴリ"
                className="border p-2 w-full"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                検索
              </button>
            </div>
            <ReactGoogleMaps.APIProvider
              apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            >
              <ReactGoogleMaps.Map
                id="search-map"
                mapId="map"
                center={center}
                zoom={12}
                className="w-full h-96"
                onLoad={(map) => (mapRef.current = map)}
              >
                {events
                  .filter(
                    (event) =>
                      (!searchDate || event.date === searchDate) &&
                      (!searchCategory || event.category === searchCategory)
                  )
                  .map((event) => (
                    <ReactGoogleMaps.AdvancedMarker
                      key={event.id}
                      position={{ lat: event.lat, lng: event.lng }}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
              </ReactGoogleMaps.Map>
            </ReactGoogleMaps.APIProvider>
          </div>
        );
      case "messages":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">メッセージ</h2>
            <ul>
              {events.map((event) => (
                <li key={event.id} className="mb-2 p-2 bg-gray-100 rounded">
                  {event.name}のチャットルーム
                </li>
              ))}
            </ul>
          </div>
        );
      case "profile":
        return (
          <div className="p-4">
            {user ? (
              <>
                <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-bold">{user.username}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
                <p className="mb-4">{user.bio}</p>
                <h3 className="font-bold mb-2">過去の投稿イベント</h3>
                <ul>
                  {events
                    .filter((event) => event.user_id === user.id)
                    .map((event) => (
                      <li
                        key={event.id}
                        className="mb-2 p-2 bg-gray-100 rounded"
                      >
                        {event.name}
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-2">
                <input
                  name="username"
                  type="text"
                  placeholder="ユーザー名"
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="パスワード"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  ログイン
                </button>
              </form>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoaded) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-around mb-4">
        <button onClick={() => setActiveTab("home")} className="px-4 py-2 bg-blue-500 text-white rounded">ホーム</button>
        <button onClick={() => setActiveTab("calendar")} className="px-4 py-2 bg-blue-500 text-white rounded">カレンダー</button>
        <button onClick={() => setActiveTab("map")} className="px-4 py-2 bg-blue-500 text-white rounded">地図</button>
        <button onClick={() => setActiveTab("messages")} className="px-4 py-2 bg-blue-500 text-white rounded">メッセージ</button>
        <button onClick={() => setActiveTab("profile")} className="px-4 py-2 bg-blue-500 text-white rounded">プロフィール</button>
      </nav>
      {renderContent()}
      {selectedEvent && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">{selectedEvent.name}</h3>
          <p>{selectedEvent.date} - {selectedEvent.location}</p>
        </div>
      )}
    </div>
  );
}

export default MainComponent;