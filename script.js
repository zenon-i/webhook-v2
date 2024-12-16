// script.js

document.getElementById("webhookForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const webhookURL = document.getElementById("webhookURL").value;
  const message = document.getElementById("message").value;
  const count = parseInt(document.getElementById("count").value);
  const file = document.getElementById("file").files[0];
  const image = document.getElementById("image").value;

  if (!webhookURL || count > 100) {
    alert("Please enter a valid Webhook URL and a count less than or equal to 100.");
    return;
  }

  for (let i = 0; i < count; i++) {
    const formData = new FormData();
    formData.append("content", message);
    if (file) formData.append("file", file);
    if (image) formData.append("embeds", JSON.stringify([{ image: { url: image } }]));

    try {
      await fetch(webhookURL, { method: "POST", body: formData });
      console.log(`Message ${i + 1} sent successfully.`);
    } catch (error) {
      console.error(`Error sending message ${i + 1}:`, error);
    }
  }

  alert("Messages sent successfully!");
});

// Language switcher
const enTexts = {
  title: "Discord Webhook Manager",
  webhookURL: "Webhook URL:",
  message: "Message:",
  count: "Send Count (1-100):",
  file: "Include File:",
  image: "Include Image (URL):",
  send: "Send",
};

const jaTexts = {
  title: "ディスコードウェブフックマネージャー",
  webhookURL: "Webhook URL:",
  message: "メッセージ:",
  count: "送信回数 (1-100):",
  file: "ファイルを含む:",
  image: "画像を含む (URL):",
  send: "送信",
};

document.getElementById("en").addEventListener("click", () => switchLanguage(enTexts));
document.getElementById("ja").addEventListener("click", () => switchLanguage(jaTexts));

function switchLanguage(texts) {
  document.getElementById("title").textContent = texts.title;
  document.querySelector("label[for='webhookURL']").textContent = texts.webhookURL;
  document.querySelector("label[for='message']").textContent = texts.message;
  document.querySelector("label[for='count']").textContent = texts.count;
  document.querySelector("label[for='file']").textContent = texts.file;
  document.querySelector("label[for='image']").textContent = texts.image;
  document.querySelector("button[type='submit']").textContent = texts.send;
}
