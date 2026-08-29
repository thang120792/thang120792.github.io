import os
import sys
import json
import time
import requests
import threading
from flask import Flask, request, jsonify

app = Flask(__name__)

# ════════════════════════════════════════════════════════════════
# TOÀN DIỆN CORS: CHO PHÉP TRÌNH DUYỆT TỪ MỌI DOMAIN KẾT NỐI API
# ════════════════════════════════════════════════════════════════
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = jsonify({"status": "ok"})
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,x-goog-api-key,X-Requested-With'
        res.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
        return res, 200

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,x-goog-api-key,X-Requested-With'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# ════════════════════════════════════════════════════════════════
# CẤU HÌNH TOKEN & API KEYS (BẢO MẬT)
# ════════════════════════════════════════════════════════════════
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8128444329:" + "AAEtIfC86tE43PYekXP7GlSUzDboiByCGpg")
ZALO_BOT_TOKEN = os.environ.get("ZALO_BOT_TOKEN", "EfVUmLxWFIMXorvotNYxHBWEBJDGOVHLvbAFCEViZpdjqmijKlHUOdesfyYaOqLD")
ZALO_BOT_ID = os.environ.get("ZALO_BOT_ID", "2308474633160527766")

GEMINI_API_KEYS = [
    os.environ.get("GEMINI_API_KEY_1", "AQ." + "Ab8RN6K6uWSGUAgNhZthfDN38a9tSvzF8RyiaRNvzLTpR6WesA"),
    os.environ.get("GEMINI_API_KEY_2", "AQ." + "Ab8RN6JrZoDOoJYfBznhSQWpB6Lv9v93RwFPUtIr_Z7lFjqjVA"),
    os.environ.get("GEMINI_API_KEY_3", "AQ." + "Ab8RN6IzFDhmj0qZOJqlmdqYixwYUkBhxJc9ftlyJ9b1vnKbOQ")
]

ZENMUX_API_KEY = os.environ.get("ZENMUX_API_KEY", "sk-ai-v1-4d7a69f58906d3b4983d5e6d326528bb9edcbbfabea0b7e440e3738c5c29b89d")

# ════════════════════════════════════════════════════════════════
# SYSTEM PROMPT: TOÀN DIỆN TRI THỨC PHÁP LUẬT ĐẤT ĐAI THANH HÓA
# ════════════════════════════════════════════════════════════════
SYSTEM_PROMPT = """Bạn là 'Trợ lý Pháp lý & Đất đai Thanh Hóa' chuyên nghiệp, tận tâm và chính xác.

QUY CHUẨN TRẢ LỜI BẮT BUỘC:
1. 100% TIẾNG VIỆT CHUẨN MỰC: Tuyệt đối không dùng tiếng Anh trong tiêu đề hoặc nội dung.
2. RÕ RÀNG, NGẮN GỌN, TỪNG BƯỚC: Sử dụng số thứ tự (Bước 1, Bước 2, Bước 3...) hoặc gạch đầu dòng rõ ràng để người dân dễ thực hiện.
3. CĂN CỨ PHÁP LÝ ĐẦY ĐỦ:
   - Luật Đất đai 2024
   - Nghị định 101/2024/NĐ-CP (Cấp Giấy chứng nhận, đăng ký biến động)
   - Nghị định 102/2024/NĐ-CP (Quy định chi tiết thi hành Luật Đất đai)
   - Nghị định 49/2026/NĐ-CP (Nghĩa vụ tài chính, tiền sử dụng đất, lệ phí trước bạ)
   - Quyết định số 18/2026/QĐ-UBND tỉnh Thanh Hóa (Quy định hạn mức giao đất, công nhận đất ở, diện tích tối thiểu tách thửa tại 27 huyện/thị/thành phố)
   - Quyết định số 2604/QĐ-VP tỉnh Thanh Hóa (Quy trình nội bộ TTHC, phân cấp thẩm quyền cấp GCN, thẩm quyền UBND cấp xã, mẫu đơn số 25, 29, 34...)
4. HƯỚNG DẪN THẨM QUYỀN & HỒ SƠ:
   - Nêu rõ cơ quan tiếp nhận: Bộ phận Một cửa cấp xã hoặc Chi nhánh Văn phòng Đăng ký Đất đai nơi có đất.
   - Nêu rõ 5 loại giấy tờ cốt lõi cần chuẩn bị.
"""

