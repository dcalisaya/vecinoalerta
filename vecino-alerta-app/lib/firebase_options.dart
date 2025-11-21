// File generated manually from Firebase console configs for each platform.
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        // Use iOS values for macOS builds unless a dedicated config is provided.
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not configured for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyB_8vQn1vK9uwm7nYU1Ra6887yO5mxlxW4',
    appId: '1:200103006776:web:aee9ee15f4a76b5b004ccd',
    messagingSenderId: '200103006776',
    projectId: 'vecinoalerta-2e0de',
    authDomain: 'vecinoalerta-2e0de.firebaseapp.com',
    storageBucket: 'vecinoalerta-2e0de.firebasestorage.app',
    measurementId: 'G-YCRQEQPM8L',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyB_8vQn1vK9uwm7nYU1Ra6887yO5mxlxW4',
    appId: '1:200103006776:android:52c2c5962c2c5962c2c596',
    messagingSenderId: '200103006776',
    projectId: 'vecinoalerta-2e0de',
    storageBucket: 'vecinoalerta-2e0de.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyB_8vQn1vK9uwm7nYU1Ra6887yO5mxlxW4',
    appId: '1:200103006776:ios:52c2c5962c2c5962c2c596',
    messagingSenderId: '200103006776',
    projectId: 'vecinoalerta-2e0de',
    storageBucket: 'vecinoalerta-2e0de.firebasestorage.app',
    iosBundleId: 'com.vecinoalerta.vecinoalerta',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyB_8vQn1vK9uwm7nYU1Ra6887yO5mxlxW4',
    appId: '1:200103006776:macos:52c2c5962c2c5962c2c596',
    messagingSenderId: '200103006776',
    projectId: 'vecinoalerta-2e0de',
    storageBucket: 'vecinoalerta-2e0de.firebasestorage.app',
    iosBundleId: 'com.livedev.vecinoalerta',
  );
}
