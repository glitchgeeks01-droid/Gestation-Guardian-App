package com.example.gestationguardian

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.WindowManager
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader

class MainActivity : ComponentActivity() {

    companion object {
        private const val PERMISSION_REQUEST_RECORD_AUDIO = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        
        // S10: Enforce screenshot blocking and recent-app switcher privacy shielding
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        
        // Enable Edge to Edge for modern Android devices
        enableEdgeToEdge()

        // Check and request microphone runtime permission
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS),
                PERMISSION_REQUEST_RECORD_AUDIO
            )
        }

        // Initialize WebViewAssetLoader to serve assets under virtual https://appassets.androidplatform.net
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        // Create WebView programmatically
        val webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = false
                allowFileAccessFromFileURLs = false
                allowUniversalAccessFromFileURLs = false
                allowContentAccess = true
                mediaPlaybackRequiresUserGesture = false
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            }
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }
            }
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest?) {
                    if (request == null) return
                    val origin = request.origin?.toString() ?: ""
                    val isOriginAllowed = origin.isEmpty() ||
                        origin.startsWith("file://") ||
                        origin.startsWith("https://localhost") ||
                        origin.startsWith("http://localhost") ||
                        origin.startsWith("capacitor://localhost") ||
                        origin.startsWith("https://appassets.androidplatform.net")

                    val audioRequested = request.resources?.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE) == true

                    if (isOriginAllowed && audioRequested) {
                        request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
                    } else {
                        request.deny()
                    }
                }
            }
            
            // Load the web app via virtual HTTPS domain served by WebViewAssetLoader
            loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
        }

        // Apply Window Insets so the WebView never collides with status bar, navigation bar, or camera display cutouts
        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, windowInsets ->
            val insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            v.setPadding(insets.left, insets.top, insets.right, insets.bottom)
            windowInsets
        }

        // Set the WebView as the main view
        setContentView(webView)
    }
}
