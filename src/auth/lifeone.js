import Keycloak from 'keycloak-js';

const configured = Boolean(import.meta.env.VITE_LIFEONE_URL && import.meta.env.VITE_LIFEONE_REALM && import.meta.env.VITE_LIFEONE_CLIENT_ID);
let keycloak = null;
let initPromise = null;

export function isLifeOneConfigured() { return configured; }

export function getLifeOneClient() {
  if (!configured) throw new Error('LifeOne sign-in is not configured');
  if (!keycloak) {
    keycloak = new Keycloak({
      url: import.meta.env.VITE_LIFEONE_URL,
      realm: import.meta.env.VITE_LIFEONE_REALM,
      clientId: import.meta.env.VITE_LIFEONE_CLIENT_ID,
    });
  }
  return keycloak;
}

export async function initializeLifeOne() {
  const client = getLifeOneClient();
  if (!initPromise) {
    initPromise = client.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      responseMode: 'query',
      enableLogging: false,
    }).catch(error => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export async function loginWithLifeOne() {
  const client = getLifeOneClient();
  await client.login({ scope: 'openid profile email' });
}

export async function logoutFromLifeOne() {
  const client = getLifeOneClient();
  await client.logout({ redirectUri: window.location.origin });
}

export function getLifeOneIdentity() {
  if (!keycloak?.authenticated || !keycloak.tokenParsed?.sub) return null;
  return { subject: keycloak.tokenParsed.sub };
}

export async function mountLifeOneSignIn(container) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lifeone-signin-button';
  button.textContent = '使用 LifeOne 登入';
  button.setAttribute('aria-label', '使用 LifeOne 統一帳號登入');
  let authenticated = false;
  const update = () => {
    authenticated = Boolean(getLifeOneIdentity());
    button.textContent = authenticated ? 'LifeOne 已登入 · 登出' : '使用 LifeOne 登入';
    button.setAttribute('aria-label', authenticated ? 'LifeOne 已登入，按此登出' : '使用 LifeOne 統一帳號登入');
  };
  button.addEventListener('click', async () => {
    if (!configured) return;
    button.disabled = true;
    try {
      if (authenticated) await logoutFromLifeOne();
      else await loginWithLifeOne();
    } catch {
      button.textContent = authenticated ? '登出暫時無法使用' : '登入暫時無法使用，請稍後再試';
    } finally {
      button.disabled = false;
    }
  });
  container.prepend(button);
  if (!configured) {
    button.title = 'LifeOne 尚未設定；目前不會啟動外部登入';
    button.disabled = true;
    return { button, configured: false };
  }
  try {
    await initializeLifeOne();
    update();
  } catch {
    button.title = '無法連線至 LifeOne；學習內容仍可使用';
  }
  return { button, configured: true };
}
