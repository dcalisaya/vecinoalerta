import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Colors
  static const Color primaryRed = Color(0xFFE53935); // Red 600
  static const Color darkBackground = Color(0xFF121212);
  static const Color surfaceColor = Color(0xFF1E1E1E);
  static const Color textWhite = Color(0xFFFFFFFF);
  static const Color textGrey = Color(0xFFB0BEC5);

  // Text Styles
  static TextStyle get displayLarge => GoogleFonts.outfit(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: textWhite,
      );

  static TextStyle get displayMedium => GoogleFonts.outfit(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: textWhite,
      );

  static TextStyle get bodyLarge => GoogleFonts.outfit(
        fontSize: 18,
        fontWeight: FontWeight.normal,
        color: textWhite,
      );

  static TextStyle get bodyMedium => GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.normal,
        color: textGrey,
      );

  // ThemeData
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      primaryColor: primaryRed,
      colorScheme: const ColorScheme.dark(
        primary: primaryRed,
        surface: surfaceColor,
        onSurface: textWhite,
      ),
      textTheme: TextTheme(
        displayLarge: displayLarge,
        displayMedium: displayMedium,
        bodyLarge: bodyLarge,
        bodyMedium: bodyMedium,
      ),
    );
  }
}
