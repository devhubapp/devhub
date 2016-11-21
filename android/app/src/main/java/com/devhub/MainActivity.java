package com.devhub;

// import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainActivity extends SplashActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "devhub";
    }
}
