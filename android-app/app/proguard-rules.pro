# Proguard rules for Calk.KG Android App

# Keep TWA classes
-keep class androidx.browser.** { *; }
-keep class kg.calk.app.** { *; }

# Keep custom tabs
-keep class android.support.customtabs.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}




