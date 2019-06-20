package com.devhubapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.bugsnag.BugsnagReactNative;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNScreensPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            BugsnagReactNative.getPackage(),
            new RNInAppBrowserPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "packages/mobile/index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
