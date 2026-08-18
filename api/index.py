import os
import json
import difflib
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Lấy Gemini API Key từ Environment Variables của Vercel
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_CLIENT = None
if GEMINI_API_KEY:
    try:
        from google import genai
        GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"⚠️ Google GenAI SDK init error: {e}")

# Nạp dữ liệu tri thức tĩnh từ knowledge_base.json
KB_DATA = []
kb_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "knowledge_base.json")
if os.path.exists(kb_path):
    try:
        with open(kb_path, 'r', encoding='utf-8') as f:
            raw_kb = json.load(f)
            if isinstance(raw_kb, list):
                KB_DATA = raw_kb
            elif isinstance(raw_kb, dict):
                KB_DATA = raw_kb.get("qa_list", []) or raw_kb.get("data", []) or raw_kb.get("sample_qa", [])
    except Exception as e:
        print(f"⚠️ Error loading knowledge_base.json: {e}")

def compute_similarity(query, item_q):
    if not query or not item_q:
        return 0.0
    q1 = re.sub(r'[^\w\s]', '', query.lower()).strip()
    q2 = re.sub(r'[^\w\s]', '', item_q.lower()).strip()
    if not q1 or not q2:
        return 0.0
    if q1 == q2:
        return 1.0
    seq = difflib.SequenceMatcher(None, q1, q2).ratio()
    w1 = set(q1.split())
    w2 = set(q2.split())
    jaccard = len(w1.intersection(w2)) / float(max(len(w1), len(w2))) if w1 and w2 else 0.0
    return max(seq, jaccard)

def search_similarity(query, min_score=0.75):
    if not KB_DATA or not query:
        return None
    best_item = None
    best_score = 0.0
    for item in KB_DATA:
        if isinstance(item, dict):
            item_q = item.get("q", item.get("question", item.get("title", "")))
        elif isinstance(item, str):
            item_q = item
        else:
            continue
        score = compute_similarity(query, item_q)
        if score > best_score and score >= min_score:
            best_score = score
            best_item = item
    return best_item

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        question = data.get('question', '').strip()
        if not question:
            return jsonify({"answer": "Vui lòng nhập câu hỏi.", "source": "error"}), 400

        # 1. Tìm trong kho tri thức chuẩn trước
        kb_match = search_similarity(question, min_score=0.78)
        if kb_match and isinstance(kb_match, dict):
            ans = kb_match.get("a", kb_match.get("answer", kb_match.get("content", "")))
            if ans:
                return jsonify({
                    "answer": ans,
                    "source": "CSDL Pháp Lý Đất Đai Thanh Hóa (Tri thức chuẩn 100%)"
                })

        # 2. Nếu không khớp trực tiếp, gọi Gemini AI với Grounded System Prompt
        if GEMINI_CLIENT:
            try:
                sys_prompt = (
                    "Bạn là Trợ lý ảo ThanhHoa Land AI (v2026) - Chuyên gia tư vấn pháp lý đất đai và TTHC tại tỉnh Thanh Hóa.\n"
                    "BẮT BUỘC TUÂN THỦ NGUYÊN TẮC PHÁP LÝ CHÍNH XÁC:\n"
                    "1. Áp dụng Luật Đất đai 2024 (số 31/2024/QH15), Nghị định 101/2024/NĐ-CP, Nghị định 49/2026/NĐ-CP, Quyết định 18/2026/QĐ-UBND và Quyết định 2604/QĐ-VP của Thanh Hóa.\n"
                    "2. Tuyệt đối KHÔNG trích dẫn luật cũ hết hiệu lực (Luật 2013, NĐ 43/2014).\n"
                    "3. Diện tích tách thửa tối thiểu Thanh Hóa: Đô thị >= 40m2 (mặt tiền >= 3m); Nông thôn >= 50m2 (mặt tiền >= 4m); Rừng sản xuất >= 3.000m2.\n"
                    "4. Mẫu đơn: Cấp lần đầu (Mẫu 25), Sang tên/biến động (Mẫu 29), Tách/Hợp thửa (Mẫu 35 kèm bản vẽ Mẫu 34), Thuế (Mẫu 01/LPTB và Mẫu 03/BĐS-TNCN).\n"
                    "5. Thẩm quyền: Cấp lần đầu thuộc Chủ tịch UBND cấp xã; Cấp đổi, Sang tên thuộc Chi nhánh Văn phòng ĐKĐĐ.\n"
                    "Trả lời rõ ràng, mạch lạc, có căn cứ điều khoản cụ thể."
                )
                resp = GEMINI_CLIENT.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{sys_prompt}\n\nCâu hỏi của người dân: {question}"
                )
                return jsonify({
                    "answer": resp.text,
                    "source": "Google Gemini AI (Vercel Serverless Grounded)"
                })
            except Exception as ai_err:
                return jsonify({
                    "answer": f"Lỗi xử lý AI: {str(ai_err)}",
                    "source": "AI Error"
                }), 500

        return jsonify({
            "answer": "Hệ thống đang hoạt động. Vui lòng cấu hình GEMINI_API_KEY trên Vercel.",
            "source": "Config Pending"
        })
    except Exception as e:
        return jsonify({"answer": f"Lỗi hệ thống: {str(e)}", "source": "Server Error"}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "knowledge_items": len(KB_DATA),
        "ai_ready": GEMINI_CLIENT is not None
    })

if __name__ == '__main__':
    app.run(port=5000)
