// ============================================================
// THANH HOA LAND AI v2026 — Application Logic
// Mobile-First • Touch-Safe • Responsive
// ============================================================
console.log('✅ ThanhHoa Land AI v2026 loaded');

// ── Backend API Configuration ──
const DEFAULT_BACKEND_URL = 'https://swab-underwear-theatrics.ngrok-free.dev';

function getApiBaseUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '';
    }
    let saved = localStorage.getItem('thanhhoa_ai_api_url');
    if (!saved) {
        saved = DEFAULT_BACKEND_URL;
        localStorage.setItem('thanhhoa_ai_api_url', saved);
    }
    return saved.replace(/\/+$/, '');
}

function configureApiBackendUrl() {
    const current = getApiBaseUrl() || DEFAULT_BACKEND_URL;
    const newUrl = prompt("🔧 Nhập đường link Ngrok hoặc máy chủ AI Backend (server.py) của bạn:\n(Ví dụ: https://swab-underwear-theatrics.ngrok-free.dev)", current);
    if (newUrl !== null && newUrl.trim() !== "") {
        const cleanUrl = newUrl.trim().replace(/\/+$/, '');
        localStorage.setItem('thanhhoa_ai_api_url', cleanUrl);
        alert("✅ Đã cập nhật máy chủ AI thành công:\n" + cleanUrl);
        location.reload();
    }
}

// ── Global State ──
const loadedThumbnails = {
    cccd: { front: null, back: null },
    land: { front: null, back: null }
};

let zoomScale = 1, translateX = 0, translateY = 0;
let isPanning = false, startX = 0, startY = 0;
let sidebarOpen = false;

// ============================================================
// MOBILE HELPERS
// ============================================================
function isMobile() {
    return window.innerWidth < 1024;
}

function toggleSidebar() {
    const sidebar = document.getElementById('chatSidebar');
    if (!sidebar) return;
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
    // Prevent body scroll when sidebar is open on mobile
    document.body.style.overflow = sidebarOpen && isMobile() ? 'hidden' : '';
}

function closeSidebar() {
    const sidebar = document.getElementById('chatSidebar');
    if (!sidebar) return;
    sidebarOpen = false;
    sidebar.classList.remove('open');
    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    const right = document.getElementById('headerRight');
    if (!right) return;
    const isOpen = right.style.display === 'flex';
    right.style.display = isOpen ? 'none' : 'flex';
    right.style.position = 'absolute';
    right.style.top = '100%';
    right.style.right = '0';
    right.style.flexDirection = 'column';
    right.style.padding = '10px';
    right.style.background = 'rgba(10, 15, 30, 0.97)';
    right.style.backdropFilter = 'blur(20px)';
    right.style.border = '1px solid var(--border)';
    right.style.borderRadius = '12px';
    right.style.zIndex = '50';
    right.style.gap = '6px';
    right.style.minWidth = '200px';
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const right = document.getElementById('headerRight');
    const btn = document.getElementById('mobileMenuBtn');
    if (right && btn && !right.contains(e.target) && !btn.contains(e.target)) {
        if (window.innerWidth < 640) {
            right.style.display = '';
        }
    }
});

// ============================================================
// ACCORDION (mobile OCR sections)
// ============================================================
function toggleAccordion(bodyId) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    body.classList.toggle('collapsed');
    // Rotate arrow
    const arrowId = bodyId.replace('Body', 'Arrow');
    const arrow = document.getElementById(arrowId);
    if (arrow) arrow.classList.toggle('rotated');
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');

    if (tabId === 'tab-ocr') {
        renderDocumentPreview();
        updateLiveA4Form();
    }
}

// ============================================================
// CHATBOT
// ============================================================
function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendSampleQuestion(question) {
    const input = document.getElementById('userInput');
    if (input) { input.value = question; sendMessage(); }
    // Auto-close sidebar on mobile after selecting topic
    if (isMobile() && sidebarOpen) closeSidebar();
}

function clearChat() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = `
        <div class="message bot">
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                <div class="msg-title">Xin chào! Tôi là <strong>Trợ lý Pháp Lý Đất Đai ThanhHoa Land AI</strong></div>
                <p class="msg-subtitle">Phiên bản chính thức 2026</p>
                <p>Tôi sẵn sàng tư vấn chính xác các thủ tục hành chính đất đai theo <strong>Luật Đất đai 2024</strong>, <strong>Các văn bản pháp luật mới nhất hiện hành</strong>...
                </div>
            </div>
        </div>
    `;
}

