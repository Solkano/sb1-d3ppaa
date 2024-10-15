import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { AppNavigator } from './navigation/AppNavigator';

// Controls react-nativescript log verbosity.
// - true: all logs;
// - false: only error logs.
Object.defineProperty(global, '__DEV__', { value: false });

ReactNativeScript.start(React.createElement(AppNavigator, {}, null));