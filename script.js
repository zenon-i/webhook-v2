// script.js

const savedWebhooks = [];
const history = [];
let stats = { success: 0, failed: 0 };
const savedWebhooksKey = 'savedWebhooks';
const historyKey = 'webhookHistory';

// ロード時にローカルストレージからデータを読み込む
document.addEventListener('DOMContentLoaded', () => {
  loadSavedWebhooks();
  loadHistory();
  updateWebhookList();
  updateHistory();
});

// Webhookの追加
document.getElementById('addWebhook').addEventListener('click', () => {
  const newWebhook = document.getElementById('newWebhook').value.trim();
  if (newWebhook) {
    savedWebhooks.push(newWebhook);
    saveToLocalStorage(savedWebhooksKey, savedWebhooks);
    updateWebhookList();
    document.getElementById('newWebhook').value = '';
  } else {
    alert('Webhook URLを入力してください。');
  }
});

// Webhookリストを更新
function updateWebhookList() {
  const list = document.getElementById('savedWebhooks');
  const select = document.getElementById('webhookSelect');
  list.innerHTML = '';
  select.innerHTML = '';

  savedWebhooks.forEach((webhook, index) => {
    const li = document.createElement('li');
    li.textContent = webhook;
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = webhook;
    option.textContent = `Webhook ${index + 1}`;
    select.appendChild(option);
  });
}

// Webhook送信
document.getElementById('webhookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const webhooks = Array.from(document.getElementById('webhookSelect').selectedOptions).map(
    (opt) => opt.value
  );
  const message = document.getElementById('message').value.trim();
  const repeatCount = parseInt(document.getElementById('repeatCount').value, 10);
  const sendCount = parseInt(document.getElementById('sendCount').value, 10);
  const files = document.getElementById('fileUpload').files;

  if (webhooks.length === 0 || repeatCount < 1 || sendCount < 1) {
    alert('Webhookを選択し、送信数と繰り返し回数を正しく設定してください。');
    return;
  }

  const tasks = [];
  for (let i = 0; i < repeatCount; i++) {
    const limitedWebhooks = webhooks.slice(0, sendCount);
    for (const webhook of limitedWebhooks) {
      tasks.push(sendWebhook(webhook, message, files));
    }
  }

  const results = await Promise.allSettled(tasks);
  stats.success += results.filter((res) => res.status === 'fulfilled').length;
  stats.failed += results.filter((res) => res.status === 'rejected').length;

  updateHistory();
  updateStats();
});

// Webhook送信タスク
async function sendWebhook(webhook, message, files) {
  const formData = new FormData();
  formData.append('content', message);

  Array.from(files).forEach((file) => {
    formData.append('file', file);
  });

  const response = await fetch(webhook, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(`Webhook送信失敗: ${webhook}`);

  history.push(`成功: ${webhook}`);
  saveToLocalStorage(historyKey, history);
}

// 履歴を更新
function updateHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  history.slice(-20).forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    list.appendChild(li);
  });
}

// 統計を更新
function updateStats() {
  const display = document.getElementById('statsDisplay');
  display.textContent = `成功: ${stats.success} | 失敗: ${stats.failed}`;
}

// ローカルストレージ操作
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadSavedWebhooks() {
  const data = localStorage.getItem(savedWebhooksKey);
  if (data) savedWebhooks.push(...JSON.parse(data));
}

function loadHistory() {
  const data = localStorage.getItem(historyKey);
  if (data) history.push(...JSON.parse(data));
}
