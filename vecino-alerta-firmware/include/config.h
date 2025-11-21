#ifndef CONFIG_H
#define CONFIG_H

// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API
const char* API_URL = "https://us-central1-vecinoalerta-2e0de.cloudfunctions.net/api"; // Example
const char* BARRIO_ID = "test_barrio_1"; // The ID of the barrio this siren belongs to

// Pin Definitions
const int SIREN_RELAY_PIN = 26; // GPIO pin connected to the relay
const int STATUS_LED_PIN = 2;   // Onboard LED

#endif
