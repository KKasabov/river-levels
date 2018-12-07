import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'leaflet/dist/leaflet.css';
import rootReducer from './reducers/reducers';

let store = createStore(rootReducer);
let rootElement = document.getElementById('root');

render(
   <Provider store={store}>
      <App/>
   </Provider>,
   rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
