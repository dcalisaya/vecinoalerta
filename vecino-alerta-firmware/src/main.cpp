#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

// Global variables
unsigned long lastPollTime = 0;
const unsigned long pollInterval = 5000; // Poll every 5 seconds

void setupWiFi() {
  Serial.begin(115200);
  pinMode(SIREN_RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(SIREN_RELAY_PIN, LOW); // Ensure siren is off

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN)); // Blink LED
  }

  digitalWrite(STATUS_LED_PIN, HIGH); // LED on when connected
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void checkSirenStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(API_URL) + "/siren-status?barrioId=" + BARRIO_ID;
    
    // Note: In a real production env, use HTTPS with proper certificate validation
    // http.begin(url, root_ca); 
    http.begin(url); 

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      // Serial.println(httpResponseCode);
      // Serial.println(payload);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      bool active = doc["active"];
      
      if (active) {
        Serial.println("🚨 SIREN ACTIVATED!");
        digitalWrite(SIREN_RELAY_PIN, HIGH);
      } else {
        Serial.println("Siren Standby");
        digitalWrite(SIREN_RELAY_PIN, LOW);
      }

    } else {
      Serial.print("Error on HTTP request: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

void setup() {
  setupWiFi();
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastPollTime >= pollInterval) {
    lastPollTime = currentMillis;
    checkSirenStatus();
  }
}
