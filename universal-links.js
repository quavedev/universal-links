import { getSettings } from 'meteor/quave:settings';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

const PACKAGE_NAME = 'quave:universal-links';
const settings = getSettings({ packageName: PACKAGE_NAME });

export const APPLE_APP_SITE_ASSOCIATION_PATH = '/apple-app-site-association';

export const respondAppleAppSiteAssociation = (req, res, customSettings) => {
  const { appleTeamId, appleBundleId, paths } =
    customSettings && customSettings.appleTeamId ? customSettings : settings;
  if (!appleTeamId || !appleBundleId) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(405);
    res.end(
      `<h1>${PACKAGE_NAME} Native App not configured for iOS, add to your settings.packages.[quave:universal-links] the following keys: appleTeamId and appleBundleId</h1>`
    );
    return;
  }

  const appSiteAssociation = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${appleTeamId}.${appleBundleId}`,
          paths: paths || ['*'],
        },
      ],
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(appSiteAssociation));
};

export const createResponderAppleAppSiteAssociation = customSettings => (
  req,
  res
) => respondAppleAppSiteAssociation(req, res, customSettings);

export const registerUniversalLinksHandler = customSettings => {
  WebApp.connectHandlers.use(
    APPLE_APP_SITE_ASSOCIATION_PATH,
    Meteor.bindEnvironment((req, res) =>
      respondAppleAppSiteAssociation(req, res, customSettings)
    )
  );
};
