package com.devhub;

import android.app.Application;
import android.util.Log;

// import com.facebook.react.ReactApplication;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.NavigationReactPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements NavigationApplication {

  /*
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NavigationReactPackage()
      );
    }
  };
  */

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  @NonNull
  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      // Add the packages you require here.
      // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
          new NavigationReactPackage()
      );
  }
}