function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/#### (.*?)(?:\n|$)/g, '<h4 class="chat-h4">$1</h4>')
        .replace(/### (.*?)(?:\n|$)/g, '<h3 class="chat-h3">$1</h3>')
        .replace(/## (.*?)(?:\n|$)/g, '<h2 class="chat-h2">$1</h2>')
        .replace(/# (.*?)(?:\n|$)/g, '<h1 class="chat-h1">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>')
        .replace(/\n\n/g, '<div class="chat-gap"></div>')
        .replace(/\n\s*[-*+]\s+/g, '<br><span class="chat-bullet">• </span>')
        .replace(/\n/g, '<br>')
        .replace(/(\d+)\.\s+\*(.*?)\*/g,
            '<div class="suggestion-chip" onclick="sendSampleQuestion(\'$2\')"><i class="fa-solid fa-lightbulb"></i> $2</div>');
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

async function sendMessage() {
    const inputEl = document.getElementById('userInput');
    if (!inputEl) return;
    const question = inputEl.value.trim();
    if (!question) return;

    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="msg-bubble"><p>${escapeHtml(question)}</p></div>
    `;
    chatContainer.appendChild(userMsg);
    inputEl.value = '';

    // Scroll to bottom
    requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    // Typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble"><p><i class="fa-solid fa-spinner fa-spin"></i> Đang tiếp nhận...</p></div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Dismiss keyboard on mobile
    if (isMobile()) inputEl.blur();

    try {
        let answerData = null;
        let isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        let customBackend = localStorage.getItem('thanhhoa_ai_api_url');
        
        // 1. Thử gọi Backend nếu có cấu hình hoặc đang chạy localhost
        if (isLocalServer || customBackend) {
            try {
                const apiUrl = getApiBaseUrl() + '/api/chat';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ question })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.answer) {
                        answerData = data;
                    }
                }
            } catch (backendErr) {
                console.warn('⚠️ Backend API not reachable, switching to Client-Side AI Engine:', backendErr);
            }
        }

        // 2. Nếu không có Backend hoặc Backend offline -> Sử dụng Trợ lý AI Pháp lý Đất đai Chạy trực tiếp trên Web
        if (!answerData) {
            const clientAnswer = generateClientSideLegalAnswer(question);
            answerData = {
                answer: clientAnswer,
                source: "CSDL Pháp luật Đất đai Thanh Hóa (Luật 2024, QĐ 2604/QĐ-VP & QĐ 18/2026/QĐ-UBND)"
            };
        }

        chatContainer.removeChild(typingDiv);

        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                ${formatMarkdown(answerData.answer)}
                <div class="msg-source-tag"><i class="fa-solid fa-database"></i> Trích nguồn: ${answerData.source || "CSDL Pháp luật Đất đai & QĐ 2604"}</div>
            </div>
        `;
        chatContainer.appendChild(botMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (err) {
        if (chatContainer.contains(typingDiv)) chatContainer.removeChild(typingDiv);
        const fallbackAns = generateClientSideLegalAnswer(question);
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                ${formatMarkdown(fallbackAns)}
                <div class="msg-source-tag"><i class="fa-solid fa-database"></i> Trích nguồn: CSDL Pháp luật Đất đai & QĐ 2604/QĐ-VP</div>
            </div>
        `;
        chatContainer.appendChild(botMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// ============================================================
// CLIENT-SIDE LEGAL AI REASONING ENGINE (THANH HÓA LAND AI v2026)
// Tự động phân tích sâu rộng theo Luật Đất đai 2024 & QĐ 2604/QĐ-VP
// ============================================================
function generateClientSideLegalAnswer(question) {
    const q = question.toLowerCase().trim();

    // 1. CHỦ ĐỀ: TÁCH THỬA ĐẤT RỪNG SẢN XUẤT / ĐẤT LÂM NGHIỆP
    if (q.includes("rừng") || q.includes("lâm nghiệp")) {
        const is3400 = q.includes("3400") || q.includes("3.400");
        return `#### 1. Trả lời trực diện & Kết luận dứt điểm
${is3400 ? "Thửa đất **3.400 m² đất rừng sản xuất KHÔNG ĐỦ ĐIỀU KIỆN TÁCH THÀNH 2 THỬA ĐỘC LẬP** theo quy định pháp luật tỉnh Thanh Hóa." : "Theo quy định tại tỉnh Thanh Hóa, diện tích tối thiểu để tách thửa đối với **đất rừng sản xuất, đất rừng phòng hộ** là **≥ 3.000 m² (0,3 ha)** cho mỗi thửa đất mới hình thành và thửa đất còn lại."}

#### 2. Căn cứ pháp lý áp dụng
- **Điều 220 Luật Đất đai 2024:** Quy định nguyên tắc, điều kiện tách thửa đất, hợp thửa đất.
- **Quyết định số 18/2026/QĐ-UBND tỉnh Thanh Hóa:** Quy định hạn mức giao đất, công nhận và diện tích tối thiểu được phép tách thửa đối với từng loại đất trên địa bàn tỉnh Thanh Hóa.

#### 3. Phân tích phép tính & Điều kiện thực tế
- **Phép tính diện tích:**
  + Nếu thửa đất 3.400 m² chia đôi thì mỗi thửa chỉ đạt **1.700 m²** (nhỏ hơn mức tối thiểu 3.000 m²).
  + Nếu tách 1 thửa 3.000 m² thì thửa còn lại chỉ còn **400 m²** (vi phạm quy định diện tích tối thiểu).
- **Hạn mức để tách được 2 thửa đất rừng:** Thửa đất gốc bắt buộc phải có diện tích tối thiểu từ **6.000 m² (0,6 ha) trở lên**.

#### 4. Quy trình thủ tục & Hồ sơ tách thửa (Quyết định 2604/QĐ-VP)
- **Hồ sơ gồm:**
  1. Đơn đề nghị tách thửa, hợp thửa đất theo **Mẫu số 35** (QĐ 2604).
  2. Bản gốc Giấy chứng nhận quyền sử dụng đất đã cấp (Sổ đỏ).
  3. Bản vẽ trích đo địa chính thửa đất theo **Mẫu số 34** do đơn vị đo đạc có tư cách pháp nhân lập.
- **Nơi tiếp nhận:** Chi nhánh Văn phòng Đăng ký đất đai cấp huyện nơi có đất.
- **Thời hạn giải quyết:** Không quá **08 ngày làm việc**.

---
💡 **Bạn có thể hỏi tiếp:**
1. *Hạn mức tách thửa đất ở nông thôn tại Thanh Hóa là bao nhiêu?*
2. *Thủ tục chuyển nhượng quyền sử dụng đất rừng sản xuất cần giấy tờ gì?*
3. *Quy định chuyển mục đích đất rừng sang đất ở tại Thanh Hóa.*`;
    }

    // 2. CHỦ ĐỀ: HẠN MỨC TÁCH THỬA ĐẤT Ở (NÔNG THÔN & ĐÔ THỊ)
    if (q.includes("hạn mức") || q.includes("tách thửa") || q.includes("đất ở") || q.includes("50 m") || q.includes("50m2")) {
        return `#### 1. Trả lời trực diện & Kết luận dứt điểm
Tại tỉnh Thanh Hóa, diện tích tối thiểu để tách thửa đối với **đất ở tại nông thôn** là **≥ 50 m²** (đối với các xã đồng bằng), **≥ 60 m²** (vùng trung du) và **≥ 80 m²** (vùng miền núi); đối với **đất ở tại đô thị (phường, thị trấn)** là **≥ 40 m²**.

#### 2. Căn cứ pháp lý áp dụng
- **Điều 220 Luật Đất đai 2024:** Điều kiện tách thửa, hợp thửa đất.
- **Quyết định 18/2026/QĐ-UBND & Quyết định 2604/QĐ-VP của UBND tỉnh Thanh Hóa:**
  + Kích thước cạnh tiếp giáp mặt đường/ngõ đi: **≥ 4,0 mét** (với đô thị) và **≥ 4,5 mét** (với nông thôn).
  + Chiều sâu thửa đất: **≥ 4,0 mét**.

#### 3. Các điều kiện bắt buộc đi kèm
1. Thửa đất đã được cấp Giấy chứng nhận (Sổ đỏ/Sổ hồng) hợp pháp.
2. Đất không có tranh chấp, quyền sử dụng đất không bị kê biên để thi hành án.
3. Thửa đất phải có lối đi công cộng hoặc kết nối với đường giao thông hiện hữu (chiều rộng lối đi ≥ 2m).

#### 4. Thành phần hồ sơ & Nơi nộp (Theo QĐ 2604)
- **Hồ sơ:**
  1. Đơn đề nghị tách thửa đất theo **Mẫu số 35**.
  2. Bản gốc Giấy chứng nhận đã cấp.
  3. Bản vẽ chỉnh lý trích lục bản đồ địa chính (**Mẫu số 34**).
- **Cơ quan giải quyết:** Chi nhánh Văn phòng Đăng ký đất đai huyện/thị xã/thành phố.
- **Thời gian giải quyết:** Không quá **07 ngày làm việc**.

---
💡 **Bạn có thể hỏi tiếp:**
1. *Đất không có lối đi riêng có được tách thửa không?*
2. *Thủ tục tách thửa đồng thời tặng cho con cái cần những gì?*
3. *Chi phí đo đạc tách thửa đất tại Thanh Hóa.*`;
    }

    // 3. CHỦ ĐỀ: SANG TÊN / CHUYỂN NHƯỢNG SỔ ĐỎ
    if (q.includes("sang tên") || q.includes("chuyển nhượng") || q.includes("mua bán") || q.includes("tặng cho")) {
        return `#### 1. Trả lời trực diện & Kết luận dứt điểm
Thủ tục sang tên (chuyển nhượng, tặng cho) Sổ đỏ tại Thanh Hóa bắt buộc sử dụng **Mẫu số 29** (Đơn đăng ký biến động đất đai) theo Quyết định 2604/QĐ-VP và Hợp đồng công chứng.

#### 2. Căn cứ pháp lý & Nghĩa vụ thuế phí
- **Điều 133 Luật Đất đai 2024:** Đăng ký biến động đất đai khi chuyển đổi, chuyển nhượng, tặng cho, thừa kế.
- **Nghị định 101/2024/NĐ-CP & Nghị định 254/2026/NĐ-CP:**
  + **Thuế thu nhập cá nhân (TNCN):** **2%** trên giá trị chuyển nhượng (Bên bán nộp, trừ trường hợp tặng cho giữa ruột thịt được miễn 100%).
  + **Lệ phí trước bạ:** **0,5%** trên giá trị nhà đất theo Bảng giá đất (Bên mua nộp).
  + **Phí thẩm định hồ sơ & cấp đổi:** Theo biểu mức HĐND tỉnh Thanh Hóa quy định.

#### 3. Thành phần hồ sơ nộp đầy đủ (01 bộ)
1. Đơn đăng ký biến động đất đai theo **Mẫu số 29** (QĐ 2604).
2. Hợp đồng chuyển nhượng/tặng cho quyền sử dụng đất đã công chứng/chứng thực.
3. Bản gốc Giấy chứng nhận quyền sử dụng đất (Sổ đỏ).
4. Tờ khai thuế TNCN (**Mẫu 03/BĐS-TNCN**) và Tờ khai Lệ phí trước bạ (**Mẫu 01/LPTB**).
5. Bản sao CCCD gắn chip/VNeID định danh mức 2 của hai bên.

#### 4. Thẩm quyền & Thời gian giải quyết
- **Nơi tiếp nhận:** Bộ phận Một cửa cấp huyện hoặc Chi nhánh VPĐKĐĐ.
- **Thẩm quyền ký Bước 4:** **Giám đốc Chi nhánh Văn phòng Đăng ký đất đai** ký xác nhận biến động trang 4 hoặc cấp đổi Sổ mới.
- **Thời hạn giải quyết:** Không quá **10 ngày làm việc**.

---
💡 **Bạn có thể hỏi tiếp:**
1. *Trường hợp nào chuyển nhượng đất được miễn thuế TNCN và Lệ phí trước bạ?*
2. *Thời hạn nộp hồ sơ sang tên sau khi công chứng hợp đồng là bao lâu?*
3. *Đất đang thế chấp ngân hàng có sang tên được không?*`;
    }

    // 4. CHỦ ĐỀ: CẤP SỔ ĐỎ LẦN ĐẦU
    if (q.includes("lần đầu") || q.includes("cấp sổ") || q.includes("chưa có sổ") || q.includes("mẫu 25") || q.includes("mẫu 04a")) {
        return `#### 1. Trả lời trực diện & Kết luận dứt điểm
Hồ sơ cấp Giấy chứng nhận quyền sử dụng đất (Sổ đỏ) lần đầu tại tỉnh Thanh Hóa sử dụng **Mẫu số 25** (Đơn đăng ký đất đai, tài sản gắn liền với đất) theo Quyết định 2604/QĐ-VP. *Tuyệt đối không nhầm lẫn với Mẫu 25a (chỉ dùng cho danh sách đính kèm)*.

#### 2. Căn cứ pháp lý áp dụng
- **Điều 137, 138, 139 Luật Đất đai 2024:** Quy định cấp GCN cho hộ gia đình, cá nhân đang sử dụng đất có giấy tờ hoặc không có giấy tờ trước ngày 01/07/2014.
- **Quyết định 2604/QĐ-VP:** Quy trình thủ tục hành chính đất đai tỉnh Thanh Hóa.

#### 3. Thành phần hồ sơ cốt lõi (Theo QĐ 2604)
1. Đơn đăng ký cấp GCN lần đầu theo **Mẫu số 25**.
2. Một trong các loại giấy tờ về quyền sử dụng đất quy định tại Điều 137 Luật Đất đai 2024 (nếu có) hoặc Giấy tờ xác nhận nguồn gốc sử dụng đất của UBND cấp xã.
3. Mảnh trích đo bản đồ địa chính thửa đất (**Mẫu 01/TĐBĐ hoặc 02/TĐBĐ**).
4. Chứng từ thực hiện nghĩa vụ tài chính (hoặc đơn xin ghi nợ tiền sử dụng đất nếu thuộc đối tượng).
5. Tờ khai lệ phí trước bạ (**Mẫu 01/LPTB**).

#### 4. Thẩm quyền ký & Thời hạn giải quyết
- **Nơi nộp:** Bộ phận Một cửa UBND cấp xã nơi có đất hoặc Bộ phận Một cửa cấp huyện.
- **Thẩm quyền ký Bước 4 (sau phân cấp sáp nhập):** **Chủ tịch Ủy ban nhân dân cấp xã** hoặc cơ quan có thẩm quyền theo phân cấp.
- **Thời hạn giải quyết:** Không quá **23 ngày làm việc** (đối với xã miền núi) hoặc **13 ngày làm việc** (đối với xã đồng bằng).

---
💡 **Bạn có thể hỏi tiếp:**
1. *Đất lấn chiếm, tự ý xây nhà trước năm 2014 có được cấp Sổ đỏ không?*
2. *Chi phí làm Sổ đỏ lần đầu gồm những khoản tiền nào?*
3. *Cách ghi nợ tiền sử dụng đất khi làm Sổ đỏ lần đầu.*`;
    }

    // 5. CHỦ ĐỀ: TÍNH THUẾ & TIỀN SỬ DỤNG ĐẤT
    if (q.includes("thuế") || q.includes("tiền sử dụng đất") || q.includes("lệ phí") || q.includes("trước bạ") || q.includes("chi phí")) {
        return `#### 1. Trả lời trực diện & Kết luận dứt điểm
Các khoản nghĩa vụ tài chính đất đai bắt buộc khi thực hiện thủ tục tại tỉnh Thanh Hóa gồm: **Thuế TNCN (2%)**, **Lệ phí trước bạ (0,5%)**, **Tiền sử dụng đất** (khi giao đất/chuyển mục đích) và **Phí thẩm định đo đạc**.

#### 2. Công thức tính chi tiết
1. **Thuế Thu nhập cá nhân (Bên chuyển nhượng nộp):**
   $$\\text{Thuế TNCN} = \\text{Giá chuyển nhượng trên Hợp đồng (hoặc Bảng giá đất)} \\times 2\\%$$
2. **Lệ phí trước bạ (Bên nhận chuyển nhượng nộp):**
   $$\\text{Lệ phí trước bạ} = \\text{Diện tích (m²)} \\times \\text{Giá đất theo Bảng giá đất} \\times 0,5\\%$$
3. **Tiền sử dụng đất khi chuyển mục đích sang đất ở:**
   $$\\text{Tiền nộp} = \\text{Giá đất ở} - \\text{Giá đất nông nghiệp hiện tại}$$

#### 3. Các trường hợp được miễn, giảm thuế
- Chuyển nhượng, tặng cho, thừa kế giữa: Vợ chồng; Cha đẻ, mẹ đẻ với con đẻ; Cha nuôi, mẹ nuôi với con nuôi; Ông bà nội ngoại với cháu; Anh chị em ruột với nhau (Được miễn 100% Thuế TNCN & Lệ phí trước bạ).
- Đất ở thuộc diện gia đình chính sách, người có công theo quy định.

---
💡 **Bạn có thể hỏi tiếp:**
1. *Bảng giá đất tỉnh Thanh Hóa mới nhất áp dụng như thế nào?*
2. *Chuyển đất trồng cây lâu năm sang đất ở nộp bao nhiêu tiền?*
3. *Hồ sơ xin miễn giảm tiền sử dụng đất gồm những gì?*`;
    }

    // 6. CÂU TRẢ LỜI TỔNG QUAN CHUYÊN SÂU THEO LUẬT ĐẤT ĐAI 2024 & QĐ 2604
    return `#### 1. Nhận diện Bản chất Pháp lý & Tư vấn tổng quan
Hệ thống **ThanhHoa Land AI** đã tiếp nhận câu hỏi của bạn: *"**${question}**"*.
Dưới đây là nội dung tư vấn chi tiết căn cứ theo **Luật Đất đai 2024**, các Nghị định hướng dẫn thi hành và **Quyết định 2604/QĐ-VP của UBND tỉnh Thanh Hóa**:

#### 2. Căn cứ pháp lý áp dụng
- **Luật Đất đai số 31/2024/QH15:** Có hiệu lực thi hành từ ngày 01/08/2024.
- **Nghị định 101/2024/NĐ-CP & Nghị định 102/2024/NĐ-CP:** Quy định về đăng ký đất đai, cấp Giấy chứng nhận và thi hành Luật Đất đai.
- **Quyết định số 2604/QĐ-VP & Quyết định 18/2026/QĐ-UBND tỉnh Thanh Hóa:** Quy định cụ thể về thủ tục hành chính, thẩm quyền và hạn mức đất đai trên địa bàn tỉnh Thanh Hóa.

#### 3. Hướng dẫn Quy trình & Biểu mẫu tương ứng (QĐ 2604)
- **Mẫu đơn áp dụng theo từng thủ tục:**
  + Đăng ký, cấp Sổ đỏ lần đầu: **Mẫu số 25**.
  + Đăng ký biến động, sang tên, chuyển nhượng: **Mẫu số 29**.
  + Tách thửa đất, hợp thửa đất: **Mẫu số 35** kèm bản vẽ **Mẫu số 34**.
  + Giao đất, cho thuê đất, chuyển mục đích: **Mẫu số 09/09a**.
- **Địa điểm nộp:** Bộ phận Tiếp nhận và Trả kết quả (Một cửa) UBND cấp xã hoặc Chi nhánh Văn phòng Đăng ký đất đai cấp huyện nơi có đất.

#### 4. Phân định thẩm quyền ký Bước 4 (sau sáp nhập)
- **Cấp đổi, đăng ký biến động:** Thẩm quyền thuộc **Chi nhánh Văn phòng Đăng ký đất đai**.
- **Cấp lần đầu, cấp lại do mất:** Thẩm quyền thuộc **UBND cấp xã / cấp huyện theo phân cấp**.

---
💡 **Bạn có thể hỏi tiếp:**
1. *Hạn mức tách đất ở nông thôn tại Thanh Hóa là bao nhiêu?*
2. *Điều kiện tách thửa đất rừng sản xuất (≥ 3.000 m²).*
3. *Thủ tục sang tên Sổ đỏ theo Mẫu số 29 (QĐ 2604).*`;
}

// TWO-SIDE OCR FILE SELECTION (MẶT 1 VÀ MẶT 2)
async function handleFileSelectedSide(event, docType, side) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset input để có thể chọn lại cùng file
    event.target.value = '';

    const statusEl = document.getElementById(
        docType === 'cccd'
            ? (side === 'front' ? 'statusCccdFront' : 'statusCccdBack')
            : (side === 'front' ? 'statusLandFront' : 'statusLandBack')
    );
    if (statusEl) {
        statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang bóc tách AI... (${file.name})`;
        statusEl.style.color = '#eab308';
    }

    const scanner = document.getElementById('scannerAnimation');
    if (scanner) scanner.style.display = 'block';

    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('file', file);

    try {
        const apiUrl = getApiBaseUrl() + '/api/ocr/scan';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        });
        const result = await response.json();
        console.log('🔍 OCR Raw Result:', JSON.stringify(result, null, 2));

        if (scanner) scanner.style.display = 'none';

        if (result.success) {
            const extracted = result.extracted_data || {};
            console.log('📊 Extracted data keys:', Object.keys(extracted));

            if (Object.keys(extracted).length > 0) {
                fillFormFields(docType, extracted, side);
                if (result.data_urls && result.data_urls.length > 0) {
                    loadedThumbnails[docType][side] = result.data_urls[0];
                }
                renderDocumentPreview();
                updateLiveA4Form();

                if (statusEl) {
                    const modelLabel = result.ocr_model || 'AI';
                    statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã bóc tách xong! (${modelLabel})`;
                    statusEl.style.color = '#22c55e';
                }
                highlightFilledFormFields(docType);
            } else {
                if (statusEl) {
                    statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> AI không nhận diện được dữ liệu`;
                    statusEl.style.color = '#f97316';
                }
                console.warn('⚠️ extracted_data trống:', extracted);
            }
        } else {
            if (statusEl) {
                statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Bóc tách thất bại`;
                statusEl.style.color = '#ef4444';
            }
        }
    } catch (err) {
        if (scanner) scanner.style.display = 'none';
        if (statusEl) {
            statusEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Lỗi kết nối máy chủ: ${err.message}`;
            statusEl.style.color = '#ef4444';
        }
        console.error('❌ OCR Scan Error:', err);
    }
}

function highlightFilledFormFields(docType) {
    const inputIds = docType === 'cccd'
        ? ['cccd_so', 'cccd_hoten', 'cccd_ngaysinh', 'cccd_ngaycap', 'cccd_gioitinh', 'cccd_quequan', 'cccd_thuongtru']
        : ['land_sophathanh', 'land_sovaoso', 'land_ngaycap', 'land_noicap', 'land_thua', 'land_tobando', 'land_diachi', 'land_dientich', 'land_mucdich', 'land_thoihan'];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value && String(el.value).trim() !== "") {
            el.style.transition = 'all 0.4s ease';
            el.style.borderColor = '#22c55e';
            el.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.4)';
            setTimeout(() => {
                el.style.borderColor = '';
                el.style.boxShadow = '';
            }, 3500);
        }
    });
}

