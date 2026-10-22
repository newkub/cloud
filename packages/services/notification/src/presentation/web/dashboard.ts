export const dashboardHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cloud Notification</title>
  <style>
    :root { --bg: #0f172a; --fg: #e2e8f0; --accent: #38bdf8; --card: #1e293b; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--fg); padding: 2rem; }
    h1 { color: var(--accent); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .card { background: var(--card); padding: 1rem; border-radius: 0.75rem; }
    input, button, select, textarea { width: 100%; padding: 0.5rem; margin-top: 0.5rem; border-radius: 0.5rem; border: none; }
    button { background: var(--accent); color: var(--bg); font-weight: 600; cursor: pointer; }
    pre { white-space: pre-wrap; word-break: break-word; font-size: 0.85rem; }
    small { opacity: 0.7; }
  </style>
</head>
<body>
  <h1>Notification (Novu-like)</h1>
  <p><small>Working app — no auth. Supports web, mobile web, MCP, SDK, and skills.</small></p>
  <div class="grid">
    <div class="card">
      <h3>Create Notification</h3>
      <input id="n-title" placeholder="title" />
      <textarea id="n-body" placeholder="body" rows="3"></textarea>
      <select id="n-channel">
        <option value="in-app">in-app</option>
        <option value="email">email</option>
        <option value="sms">sms</option>
        <option value="push">push</option>
      </select>
      <button id="n-create">Create</button>
    </div>
    <div class="card">
      <h3>Create Subscriber</h3>
      <input id="s-email" placeholder="email" />
      <input id="s-name" placeholder="name (optional)" />
      <button id="s-create">Create</button>
    </div>
    <div class="card">
      <h3>Trigger</h3>
      <input id="t-nid" placeholder="notification id" />
      <input id="t-sid" placeholder="subscriber id" />
      <button id="t-trigger">Trigger</button>
    </div>
  </div>
  <div class="grid">
    <div class="card">
      <h3>Notifications</h3>
      <button id="r-notifications">Refresh</button>
      <pre id="o-notifications">[]</pre>
    </div>
    <div class="card">
      <h3>Subscribers</h3>
      <button id="r-subscribers">Refresh</button>
      <pre id="o-subscribers">[]</pre>
    </div>
    <div class="card">
      <h3>Output</h3>
      <pre id="o-result">ready</pre>
    </div>
  </div>
  <script>
    const api = '';
    const $ = (id) => document.getElementById(id);
    const j = (res) => res.json();
    const show = (id, data) => $(id).textContent = JSON.stringify(data, null, 2);
    const post = (path, body) => fetch(api + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(j);
    const get = (path) => fetch(api + path).then(j);
    const newId = () => crypto.randomUUID();
    const now = () => new Date().toISOString();
    $('n-create').onclick = async () => {
      const data = await post('/api/notifications', { id: newId(), title: $('n-title').value, body: $('n-body').value, channel: $('n-channel').value, createdAt: now() });
      show('o-result', data); await refreshNotifications();
    };
    $('s-create').onclick = async () => {
      const data = await post('/api/subscribers', { id: newId(), email: $('s-email').value, name: $('s-name').value || undefined, createdAt: now() });
      show('o-result', data); await refreshSubscribers();
    };
    $('t-trigger').onclick = async () => {
      const data = await post('/api/trigger', { notificationId: $('t-nid').value, subscriberId: $('t-sid').value });
      show('o-result', data);
    };
    const refreshNotifications = async () => show('o-notifications', await get('/api/notifications'));
    const refreshSubscribers = async () => show('o-subscribers', await get('/api/subscribers'));
    $('r-notifications').onclick = refreshNotifications;
    $('r-subscribers').onclick = refreshSubscribers;
    refreshNotifications(); refreshSubscribers();
  </script>
</body>
</html>`;
