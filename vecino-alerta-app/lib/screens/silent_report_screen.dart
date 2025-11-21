import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/emergency_service.dart';
import '../services/location_service.dart';

class SilentReportScreen extends StatefulWidget {
  const SilentReportScreen({super.key});

  @override
  State<SilentReportScreen> createState() => _SilentReportScreenState();
}

class _SilentReportScreenState extends State<SilentReportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _detailsController = TextEditingController();
  String _selectedType = 'SOSPECHA';
  bool _isLoading = false;

  final List<Map<String, dynamic>> _reportTypes = [
    {'value': 'SOSPECHA', 'label': '🔍 Actividad Sospechosa', 'icon': Icons.search},
    {'value': 'RUIDO', 'label': '🔊 Ruido Excesivo', 'icon': Icons.volume_up},
    {'value': 'VANDALISMO', 'label': '🎨 Vandalismo', 'icon': Icons.warning},
    {'value': 'VEHICULO', 'label': '🚗 Vehículo Sospechoso', 'icon': Icons.directions_car},
    {'value': 'OTRO', 'label': '📝 Otro', 'icon': Icons.more_horiz},
  ];

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      // Get current location
      final locationService = LocationService();
      final position = await locationService.getCurrentLocation();

      // Send report
      final emergencyService = Provider.of<EmergencyService>(context, listen: false);
      await emergencyService.createSilentReport(
        'test_barrio_1', // TODO: Get from user's profile
        _selectedType,
        _detailsController.text.trim(),
        position.latitude,
        position.longitude,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Reporte enviado exitosamente'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 3),
          ),
        );
        // Go back to home instead of success screen
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reporte Silencioso'),
        backgroundColor: Colors.orange.shade700,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Info Card
              Card(
                color: Colors.orange.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, color: Colors.orange.shade700),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Este reporte será enviado al comité de seguridad sin activar la alarma.',
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.orange.shade900,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Type Selection
              const Text(
                'Tipo de Incidente',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              ..._reportTypes.map((type) => RadioListTile<String>(
                    value: type['value'],
                    groupValue: _selectedType,
                    onChanged: (value) {
                      setState(() => _selectedType = value!);
                    },
                    title: Text(type['label']),
                    secondary: Icon(type['icon']),
                    activeColor: Colors.orange.shade700,
                  )),
              const SizedBox(height: 24),

              // Details Field
              const Text(
                'Detalles (Opcional)',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _detailsController,
                decoration: InputDecoration(
                  hintText: 'Describe lo que observaste...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixIcon: const Icon(Icons.edit_note),
                ),
                maxLines: 4,
                maxLength: 500,
              ),
              const SizedBox(height: 24),

              // Location Info
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.location_on, color: Colors.grey.shade600),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Se incluirá tu ubicación actual',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitReport,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange.shade700,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Enviar Reporte',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