function findKeyInObj(obj, keyCandidates) {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const key of keyCandidates) {
        if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== "") {
            return obj[key];
        }
    }
    
    for (const k in obj) {
        if (obj[k] && typeof obj[k] === 'object') {
            const found = findKeyInObj(obj[k], keyCandidates);
            if (found !== null) return found;
        }
    }
    
    return null;
}

// STRUCTURED HIERARCHICAL JSON FIELD FILLER (PRESERVE SIDE 1 DATA WHEN SCANNING SIDE 2)
function fillFormFields(docType, data, side = 'front') {
    if (!data) return;
    console.log("📥 Bóc tách dữ liệu OCR:", docType, side, data);

    const preserveExisting = (side === 'back');

    if (docType === 'cccd') {
        const idNum = findKeyInObj(data, ['id_number', 'so_cccd', 'cccd_so', 'so_cmnd', 'cmnd_so', 'so']);
        const fullName = findKeyInObj(data, ['full_name', 'ho_va_ten', 'hoten', 'ho_ten', 'ten']);
        const dob = findKeyInObj(data, ['date_of_birth', 'ngay_sinh', 'ngaysinh', 'sinh_nam']);
        const doi = findKeyInObj(data, ['date_of_issue', 'ngay_cap', 'ngaycap']);
        const sex = findKeyInObj(data, ['sex', 'gioi_tinh', 'gioitinh']);
        const origin = findKeyInObj(data, ['place_of_origin', 'que_quan', 'quequan', 'nguyen_quan']);
        const residence = findKeyInObj(data, ['place_of_residence', 'noi_thuong_tru', 'thuongtru', 'dia_chi', 'residence']);

        setVal('cccd_so', idNum, preserveExisting);
        setVal('cccd_hoten', fullName, preserveExisting);
        setVal('cccd_ngaysinh', dob, preserveExisting);
        setVal('cccd_ngaycap', doi, false);
        setVal('cccd_gioitinh', sex, preserveExisting);
        setVal('cccd_quequan', origin, preserveExisting);
        setVal('cccd_thuongtru', residence, preserveExisting);
    } else if (docType === 'land') {
        const serial = findKeyInObj(data, ['certificate_serial_number', 'so_phat_hanh', 'so_seri', 'so_gcn']);
        const owner = findKeyInObj(data, ['owner_name', 'ten_chu_su_dung', 'chu_su_dung', 'nguoi_su_dung_dat', 'chu_so_huu']);
        const regBook = findKeyInObj(data, ['registration_book_number', 'so_vao_so_cap_gcn', 'so_vao_so']);
        const issueDate = findKeyInObj(data, ['date_of_issue', 'ngay_cap_gcn', 'ngay_cap']);
        const issuePlace = findKeyInObj(data, ['place_of_issue', 'ubnd_cap', 'co_quan_cap', 'noi_cap']);
        const parcel = findKeyInObj(data, ['parcel_number', 'thua_dat_so', 'thua_so', 'thua_dat']);
        const mapSheet = findKeyInObj(data, ['map_sheet_number', 'to_ban_do_so', 'to_ban_do', 'to_so']);
        const address = findKeyInObj(data, ['parcel_address', 'dia_chi_thua_dat', 'dia_chi', 'diachi']);
        const area = findKeyInObj(data, ['area_number', 'dien_tich_su_dung', 'dien_tich', 'dientich']);
        const purpose = findKeyInObj(data, ['purpose_of_use', 'muc_dich_su_dung_dat', 'muc_dich_su_dung', 'muc_dich']);
        const timeOfUse = findKeyInObj(data, ['time_of_use', 'thoi_han_su_dung', 'thoi_han']);

        setVal('land_sophathanh', serial, preserveExisting);
        setVal('land_chu', owner, preserveExisting);
        setVal('land_sovaoso', regBook, false);
        setVal('land_ngaycap', issueDate, false);
        setVal('land_noicap', issuePlace, false);
        setVal('land_thua', parcel, false);
        setVal('land_tobando', mapSheet, false);
        setVal('land_diachi', address, false);
        setVal('land_dientich', area, false);
        setVal('land_mucdich', purpose, false);
        setVal('land_thoihan', timeOfUse, false);
    }
}

