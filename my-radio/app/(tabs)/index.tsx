import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";

// API Radio Browser
const API_URL =
  "https://de1.api.radio-browser.info/json/stations/search?limit=20&order=clickcount&reverse=true&hidebroken=true";

export default function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [query, setQuery] = useState("");

  // Завантаження станцій при старті
  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations(search = "") {
    setLoading(true);
    try {
      let url = API_URL;
      if (search) {
        url = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(
          search
        )}&limit=20&hidebroken=true`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setStations(data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    } finally {
      setLoading(false);
    }
  }

  async function playStation(station) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url_resolved },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentStation(station.name);
    } catch (err) {
      console.error("Помилка відтворення:", err);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#111" }}>
      <Text style={{ fontSize: 22, color: "#fff", marginBottom: 10 }}>
        🌍 Інтернет-радіо
      </Text>

      {/* Пошук станцій */}
      <TextInput
        placeholder="🔍 Введи назву станції"
        placeholderTextColor="#888"
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => fetchStations(query)}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0f0"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={stations}
          keyExtractor={(item, index) => item.stationuuid || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => playStation(item)}
              style={{
                padding: 15,
                marginVertical: 5,
                backgroundColor: "#333",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>{item.name}</Text>
              <Text style={{ color: "#aaa", fontSize: 14 }}>
                {item.country} · {item.codec} · {item.bitrate}kbps
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {currentStation && (
        <Text style={{ marginTop: 20, color: "#0f0" }}>
          ▶ Зараз грає: {currentStation}
        </Text>
      )}
    </View>
  );
}
