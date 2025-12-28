(function () {
  const tokenHash = window.__NETLIFY_IDENTITY_TOKEN_HASH__;
  const hasIdentityToken = typeof tokenHash === 'string' && /(invite_token|recovery_token|confirmation_token)=/i.test(tokenHash);
  const identity = window.netlifyIdentity;

  const normalizedHash = hasIdentityToken
    ? tokenHash.startsWith('#')
      ? tokenHash
      : `#${tokenHash}`
    : '';

  const restoreHash = () => {
    if (!hasIdentityToken) return;
    if (window.location.hash === normalizedHash) return;

    if (typeof history.replaceState === 'function') {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${normalizedHash}`);
      return;
    }

    window.location.hash = normalizedHash;
  };

  const openIdentityWithRetry = () => {
    if (!hasIdentityToken) return;
    const attempts = [0, 240, 720];

    attempts.forEach((delay) => {
      window.setTimeout(() => {
        restoreHash();
        identity.open('signup');
      }, delay);
    });
  };

  if (!identity) return;

  identity.on('init', () => {
    if (!hasIdentityToken) return;
    restoreHash();
    openIdentityWithRetry();
  });

  identity.init();
})();