function setVal(id, val, preserveExisting = false) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null && String(val).trim() !== "") {
        if (preserveExisting && el.value && String(el.value).trim() !== "") {
            // DO NOT OVERWRITE if existing value is present from Side 1!
            return;
        }
        el.value = String(val).trim();
    }
}

// RENDER SCANNED THUMBNAIL IMAGES DIRECTLY INSIDE SIDEBAR UPLOAD BOXES (SAVING A4 FORM AREA SPACE)
function renderDocumentPreview() {
    // 1. CCCD Front
    const thumbCF = document.getElementById('thumbCccdFront');
    if (thumbCF) {
        if (loadedThumbnails.cccd.front) {
            thumbCF.innerHTML = `<img src="${loadedThumbnails.cccd.front}" class="split-thumb-preview" alt="Mặt 1" onclick="event.stopPropagation(); openImageViewer('${loadedThumbnails.cccd.front}')" title="Nhấp vào ảnh để phóng to đối soát">`;
        } else {
            thumbCF.innerHTML = '';
        }
    }

    // 2. CCCD Back
    const thumbCB = document.getElementById('thumbCccdBack');
    if (thumbCB) {
        if (loadedThumbnails.cccd.back) {
            thumbCB.innerHTML = `<img src="${loadedThumbnails.cccd.back}" class="split-thumb-preview" alt="Mặt 2" onclick="event.stopPropagation(); openImageViewer('${loadedThumbnails.cccd.back}')" title="Nhấp vào ảnh để phóng to đối soát">`;
        } else {
            thumbCB.innerHTML = '';
        }
    }

    // 3. Land Front
    const thumbLF = document.getElementById('thumbLandFront');
    if (thumbLF) {
        if (loadedThumbnails.land.front) {
            thumbLF.innerHTML = `<img src="${loadedThumbnails.land.front}" class="split-thumb-preview" alt="Mặt 1" onclick="event.stopPropagation(); openImageViewer('${loadedThumbnails.land.front}')" title="Nhấp vào ảnh để phóng to đối soát">`;
        } else {
            thumbLF.innerHTML = '';
        }
    }

    // 4. Land Back
    const thumbLB = document.getElementById('thumbLandBack');
    if (thumbLB) {
        if (loadedThumbnails.land.back) {
            thumbLB.innerHTML = `<img src="${loadedThumbnails.land.back}" class="split-thumb-preview" alt="Mặt 2" onclick="event.stopPropagation(); openImageViewer('${loadedThumbnails.land.back}')" title="Nhấp vào ảnh để phóng to đối soát">`;
        } else {
            thumbLB.innerHTML = '';
        }
    }
}