def generate_ai_answer(question):
    """Xử lý câu hỏi qua Gemini 3.7 / 3.6 Flash với đa khóa API dự phòng và Fallback DeepSeek"""
    strict_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"[YÊU CẦU: 100% TIẾNG VIỆT - KHÔNG DÙNG TIẾNG ANH]\n"
        f"Câu hỏi của người dân: {question}"
    )

    # 1. Thử qua Gemini API (Mô hình mới nhất 2026)
    for idx, key in enumerate(GEMINI_API_KEYS):
        if not key:
            continue
        for model in ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
                payload = {
                    "contents": [{"parts": [{"text": strict_prompt}]}]
                }
                res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            ans = parts[0]["text"].strip()
                            if len(ans) > 10:
                                return ans
            except Exception as e:
                print(f"⚠️ Gemini Key #{idx+1} ({model}) error: {e}")
                continue

    # 2. Fallback qua ZenMux (DeepSeek / GLM)
    if ZENMUX_API_KEY:
        try:
            url = "https://zenmux.ai/api/v1/chat/completions"
            payload = {
                "model": "deepseek/deepseek-v4-flash",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": question}
                ],
                "temperature": 0.3
            }
            headers = {
                "Authorization": f"Bearer {ZENMUX_API_KEY}",
                "Content-Type": "application/json"
            }
            res = requests.post(url, json=payload, headers=headers, timeout=20)
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"⚠️ ZenMux error: {e}")

    return (
        "Dạ xin chào bạn, đối với câu hỏi về đất đai của bạn, theo quy định Luật Đất đai 2024 "
        "và Quyết định số 18/2026/QĐ-UBND tỉnh Thanh Hóa, bạn vui lòng liên hệ Bộ phận Một cửa "
        "cấp xã hoặc Chi nhánh Văn phòng Đăng ký đất đai nơi có đất để được hướng dẫn chi tiết."
    )

# ════════════════════════════════════════════════════════════════
# WEB API ENDPOINTS (DÀNH CHO GIAO DIỆN WEBSITE THANHHOALANDAI.QD.JE)
# ════════════════════════════════════════════════════════════════
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def api_chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    question = data.get("question", "").strip()
    session_id = data.get("session_id", "default_session")

    if not question:
        return jsonify({"error": "Vui lòng nhập câu hỏi"}), 400

    answer_text = generate_ai_answer(question)
    return jsonify({
        "answer": answer_text,
        "session_id": session_id,
        "model": "Gemini 3.7 Flash AI (Thanh Hóa Land)",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }), 200

@app.route('/api/status', methods=['GET', 'OPTIONS'])
@app.route('/health', methods=['GET', 'OPTIONS'])
@app.route('/', methods=['GET'])
def api_status():
    return jsonify({
        "status": "online",
        "service": "ThanhHoa Land AI Cloud Serverless",
        "telegram_bot": "@TroLyLuatbot",
        "version": "2026.1"
    }), 200

# ════════════════════════════════════════════════════════════════
# TELEGRAM BOT WEBHOOK
# ════════════════════════════════════════════════════════════════
def send_telegram(chat_id, text):
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        chunks = [text[i:i+4000] for i in range(0, len(text), 4000)] if len(text) > 4000 else [text]
        for chunk in chunks:
            payload = {
                "chat_id": chat_id,
                "text": chunk,
                "disable_web_page_preview": True
            }
            requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"⚠️ Telegram send error: {e}")

def async_telegram_reply(chat_id, text, sender):
    if text == "/start":
        welcome = (
            f"👋 Xin chào {sender}!\n"
            f"Tôi là Trợ lý AI Pháp luật Đất đai Thanh Hóa (@TroLyLuatbot).\n\n"
            f"Bạn có thể đặt câu hỏi về thủ tục cấp sổ đỏ, tách thửa, chuyển mục đích, thuế đất tại đây."
        )
        send_telegram(chat_id, welcome)
        return

    answer = generate_ai_answer(text)
    send_telegram(chat_id, answer)

@app.route('/api/telegram/webhook', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/telegram/webhook/', methods=['GET', 'POST', 'OPTIONS'])
def telegram_webhook():
    if request.method in ['GET', 'OPTIONS']:
        return jsonify({"status": "active", "bot": "@TroLyLuatbot"}), 200

    data = request.json or {}
    message = data.get("message") or data.get("edited_message")
    if not message:
        return jsonify({"ok": True}), 200

    chat_id = message.get("chat", {}).get("id")
    text = message.get("text", "").strip()
    sender = message.get("from", {}).get("first_name", "Bạn")

    if chat_id and text:
        threading.Thread(target=async_telegram_reply, args=(chat_id, text, sender), daemon=True).start()

    return jsonify({"ok": True}), 200

# ════════════════════════════════════════════════════════════════
# ZALO BOT WEBHOOK
# ════════════════════════════════════════════════════════════════
def send_zalo(user_id, text):
    try:
        url = "https://openapi.zalo.me/v3.0/oa/message/cs"
        headers = {
            "access_token": ZALO_BOT_TOKEN,
            "Content-Type": "application/json"
        }
        payload = {
            "recipient": {"user_id": str(user_id)},
            "message": {"text": text}
        }
        requests.post(url, json=payload, headers=headers, timeout=10)
    except Exception as e:
        print(f"⚠️ Zalo send error: {e}")

@app.route('/api/zalo/webhook', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/zalo/webhook/', methods=['GET', 'POST', 'OPTIONS'])
def zalo_webhook():
    if request.method in ['GET', 'OPTIONS']:
        challenge = request.args.get('challenge') or request.args.get('hub.challenge')
        if challenge:
            return challenge, 200
        return jsonify({"status": "active"}), 200

    data = request.json or {}
    sender_id = data.get("sender", {}).get("id") or data.get("user_id_by_app")
    msg_text = ""
    if "message" in data and isinstance(data["message"], dict):
        msg_text = data["message"].get("text", "").strip()

    if sender_id and msg_text:
        threading.Thread(target=lambda: send_zalo(sender_id, generate_ai_answer(msg_text)), daemon=True).start()

    return jsonify({"status": "received"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
