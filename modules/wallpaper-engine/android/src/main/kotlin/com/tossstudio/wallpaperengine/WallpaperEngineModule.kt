package com.tossstudio.wallpaperengine

import android.app.WallpaperManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class WallpaperEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WallpaperEngine")

    AsyncFunction("setWallpaper") { imageUrl: String, location: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val wallpaperManager = WallpaperManager.getInstance(context)

      Thread {
        try {
          val url = URL(imageUrl)
          url.openStream().use { inputStream ->
            val bitmap = BitmapFactory.decodeStream(inputStream)

            when (location) {
              "HOME" -> wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
              "LOCK" -> wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
              "BOTH" -> {
                wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
                wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
              }
              else -> wallpaperManager.setBitmap(bitmap)
            }
          }
        } catch (e: Exception) {
          e.printStackTrace()
        }
      }.start()
      true
    }
  }
}
