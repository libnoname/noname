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
            signingConfig = signingConfigs.getByName("debug")
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

