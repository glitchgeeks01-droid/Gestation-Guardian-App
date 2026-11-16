# Standard R8 obfuscation and shrinking rules for Gestation Guardian

# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in getDefaultProguardFile('proguard-android-optimize.txt').

# Preserve source file and line numbers for crash analysis
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,EnclosingMethod,InnerClasses,Signature

# Keep Android WebKit and AndroidX WebKit (WebView, WebViewAssetLoader, settings)
-keep class android.webkit.** { *; }
-keep class androidx.webkit.** { *; }
-keep class androidx.webkit.WebViewAssetLoader** { *; }
-dontwarn androidx.webkit.**

# Preserve JavascriptInterface methods called from WebView JS
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Native method signatures
-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve Application and Activities
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application

# Preserve Kotlin Serialization / Models
-keepattributes *Annotation*
-keepclassmembers class * {
    *** Companion;
}
