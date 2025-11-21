import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme.dart';

class PanicConfirmScreen extends StatelessWidget {
  const PanicConfirmScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.primaryRed,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('ENVIANDO ALERTA', style: Theme.of(context).textTheme.displayLarge),
            const SizedBox(height: 20),
            const CircularProgressIndicator(color: Colors.white),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => context.pop(),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.red),
              child: const Text('CANCELAR'),
            ),
          ],
        ),
      ),
    );
  }
}
