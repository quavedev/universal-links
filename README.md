# quave:universal-links

`quave:universal-links` is a Meteor package that allows you to expose your native iOS settings to enable Universal Links.

## Why

It is very useful to lunch your app from a link and this package make this configuration a breeze.

Remember that you need to enable `Associated Domains` in your app and also configure Universal Links in your `mobile-config.js`.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:universal-links
```

### Usage

In your settings

```json
  "packages": {
    "quave:universal-links": {
      "appleTeamId": "VR7QCJTCL2",
      "appleBundleId": "com.yoursite.app"
    }
  }
```

In your server

```javascript
import { Meteor } from 'meteor/meteor';

import { registerUniversalLinksHandler } from 'meteor/quave:universal-links';

Meteor.startup(() => {
  registerUniversalLinksHandler();
});
```

That is it, now you can access http://localhost:3000/apple-app-site-association and you will get back Apple required configuration for Universal Links.

## Advanced

If you want to provide `appleTeamId` and `appleBundleId` in runtime (in case you serve multiple apps from the same backend) you can use
`createResponderAppleAppSiteAssociation` function. See a full example from a market place that each store can have a native app.

```javascript
import { createResponderAppleAppSiteAssociation } from 'meteor/quave:universal-links';

import { StoresCollection } from '../../app/stores/data/StoresCollection';
import { getNativeStoresInfo } from './native';
import { getBaseUrlFromHeaders } from '../mode/modeCommon';

export const appleAppSiteAssociation = (req, res) => {
  const baseUrl = getBaseUrlFromHeaders(req.headers);
  const store = StoresCollection.findByFullUrl(baseUrl);
  const nativeStoresInfo = getNativeStoresInfo(store);

  if (!nativeStoresInfo.nativeAppEnabled) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(405);
    res.end(`<h1>Native App not enabled for ${store.name}</h1>`);
    return;
  }
  if (!nativeStoresInfo.appleTeamId || !nativeStoresInfo.appleBundleId) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(405);
    res.end(
      `<h1>Bundle ID and Team ID are not configured for ${store.name}</h1>`
    );
    return;
  }

  createResponderAppleAppSiteAssociation(nativeStoresInfo)(req, res);
};
```

### License

MIT