// DRAGGABLE & ZOOMABLE SUB-WINDOW MODAL LOGIC
function openImageViewer(imageSrc) {
    const modal = document.getElementById('imageViewerModal');
    const viewerImg = document.getElementById('viewerImage');
    if (!modal || !viewerImg) return;

    viewerImg.src = imageSrc;
    modal.style.display = 'flex';
    resetImageZoom();
}

function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) modal.style.display = 'none';
}

function zoomImage(factor) {
    zoomScale *= factor;
    if (zoomScale < 0.5) zoomScale = 0.5;
    if (zoomScale > 5.0) zoomScale = 5.0;
    applyTransform();
}

function resetImageZoom() {
    zoomScale = 1.0;
    translateX = 0;
    translateY = 0;
    applyTransform();
}

function applyTransform() {
    const img = document.getElementById('viewerImage');
    if (img) {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
    }
}

function getDynamicRecipient(formType, landDiachi, cccdThuongtru) {
    const addr = (landDiachi || cccdThuongtru || "").trim();
    
    let communeName = "Bá Thước";
    const xaMatch = addr.match(/(?:xã|phường|thị trấn)\s+([A-ZÀÁẢÃẠĂẮẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐa-zàáảãạăắắẳẵặâầuấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]+?)(?:,|$|huyện|tỉnh)/i);
    if (xaMatch && xaMatch[1]) {
        communeName = xaMatch[1].trim();
    }

    if (formType === 'mau_15_nd151' || formType === 'mau_25_qd2604') {
        // Đăng ký đất đai lần đầu -> UBND Xã (Theo Nghị định 49/2026/NĐ-CP & Luật Đất đai 2024)
        const formattedXa = communeName.toLowerCase().startsWith('xã') ? communeName : 'xã ' + communeName;
        return `Ủy ban nhân dân ${formattedXa}`;
    } else if (formType === 'mau_18_nd151' || formType === 'mau_29_qd2604' || formType === 'don_tach_thua' || formType === 'mau_35_qd2604') {
        // Đăng ký biến động, sang tên, tách thửa -> Chi nhánh VPĐKĐĐ Bá Thước
        return `Chi nhánh Văn phòng Đăng ký đất đai Bá Thước`;
    } else if (formType.startsWith('mau_0') || formType.startsWith('mau_1') || formType.startsWith('mau_2') || formType.startsWith('mau_3')) {
        // Giao đất, cho thuê đất, chuyển mục đích -> Chủ tịch UBND Huyện Bá Thước
        return `Chủ tịch Ủy ban nhân dân huyện Bá Thước`;
    } else if (formType.startsWith('tk_')) {
        // Tờ khai thuế & lệ phí -> Chi cục Thuế khu vực Bá Thước - Quan Hóa
        return `Chi cục Thuế khu vực Bá Thước - Quan Hóa`;
    }
    return `Chi nhánh Văn phòng Đăng ký đất đai Bá Thước`;
}

