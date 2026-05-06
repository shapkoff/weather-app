import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WeatherAppUA() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const availableCities = [
    "Київ",
    "Львів",
    "Одеса",
    "Харків",
    "Дніпро",
    "Запоріжжя",
    "Вінниц",
    "Полтава",
    "Чернігів",
    "Івано-Франківськ",
  ];

  const [weather, setWeather] = useState({
    city: "Київ",
    temperature: 22,
    condition: "Хмарно з проясненнями",
    humidity: 64,
    wind: 5,
  });

  const API_KEY = "3fbf05ac9cd77509c9c68ab7422c3c2a";

  const handleSearch = async (selectedCity) => {
    const normalizedCity = (selectedCity || city).trim();

    if (!normalizedCity) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${normalizedCity}&appid=${API_KEY}&units=metric&lang=ua`
      );

      if (!response.ok) {
        throw new Error("Місто не знайдено");
      }

      const data = await response.json();

      setWeather({
        city: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather?.[0]?.description || "Немає даних",
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
      });
    } catch (error) {
      setWeather({
        city: normalizedCity,
        temperature: "—",
        condition: "Не вдалося отримати погоду",
        humidity: "—",
        wind: "—",
      });
    }

    setCity("");
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = availableCities.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="rounded-2xl shadow-xl border-0 bg-white">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌤️</span>
              <CardTitle className="text-3xl font-bold">
                Застосунок погоди
              </CardTitle>
            </div>

            <div className="flex gap-3">
              <Input
                placeholder="Введіть назву міста"
                value={city}
                onChange={handleInputChange}
                className="h-12 text-base"
              />

              <Button
                onClick={() => handleSearch()}
                className="h-12 px-6 rounded-xl"
              >
                🔍 Пошук
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSearch(item)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">{weather.city}</h2>
              <p className="text-slate-600">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col gap-2">
                  <div className="text-2xl">🌡️</div>
                  <p className="text-sm text-slate-500">Температура</p>
                  <p className="text-2xl font-bold">
                    {weather.temperature}°C
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col gap-2">
                  <div className="text-2xl">💧</div>
                  <p className="text-sm text-slate-500">Вологість</p>
                  <p className="text-2xl font-bold">
                    {weather.humidity}%
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col gap-2">
                  <div className="text-2xl">💨</div>
                  <p className="text-sm text-slate-500">Вітер</p>
                  <p className="text-2xl font-bold">
                    {weather.wind} м/с
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
