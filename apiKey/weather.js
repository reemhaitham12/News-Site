import { API } from "../config.js";

export async function getWeather(city) {
  try {
    // عرض Loading مؤقت أثناء جلب البيانات
    document.getElementById("city").innerText = "Loading...";
    document.getElementById("temp").innerText = "--°C";
    document.getElementById("weatherDesc").innerText = "";
    document.getElementById("weatherIcon").src = "";

    const response = await fetch(
      `${API.weather.url}?q=${city}&appid=${API.weather.key}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found or API error");
    }

    const data = await response.json();

    // تحديث عناصر الواجهة
    document.getElementById("city").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("weatherDesc").innerText = data.weather[0].main;

    // أيقونة الطقس
    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // الوقت الحالي
    const now = new Date();
    document.getElementById("time").innerText = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  } catch (err) {
    console.error(err);
    document.getElementById("city").innerText = "Error!";
    document.getElementById("temp").innerText = "--°C";
    document.getElementById("weatherDesc").innerText = "Could not fetch weather";
    document.getElementById("weatherIcon").src = "";
  }
}