import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/foundation.dart';

class EmergencyService {
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  Future<String> triggerEmergency(String barrioId, double lat, double lng) async {
    try {
      final result = await _functions.httpsCallable('triggerEmergency').call({
        'barrioId': barrioId,
        'location': {'lat': lat, 'lng': lng},
      });
      return result.data['incidentId'];
    } catch (e) {
      debugPrint("Error triggering emergency: $e");
      rethrow;
    }
  }

  Future<void> cancelEmergency(String barrioId, String incidentId) async {
    try {
      await _functions.httpsCallable('cancelEmergency').call({
        'barrioId': barrioId,
        'incidentId': incidentId,
      });
    } catch (e) {
      debugPrint("Error cancelling emergency: $e");
      rethrow;
    }
  }

  Future<void> createSilentReport(String barrioId, String type, String details, double lat, double lng) async {
    try {
      await _functions.httpsCallable('createSilentReport').call({
        'barrioId': barrioId,
        'type': type,
        'details': details,
        'location': {'lat': lat, 'lng': lng},
      });
    } catch (e) {
      debugPrint("Error creating silent report: $e");
      rethrow;
    }
  }
}
