// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import 'package:vecino_alerta_app/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Carga la pantalla de login con el CTA mock', (WidgetTester tester) async {
    await tester.pumpWidget(const VecinoAlertaApp());
    await tester.pumpAndSettle();

    expect(find.text('Vecino Alerta'), findsOneWidget);
    expect(find.text('Login (Mock)'), findsOneWidget);
  });
}
