import java.util.Properties

val signingProperties = Properties()
val signingPropertiesFile = rootProject.file("keystore.properties")
if (signingPropertiesFile.exists()) {
    signingPropertiesFile.inputStream().use(signingProperties::load)
}

fun signingValue(propertyName: String, environmentName: String): String? =
    System.getenv(environmentName)?.takeIf(String::isNotBlank)
        ?: signingProperties.getProperty(propertyName)?.takeIf(String::isNotBlank)

val releaseStoreFile = signingValue("storeFile", "ANDROID_KEYSTORE_PATH")
val releaseStorePassword = signingValue("storePassword", "ANDROID_KEYSTORE_PASSWORD")
val releaseKeyAlias = signingValue("keyAlias", "ANDROID_KEY_ALIAS")
val releaseKeyPassword = signingValue("keyPassword", "ANDROID_KEY_PASSWORD")
val releaseSigningConfigured = listOf(
    releaseStoreFile,
    releaseStorePassword,
    releaseKeyAlias,
    releaseKeyPassword,
).all { it != null }

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.libnoname.noname"
    compileSdk = rootProject.extra["compileSdkVersion"] as Int

    defaultConfig {
        applicationId = "com.libnoname.noname"
        minSdk = rootProject.extra["minSdkVersion"] as Int
        targetSdk = rootProject.extra["targetSdkVersion"] as Int
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        androidResources {
            // Files and dirs to omit from the packaged assets dir, modified to accommodate modern web apps.
            // Default: https://android.googlesource.com/platform/frameworks/base/+/282e181b58cf72b6ca770dc7ca5f91f135444502/tools/aapt/AaptAssets.cpp#61
            ignoreAssetsPattern = "!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~"
        }
    }

    if (releaseSigningConfigured) {
        signingConfigs {
            create("release") {
                storeFile = rootProject.file(releaseStoreFile!!)
                storePassword = releaseStorePassword
                keyAlias = releaseKeyAlias
                keyPassword = releaseKeyPassword
            }
        }
        logger.lifecycle("Release signing is configured.")
    } else {
        logger.warn("Release signing is not configured; falling back to the debug keystore.")
    }

    buildTypes {
        getByName("debug") {
            isDebuggable = true
            manifestPlaceholders["enableAnalytics"] = "true"
        }

        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            manifestPlaceholders["enableAnalytics"] = "false"
            signingConfig = if (releaseSigningConfigured) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }

    buildFeatures {
        buildConfig = true
    }
}

repositories {
    flatDir {
        dirs(
            "../capacitor-cordova-android-plugins/src/main/libs",
            "libs"
        )
    }
}

dependencies {
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
    implementation("androidx.appcompat:appcompat:${rootProject.extra["androidxAppCompatVersion"]}")
    implementation("androidx.coordinatorlayout:coordinatorlayout:${rootProject.extra["androidxCoordinatorLayoutVersion"]}")
    implementation("androidx.core:core-splashscreen:${rootProject.extra["coreSplashScreenVersion"]}")
    implementation("androidx.webkit:webkit:${rootProject.extra["androidxWebkitVersion"]}")
    implementation("androidx.documentfile:documentfile:${rootProject.extra["androidxDocumentfileVersion"]}")

    implementation(project(":capacitor-android"))
    implementation(project(":capacitor-cordova-android-plugins"))

    testImplementation("junit:junit:${rootProject.extra["junitVersion"]}")
    androidTestImplementation("androidx.test.ext:junit:${rootProject.extra["androidxJunitVersion"]}")
    androidTestImplementation("androidx.test.espresso:espresso-core:${rootProject.extra["androidxEspressoCoreVersion"]}")
}

// apply from: 'capacitor.build.gradle'
apply(from = "capacitor.build.gradle")

// google-services 检测
val servicesJSON = file("google-services.json")
if (servicesJSON.exists() && servicesJSON.readText().isNotEmpty()) {
    apply(plugin = "com.google.gms.google-services")
} else {
    logger.info("google-services.json not found, google-services plugin not applied. Push Notifications won't work")
}

