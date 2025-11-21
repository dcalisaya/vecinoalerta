import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../theme.dart';
import '../providers/auth_provider.dart';
// import '../services/emergency_service.dart';
import '../services/location_service.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vecino Alerta'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().signOut();
              context.go('/');
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: () async {
                // 1. Get Location
                try {
                  final position = await context.read<LocationService>().getCurrentLocation();
                  debugPrint("Location obtained: ${position.latitude}, ${position.longitude}");
                  
                  // 2. Trigger Emergency (Mock Barrio ID for now)
                  if (context.mounted) {
                    // Navigate to confirmation/countdown first in real app, 
                    // but here we simulate the trigger action or go to panic screen
                    context.push('/panic'); 
                    
                    // Note: The actual API call should probably happen AFTER the countdown 
                    // in PanicConfirmScreen, but for this MVP step we are just wiring things up.
                    // Let's assume PanicConfirmScreen handles the actual call after countdown.
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error: $e')),
                    );
                  }
                }
              },
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  color: AppTheme.primaryRed,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryRed.withValues(alpha: 0.5),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.notifications_active, size: 80, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => context.push('/silent'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.grey[800]),
              child: const Text('Reporte Silencioso', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }
}
