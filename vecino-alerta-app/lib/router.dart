import 'package:go_router/go_router.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/panic_confirm_screen.dart';
import 'screens/silent_report_screen.dart';
import 'screens/success_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/panic',
      builder: (context, state) => const PanicConfirmScreen(),
    ),
    GoRoute(
      path: '/silent-report',
      builder: (context, state) => const SilentReportScreen(),
    ),
    GoRoute(
      path: '/success',
      builder: (context, state) => const SuccessScreen(),
    ),
  ],
);
