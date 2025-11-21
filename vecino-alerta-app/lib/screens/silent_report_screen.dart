import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SilentReportScreen extends StatelessWidget {
  const SilentReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reporte Silencioso')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const TextField(
              decoration: InputDecoration(
                labelText: 'Detalles (Opcional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Reporte enviado')),
                  );
                  context.pop();
                },
                child: const Text('Enviar Reporte'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