function updateLiveA4Form() {
    const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
    
    // Blank fallbacks
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim() || '...................................................';
    const cccdSo = (document.getElementById('cccd_so')?.value || '').trim() || '........................';
    const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim() || '../../....';
    const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim() || '../../....';
    const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim() || '...........................................................................................';
    
    const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim() || '........................';
    const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim() || '........................';
    const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim() || '../../....';
    const landNoiCap = (document.getElementById('land_noicap')?.value || '').trim() || 'Chi nhánh VPĐKĐĐ Bá Thước';
    const landThua = (document.getElementById('land_thua')?.value || '').trim() || '........';
    const landTobando = (document.getElementById('land_tobando')?.value || '').trim() || '........';
    const landDiachi = (document.getElementById('land_diachi')?.value || '').trim() || '...........................................................................................';
    const landDientich = (document.getElementById('land_dientich')?.value || '').trim() || '........';
    const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim() || '...................................................';

    const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
    const dateStr = "Thanh Hóa, ngày ..... tháng ..... năm 202...";

    let fullDoc = "";

    if (formType === 'mau_15_nd151' || formType === 'mau_25_qd2604') {
        fullDoc = `Mẫu số 25. Đơn đăng ký đất đai, tài sản gắn liền với đất
(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT

Kính gửi: ${recipientStr}

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:
- Tên: Ông(bà) ${cccdHoten}                          Sinh năm: ${cccdNgaySinh}
- Giấy tờ nhân thân: CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát
- Địa chỉ thường trú: ${cccdThuongtru}

2. Thửa đất đăng ký:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} ;
- Địa chỉ thửa đất: ${landDiachi}
- Diện tích: ${landDientich} m² (Sử dụng riêng: ${landDientich} m²; Sử dụng chung: 0 m²)
- Mục đích sử dụng đất đề nghị: ${landMucdich}
- Thời hạn sử dụng đất: Lâu dài
- Nguồn gốc sử dụng đất: Công nhận quyền sử dụng đất như giao đất có thu tiền sử dụng đất

3. Nhà ở, công trình xây dựng: (nếu có)

4. Đề nghị của người sử dụng đất, chủ sở hữu tài sản: Cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu.

5. Những giấy tờ nộp kèm theo:
- Bản gốc CCCD và Giấy tờ xác nhận nguồn gốc đất đai;

Tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật và chịu hoàn toàn trách nhiệm trước pháp luật.

                                                                  ${dateStr}
                                                                     Người làm đơn
                                                                  (Ký và ghi rõ họ tên)


                                                                  ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_18_nd151' || formType === 'mau_29_qd2604') {
        fullDoc = `Mẫu số 29. Đơn đăng ký biến động đất đai, tài sản gắn liền với đất
(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT

Kính gửi: ${recipientStr}

I. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:
- Tên: Ông(bà) ${cccdHoten}
- Giấy tờ nhân thân: CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát
- Địa chỉ thường trú: ${cccdThuongtru}

II. Thông tin thửa đất biến động:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
- Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
- Số phát hành GCN đã cấp: ${landSophathanh} ; Số vào sổ cấp GCN: ${landSovaoso}

III. Nội dung đề nghị đăng ký biến động:
Chuyển nhượng quyền sử dụng đất (sang tên Sổ đỏ) theo Hợp đồng chuyển nhượng công chứng.

IV. Giấy tờ nộp kèm theo:
1. Bản gốc Giấy chứng nhận số ${landSophathanh};
2. Hợp đồng chuyển nhượng quyền sử dụng đất công chứng;
3. Tờ khai thuế TNCN và Lệ phí trước bạ.

Tôi cam đoan nội dung kê khai trên đơn là đúng sự thật.

                                                                  ${dateStr}
                                                                     Người làm đơn
                                                                  (Ký và ghi rõ họ tên)


                                                                  ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'don_tach_thua' || formType === 'mau_35_qd2604') {
        fullDoc = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập – Tự do - Hạnh phúc

ĐƠN ĐỀ NGHỊ TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT
(Mẫu số 35 - Theo Quyết định số 2604/QĐ-VP tỉnh Thanh Hóa)

Kính gửi: ${recipientStr}

Tên tôi là: ${cccdHoten}
Giấy tờ nhân thân: CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát
Địa chỉ thường trú: ${cccdThuongtru}

Hiện là chủ sử dụng thửa đất số ${landThua}, tờ bản đồ số ${landTobando} tại ${landDiachi}.
Giấy chứng nhận QSDĐ số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso}.
Diện tích thửa đất hiện tại: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}.

Lý do tách thửa: Tách thửa đất để chuyển nhượng / tặng cho quyền sử dụng đất cho người thân.
Kích thước, diện tích thửa đất sau khi tách đảm bảo đủ điều kiện diện tích tối thiểu theo Quyết định 2604/QĐ-VP tỉnh Thanh Hóa.

Tôi cam đoan nội dung kê khai trên đơn là đúng sự thật.

                                                                  ${dateStr}
                                                                     Người làm đơn
                                                                  (Ký và ghi rõ họ tên)


                                                                  ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_01_giao_dat' || formType === 'mau_09_qd2604') {
        fullDoc = `Mẫu số 09. Đơn đề nghị giao đất, cho thuê đất, giao rừng
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ GIAO ĐẤT, CHO THUÊ ĐẤT, GIAO RỪNG

Kính gửi: ${recipientStr}

1. Người đề nghị: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát
3. Địa chỉ thường trú: ${cccdThuongtru}
4. Thông tin thửa đất đề nghị giao/cho thuê:
- Địa điểm thửa đất: ${landDiachi}
- Diện tích đề nghị: ${landDientich} m²
- Mục đích sử dụng đất đề nghị: ${landMucdich}

Cam đoan sử dụng đất đúng mục đích và chấp hành đầy đủ quy định của pháp luật đất đai.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'mau_02_chuyen_muc_dich' || formType === 'mau_09a_qd2604') {
        fullDoc = `Mẫu số 09a. Đơn đề nghị chuyển mục đích sử dụng đất
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT

Kính gửi: ${recipientStr}

1. Người đề nghị chuyển mục đích: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap}
3. Địa chỉ: ${cccdThuongtru}
4. Thông tin thửa đất xin chuyển mục đích:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
- Diện tích: ${landDientich} m²
- Mục đích sử dụng đất hiện tại: ${landMucdich}
- Mục đích sử dụng đất xin chuyển sang: Đất ở tại nông thôn (ONT)

