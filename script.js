// script.js

const savedWebhooks = [];
const history = [];
let stats = { success: 0, failed: 0 };

// Webhookの追加
document.getElementById('addWebhook').addEventListener('click', () => {
  const newWebhook = document.getElementById('newWebhook').value;
  if (newWebhook) {
    savedWebhooks.push(newWebhook);
    updateWebhookList();
    document.getElementById('newWebhook').value = '';
  }
});

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

// Webhookの送信
document.getElementById('webhookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const webhooks = Array.from(document.getElementById('webhookSelect').selectedOptions).map(
    (opt) => opt.value
  );
  const message = document.getElementById('message').value;
  const repeatCount = parseInt(document.getElementById('repeatCount').value, 10);
  const files = document.getElementById('fileUpload').files;

  if (webhooks.length === 0 || repeatCount < 1 || repeatCount > 100) {
    alert('Webhookを選択し、1～100回の範囲で回数を指定してください。');
    return;
  }

  for (let i = 0; i < repeatCount; i++) {
    for (const webhook of webhooks) {
      const formData = new FormData();
      formData.append('content', message);

      Array.from(files).forEach((file) => {
        formData.append('file', file);
      });

      try {
        await fetch(webhook, { method: 'POST', body: formData });
        stats.success++;
        history.push(`成功: ${webhook}`);
      } catch {
        stats.failed++;
        history.push(`失敗: ${webhook}`);
      }
    }
  }

  updateHistory();
  updateStats();
});

function updateHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  history.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    list.appendChild(li);
  });
}

function updateStats() {
  const display = document.getElementById('statsDisplay');
  display.textContent = `成功: ${stats.success} | 失敗: ${stats.failed}`;
}
