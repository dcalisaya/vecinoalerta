# Future Roadmap - Vecino Alerta 🚀

With the core system (Backend, Mobile, Web Panel) complete and open-sourced, here are the recommended next phases:

## Phase 6: Hardware Integration (IoT) 📡
**Goal:** Connect physical sirens and strobes to the system.
- [ ] **Firmware Development:** Create C++/Arduino code for ESP32/ESP8266.
- [ ] **Connectivity:** Implement MQTT or HTTP polling to listen for activation commands.
- [ ] **Security:** Implement secure device authentication (IoT Core or Custom Tokens).
- [ ] **Hardware Manager:** Add "Devices" section to the Web Panel.

## Phase 7: Advanced Mobile Features 📱
**Goal:** Enhance user engagement and reliability.
- [ ] **Push Notifications:** Implement Firebase Cloud Messaging (FCM) for real-time alerts.
- [ ] **Social Features:** Allow comments or status updates on incidents.
- [ ] **Offline Mode:** Cache data for use without internet.
- [ ] **Biometric Auth:** FaceID/TouchID for quick login.

## Phase 8: DevOps & CI/CD 🛠️
**Goal:** Automate testing and deployment.
- [ ] **GitHub Actions:** Create workflows for:
    - `test-backend`: Runs unit/integration tests on PR.
    - `deploy-staging`: Auto-deploy to Firebase channel on merge to `develop`.
    - `build-mobile`: Build APK/IPA artifacts.
- [ ] **Code Quality:** Enforce ESLint/Prettier and Flutter Lints.

## Phase 9: Analytics & AI 🧠
**Goal:** Predictive security and insights.
- [ ] **Predictive Heatmaps:** Use historical data to predict high-risk times/zones.
- [ ] **Image Analysis:** Integrate Vision API to analyze photos attached to reports.