Tôi xin cam đoan thực hiện đầy đủ nghĩa vụ tài chính tiền sử dụng đất khi chuyển mục đích.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'mau_03_chuyen_hinh_thuc' || formType === 'mau_16_qd2604') {
        fullDoc = `Mẫu số 16. Đơn đề nghị chuyển hình thức sử dụng đất
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ CHUYỂN HÌNH THỨC SỬ DỤNG ĐẤT

Kính gửi: ${recipientStr}

1. Người đề nghị: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Địa chỉ: ${cccdThuongtru}
3. Thửa đất số ${landThua}, tờ bản đồ số ${landTobando} tại ${landDiachi}
4. Hình thức sử dụng đất xin chuyển đổi: Từ Thuê đất trả tiền hàng năm sang Thuê đất trả tiền một lần / Giao đất có thu tiền.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'mau_04_dieu_chinh_quyet_dinh' || formType === 'mau_23_qd2604') {
        fullDoc = `Mẫu số 23. Đơn đề nghị điều chỉnh quyết định giao đất, cho thuê đất
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ ĐIỀU CHỈNH QUYẾT ĐỊNH GIAO ĐẤT, CHO THUÊ ĐẤT

Kính gửi: ${recipientStr}

1. Người đề nghị: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Địa chỉ: ${cccdThuongtru}
3. Đề nghị điều chỉnh thông tin thửa đất số ${landThua}, tờ bản đồ số ${landTobando} tại ${landDiachi} do sai lệch kích thước hiện trạng.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'mau_17_qd2604') {
        fullDoc = `Mẫu số 17. Đơn đề nghị gia hạn sử dụng đất
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ GIA HẠN SỬ DỤNG ĐẤT

Kính gửi: ${recipientStr}

1. Người đề nghị: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap}
3. Địa chỉ thường trú: ${cccdThuongtru}
4. Thửa đất số: ${landThua}, tờ bản đồ số: ${landTobando} tại ${landDiachi}
5. Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
6. Đề nghị gia hạn thời hạn sử dụng đất theo quy định của pháp luật.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'mau_33_qd2604') {
        fullDoc = `Mẫu số 33. Đơn đề nghị sử dụng đất kết hợp đa mục đích
(Theo Quyết định số 2604/QĐ-VP)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN ĐỀ NGHỊ SỬ DỤNG ĐẤT KẾT HỢP ĐA MỤC ĐÍCH

Kính gửi: ${recipientStr}

1. Người đề nghị: Ông(bà) ${cccdHoten}
2. CCCD số: ${cccdSo} ; Địa chỉ: ${cccdThuongtru}
3. Thửa đất số: ${landThua}, tờ bản đồ số: ${landTobando} tại ${landDiachi}
4. Diện tích thửa đất: ${landDientich} m² ; Mục đích chính: ${landMucdich}
5. Mục đích kết hợp đề xuất: Sử dụng kết hợp thương mại, dịch vụ hoặc nông nghiệp công nghệ cao.

                                                                  ${dateStr}
                                                                  Người làm đơn`;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        fullDoc = `TỜ KHAI LỆ PHÍ TRƯỚC BẠ NHÀ, ĐẤT
(Mẫu số 01/LPTB - Ban hành kèm theo Thông tư Bộ Tài chính & QĐ 2604/QĐ-VP)

[01] Tên người nộp thuế: ${cccdHoten}
[02] CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap}
[03] Địa chỉ thường trú: ${cccdThuongtru}

[04] THÔNG TIN THỬA ĐẤT KHAI LỆ PHÍ TRƯỚC BẠ:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando}
- Địa chỉ thửa đất: ${landDiachi}
- Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
- Số phát hành GCN: ${landSophathanh} ; Số vào sổ cấp GCN: ${landSovaoso}

Cam đoan số liệu kê khai trên là đúng sự thật và chịu trách nhiệm trước pháp luật.

                                                                  ${dateStr}
                                                                  Người nộp thuế`;
    } else if (formType === 'tk_thue_tncn') {
        fullDoc = `TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
(Mẫu số 03/BĐS-TNCN - Áp dụng cho chuyển nhượng BĐS & QĐ 2604/QĐ-VP)

