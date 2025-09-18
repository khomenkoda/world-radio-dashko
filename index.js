import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

// Список станцій (можеш додати свої)
const stations = [
  {
    id: "1",
    name: "BBC World Service",
    url: "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
  },
  {
    id: "2",
    name: "Radio Paradise",
    url: "http://stream.radioparadise.com/aac-320",
  },
  {
    id: "3",
    name: "NRJ France",
    url: "http://cdn.nrjaudio.fm/adwz1/fr/30001/mp3_128.mp3",
  },
];

export default function App() {
  const [sound, setSound] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);

  async function playStation(station) {
    // Якщо вже щось грає – зупиняємо
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    // Створюємо новий плеєр
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: station.url },
      { shouldPlay: true }
    );
    setSound(newSound);
    setCurrentStation(station.name);
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#111" }}>
      <Text style={{ fontSize: 22, color: "#fff", marginBottom: 20 }}>
        🌍 Мій радіо-плеєр
      </Text>

      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
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
          </TouchableOpacity>
        )}
      />

      {currentStation && (
        <Text style={{ marginTop: 20, color: "#0f0" }}>
          ▶ Зараз грає: {currentStation}
        </Text>
      )}
    </View>
  );
}
