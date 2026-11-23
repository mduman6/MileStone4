# 🎄 Mount Crumpit & Whoville Weather Watch (Project Milestone 4)

A live, interactive, *How the Grinch Stole Christmas*–themed weather dashboard built with semantic **HTML5**, **CSS3**, and vanilla **JavaScript (ES6+)**. This project connects live meteorological API data to dynamic DOM updates, animated weather particles, and keyboard-accessible controls.

🔗 **Live Site:** [https://github.io](https://github.io)

---

## ✨ Features

### 1. Dynamic DOM Manipulation (`querySelector` + `addEventListener`)
* **Live Weather Animations:** Automatically renders falling **snowflakes**, **rain drops**, **heavy thunderstorm rain**, or **clear sunny skies** based on real-time WMO weather codes.
* **Interactive Weather Preview:** Includes a **Test Mount Crumpit Weather** selector so users can preview rain drops, snowstorms, and sunny skies anytime.
* **°F / °C Unit Converter:** Toggles both the current temperature and the 6-hour forecast cards between Fahrenheit and Celsius without reloading the page.
* **Collapsible JSON Inspector:** Expands or hides the formatted live API payload directly in the DOM.

### 2. Accessible Whoville Weather Alert Form
* **Client-Side Validation:** Prevents submission (`event.preventDefault()`) when required fields are empty or when an email address is improperly formatted.
* **Inline ARIA Error Messages:** Displays accessible, screen-reader-friendly error alerts (`role="alert"`, `aria-invalid="true"`) directly below each field rather than using `alert()`.
* **Real-Time Error Clearing:** Automatically clears validation errors as soon as the user corrects the input.

### 3. Live Public API Integration (Bonus)
* **Open-Meteo Forecast API:** Fetches live temperature, wind speed, weather condition codes, and a 6-hour hourly forecast (defaulting to New Castle, DE / Whoville Outpost).
* **Open-Meteo Geocoding API:** Allows users to search any city worldwide and update the dashboard dynamically.
* **Error Handling:** Uses `try/catch` and `response.ok` checks with graceful fallback weather data if the network is offline.

### 4. Keyboard Accessibility
* Built with semantic `<button>`, `<input>`, `<select>`, and `<form>` elements supporting `Tab`, `Enter`, and `Space` navigation.
* High-contrast `:focus-visible` outlines highlight every interactive control, and invalid form submissions automatically move focus to the first field needing correction.

---

## 📁 Project Structure

```text
MileStone4/
├── index.html   # Semantic page structure, search bar, weather widget, & alert form
├── style.css    # Grinch-inspired holiday palette, rain/snow keyframes, & focus styles
├── script.js    # API fetch calls, DOM event listeners, particle generator, & validation
└── README.md    # Project overview and documentation
```

---

## 🛠️ Technologies Used
* **HTML5** (Semantic landmarks & ARIA accessibility attributes)
* **CSS3** (CSS Grid, Flexbox, gradients, and `@keyframes` particle animations)
* **JavaScript** (`fetch()`, `async/await`, DOM manipulation, and regex validation)
* **Open-Meteo API** (Free weather forecast and geocoding endpoints)