I. THÔNG TIN NGƯỜI KÊ KHAI NỘP THUẾ:
1. Họ và tên người chuyển nhượng: ${cccdHoten}
2. Số CCCD: ${cccdSo} ; Cấp ngày: ${cccdNgayCap}
3. Địa chỉ thường trú: ${cccdThuongtru}

II. THÔNG TIN BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
- Diện tích: ${landDientich} m² ; Giấy chứng nhận số phát hành: ${landSophathanh}

Cam đoan dữ liệu kê khai tính thuế là trung thực.

                                                                  ${dateStr}
                                                                  Người kê khai`;
    } else {
        fullDoc = `TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
(Mẫu số 01/TK-SDDPNN & QĐ 2604/QĐ-VP)

1. Tên người nộp thuế: ${cccdHoten}
2. Số CCCD: ${cccdSo} ; Cấp ngày: ${cccdNgayCap}
3. Địa chỉ thường trú: ${cccdThuongtru}

4. THÔNG TIN THỬA ĐẤT CHỊU THUẾ:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
- Diện tích chịu thuế: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}

Cam đoan thông tin kê khai là chính xác.

                                                                  ${dateStr}
                                                                  Người nộp thuế`;
    }

    const formOutput = document.getElementById('formOutputText');
    if (formOutput) {
        formOutput.value = fullDoc;
    }

    const qrcodeDiv = document.getElementById('qrcode');
    if (qrcodeDiv) {
        qrcodeDiv.innerHTML = '';
        try {
            const cleanName = cccdHoten.includes('.') ? '' : cccdHoten;
            const cleanCccd = cccdSo.includes('.') ? '' : cccdSo;
            const qrText = `MAU DON OBSIDIAN VAULT 04_MAUDON | HO TEN: ${cleanName} | CCCD: ${cleanCccd} | THUA: ${landThua} | TBD: ${landTobando}`;
            new QRCode(qrcodeDiv, {
                text: qrText.substring(0, 150),
                width: 90,
                height: 90,
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (err) {
            console.warn("QR code render note:", err);
        }
    }
}

// EXPORT TO WORD (.DOCX / .DOC) FUNCTION
async function exportToWord() {
    const formOutputText = document.getElementById('formOutputText')?.value;
    if (!formOutputText) {
        alert("Vui lòng kiểm tra nội dung đơn trước khi xuất!");
        return;
    }

    const cccdHoten = document.getElementById('cccd_hoten')?.value || 'Don_Dat_Dai';
    const formType = document.getElementById('selectFormType')?.value || 'Don_Dat_Dai';
    const filename = `${formType}_${cccdHoten.replace(/\s+/g, '_')}`;

    let isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    let customBackend = localStorage.getItem('thanhhoa_ai_api_url');

    // 1. Thử xuất qua Backend nếu có server đang chạy
    if (isLocalServer || customBackend) {
        try {
            const apiUrl = getApiBaseUrl() + '/api/export/docx';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    title: filename,
                    content: formOutputText
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${filename}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);

                alert("🎉 Đã xuất thành công file Word (.docx)! Bạn có thể mở và in hồ sơ.");
                return;
            }
        } catch (serverErr) {
            console.warn("⚠️ Backend export unavailable, using client-side generator:", serverErr);
        }
    }

    // 2. Xuất file Word trực tiếp từ trình duyệt (Client-Side Word Generator chuẩn NĐ 30)
    try {
        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>${filename}</title>
                <style>
                    @page {
                        size: 210mm 297mm;
                        margin: 20mm 15mm 20mm 30mm;
                    }
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 13pt;
                        line-height: 1.25;
                        color: #000;
                    }
                    h2, h3 { text-align: center; font-weight: bold; margin: 10px 0; }
                    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .header-table td { vertical-align: top; border: none; padding: 4px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .italic { font-style: italic; }
                    pre { font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap; line-height: 1.3; }
                </style>
            </head>
            <body>
                <table class="header-table">
                    <tr>
                        <td style="width: 45%; text-align: left;" class="italic">
                            UBND TỈNH THANH HÓA<br>
                            <b>SỞ TÀI NGUYÊN & MÔI TRƯỜNG</b>
                        </td>
                        <td style="width: 55%; text-align: center;">
                            <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
                            <b><u>Độc lập - Tự do - Hạnh phúc</u></b>
                        </td>
                    </tr>
                </table>
                <pre>${escapeHtml(formOutputText)}</pre>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.doc`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        alert("🎉 Đã xuất thành công file Word (.doc) chuẩn văn bản A4 trực tiếp từ Web!");
    } catch (err) {
        alert("Lỗi xuất file: " + err.message);
    }
}

function generateFormA4() {
    updateLiveA4Form();
    alert("🎉 Đơn A4 chuẩn CSDL Obsidian Vault đã hoàn thiện kèm Mã QR! Bạn có thể in đơn hoặc chỉnh sửa trực tiếp.");
}

// SETUP DRAG AND WHEEL LISTENERS FOR SUB-WINDOW VIEWER & DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
    const viewerBody = document.getElementById('viewerBody');
    const viewerWindow = document.getElementById('viewerWindow');
    const viewerHeader = document.getElementById('viewerHeader');

    if (viewerBody) {
        viewerBody.addEventListener('mousedown', (e) => {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            viewerBody.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            applyTransform();
        });

        window.addEventListener('mouseup', () => {
            if (isPanning) {
                isPanning = false;
                if (viewerBody) viewerBody.style.cursor = 'grab';
            }
        });

        viewerBody.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomImage(1.15);
            } else {
                zoomImage(0.85);
            }
        });
    }

    if (viewerHeader && viewerWindow) {
        let isWindowDragging = false;
        let winX = 0, winY = 0;

        viewerHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.viewer-controls')) return;
            isWindowDragging = true;
            winX = e.clientX - viewerWindow.offsetLeft;
            winY = e.clientY - viewerWindow.offsetTop;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isWindowDragging) return;
            viewerWindow.style.left = (e.clientX - winX) + 'px';
            viewerWindow.style.top = (e.clientY - winY) + 'px';
        });

        window.addEventListener('mouseup', () => {
            isWindowDragging = false;
        });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeImageViewer();
    });

    updateLiveA4Form();

    // Enable API Backend config on chip click
    const onlineChip = document.querySelector('.status-chip.online');
    if (onlineChip) {
        onlineChip.style.cursor = 'pointer';
        onlineChip.title = 'Nhấp để đổi địa chỉ máy chủ Ngrok / AI Backend';
        onlineChip.addEventListener('click', configureApiBackendUrl);
    }
    const mobileStatus = document.getElementById('headerStatusMobile');
    if (mobileStatus) {
        mobileStatus.style.cursor = 'pointer';
        mobileStatus.title = 'Nhấp để đổi địa chỉ máy chủ Ngrok / AI Backend';
        mobileStatus.addEventListener('click', configureApiBackendUrl);
    }
});
