// ============================================================
// THANH HOA LAND AI v2026 — Application Logic
// Mobile-First • Touch-Safe • Responsive
// ============================================================
console.log('✅ ThanhHoa Land AI v2026 loaded');

// ── Multi-Platform API Gateway Base URL ──
const API_BASE_URL = (window.location.hostname.includes('github.io') || window.location.hostname.includes('thanhhoalandai') || window.location.protocol === 'https:')
    ? 'https://bot-troly-luat-telegram.onrender.com'
    : '';

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
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        // Kiểm tra Content-Type trước khi parse — tránh lỗi "Unexpected token '<'"
        const contentType = response.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            throw new Error('Server lỗi (HTTP ' + response.status + '). Vui lòng thử lại sau.');
        }

        chatContainer.removeChild(typingDiv);

        // Xử lý khi bị Security Guard chặn (429)
        if (!response.ok || data.blocked) {
            const blockedMsg = document.createElement('div');
            blockedMsg.className = 'message bot';
            blockedMsg.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-bubble"><p style="color:#f59e0b;">\u26a0\ufe0f ${data.error || 'Yêu cầu bị từ chối. Vui lòng thử lại sau.'}</p></div>
            `;
            chatContainer.appendChild(blockedMsg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            return;
        }

        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        const modelLabel = data.model ? ` • <span style="color:#38bdf8;">${escapeHtml(data.model)}</span>` : '';
        botMsg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                ${formatMarkdown(data.answer)}
                <div class="msg-source-tag"><i class="fa-solid fa-database"></i> Trích nguồn: CSDL Pháp luật Đất đai${modelLabel}</div>
            </div>
        `;
        chatContainer.appendChild(botMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (err) {
        if (chatContainer.contains(typingDiv)) chatContainer.removeChild(typingDiv);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message bot';
        const friendlyMsg = err.message.includes('Failed to fetch')
            ? 'Không thể kết nối máy chủ. Kiểm tra server đang chạy.'
            : err.message;
        errorMsg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble"><p style="color:var(--red);">\u26a0\ufe0f ${friendlyMsg}</p></div>
        `;
        chatContainer.appendChild(errorMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
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
        const response = await fetch(`${API_BASE_URL}/api/ocr/scan`, {
            method: 'POST',
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
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim();
    const cccdSo = (document.getElementById('cccd_so')?.value || '').trim();
    const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim();
    const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim();
    const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim();
    
    const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim();
    const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim();
    const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim();
    const landNoiCap = (document.getElementById('land_noicap')?.value || '').trim();
    const landThua = (document.getElementById('land_thua')?.value || '').trim();
    const landTobando = (document.getElementById('land_tobando')?.value || '').trim();
    const landDiachi = (document.getElementById('land_diachi')?.value || '').trim();
    const landDientich = (document.getElementById('land_dientich')?.value || '').trim();
    const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim();

    // Điền dấu chấm nếu không có giá trị
    const valHoten = cccdHoten || '.....................................................................................................................';
    const valSo = cccdSo || '......................................................................................';
    const valNgaySinh = cccdNgaySinh || '....................';
    const valThuongtru = cccdThuongtru || '..........................................................................................................................';
    const valThua = landThua || '......................';
    const valTobando = landTobando || '......................';
    const valDiachi = landDiachi || '.........................................................................................................................';
    const valDientich = landDientich || '……………';
    const valMucdich = landMucdich || '…………………………';
    const valSophathanh = landSophathanh || '................................';
    const valSovaoso = landSovaoso || '................................';
    const valNgayCap = landNgayCap || '……../ ……../………..';

    const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
    const dateYear = new Date().getFullYear();
    const dateStr = `..... ngày .... tháng... năm ${dateYear}`;

    let fullDoc = "";

    if (formType === 'mau_25_qd2604') {
        // MẪU SỐ 25 CHUẨN 100% THEO media_1788077058155.png VÀ PLIV_signed.pdf TRANG 49-51
        fullDoc = `Mẫu số 25. Đơn đăng ký đất đai, tài sản gắn liền với đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------

ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
Kính gửi: ${recipientStr} (1)

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:
(Trường hợp nhiều người cùng sử dụng đất, cùng sở hữu tài sản thì kê khai tên người cùng sử dụng đất, cùng sở hữu tài sản đó theo Mẫu số 25a)
a) Họ và tên (2): ${valHoten}
b) Giấy tờ nhân thân/pháp nhân (3): ${valSo}
c) Mã số thuế (nếu có): .........................................................................................................
d) Địa chỉ (4): ${valThuongtru}
đ) Điện thoại liên hệ (nếu có): ……………….. Hộp thư điện tử (nếu có): .........................

2. Thửa đất đăng ký (người sử dụng đất là tổ chức thì không phải kê khai mục này):
(Trường hợp đăng ký nhiều thửa đất nông nghiệp mà không đề nghị cấp Giấy chứng nhận hoặc đề nghị cấp chung một Giấy chứng nhận cho nhiều thửa đất nông nghiệp thì không kê khai các nội dung tại Mục này mà chỉ ghi tổng số thửa và kê khai từng thửa đất theo Mẫu số 25b)
a) Thửa đất số(4a): ${valThua} ; Tờ bản đồ số(4b): ${valTobando}
b) Địa chỉ (5): ${valDiachi}
c) Diện tích (6): ${valDientich} m2; sử dụng chung: …….…..m2; sử dụng riêng: ${valDientich} m2
d) Sử dụng vào mục đích(7): ${valMucdich}, từ thời điểm: ...................................
đ) Thời hạn đề nghị được sử dụng đất(8): Lâu dài
e) Nguồn gốc sử dụng đất(9): Sử dụng đất ổn định, không có tranh chấp
g) Có quyền hoặc hạn chế quyền đối với thửa đất liền kề số …………, tờ bản đồ số ………, của ……..……, nội dung về quyền đối với thửa đất liền kề ............................. (10).

3. Nhà ở, công trình xây dựng (người sử dụng đất là tổ chức thì không phải kê khai mục này):
(Chỉ kê khai nếu có nhu cầu đăng ký hoặc chứng nhận quyền sở hữu tài sản; Trường hợp có nhiều nhà ở, công trình xây dựng khác trên cùng 01 thửa đất thì chỉ kê khai các thông tin chung và tổng diện tích của các nhà ở, công trình xây dựng; đồng thời lập danh sách nhà ở, công trình theo Mẫu số 25c)
a) Loại nhà ở, công trình xây dựng (11): ................................................................................
b) Diện tích xây dựng(12): …………… m2.
c) Diện tích sàn xây dựng/diện tích sử dụng (13): ……………..m2.
d) Sở hữu chung(14): …………… m2, sở hữu riêng(14): ……………….. m2.
đ) Số tầng: …….. tầng; trong đó, số tầng nổi: ……… tầng, số tầng hầm: ……….tầng.
e) Nguồn gốc (15): ..................................................................................................................
g) Năm hoàn thành xây dựng(16): ..........................................................................................
h) Thời hạn sở hữu đến (17): ..................................................................................................
i) Cam kết chịu trách nhiệm về nhà ở, công trình xây dựng(18): □

4. Đề nghị của người sử dụng đất, chủ sở hữu tài sản gắn liền với đất: (Đánh dấu vào ô lựa chọn)
a) Đề nghị đăng ký đất đai, tài sản gắn liền với đất [x]
b) Đề nghị cấp Giấy chứng nhận [x]
c) Đề nghị ghi nợ tiền sử dụng đất (đối với cá nhân) □
d) Đề nghị khác (nếu có): .....................................................................................................

5. Thông tin về đối tượng được miễn tiền sử dụng đất, tiền thuê đất (nếu có)(19): 
...............................................................................................................................................

6. Những giấy tờ nộp kèm theo(20):
(1) ..........................................................................................................................................
(2) ..........................................................................................................................................
(3) ..........................................................................................................................................

Tôi/chúng tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật, nếu sai tôi/chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật.

                                                                  ${dateStr}
                                                      Người sử dụng đất/Người kê khai
                                                   (Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))


                                                              ${cccdHoten}

Hướng dẫn kê khai đơn: “Lưu ý: xem kỹ hướng dẫn viết Đơn trước khi kê khai; không tẩy xóa, sửa chữa trên Đơn”
(1) Đối với hộ gia đình, cá nhân, cộng đồng dân cư thì ghi: “Ủy ban nhân dân/Chủ tịch UBND xã/phường/đặc khu …”; đối với tổ chức, người gốc Việt Nam định cư nước ngoài thì ghi: “Sở Nông nghiệp và Môi trường …” .
(2) Cá nhân: Ghi họ và tên bằng chữ in hoa, năm sinh theo giấy tờ nhân thân. Người gốc Việt Nam định cư ở nước ngoài: Ghi họ tên, năm sinh, quốc tịch. Cộng đồng dân cư: Ghi tên của cộng đồng dân cư. Tổ chức: Ghi theo quyết định thành lập hoặc giấy đăng ký kinh doanh.
(3) Cá nhân: Ghi số định danh cá nhân hoặc số, ngày cấp và nơi cấp hộ chiếu. Tổ chức: Ghi số, ngày ký, cơ quan ký văn bản theo quyết định thành lập hoặc giấy đăng ký kinh doanh.
(4) Cá nhân: Ghi địa chỉ nơi đăng ký thường trú. Người gốc Việt Nam định cư ở nước ngoài: Ghi địa chỉ đăng ký thường trú ở Việt Nam (nếu có). Cộng đồng dân cư: Ghi địa chỉ nơi sinh hoạt chung của cộng đồng. Tổ chức: Ghi địa chỉ trụ sở chính theo quyết định thành lập hoặc giấy đăng ký kinh doanh.
(4a), (4b): Ghi đối với trường hợp người sử dụng đất có thông tin; trường hợp không có thông tin thì không phải kê khai nội dung này, cơ quan giải quyết thủ tục xác định thông tin này trong quá trình giải quyết thủ tục.
(5) Ghi số nhà, tên đường, phố (nếu có); tên điểm dân cư (tổ dân phố, thôn, xóm, làng, ấp, bản, bon, buôn, phum, sóc, điểm dân cư tương tự) hoặc tên khu vực, xứ đồng (đối với thửa đất ngoài khu dân cư); tên đơn vị hành chính các cấp xã, tỉnh nơi có thửa đất.
(6) Ghi diện tích của thửa đất bằng số Ả Rập, được làm tròn số đến một chữ số thập phân.
(7) Ghi mục đích chính đang sử dụng. Từ thời điểm ghi ngày ... tháng ... năm ...
(8) Ghi “đến ngày …/…/…” hoặc “Lâu dài” hoặc ghi bằng dấu “-/-” nếu không xác định được thời hạn.
(9) Ghi được Nhà nước giao đất có thu tiền sử dụng đất hoặc giao đất không thu tiền sử dụng đất hoặc cho thuê đất trả tiền một lần cho cả thời gian thuê hoặc cho thuê đất trả tiền thuê đất hằng năm hoặc nhận chuyển quyền (chuyển đổi, chuyển nhượng, thừa kế, tặng cho, góp vốn) hoặc nguồn gốc khác như do ông cha để lại, lấn, chiếm, giao đất không đúng thẩm quyền, khai hoang...`;
    } else if (formType === 'mau_29_qd2604') {
        // MẪU SỐ 29 (TRANG 64-65 PLIV_signed.pdf)
        fullDoc = `Mẫu số 29. Đơn đăng ký biến động đất đai, tài sản gắn liền với đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------
ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT

Kính gửi: ${recipientStr} (1)

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:
a) Tên(2): ${valHoten}
b) Giấy tờ nhân thân/pháp nhân(2): ${valSo}
c) Địa chỉ(2): ${valThuongtru}
d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...........
(Trường hợp có nhiều đồng sử dụng, sở hữu thì kê khai thông tin một người đại diện; đồng thời lập danh sách theo bảng 01 kèm theo)

2. Giấy chứng nhận đã cấp (3)
2.1. Số vào sổ cấp Giấy chứng nhận: ${valSovaoso};
2.2. Số phát hành Giấy chứng nhận (Số seri): ${valSophathanh};
2.3. Ngày cấp Giấy chứng nhận: ${valNgayCap};

3. Nội dung biến động(4):
.................................................................................................................................
.................................................................................................................................

4. Thông tin về đối tượng được miễn, giảm nghĩa vụ tài chính về đất đai (nếu có)(5):
.................................................................................................................................

5. Giấy tờ liên quan đến nội dung biến động nộp kèm theo đơn này gồm có(6):
(1) Giấy chứng nhận đã cấp;
(2) ..........................................................................................................................
(3) ..........................................................................................................................
[x] Có nhu cầu cấp mới Giấy chứng nhận (7)
[ ] Không có nhu cầu cấp mới Giấy chứng nhận

Cam đoan nội dung kê khai trên đơn là đúng sự thật và chịu trách nhiệm trước pháp luật.

                                                                  ${dateStr}
                                                                  Người viết đơn
                                                       (Ký, ghi rõ họ tên và đóng dấu nếu có)


                                                              ${cccdHoten}

Hướng dẫn kê khai đơn:
(1) Đối với hộ gia đình, cá nhân, cộng đồng dân cư, người gốc Việt Nam định cư ở nước ngoài thực hiện các thủ tục hành chính thuộc thẩm quyền giải quyết của Văn phòng Đăng ký đất đai/Chi nhánh Văn phòng Đăng ký đất đai thì ghi: “Văn phòng đăng ký đất đai/Chi nhánh Văn phòng đăng ký đất đai……” nơi có đất; đối với tổ chức trong nước, tổ chức tôn giáo, tổ chức tôn giáo trực thuộc, tổ chức kinh tế có vốn đầu tư nước ngoài, tổ chức nước ngoài có chức năng ngoại giao và tổ chức nước ngoài, cá nhân nước ngoài thì ghi “Văn phòng đăng ký đất đai Thanh Hóa”.
Trường hợp thực hiện các thủ tục hành chính thuộc thẩm quyền giải quyết của Chủ tịch UBND cấp xã/phường thì ghi: “Chủ tịch Ủy ban nhân dân xã/phường”.
(2) Ghi thông tin như trên Giấy chứng nhận đã cấp. Trường hợp nhận chuyển quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất thì ghi thông tin của bên nhận chuyển quyền.
(3) Ghi thông tin như trên Giấy chứng nhận đã cấp.
(4) Ghi nội dung biến động như: “nhận chuyển nhượng, nhận tặng cho ..., cấp lại Giấy chứng nhận do bị mất, cấp đổi Giấy chứng nhận ...”.
(7) Tích dấu x vào ô lựa chọn.`;
    } else if (formType === 'mau_35_qd2604') {
        // MẪU SỐ 35 (TRANG 80-82 PLIV_signed.pdf)
        fullDoc = `Mẫu số 35. Đơn đề nghị tách thửa đất, hợp thửa đất
CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_____________________________________

ĐƠN ĐỀ NGHỊ
TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT

Kính gửi: ${recipientStr}

I. KÊ KHAI CỦA NGƯỜI SỬ DỤNG ĐẤT
(Xem kỹ hướng dẫn ở cuối đơn này trước khi viết đơn; không tẩy xoá, sửa chữa nội dung đã viết)

1. Người sử dụng đất (1):
a) Tên: ${valHoten}
b) Giấy tờ nhân thân/pháp nhân số (2): ${valSo}
c) Địa chỉ: ${valThuongtru}
d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...............

2. Đề nghị tách thửa đất, hợp thửa đất (3) như sau:
a) Tách thửa đất số ${valThua}, tờ bản đồ số: ${valTobando}, diện tích: ${valDientich} m2; loại đất: ${valMucdich}; địa chỉ thửa đất: ${valDiachi}; Giấy chứng nhận: số vào sổ cấp GCN: ${valSovaoso}, ngày cấp GCN: ${valNgayCap}, thành ……… thửa:
Thửa thứ nhất: diện tích: …..……m2; loại đất: ${valMucdich}
Thửa thứ hai: diện tích: ……..…m2; loại đất: ${valMucdich}
(Liệt kê các thửa đất tách thửa): ......................................................................................................................

b) Hợp thửa đất số .……....., tờ bản đồ số: ………...…, diện tích: ……...……m2; loại đất: …………, địa chỉ thửa đất: ..........................................................; Giấy chứng nhận: số vào sổ cấp GCN: ….. ……...…, ngày cấp GCN: ..........................., với: Thửa đất số: ……..., tờ bản đồ số: …....…, diện tích: ……..……m2; loại đất: ……………..., địa chỉ thửa đất: ...................; Giấy chứng nhận: số vào sổ cấp GCN: ….…, ngày cấp GCN: .....................
(liệt kê các thửa đất cần hợp): .........................................................................................................................
Thành thửa đất mới: Diện tích: ………m2; loại đất: ……………………..…...
(liệt kê các thửa đất sau hợp thửa): ....................................................................................................................

c) Tách đồng thời với hợp thửa đất:
........................................................................................................................................................
(Mô tả chi tiết việc tách, hợp thửa): ....................................................................................................................

3. Lý do tách, hợp thửa đất: .............................................................................................
4. Giấy tờ nộp kèm theo đơn này gồm có:
- Giấy chứng nhận và Bản vẽ tách thửa đất, hợp thửa đất các thửa đất nêu trên
- ……………………………………………………………….……………………………...
5. Đề nghị cấp Giấy chứng nhận: Có đề nghị cấp Giấy chứng nhận
(ghi có hoặc không thay đổi người sử dụng đất)

Tôi cam đoan nội dung kê khai trên đơn là đúng.

                                                                  ${dateStr}
                                                                  Người viết đơn (4)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}

II. Ý KIẾN CỦA VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI/CHI NHÁNH VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI (5)
.................................................................................................................................................................
.................................................................................................................................................................

Ngày ……. tháng …… năm …...                              Ngày ……. tháng …… năm …...
       Người kiểm tra                                      Văn phòng đăng ký đất đai/Chi nhánh
(Ký, ghi rõ họ tên, chức vụ)                                    Văn phòng đăng ký đất đai
                                                              (Ký, ghi rõ họ tên, chức vụ, đóng dấu)

Hướng dẫn viết đơn:
(1) Ghi tên người sử dụng đất theo Giấy chứng nhận. Trường hợp các thửa đất gốc thuộc nhiều người sử dụng đất khác nhau thì ghi đầy đủ người sử dụng đất của các thửa đất gốc đó.
(2) Ghi số định danh cá nhân hoặc số, ngày cấp và nơi cấp hộ chiếu. Đối với tổ chức thì ghi số, ngày ký, cơ quan ký văn bản theo quyết định thành lập hoặc giấy đăng ký kinh doanh hoặc giấy phép đầu tư.
(3) Ghi thông tin thửa đất theo Giấy chứng nhận.
(4) Người sử dụng đất của các thửa đất gốc cùng ký vào Đơn.
(5) Văn phòng đăng ký đất đai/Chi nhánh Văn phòng đăng ký đất đai ghi rõ “Đủ điều kiện tách thửa đất, hợp thửa đất như bản vẽ gửi kèm” và số thứ tự thửa đất, tờ bản đồ dự kiến sau khi tách thửa đất, hợp thửa đất.`;
    } else if (formType === 'mau_09_qd2604') {
        // MẪU SỐ 09 (TRANG 16 PLIV_signed.pdf)
        fullDoc = `Mẫu số 09. Đơn đề nghị giao đất; cho thuê đất; giao đất và giao rừng; cho thuê đất và cho thuê rừng
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ (1)
Kính gửi: Cơ quan, người có thẩm quyền (2): ${recipientStr}

1. Người đề nghị (3): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): ........................................................................
4. Địa điểm thửa đất/khu đất/khu rừng (tại xã/phường..., tỉnh/thành phố ...): ${valDiachi}
5. Diện tích đất (m2): ${valDientich}
6. Diện tích đất chuyên trồng lúa phải nộp tiền theo quy định của pháp luật về đất trồng lúa (m2) (nếu có): ....................
7. Diện tích rừng (m2) (nếu có): ....................
8. Để sử dụng vào mục đích (4): ${valMucdich}
9. Hình thức sử dụng đất (5): Cho thuê đất thu tiền thuê đất hằng năm [x]
10. Thời hạn sử dụng đất: 50 năm
11. Xác định trường hợp được miễn tiền sử dụng đất, tiền thuê đất theo quy định (nếu có)(6): .....................................................
12. Cam kết sử dụng đất, sử dụng rừng đúng mục đích, chấp hành quy định của pháp luật về đất đai, pháp luật về lâm nghiệp, pháp luật về đất trồng lúa và pháp luật khác có liên quan; nộp tiền sử dụng đất, tiền thuê đất, tiền để nhà nước bổ sung diện tích đất chuyên trồng lúa bị mất hoặc tăng hiệu quả sử dụng đất trồng lúa (nếu có), các nghĩa vụ tài chính khác theo quy định của pháp luật (nếu có) đầy đủ, đúng hạn.
Các cam kết khác (nếu có): ...............................................................................................
13. Tài liệu gửi kèm (nếu có)(7): Trích đo địa chính, Dự án đầu tư.

                                                                  Người làm đơn (8)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_09a_qd2604') {
        // MẪU SỐ 09A (TRANG 17 PLIV_signed.pdf)
        fullDoc = `Mẫu số 09a. Đơn đề nghị chuyển mục đích sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (9): ${recipientStr}

1. Người đề nghị chuyển mục đích sử dụng đất (10): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): ..................................................................
4. Thông tin thửa đất/khu đất:
- Địa điểm thửa đất/khu đất (tại xã/phường..., tỉnh/thành phố ...): ${valDiachi}
- Diện tích và mục đích sử dụng hiện tại (11): ${valDientich} m2, Loại đất: ${valMucdich}
- Thời hạn sử dụng đất: Lâu dài
- Hình thức sử dụng đất (12): Giao đất có thu tiền sử dụng đất / Công nhận QSDĐ
- Số, ngày tháng năm ban hành văn bản của cấp có thẩm quyền về thửa đất/khu đất: Giấy chứng nhận QSDĐ số ${valSophathanh} cấp ngày ${valNgayCap}.
5. Nội dung đề nghị chuyển mục đích sử dụng đất:
- Diện tích và mục đích sử dụng đất đề nghị chuyển: Chuyển ${valDientich} m2 sang Đất ở tại nông thôn (ONT) / Đất ở tại đô thị (ODT).
- Diện tích đất chuyên trồng lúa phải nộp tiền theo quy định (m2) (nếu có): ..........................................................
- Thời hạn sử dụng đất: Ổn định lâu dài
- Hình thức sử dụng đất (13): Giao đất có thu tiền sử dụng đất.
6. Xác định trường hợp được miễn tiền sử dụng đất, tiền thuê đất theo quy định (nếu có)(14): .....................................................
7. Cam kết sử dụng đất đúng mục đích, chấp hành quy định của pháp luật về đất đai, pháp luật về đất trồng lúa; nộp tiền sử dụng đất, tiền thuê đất, tiền để nhà nước bổ sung diện tích đất chuyên trồng lúa bị mất hoặc tăng hiệu quả sử dụng đất trồng lúa (nếu có), các nghĩa vụ tài chính khác theo quy định của pháp luật (nếu có) đầy đủ, đúng hạn.
Các cam kết khác (nếu có): ...............................................................................................
8. Tài liệu gửi kèm (nếu có) (15): Bản gốc Giấy chứng nhận QSDĐ số ${valSophathanh}, Bản sao Thẻ CCCD.

                                                                  Người làm đơn (16)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_10_qd2604') {
        // MẪU SỐ 10 (TRANG 19 PLIV_signed.pdf)
        fullDoc = `Mẫu số 10. Đơn đề nghị giao đất; cho thuê đất đối với trường hợp giao đất, cho thuê đất thông qua đấu giá quyền sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ (20)
Kính gửi: Cơ quan, người có thẩm quyền (21): ${recipientStr}

1. Người đề nghị (22): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): .........................................................................................
4. Địa điểm thửa đất/khu đất/khu rừng: ${valDiachi}
5. Diện tích đất (m2): ${valDientich}
6. Để sử dụng vào mục đích (23): ${valMucdich}
7. Hình thức sử dụng đất (24): Giao đất có thu tiền sử dụng đất / Cho thuê đất thu tiền một lần
8. Thời hạn sử dụng đất: Ổn định lâu dài / 50 năm
9. Cam kết sử dụng đất đúng mục đích, nộp tiền trúng đấu giá quyền sử dụng đất đầy đủ, đúng hạn.
10. Tài liệu gửi kèm (nếu có) (25): Quyết định công nhận kết quả trúng đấu giá QSDĐ.

                                                                  Người làm đơn (26)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_11_qd2604') {
        // MẪU SỐ 11 (TRANG 20 PLIV_signed.pdf)
        fullDoc = `Mẫu số 11. Văn bản đề nghị miễn, giảm tiền thuê đất, tiền sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

VĂN BẢN ĐỀ NGHỊ MIỄN, GIẢM TIỀN SỬ DỤNG ĐẤT, TIỀN THUÊ ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (27): ${recipientStr}

1. Người đề nghị (28): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin liên hệ: .................................................................................................................
4. Địa điểm thửa đất: ${valDiachi}
5. Mục đích sử dụng đất (29): ${valMucdich}
6. Hình thức sử dụng đất (30): Giao đất có thu tiền sử dụng đất / Thuê đất
7. Thời hạn sử dụng đất: Ổn định lâu dài
8. Miễn tiền sử dụng đất, tiền thuê đất: Đối tượng, lý do miễn: .....................................................
9. Giảm tiền sử dụng đất, tiền thuê đất (31): Mức đề nghị giảm: ...................................................
12. Các cam kết khác: Cam kết kê khai đúng sự thật và chấp hành nghiêm chỉnh quy định pháp luật.
13. Tài liệu gửi kèm: Giấy tờ chứng minh thuộc đối tượng miễn, giảm nghĩa vụ tài chính.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_15_qd2604') {
        // MẪU SỐ 15 (TRANG 27-30 PLIV_signed.pdf)
        fullDoc = `Mẫu số 15. Phiếu chuyển thông tin để xác định nghĩa vụ tài chính về đất đai
(TÊN ĐƠN VỊ CHUYỂN THÔNG TIN)
-------
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------
Số: ……../PCTT                                           ….. , ngày … tháng …. năm ....

PHIẾU THÔNG TIN ĐỂ XÁC ĐỊNH NGHĨA VỤ TÀI CHÍNH VỀ ĐẤT ĐAI
Kính gửi: Cơ quan Thuế ....................................................

I. THÔNG TIN VỀ HỒ SƠ THỦ TỤC
1. Mã số hồ sơ thủ tục hành chính (1): ……………………………
2. Ngày nhận đủ hồ sơ hợp lệ (2): …………………………………
3. Loại thủ tục cần xác định nghĩa vụ tài chính (3): Đăng ký biến động / Cấp Giấy chứng nhận QSDĐ
4. Căn cứ pháp lý (53): Luật Đất đai 2024 và các văn bản hướng dẫn thi hành.

II. THÔNG TIN VỀ NGƯỜI SỬ DỤNG ĐẤT, CHỦ SỞ HỮU TÀI SẢN GẮN LIỀN VỚI ĐẤT
1. THÔNG TIN CHUNG VỀ NGƯỜI SỬ DỤNG ĐẤT / NGƯỜI NHẬN CHUYỂN QUYỀN:
1. Tên (4): ${valHoten}
2. Địa chỉ (5): ${valThuongtru}
3. Mã số thuế / Số định danh cá nhân (6): ${valSo} ; Ngày sinh: ${valNgaySinh}

III. THÔNG TIN VỀ ĐẤT
1. Thửa đất số (8): ${valThua} ; Tờ bản đồ số: ${valTobando}
2. Địa chỉ tại: ${valDiachi}
3. Diện tích thửa đất: ${valDientich} m2 (Sử dụng riêng: ${valDientich} m2)
4. Nguồn gốc sử dụng đất: Sử dụng đất ổn định, nhận chuyển nhượng / Cấp GCN lần đầu
5. Mục đích sử dụng đất (9): ${valMucdich}
6. Thời hạn sử dụng đất: Ổn định lâu dài [x]
7. Giấy tờ về quyền sử dụng đất (11): GCN QSDĐ số ${valSophathanh} cấp ngày ${valNgayCap}.

                                                                  THỦ TRƯỞNG ĐƠN VỊ
                                                              (Ký, ghi rõ họ tên, đóng dấu)`;
    } else if (formType === 'mau_16_qd2604') {
        // MẪU SỐ 16 (TRANG 34 PLIV_signed.pdf)
        fullDoc = `Mẫu số 16. Đơn đề nghị chuyển hình thức sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng .... năm ....

ĐƠN ĐỀ NGHỊ CHUYỂN HÌNH THỨC SỬ DỤNG ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (56): ${recipientStr}

1. Người đề nghị (57): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin liên hệ: .................................................................................................................
4. Thông tin thửa đất/khu đất:
- Địa điểm: ${valDiachi}
- Diện tích: ${valDientich} m2, Mục đích hiện tại: ${valMucdich}
- Hình thức sử dụng đất hiện tại (59): Thuê đất trả tiền hằng năm
5. Nội dung đề nghị chuyển hình thức sử dụng đất:
- Diện tích (m2): ${valDientich}
- Chuyển từ hình thức: Thuê đất trả tiền hằng năm sang Thuê đất trả tiền một lần cho cả thời gian thuê (hoặc Giao đất có thu tiền).
6. Cam kết sử dụng đất đúng mục đích và nộp đầy đủ nghĩa vụ tài chính đúng hạn.

                                                                  Người làm đơn (64)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_17_qd2604') {
        // MẪU SỐ 17 (TRANG 35 PLIV_signed.pdf)
        fullDoc = `Mẫu số 17. Đơn đề nghị gia hạn sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ GIA HẠN SỬ DỤNG ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người đề nghị (2): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin về thửa đất/khu đất:
a) Thửa đất số: ${valThua} ; 4.2. Tờ bản đồ số: ${valTobando}
b) Diện tích đất (m2): ${valDientich}
c) Mục đích sử dụng đất (3): ${valMucdich}
d) Địa điểm: ${valDiachi}
g) GCN đã cấp: Số phát hành: ${valSophathanh} ; Số vào sổ: ${valSovaoso}, ngày cấp: ${valNgayCap}.
5. Nội dung đề nghị gia hạn: Thời gian gia hạn: .......... năm (đến ngày ...../...../..........)
Lý do gia hạn: Tiếp tục sử dụng đất đúng mục đích, phục vụ sản xuất kinh doanh / đời sống ổn định.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_18_qd2604') {
        // MẪU SỐ 18 (TRANG 36 PLIV_signed.pdf)
        fullDoc = `Mẫu số 18. Đơn đề nghị điều chỉnh thời hạn sử dụng đất của dự án đầu tư
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------
..., ngày... tháng... năm...

ĐƠN ĐỀ NGHỊ
Điều chỉnh thời hạn sử dụng đất của dự án đầu tư
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người sử dụng đất (2): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin về thửa đất đang sử dụng: Thửa số: ${valThua} ; Tờ bản đồ: ${valTobando} ; Diện tích: ${valDientich} m2 tại ${valDiachi}.
4. GCN đã cấp: Số phát hành: ${valSophathanh} ; Ngày cấp: ${valNgayCap}.
5. Nội dung xin điều chỉnh thời hạn sử dụng đất: Phù hợp theo Quyết định điều chỉnh tiến độ dự án đầu tư.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_23_qd2604') {
        // MẪU SỐ 23 (TRANG 45-46 PLIV_signed.pdf)
        fullDoc = `Mẫu số 23. Đơn đề nghị điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_______________________________________________
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ ĐIỀU CHỈNH QUYẾT ĐỊNH (109)
Kính gửi: Cơ quan, người có thẩm quyền (110): ${recipientStr}

1. Người đề nghị (111): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin thửa đất: Thửa số ${valThua}, Tờ bản đồ ${valTobando}, Diện tích: ${valDientich} m2 tại ${valDiachi}.
4. Lý do đề nghị điều chỉnh: Điều chỉnh ranh giới, diện tích thửa đất / sửa chữa thông tin sai sót kỹ thuật theo kết quả đo đạc địa chính mới nhất.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_33_qd2604') {
        // MẪU SỐ 33 (TRANG 76 PLIV_signed.pdf)
        fullDoc = `Mẫu số 33. Đơn đề nghị sử dụng đất kết hợp đa mục đích
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ SỬ DỤNG ĐẤT KẾT HỢP ĐA MỤC ĐÍCH
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người sử dụng đất (2): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin về thửa đất: Thửa đất số: ${valThua} ; Tờ bản đồ số: ${valTobando} ; Diện tích: ${valDientich} m2 tại ${valDiachi}.
4. Nội dung đề nghị sử dụng đất kết hợp: Sử dụng đất nông nghiệp kết hợp mục đích thương mại, dịch vụ, du lịch sinh thái (Điều 218 Luật Đất đai 2024).

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_33a_qd2604') {
        // MẪU SỐ 33A (TRANG 77 PLIV_signed.pdf)
        fullDoc = `Mẫu số 33a. Đơn đề nghị gia hạn phương án sử dụng đất kết hợp đa mục đích
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ GIA HẠN PHƯƠNG ÁN SỬ DỤNG ĐẤT KẾT HỢP ĐA MỤC ĐÍCH
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người sử dụng đất (2): ${valHoten}
2. Địa chỉ/trụ sở chính: ${valThuongtru}
3. Thông tin thửa đất: Thửa đất số: ${valThua} ; Tờ bản đồ số: ${valTobando} ; Diện tích: ${valDientich} m2 tại ${valDiachi}.
4. Nội dung đề nghị: Gia hạn thời gian thực hiện phương án sử dụng đất đa mục đích đã được phê duyệt.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten}`;
    } else if (formType === 'mau_37_qd2604') {
        // MẪU SỐ 37 (TRANG 86-88 PLIV_signed.pdf)
        fullDoc = `Mẫu số 37. Hợp đồng thuê đất
HỢP ĐỒNG THUÊ ĐẤT...
-------
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc 
------------
Số: ………/HĐTĐ                                           Thanh Hóa, ngày ... tháng ... năm ....

HỢP ĐỒNG THUÊ ĐẤT
Căn cứ Luật Đất đai 2024;
Căn cứ Quyết định cho thuê đất của Ủy ban nhân dân cấp có thẩm quyền (1);

Hôm nay, ngày... tháng... năm... tại ........................................................................................, chúng tôi gồm:
I. BÊN CHO THUÊ ĐẤT: Cơ quan có thẩm quyền tỉnh Thanh Hóa.
II. BÊN THUÊ ĐẤT: ${valHoten}, CCCD/MST: ${valSo}, Địa chỉ: ${valThuongtru}.
III. ĐIỀU KHOẢN HỢP ĐỒNG: Cho thuê thửa đất số ${valThua}, Tờ bản đồ ${valTobando}, Diện tích: ${valDientich} m2 tại ${valDiachi}.

            BÊN THUÊ ĐẤT                                              BÊN CHO THUÊ ĐẤT
(Ký và ghi rõ họ tên, đóng dấu nếu có)                     (Ký và ghi rõ họ tên, đóng dấu)`;
        } else if (formType === 'tk_thue_tncn') {
        // TỜ KHAI THUẾ THU NHẬP CÁ NHÂN (MẪU 03/BĐS-TNCN - G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tờ khai thuế thu nhập cá nhân.docx)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 03/BĐS-TNCN                                       |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                    |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                    TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
                   (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản; 
                       thu nhập từ nhận thừa kế và nhận quà tặng là bất động sản)

[01] Kỳ tính thuế: Lần phát sinh: Ngày … tháng … năm ${dateYear}
[02] Lần đầu: [x]      [03.1] Bổ sung lần thứ:…       [03.2] Số Thông báo lần trước liền kề:….

I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG
+-----+----------------------+---------------------+---------------+---------------------------------+------------+-------+--------------------+
| STT |      Họ và tên       | Mã số thuế/Số ĐDCN  |   Ngày sinh   | Hộ chiếu (Số | Ngày cấp | Nơi) | Điện thoại | Email | Tỷ lệ sở hữu (%)   |
+-----+----------------------+---------------------+---------------+---------------------------------+------------+-------+--------------------+
| [04.1]|[04.2]              | [04.3]              | [04.4]        | [04.5] | [04.6] | [04.7]        | [04.8]     | [04.9]| [04.10]            |
+-----+----------------------+---------------------+---------------+---------------------------------+------------+-------+--------------------+
|  1  | ${valHoten.padEnd(20)} | ${valSo.padEnd(19)} | ${valNgaySinh.padEnd(13)} |                                 |            |       | 100%               |
+-----+----------------------+---------------------+---------------+---------------------------------+------------+-------+--------------------+

[05] Tổ chức, cá nhân khai, nộp thuế thay (nếu có): ...............................................
[06] Mã số thuế (nếu có): .............................................................................................
[07] Văn bản ủy quyền (nếu có): Số ..............ngày ..... tháng ..... năm ........................
[08] Tên tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế (nếu có): ...........
[09] Mã số thuế: ........................................................................................................... 
[10] Hợp đồng dịch vụ làm thủ tục về thuế: Số ........................ ngày..........................

II. THÔNG TIN NGƯỜI NHẬN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG
+-----+----------------------+---------------------+---------------+---------------------------------+--------------------+
| STT |      Họ và tên       | Mã số thuế/Số ĐDCN  |   Ngày sinh   | Hộ chiếu (Số | Ngày cấp | Nơi) | Tỷ lệ sở hữu (%)   |
+-----+----------------------+---------------------+---------------+---------------------------------+--------------------+
| [11.1]|[11.2]              | [11.3]              | [11.4]        | [11.5] | [11.6] | [11.7]        | [11.8]             |
+-----+----------------------+---------------------+---------------+---------------------------------+--------------------+
|  1  |                      |                     |               |                                 | 100%               |
+-----+----------------------+---------------------+---------------+---------------------------------+--------------------+

III. LOẠI BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
[12] Quyền sử dụng đất và tài sản gắn liền trên đất: [x]
[13] Quyền sở hữu hoặc sử dụng nhà ở: [ ]
[14] Quyền thuê đất, thuê mặt nước: [ ]
[15] Bất động sản khác: [ ]

IV. ĐẶC ĐIỂM BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
[16] Giấy tờ về quyền sử dụng đất:
[16.1] Loại giấy tờ: Giấy chứng nhận quyền sử dụng đất
[16.2] Số: ${valSophathanh} ; [16.3] Nơi cấp: Chi nhánh VPĐKĐĐ ; [16.4] Ngày cấp: ${valLandNgayCap}
[17] Hợp đồng mua bán nhà ở, công trình xây dựng hình thành trong tương lai: Số .................... Ngày .................... Tỷ lệ góp vốn: ....................
[18] Hợp đồng chuyển nhượng trao đổi bất động sản: Số .................... Nơi lập: VP Công chứng .................... Ngày lập: ...../...../..........
[19] Văn bản phân chia di sản thừa kế, quà tặng là bất động sản: Nơi lập .................... Ngày lập ...../...../..........

[20] Thông tin về đất:
[20.1] Thửa đất số: ${valThua} ; [20.2] Tờ bản đồ số: ${valTobando}
[20.3] Địa chỉ: ${valDiachi}
[20.4] Xã/Phường/Đặc khu: .................................. [20.5] Tỉnh/thành phố: Thanh Hóa
[20.6] Loại đất, vị trí thửa đất (1, 2, 3, 4…):
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
| STT | Đường              | Đoạn đường         | Vị trí  | Loại đất             | Hệ số (nếu có)   | Diện tích (m2)   |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
| (1) | (2)                | (3)                | (4)     | (5)                  | (6)              | (7)              |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
|  1  |                    |                    |         | ${valMucdich.padEnd(20)} |                  | ${valDientich.padEnd(16)} |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
[20.7] Nguồn gốc đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu
[20.8] Thời hạn sử dụng đất: - Ổn định lâu dài [x]   - Có thời hạn: ..... năm
[20.9] Giá trị đất thực tế chuyển giao (nếu có): ................................................... đồng

[21] Thông tin về nhà ở, công trình xây dựng:
[21.1] Nhà ở riêng lẻ: Cấp nhà: .................... Diện tích sàn xây dựng: .................... m2
[21.4] Năm hoàn thành xây dựng: ....................
[21.16] Nguồn gốc nhà: Tự xây dựng [x]     Chuyển nhượng [ ]
[21.19] Giá trị nhà thực tế chuyển giao (nếu có): ................................................... đồng

[22] Tài sản gắn liền với đất:
[22.1] Loại tài sản: ............................................................................................
[22.2] Giá trị tài sản gắn liền với đất thực tế chuyển giao (nếu có): ................... đồng

V. THU NHẬP TỪ CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN; TỪ NHẬN THỪA KẾ, QUÀ TẶNG LÀ BẤT ĐỘNG SẢN:
[23] Loại thu nhập: [23.1] Thu nhập từ chuyển nhượng bất động sản [x]     [23.2] Thu nhập từ nhận thừa kế, quà tặng [ ]
[24] Giá trị chuyển nhượng bất động sản và tài sản khác gắn liền với đất: ................................................... đồng
[25] Giá trị bất động sản nhận thừa kế, quà tặng: ................................................... đồng
[26] Miễn thuế thu nhập từ chuyển nhượng bất động sản, thu nhập từ nhận thừa kế, quà tặng là bất động sản:
+-----+----------------------+---------------------+-------------------------------------------------------+--------------------+
| STT |      Họ và tên       | Mã số thuế/Số ĐDCN  | Lý do miễn thuế đối với nhà, đất ở duy nhất          | Lý do miễn khác    |
+-----+----------------------+---------------------+-------------------------------------------------------+--------------------+
| [26.1]|[26.2]              | [26.3]              | [26.4]                                                | [26.5]             |
+-----+----------------------+---------------------+-------------------------------------------------------+--------------------+
|  1  |                      |                     | [ ]                                                   |                    |
+-----+----------------------+---------------------+-------------------------------------------------------+--------------------+

VI. HỒ SƠ KÈM THEO GỒM:
- Hợp đồng chuyển nhượng quyền sử dụng đất, tài sản gắn liền với đất;
- Bản sao Giấy chứng nhận quyền sử dụng đất số ${valSophathanh};
- Bản sao Thẻ Căn cước công dân của các bên tham gia giao dịch.

Tôi cam đoan những nội dung kê khai là đúng và chịu trách nhiệm trước pháp luật về những nội dung đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ hoặc 
Họ và tên: ……………………                                   ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ
Chứng chỉ NV thuế số: ...................                     (Ký, ghi rõ họ tên; chức vụ và đóng dấu)

Ghi chú: Hướng dẫn kê khai một số chỉ tiêu:
- Cá nhân có thu nhập từ chuyển nhượng nhà ở, nhà ở thương mại, công trình xây dựng hình thành trong tương lai; công trình xây dựng, nhà ở đã được dự án bàn giao đưa vào sử dụng nhưng chưa cấp Giấy chứng nhận: NNT kê khai chỉ tiêu [17] và [18].
- Cá nhân có thu nhập từ nhận thừa kế, quà tặng: NNT kê khai chỉ tiêu [17] và [19].
- Chỉ tiêu [16.1]: Ghi tên loại giấy tờ về quyền sử dụng đất theo quy định tại Điều 137 Luật Đất đai hoặc Giấy chứng nhận đã cấp.
- Chỉ tiêu [20.3]: Ghi số nhà, tên đường phố (nếu có); tên điểm dân cư; tên đơn vị hành chính các cấp xã, tỉnh nơi có thửa đất.
- Chỉ tiêu [24]=[20.9]+[21.19]+[21.28]+[22.2] nếu tích vào chỉ tiêu [23.1].
- Chỉ tiêu [25]=[20.9]+[21.19]+[21.28]+[22.2] nếu tích vào chỉ tiêu [23.2].`;
    } else if (formType === 'tk_phi_nong_nghiep') {
        // TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP (MẪU 01/TK-SDDPNN - G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tk phi nông nghiệp.docx)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 01/TK-SDDPNN                                      |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                    |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
                                     (Áp dụng đối với hộ gia đình, cá nhân)

[01] Kỳ tính thuế: Năm ${dateYear}
[02] Lần đầu: [x]                       [03] Bổ sung lần thứ:……

1. Người nộp thuế: 
[04] Họ và tên: ${valHoten}
[05] Ngày, tháng, năm sinh: ${valNgaySinh}
[06] Mã số thuế: .....................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${valSo}
[08] Địa chỉ cư trú: 
[08.1] Số nhà: ................................ [08.2] Đường/phố: .................................................
[08.3] Tổ/thôn: ...............................[08.4] Xã/Phường/Đặc khu: ...................................
[08.5] Tỉnh/Thành phố: Thanh Hóa
[09] Địa chỉ nhận thông báo thuế: ${valThuongtru}
[10] Điện thoại: ......................................................................................................................

2. Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế (nếu có): 
[11] Tên tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế: .........................................
[12] Mã số thuế: ....................................................................................................................
[13] Hợp đồng dịch vụ làm thủ tục về thuế: Số: ................................ Ngày: ........................

3. Thửa đất chịu thuế: 
[14] Thông tin người sử dụng đất:
+-----+----------------------------------+-------------+---------------------------------+--------------------+
| STT |             Họ và tên            | Mã số thuế  | Số định danh cá nhân/Hộ chiếu   | Tỷ lệ              |
+-----+----------------------------------+-------------+---------------------------------+--------------------+
|  1  | ${valHoten.padEnd(32)} |             | ${valSo.padEnd(31)} | 100%               |
+-----+----------------------------------+-------------+---------------------------------+--------------------+

[15] Nguồn gốc thửa đất (đất được nhà nước giao, cho thuê; đất nhận chuyển nhượng, nhận thừa kế, nhận tặng cho, nhận góp vốn): Sử dụng đất ổn định, nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu
Trường hợp thửa đất có nguồn gốc nhận chuyển nhượng, nhận thừa kế, nhận tặng cho, nhận góp vốn:
[15.1] Tên tổ chức, cá nhân chuyển giao quyền sử dụng đất: ......................................
[15.2] Mã số thuế: ...........................................................................................................
[15.3] Số định danh cá nhân/Số hộ chiếu: ....................................................................
[15.4] Mã phi nông nghiệp (nếu có): .............................................................................

[16] Địa chỉ thửa đất: ${valDiachi}
[16.1] Số nhà: ................................[16.2] Đường/phố: .................................................
[16.3] Tổ/thôn: ..............................[16.4] Xã/Phường/Đặc khu: ...................................
[16.5] Tỉnh/Thành phố: Thanh Hóa
[17] Là thửa đất duy nhất: [x]
[18] Đăng ký kê khai tổng hợp tại (Xã/phường/đặc khu): ....................................................
[19] Đã có giấy chứng nhận: [x]
[19.1] Số giấy chứng nhận: ${valSophathanh}            [19.2] Ngày cấp: ${valLandNgayCap}
[19.3] Thửa đất số: ${valThua}                         [19.4] Tờ bản đồ số: ${valTobando}
[19.5] Diện tích: ${valDientich} m2                    [19.6] Loại đất/ Mục đích sử dụng: ${valMucdich}

[20] Tổng diện tích thực tế sử dụng cho mục đích phi nông nghiệp: ${valDientich} m2
[20.1] Diện tích đất sử dụng đúng mục đích: ${valDientich} m2
[20.2] Diện tích đất sử dụng không đúng mục đích: ...........................................................
[20.3] Diện tích đất chưa sử dụng theo đúng quy định: .....................................................
[20.4] Hạn mức (nếu có): ......................................................................................................
[20.5] Diện tích đất lấn, chiếm: ......................................................................................

[21] Chưa có giấy chứng nhận: [ ]
[21.1] Diện tích: ................. [21.2] Loại đất/ Mục đích đang sử dụng: ...........................
[22] Thời điểm bắt đầu sử dụng đất: ..................................................................................... 
[23] Thời điểm thay đổi thông tin của thửa đất: ....................................................................

4. Đối với đất ở nhà nhiều tầng nhiều hộ ở, nhà chung cư [24] (tính trên diện tích sàn thực tế sử dụng): 
[24.1] Loại nhà: ...................[24.2] Diện tích: ................ [24.3] Hệ số phân bổ: ..........

5. Miễn, giảm thuế [25] 
[25.1] Trường hợp miễn, giảm (ghi rõ trường hợp thuộc diện được miễn, giảm thuế như: thương binh, gia đình thương binh liệt sỹ, đối tượng chính sách, ...): ………………..
[25.2] Kỳ tính thuế/Khoảng thời gian đề nghị miễn, giảm: ............................................

<Trường hợp người nộp thuế đề nghị miễn thuế, giảm thuế, người nộp thuế nộp bản sao các giấy tờ chứng minh thuộc đối tượng được miễn thuế, giảm thuế. Cơ quan thuế căn cứ nội dung kê khai tại mục này để quyết định miễn thuế, giảm thuế theo quy định pháp luật, người nộp thuế không phải làm hồ sơ đề nghị miễn thuế, giảm thuế.>

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ hoặc 
Họ và tên:..............................                     ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ
Chứng chỉ nghiệp vụ chuyên môn về thuế số:...                (Ký, ghi rõ họ tên; chức vụ và đóng dấu)`;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        // TỜ KHAI LỆ PHÍ TRƯỚC BẠ (MẪU 01/LPTB - G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tk lệ phí trước bạ.doc)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 01/LPTB                                           |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                    |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                    TỜ KHAI LỆ PHÍ TRƯỚC BẠ
                                    (Áp dụng đối với nhà, đất)

[01] Kỳ tính thuế: Theo từng lần phát sinh ngày … tháng … năm ${dateYear}
[02] Lần đầu: [x]              [03] Bổ sung lần thứ:……
[ ] Tổ chức, cá nhân được ủy quyền khai thay cho người nộp thuế

[04] Người nộp thuế: ${valHoten}
[05] Ngày, tháng, năm sinh (Đối với người nộp thuế là cá nhân, đại diện hộ gia đình): ${valNgaySinh}
[06] Mã số thuế: ......................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${valSo}
[08] Địa chỉ: ${valThuongtru}
[09] Xã/phường/đặc khu: .................................. [10] Tỉnh/Thành phố: Thanh Hóa
[11] Điện thoại: ..................... [12] Fax: .................. [13] Email: ..........................................
[14] Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế; hoặc Tổ chức, cá nhân được ủy quyền khai thay (nếu có): ......................................................................................
[15] Mã số thuế: ......................................................................................................................
[16] Hợp đồng dịch vụ làm thủ tục về thuế: Số:…................................. ngày …...................

ĐẶC ĐIỂM NHÀ ĐẤT:
1. Đất:
1.1. Thửa đất số (Số hiệu thửa đất): ${valThua} ; Tờ bản đồ số: ${valTobando}
1.2. Địa chỉ thửa đất: ${valDiachi}
1.2.1. Số nhà: ………….…. Tòa nhà: ……….…..… Ngõ/Hẻm: ………………………….
Đường/Phố:……………………. Thôn/xóm/ấp: ……………………………………………
1.2.2. Xã/phường/đặc khu: …………………………………………………………………
1.2.3. Tỉnh/thành phố: Thanh Hóa
1.3. Vị trí thửa đất (mặt tiền đường phố hay ngõ, hẻm):…………………………………….
1.4. Mục đích sử dụng đất: ${valMucdich}
1.5. Diện tích (m2): ${valDientich} m2
1.6. Nguồn gốc nhà đất: (đất được Nhà nước giao, cho thuê; đất nhận chuyển nhượng; nhận thừa kế, hoặc nhận tặng cho):
a) Tên tổ chức, cá nhân chuyển giao QSDĐ:
- Tên tổ chức/cá nhân chuyển giao QSDĐ:………………………………………………….
- Mã số thuế:…………………………………………………………………………………
- Số định danh cá nhân/ Số hộ chiếu: ………………………………………………………
- Địa chỉ người giao QSDĐ: …..............................................................................................
b) Thời điểm làm giấy tờ chuyển giao QSDĐ ngày …..... tháng ….... năm ….....
1.7. Giá trị đất thực tế chuyển giao (nếu có): ................................................... đồng

2. Nhà:
2.1. Thông tin về nhà ở, nhà làm việc, nhà sử dụng cho mục đích khác:
Cấp nhà: ………………..... Loại nhà: ………………………Hạng nhà:…...................
Trường hợp là nhà ở chung cư:
Chủ dự án:……………… Địa chỉ dự án, công trình…………….
Kết cấu:………………… Số tầng nổi:…………Số tầng hầm:…….
Diện tích sở hữu chung (m2):…….. Diện tích sở hữu riêng (m2):……..
2.2. Diện tích nhà (m2):
Diện tích xây dựng (m2): ……………………………………………………………...……..
Diện tích sàn xây dựng (m2): ……………………………………………………………...…
2.3. Nguồn gốc nhà: …............................................................................................................
a) Tự xây dựng: 
- Năm hoàn công (hoặc năm bắt đầu sử dụng nhà): …............................................................
b) Mua, thừa kế, tặng cho:
- Thời điểm làm giấy tờ chuyển giao nhà: Ngày …...... tháng …..... năm ….....
2.4. Giá trị nhà (đồng):………………………………………………………………………

3. Giá trị nhà, đất thực tế nhận chuyển nhượng [ ], nhận thừa kế [ ], nhận tặng cho [ ] (đồng):
…..............................................................................................................................................
4. Tài sản thuộc diện được miễn lệ phí trước bạ (lý do):
…..............................................................................................................................................

5. Thông tin đồng chủ sở hữu nhà, đất (nếu có):
+-----+----------------------------------+-------------+---------------------------------+--------------------+
| STT | Tên tổ chức/cá nhân đồng sở hữu  | Mã số thuế  | Số định danh cá nhân/Hộ chiếu   | Tỷ lệ sở hữu (%)   |
+-----+----------------------------------+-------------+---------------------------------+--------------------+
|  1  |                                  |             |                                 |                    |
+-----+----------------------------------+-------------+---------------------------------+--------------------+

6. Giấy tờ có liên quan, gồm:
- Bản sao Giấy chứng nhận quyền sử dụng đất số ${valSophathanh};
- Hợp đồng chuyển nhượng / tặng cho / thừa kế quyền sử dụng đất;
- Bản sao Thẻ CCCD của người nộp thuế.

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ hoặc 
Họ và tên:.................................                  ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ
Chứng chỉ nghiệp vụ chuyên môn về thuế số:...                (Ký, ghi rõ họ tên; chức vụ và đóng dấu)`;

    }

    const formOutput = document.getElementById('formOutputText');
    if (formOutput) {
        formOutput.value = fullDoc;
    }

    const qrcodeDiv = document.getElementById('qrcode');
    if (qrcodeDiv) {
        qrcodeDiv.innerHTML = '';
        try {
            const qrText = `PLIV QĐ 2604/QĐ-VP THANH HOA | MAU: ${formType} | HO TEN: ${cccdHoten} | CCCD: ${cccdSo} | THUA: ${landThua} | TBD: ${landTobando}`;
            new QRCode(qrcodeDiv, {
                text: qrText.substring(0, 150),
                width: 90,
                height: 90,
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (err) {
            console.warn("QR Code render bypass:", err);
        }
    }
}

// ============================================================
// XUẤT FILE WORD GIỮ NGUYÊN 100% NỘI DUNG VĂN BẢN VÀ THỂ THỨC (KHÔNG CÓ BẢNG Ô THỪA)
// ============================================================
function exportToWord() {
    const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
    
    // Blank fallbacks
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim();
    const cccdSo = (document.getElementById('cccd_so')?.value || '').trim();
    const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim();
    const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim();
    const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim();
    
    const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim();
    const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim();
    const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim();
    const landNoiCap = (document.getElementById('land_noicap')?.value || '').trim();
    const landThua = (document.getElementById('land_thua')?.value || '').trim();
    const landTobando = (document.getElementById('land_tobando')?.value || '').trim();
    const landDiachi = (document.getElementById('land_diachi')?.value || '').trim();
    const landDientich = (document.getElementById('land_dientich')?.value || '').trim();
    const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim();

    const valHoten = cccdHoten || '.....................................................................................................................';
    const valSo = cccdSo || '......................................................................................';
    const valNgaySinh = cccdNgaySinh || '....................';
    const valNgayCap = cccdNgayCap || '....................';
    const valThuongtru = cccdThuongtru || '..........................................................................................................................';
    const valThua = landThua || '......................';
    const valTobando = landTobando || '......................';
    const valDiachi = landDiachi || '.........................................................................................................................';
    const valDientich = landDientich || '……………';
    const valMucdich = landMucdich || '…………………………';
    const valSophathanh = landSophathanh || '................................';
    const valSovaoso = landSovaoso || '................................';
    const valLandNgayCap = landNgayCap || '……../ ……../………..';

    const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
    const dateYear = new Date().getFullYear();
    const dateStr = `..... ngày .... tháng... năm ${dateYear}`;
    const cleanName = cccdHoten && !cccdHoten.includes('.') ? cccdHoten.replace(/\s+/g, '_') : 'Mau_Don';
    const filename = `${formType}_${cleanName}.doc`;

    let bodyHtml = "";

    if (formType === 'mau_25_qd2604') {
        // MẪU SỐ 25 CHUẨN 100% Y HỆT ẢNH MẪUmedia_1788077058155.png VÀ PLIV_signed.pdf TRANG 49-51
        bodyHtml = `
        <p class="MsoNormal" style="font-size:11pt; font-weight:bold;">Mẫu số 25. Đơn đăng ký đất đai, tài sản gắn liền với đất</p>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:6pt;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>
        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
        </div>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin:6pt 0 12pt 0;">
            Kính gửi: ${recipientStr} <sup>(1)</sup>
        </div>

        <p class="MsoNormal"><b>1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:</b></p>
        <p class="MsoNormal" style="font-style:italic; font-size:10.5pt; margin-left:14pt;">(Trường hợp nhiều người cùng sử dụng đất, cùng sở hữu tài sản thì kê khai tên người cùng sử dụng đất, cùng sở hữu tài sản đó theo Mẫu số 25a)</p>
        <p class="MsoNormal" style="margin-left:14pt;">a) Họ và tên <sup>(2)</sup>: ${valHoten}</p>
        <p class="MsoNormal" style="margin-left:14pt;">b) Giấy tờ nhân thân/pháp nhân <sup>(3)</sup>: ${valSo}</p>
        <p class="MsoNormal" style="margin-left:14pt;">c) Mã số thuế (nếu có): .........................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">d) Địa chỉ <sup>(4)</sup>: ${valThuongtru}</p>
        <p class="MsoNormal" style="margin-left:14pt;">đ) Điện thoại liên hệ (nếu có): ……………….. Hộp thư điện tử (nếu có): .........................</p>

        <p class="MsoNormal"><b>2. Thửa đất đăng ký (người sử dụng đất là tổ chức thì không phải kê khai mục này):</b></p>
        <p class="MsoNormal" style="font-style:italic; font-size:10.5pt; margin-left:14pt;">(Trường hợp đăng ký nhiều thửa đất nông nghiệp mà không đề nghị cấp Giấy chứng nhận hoặc đề nghị cấp chung một Giấy chứng nhận cho nhiều thửa đất nông nghiệp thì không kê khai các nội dung tại Mục này mà chỉ ghi tổng số thửa và kê khai từng thửa đất theo Mẫu số 25b)</p>
        <p class="MsoNormal" style="margin-left:14pt;">a) Thửa đất số <sup>(4a)</sup>: ${valThua} ; Tờ bản đồ số <sup>(4b)</sup>: ${valTobando}</p>
        <p class="MsoNormal" style="margin-left:14pt;">b) Địa chỉ <sup>(5)</sup>: ${valDiachi}</p>
        <p class="MsoNormal" style="margin-left:14pt;">c) Diện tích <sup>(6)</sup>: ${valDientich} m<sup>2</sup>; sử dụng chung: ....... m<sup>2</sup>; sử dụng riêng: ${valDientich} m<sup>2</sup></p>
        <p class="MsoNormal" style="margin-left:14pt;">d) Sử dụng vào mục đích <sup>(7)</sup>: ${valMucdich}, từ thời điểm: ...................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">đ) Thời hạn đề nghị được sử dụng đất <sup>(8)</sup>: Lâu dài</p>
        <p class="MsoNormal" style="margin-left:14pt;">e) Nguồn gốc sử dụng đất <sup>(9)</sup>: Sử dụng đất ổn định, không có tranh chấp</p>
        <p class="MsoNormal" style="margin-left:14pt;">g) Có quyền hoặc hạn chế quyền đối với thửa đất liền kề số …………, tờ bản đồ số ………, của ……..……, nội dung về quyền đối với thửa đất liền kề ............................. <sup>(10)</sup>.</p>

        <p class="MsoNormal"><b>3. Nhà ở, công trình xây dựng (người sử dụng đất là tổ chức thì không phải kê khai mục này):</b></p>
        <p class="MsoNormal" style="font-style:italic; font-size:10.5pt; margin-left:14pt;">(Chỉ kê khai nếu có nhu cầu đăng ký hoặc chứng nhận quyền sở hữu tài sản; Trường hợp có nhiều nhà ở, công trình xây dựng khác trên cùng 01 thửa đất thì chỉ kê khai các thông tin chung và tổng diện tích của các nhà ở, công trình xây dựng; đồng thời lập danh sách nhà ở, công trình theo Mẫu số 25c)</p>
        <p class="MsoNormal" style="margin-left:14pt;">a) Loại nhà ở, công trình xây dựng <sup>(11)</sup>: ................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">b) Diện tích xây dựng <sup>(12)</sup>: …………… m<sup>2</sup>.</p>
        <p class="MsoNormal" style="margin-left:14pt;">c) Diện tích sàn xây dựng/diện tích sử dụng <sup>(13)</sup>: ……………..m<sup>2</sup>.</p>
        <p class="MsoNormal" style="margin-left:14pt;">d) Sở hữu chung <sup>(14)</sup>: …………… m<sup>2</sup>, sở hữu riêng <sup>(14)</sup>: ……………….. m<sup>2</sup>.</p>
        <p class="MsoNormal" style="margin-left:14pt;">đ) Số tầng: …….. tầng; trong đó, số tầng nổi: ……… tầng, số tầng hầm: ……….tầng.</p>
        <p class="MsoNormal" style="margin-left:14pt;">e) Nguồn gốc <sup>(15)</sup>: ..................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">g) Năm hoàn thành xây dựng <sup>(16)</sup>: ..........................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">h) Thời hạn sở hữu đến <sup>(17)</sup>: ..................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">i) Cam kết chịu trách nhiệm về nhà ở, công trình xây dựng <sup>(18)</sup>: &#9633;</p>

        <p class="MsoNormal"><b>4. Đề nghị của người sử dụng đất, chủ sở hữu tài sản gắn liền với đất: (Đánh dấu vào ô lựa chọn)</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">a) Đề nghị đăng ký đất đai, tài sản gắn liền với đất [x]</p>
        <p class="MsoNormal" style="margin-left:14pt;">b) Đề nghị cấp Giấy chứng nhận [x]</p>
        <p class="MsoNormal" style="margin-left:14pt;">c) Đề nghị ghi nợ tiền sử dụng đất (đối với cá nhân) &#9633;</p>
        <p class="MsoNormal" style="margin-left:14pt;">d) Đề nghị khác (nếu có): .....................................................................................................</p>

        <p class="MsoNormal"><b>5. Thông tin về đối tượng được miễn tiền sử dụng đất, tiền thuê đất (nếu có)<sup>(19)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">...............................................................................................................................................</p>

        <p class="MsoNormal"><b>6. Những giấy tờ nộp kèm theo <sup>(20)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">(1) ..........................................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">(2) ..........................................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;">(3) ..........................................................................................................................................</p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Tôi/chúng tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật, nếu sai tôi/chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important; background:none !important;"></td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">Người sử dụng đất/Người kê khai</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>

        <hr style="margin-top:20pt; border:0; border-top:1px dashed #666;">
        <p class="MsoNormal" style="font-size:10pt; font-style:italic; font-weight:bold; margin-top:6pt;">Hướng dẫn kê khai đơn: “Lưu ý: xem kỹ hướng dẫn viết Đơn trước khi kê khai; không tẩy xóa, sửa chữa trên Đơn”</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(1) Đối với hộ gia đình, cá nhân, cộng đồng dân cư thì ghi: “Ủy ban nhân dân/Chủ tịch UBND xã/phường/đặc khu …”; đối với tổ chức, người gốc Việt Nam định cư nước ngoài thì ghi: “Sở Nông nghiệp và Môi trường …” .</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(2) Cá nhân: Ghi họ và tên bằng chữ in hoa, năm sinh theo giấy tờ nhân thân. Người gốc Việt Nam định cư ở nước ngoài: Ghi họ tên, năm sinh, quốc tịch. Cộng đồng dân cư: Ghi tên của cộng đồng dân cư. Tổ chức: Ghi theo quyết định thành lập hoặc giấy đăng ký kinh doanh.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(3) Cá nhân: Ghi số định danh cá nhân hoặc số, ngày cấp và nơi cấp hộ chiếu. Tổ chức: Ghi số, ngày ký, cơ quan ký văn bản theo quyết định thành lập hoặc giấy đăng ký kinh doanh.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(4) Cá nhân: Ghi địa chỉ nơi đăng ký thường trú. Người gốc Việt Nam định cư ở nước ngoài: Ghi địa chỉ đăng ký thường trú ở Việt Nam (nếu có). Cộng đồng dân cư: Ghi địa chỉ nơi sinh hoạt chung của cộng đồng. Tổ chức: Ghi địa chỉ trụ sở chính theo quyết định thành lập hoặc giấy đăng ký kinh doanh.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(4a), (4b): Ghi đối với trường hợp người sử dụng đất có thông tin; trường hợp không có thông tin thì không phải kê khai nội dung này, cơ quan giải quyết thủ tục xác định thông tin này trong quá trình giải quyết thủ tục.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(5) Ghi số nhà, tên đường, phố (nếu có); tên điểm dân cư (tổ dân phố, thôn, xóm, làng, ấp, bản, bon, buôn, phum, sóc, điểm dân cư tương tự) hoặc tên khu vực, xứ đồng (đối với thửa đất ngoài khu dân cư); tên đơn vị hành chính các cấp xã, tỉnh nơi có thửa đất.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(6) Ghi diện tích của thửa đất bằng số Ả Rập, được làm tròn số đến một chữ số thập phân.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(7) Ghi mục đích chính đang sử dụng. Từ thời điểm ghi ngày ... tháng ... năm ...</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(8) Ghi “đến ngày …/…/…” hoặc “Lâu dài” hoặc ghi bằng dấu “-/-” nếu không xác định được thời hạn.</p>
        <p class="MsoNormal" style="font-size:9.5pt; line-height:1.25; margin:2pt 0; text-align:justify;">(9) Ghi được Nhà nước giao đất có thu tiền sử dụng đất hoặc giao đất không thu tiền sử dụng đất hoặc cho thuê đất trả tiền một lần cho cả thời gian thuê hoặc cho thuê đất trả tiền thuê đất hằng năm hoặc nhận chuyển quyền (chuyển đổi, chuyển nhượng, thừa kế, tặng cho, góp vốn) hoặc nguồn gốc khác như do ông cha để lại, lấn, chiếm, giao đất không đúng thẩm quyền, khai hoang...</p>
        `;
    } else if (formType === 'mau_29_qd2604') {
        // MẪU SỐ 29
        bodyHtml = `
        <p class="MsoNormal" style="font-size:11pt; font-weight:bold;">Mẫu số 29. Đơn đăng ký biến động đất đai, tài sản gắn liền với đất</p>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:6pt;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>
        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
        </div>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin:6pt 0 12pt 0;">
            Kính gửi: ${recipientStr} <sup>(1)</sup>
        </div>

        <p class="MsoNormal"><b>1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">a) Tên <sup>(2)</sup>: ${valHoten}</p>
        <p class="MsoNormal" style="margin-left:14pt;">b) Giấy tờ nhân thân/pháp nhân <sup>(2)</sup>: ${valSo}</p>
        <p class="MsoNormal" style="margin-left:14pt;">c) Địa chỉ <sup>(2)</sup>: ${valThuongtru}</p>
        <p class="MsoNormal" style="margin-left:14pt;">d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...........</p>
        <p class="MsoNormal" style="font-style:italic; font-size:10.5pt; margin-left:14pt;">(Trường hợp có nhiều đồng sử dụng, sở hữu thì kê khai thông tin một người đại diện; đồng thời lập danh sách theo bảng 01 kèm theo)</p>

        <p class="MsoNormal"><b>2. Giấy chứng nhận đã cấp <sup>(3)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">2.1. Số vào sổ cấp Giấy chứng nhận: ${valSovaoso};</p>
        <p class="MsoNormal" style="margin-left:14pt;">2.2. Số phát hành Giấy chứng nhận (Số seri): ${valSophathanh};</p>
        <p class="MsoNormal" style="margin-left:14pt;">2.3. Ngày cấp Giấy chứng nhận: ${valLandNgayCap};</p>

        <p class="MsoNormal"><b>3. Nội dung biến động <sup>(4)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt; text-align:justify;">Đăng ký biến động quyền sử dụng đất đối với thửa đất số ${valThua}, tờ bản đồ số ${valTobando} tại ${valDiachi} do nhận chuyển nhượng / tặng cho / thừa kế / cấp đổi / đính chính thông tin theo quy định.</p>

        <p class="MsoNormal"><b>4. Thông tin về đối tượng được miễn, giảm nghĩa vụ tài chính về đất đai (nếu có)<sup>(5)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">.................................................................................................................................</p>

        <p class="MsoNormal"><b>5. Giấy tờ liên quan đến nội dung biến động nộp kèm theo đơn này gồm có <sup>(6)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;">(1) Giấy chứng nhận đã cấp số phát hành ${valSophathanh};</p>
        <p class="MsoNormal" style="margin-left:14pt;">(2) Hợp đồng chuyển quyền sử dụng đất được công chứng/chứng thực;</p>
        <p class="MsoNormal" style="margin-left:14pt;">(3) Bản sao Thẻ CCCD và các tờ khai nghĩa vụ tài chính liên quan.</p>

        <p class="MsoNormal" style="margin-left:14pt; margin-top:6pt;">[x] Có nhu cầu cấp mới Giấy chứng nhận <sup>(7)</sup> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không có nhu cầu cấp mới Giấy chứng nhận</p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Cam đoan nội dung kê khai trên đơn là đúng sự thật và chịu trách nhiệm trước pháp luật.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important; background:none !important;"></td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">Người viết đơn</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký, ghi rõ họ tên và đóng dấu nếu có)</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'mau_35_qd2604') {
        // MẪU SỐ 35
        bodyHtml = `
        <p class="MsoNormal" style="font-size:11pt; font-weight:bold;">Mẫu số 35. Đơn đề nghị tách thửa đất, hợp thửa đất</p>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:6pt;">
            CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>
        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            ĐƠN ĐỀ NGHỊ TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT
        </div>
        <div style="text-align:center; font-size:12pt; font-weight:bold; margin:6pt 0 12pt 0;">
            Kính gửi: ${recipientStr}
        </div>

        <p class="MsoNormal"><b>I. KÊ KHAI CỦA NGƯỜI SỬ DỤNG ĐẤT</b></p>
        <p class="MsoNormal" style="font-style:italic; font-size:10.5pt; margin-left:14pt;">(Xem kỹ hướng dẫn ở cuối đơn này trước khi viết đơn; không tẩy xoá, sửa chữa nội dung đã viết)</p>

        <p class="MsoNormal" style="margin-left:14pt;"><b>1. Người sử dụng đất <sup>(1)</sup>:</b></p>
        <p class="MsoNormal" style="margin-left:24pt;">a) Tên: ${valHoten}</p>
        <p class="MsoNormal" style="margin-left:24pt;">b) Giấy tờ nhân thân/pháp nhân số <sup>(2)</sup>: ${valSo}</p>
        <p class="MsoNormal" style="margin-left:24pt;">c) Địa chỉ: ${valThuongtru}</p>
        <p class="MsoNormal" style="margin-left:24pt;">d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...............</p>

        <p class="MsoNormal" style="margin-left:14pt;"><b>2. Đề nghị tách thửa đất, hợp thửa đất <sup>(3)</sup> như sau:</b></p>
        <p class="MsoNormal" style="margin-left:24pt;">a) Tách thửa đất số ${valThua}, tờ bản đồ số: ${valTobando}, diện tích: ${valDientich} m<sup>2</sup>; loại đất: ${valMucdich}; địa chỉ thửa đất: ${valDiachi}; Giấy chứng nhận: số vào sổ cấp GCN: ${valSovaoso}, ngày cấp GCN: ${valLandNgayCap}, thành ……… thửa:</p>
        <p class="MsoNormal" style="margin-left:36pt;">Thửa thứ nhất: diện tích: …..……m<sup>2</sup>; loại đất: ${valMucdich}</p>
        <p class="MsoNormal" style="margin-left:36pt;">Thửa thứ hai: diện tích: ……..…m<sup>2</sup>; loại đất: ${valMucdich}</p>

        <p class="MsoNormal" style="margin-left:24pt;">b) Hợp thửa đất: ....................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:24pt;">c) Tách đồng thời với hợp thửa đất: .....................................................................................</p>

        <p class="MsoNormal" style="margin-left:14pt;"><b>3. Lý do tách, hợp thửa đất:</b> Phân chia quyền sử dụng đất / tặng cho / chuyển nhượng theo quy định.</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>4. Giấy tờ nộp kèm theo đơn này gồm có:</b></p>
        <p class="MsoNormal" style="margin-left:24pt;">- Giấy chứng nhận và Bản vẽ tách thửa đất, hợp thửa đất các thửa đất nêu trên;</p>
        <p class="MsoNormal" style="margin-left:24pt;">- Bản sao Thẻ CCCD của người sử dụng đất.</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>5. Đề nghị cấp Giấy chứng nhận:</b> Có đề nghị cấp Giấy chứng nhận</p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Tôi cam đoan nội dung kê khai trên đơn là đúng.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important; background:none !important;"></td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">Người viết đơn <sup>(4)</sup></p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký và ghi rõ họ tên, đóng dấu nếu có)</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>

        <p class="MsoNormal" style="font-weight:bold; margin-top:16pt;">II. Ý KIẾN CỦA VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI/CHI NHÁNH VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI <sup>(5)</sup></p>
        <p class="MsoNormal">.................................................................................................................................................................</p>
        <p class="MsoNormal">.................................................................................................................................................................</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="50%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:10pt; text-align:center; margin:0;">Ngày ……. tháng …… năm …...</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11pt; text-align:center; margin:3pt 0 0 0;">NGƯỜI KIỂM TRA</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0;">(Ký, ghi rõ họ tên, chức vụ)</p>
                </td>
                <td width="50%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:10pt; text-align:center; margin:0;">Ngày ……. tháng …… năm …...</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11pt; text-align:center; margin:3pt 0 0 0;">VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI/CHI NHÁNH</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0;">(Ký, ghi rõ họ tên, chức vụ, đóng dấu)</p>
                </td>
            </tr>
        </table>
        `;
        } else if (formType === 'tk_le_phi_truoc_ba') {
        // TỜ KHAI LỆ PHÍ TRƯỚC BẠ (MẪU 01/LPTB - media_1788079951664.png)
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; margin-bottom:10pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important;"></td>
                <td width="55%" align="right" style="border:none !important;">
                    <table border="1" cellspacing="0" cellpadding="4" style="border:1px solid #000; border-collapse:collapse; text-align:center; font-family:'Times New Roman', serif; font-size:10pt; width:220pt;">
                        <tr>
                            <td style="border:1px solid #000; padding:4pt 6pt; text-align:center;">
                                <b>Mẫu số: 01/LPTB</b><br>
                                <i>(Kèm theo Thông tư số 89/2026/TT-BTC<br>
                                ngày 30 tháng 6 năm 2026 của Bộ trưởng<br>
                                Bộ Tài chính)</i>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:4pt;">
            CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            TỜ KHAI LỆ PHÍ TRƯỚC BẠ
        </div>
        <div style="text-align:center; font-size:11pt; font-style:italic; margin-bottom:10pt;">
            (Áp dụng đối với nhà, đất)
        </div>

        <p class="MsoNormal"><b>[01] Kỳ tính thuế:</b> Theo từng lần phát sinh ngày … tháng … năm ${dateYear}</p>
        <p class="MsoNormal"><b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03] Bổ sung lần thứ:</b> ……</p>
        <p class="MsoNormal">&#9633; Tổ chức, cá nhân được ủy quyền khai thay cho người nộp thuế</p>

        <p class="MsoNormal" style="margin-top:6pt;"><b>[04] Người nộp thuế:</b> ${valHoten}</p>
        <p class="MsoNormal"><b>[05] Ngày, tháng, năm sinh:</b> ${valNgaySinh}</p>
        <p class="MsoNormal"><b>[06] Mã số thuế:</b> ......................................................................................................................</p>
        <p class="MsoNormal"><b>[07] Số định danh cá nhân/Số hộ chiếu:</b> ${valSo}</p>
        <p class="MsoNormal"><b>[08] Địa chỉ:</b> ${valThuongtru}</p>
        <p class="MsoNormal"><b>[09] Xã/phường/đặc khu:</b> .................................. <b>[10] Tỉnh/Thành phố:</b> Thanh Hóa</p>
        <p class="MsoNormal"><b>[11] Điện thoại:</b> ..................... <b>[12] Fax:</b> .................. <b>[13] Email:</b> ..........................................</p>
        <p class="MsoNormal"><b>[14] Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế:</b> ......................................................................................</p>
        <p class="MsoNormal"><b>[15] Mã số thuế:</b> ......................................................................................................................</p>
        <p class="MsoNormal"><b>[16] Hợp đồng dịch vụ làm thủ tục về thuế:</b> Số:…................................. ngày …...................</p>

        <p class="MsoNormal" style="font-weight:bold; margin-top:8pt;">ĐẶC ĐIỂM NHÀ ĐẤT:</p>
        <p class="MsoNormal"><b>1. Đất:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.1. Thửa đất số:</b> ${valThua} ; <b>Tờ bản đồ số:</b> ${valTobando}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.2. Địa chỉ thửa đất:</b> ${valDiachi}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.3. Vị trí thửa đất:</b> .....................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.4. Mục đích sử dụng đất:</b> ${valMucdich}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.5. Diện tích:</b> ${valDientich} m<sup>2</sup></p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.6. Nguồn gốc nhà đất:</b> Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>1.7. Giá trị đất thực tế chuyển giao:</b> .................................................................... đồng</p>

        <p class="MsoNormal"><b>2. Nhà:</b> Cấp nhà: ............... Loại nhà: ...................... Diện tích sàn: .................... m<sup>2</sup></p>
        <p class="MsoNormal"><b>3. Giá trị nhà, đất thực tế:</b> ......................................................................................... đồng</p>
        <p class="MsoNormal"><b>4. Tài sản thuộc diện được miễn lệ phí trước bạ (lý do):</b> ...............................................................................................................................................</p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-weight:bold; font-size:10.5pt; text-align:center; margin:0;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</p>
                    <p class="MsoNormal" style="font-size:9.5pt; font-style:italic; text-align:center; margin:2pt 0 45pt 0;">(Ký, ghi rõ họ tên và chứng chỉ NV thuế)</p>
                </td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">NGƯỜI NỘP THUẾ</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'tk_phi_nong_nghiep') {
        // TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP (MẪU 01/TK-SDDPNN)
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; margin-bottom:10pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important;"></td>
                <td width="55%" align="right" style="border:none !important;">
                    <table border="1" cellspacing="0" cellpadding="4" style="border:1px solid #000; border-collapse:collapse; text-align:center; font-family:'Times New Roman', serif; font-size:10pt; width:220pt;">
                        <tr>
                            <td style="border:1px solid #000; padding:4pt 6pt; text-align:center;">
                                <b>Mẫu số: 01/TK-SDDPNN</b><br>
                                <i>(Kèm theo Thông tư số 89/2026/TT-BTC<br>
                                ngày 30 tháng 6 năm 2026 của Bộ trưởng<br>
                                Bộ Tài chính)</i>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:4pt;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
        </div>
        <div style="text-align:center; font-size:11pt; font-style:italic; margin-bottom:10pt;">
            (Áp dụng đối với hộ gia đình, cá nhân)
        </div>

        <p class="MsoNormal"><b>[01] Kỳ tính thuế:</b> Năm ${dateYear}</p>
        <p class="MsoNormal"><b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03] Bổ sung lần thứ:</b> ……</p>

        <p class="MsoNormal" style="margin-top:6pt;"><b>1. Người nộp thuế:</b></p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[04] Họ và tên:</b> ${valHoten}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[05] Ngày, tháng, năm sinh:</b> ${valNgaySinh}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[06] Mã số thuế:</b> .....................................................................................................................</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[07] Số định danh cá nhân/Số hộ chiếu:</b> ${valSo}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[08] Địa chỉ cư trú:</b> ${valThuongtru}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[09] Địa chỉ nhận thông báo thuế:</b> ${valThuongtru}</p>
        <p class="MsoNormal" style="margin-left:14pt;"><b>[10] Điện thoại:</b> ......................................................................................................................</p>

        <p class="MsoNormal" style="margin-top:6pt;"><b>3. Thửa đất chịu thuế:</b></p>
        <table class="data-table" border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; margin:6pt 0;">
            <tr style="background:#f2f2f2; font-weight:bold;">
                <td style="width:10%;">STT</td>
                <td style="width:40%;">Họ và tên</td>
                <td style="width:20%;">Mã số thuế</td>
                <td style="width:20%;">Số ĐDCN/Hộ chiếu</td>
                <td style="width:10%;">Tỷ lệ</td>
            </tr>
            <tr>
                <td>1</td>
                <td style="text-align:left; padding-left:6pt;">${valHoten}</td>
                <td></td>
                <td>${valSo}</td>
                <td>100%</td>
            </tr>
        </table>

        <p class="MsoNormal"><b>[15] Nguồn gốc thửa đất:</b> Sử dụng đất ổn định, nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu</p>
        <p class="MsoNormal"><b>[16] Địa chỉ thửa đất:</b> ${valDiachi}</p>
        <p class="MsoNormal"><b>[17] Là thửa đất duy nhất:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[19] Đã có giấy chứng nhận:</b> [x]</p>
        <p class="MsoNormal"><b>[19.1] Số giấy chứng nhận:</b> ${valSophathanh} &nbsp;&nbsp;&nbsp;&nbsp; <b>[19.2] Ngày cấp:</b> ${valLandNgayCap}</p>
        <p class="MsoNormal"><b>[19.3] Thửa đất số:</b> ${valThua} &nbsp;&nbsp;&nbsp;&nbsp; <b>[19.4] Tờ bản đồ số:</b> ${valTobando} &nbsp;&nbsp;&nbsp;&nbsp; <b>[19.5] Diện tích:</b> ${valDientich} m<sup>2</sup></p>
        <p class="MsoNormal"><b>[19.6] Loại đất/Mục đích sử dụng:</b> ${valMucdich}</p>
        <p class="MsoNormal"><b>[20.1] Diện tích đất sử dụng đúng mục đích:</b> ${valDientich} m<sup>2</sup></p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-weight:bold; font-size:10.5pt; text-align:center; margin:0;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</p>
                    <p class="MsoNormal" style="font-size:9.5pt; font-style:italic; text-align:center; margin:2pt 0 45pt 0;">(Ký, ghi rõ họ tên và chứng chỉ NV thuế)</p>
                </td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">NGƯỜI NỘP THUẾ</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'tk_thue_tncn') {
        // TỜ KHAI THUẾ THU NHẬP CÁ NHÂN (MẪU 03/BĐS-TNCN)
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; margin-bottom:10pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" style="border:none !important;"></td>
                <td width="55%" align="right" style="border:none !important;">
                    <table border="1" cellspacing="0" cellpadding="4" style="border:1px solid #000; border-collapse:collapse; text-align:center; font-family:'Times New Roman', serif; font-size:10pt; width:220pt;">
                        <tr>
                            <td style="border:1px solid #000; padding:4pt 6pt; text-align:center;">
                                <b>Mẫu số: 03/BĐS-TNCN</b><br>
                                <i>(Kèm theo Thông tư số 89/2026/TT-BTC<br>
                                ngày 30 tháng 6 năm 2026 của Bộ trưởng<br>
                                Bộ Tài chính)</i>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:4pt;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
            TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
        </div>
        <div style="text-align:center; font-size:11pt; font-style:italic; margin-bottom:10pt;">
            (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản;<br>
            thu nhập từ nhận thừa kế và nhận quà tặng là bất động sản)
        </div>

        <p class="MsoNormal"><b>[01] Kỳ tính thuế:</b> Lần phát sinh: Ngày … tháng … năm ${dateYear}</p>
        <p class="MsoNormal"><b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03.1] Bổ sung lần thứ:</b> ……</p>

        <p class="MsoNormal" style="font-weight:bold; margin-top:6pt;">I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <table class="data-table" border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:9.5pt; text-align:center; margin:6pt 0;">
            <tr style="background:#f2f2f2; font-weight:bold;">
                <td style="width:6%;">STT</td>
                <td style="width:30%;">Họ và tên</td>
                <td style="width:25%;">Mã số thuế/Số ĐDCN</td>
                <td style="width:15%;">Ngày sinh</td>
                <td style="width:14%;">Điện thoại</td>
                <td style="width:10%;">Tỷ lệ (%)</td>
            </tr>
            <tr>
                <td>1</td>
                <td style="text-align:left; padding-left:6pt;">${valHoten}</td>
                <td>${valSo}</td>
                <td>${valNgaySinh}</td>
                <td></td>
                <td>100%</td>
            </tr>
        </table>

        <p class="MsoNormal" style="font-weight:bold; margin-top:6pt;">II. THÔNG TIN NGƯỜI NHẬN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <table class="data-table" border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:9.5pt; text-align:center; margin:6pt 0;">
            <tr style="background:#f2f2f2; font-weight:bold;">
                <td style="width:6%;">STT</td>
                <td style="width:34%;">Họ và tên</td>
                <td style="width:28%;">Mã số thuế/Số ĐDCN</td>
                <td style="width:18%;">Ngày sinh</td>
                <td style="width:14%;">Tỷ lệ (%)</td>
            </tr>
            <tr>
                <td>1</td>
                <td></td>
                <td></td>
                <td></td>
                <td>100%</td>
            </tr>
        </table>

        <p class="MsoNormal"><b>[12] Loại bất động sản:</b> Quyền sử dụng đất và tài sản gắn liền trên đất [x]</p>
        <p class="MsoNormal"><b>[16.2] Giấy chứng nhận QSDĐ số:</b> ${valSophathanh} &nbsp;&nbsp;&nbsp;&nbsp; <b>[16.4] Ngày cấp:</b> ${valLandNgayCap}</p>
        <p class="MsoNormal"><b>[20.1] Thửa đất số:</b> ${valThua} ; <b>[20.2] Tờ bản đồ số:</b> ${valTobando} ; <b>[20.3] Địa chỉ:</b> ${valDiachi}</p>
        <p class="MsoNormal"><b>[20.6] Loại đất:</b> ${valMucdich} ; <b>Diện tích:</b> ${valDientich} m<sup>2</sup></p>
        <p class="MsoNormal"><b>[23.1] Thu nhập từ chuyển nhượng bất động sản:</b> [x]</p>

        <p class="MsoNormal" style="text-indent:24pt; margin-top:8pt; text-align:justify;">Tôi cam đoan những nội dung kê khai là đúng và chịu trách nhiệm trước pháp luật về những nội dung đã khai./.</p>

        <table class="sign-table" border="0" cellspacing="0" cellpadding="0" style="border:none !important; border-collapse:collapse; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
            <tr style="border:none !important;">
                <td width="45%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-weight:bold; font-size:10.5pt; text-align:center; margin:0;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</p>
                    <p class="MsoNormal" style="font-size:9.5pt; font-style:italic; text-align:center; margin:2pt 0 45pt 0;">(Ký, ghi rõ họ tên và chứng chỉ NV thuế)</p>
                </td>
                <td width="55%" align="center" valign="top" style="border:none !important; background:none !important;">
                    <p class="MsoNormal" style="font-style:italic; font-size:11pt; text-align:center; margin:0;">${dateStr}</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; text-align:center; margin:3pt 0 0 0;">NGƯỜI NỘP THUẾ</p>
                    <p class="MsoNormal" style="font-size:10pt; font-style:italic; text-align:center; margin:0 0 45pt 0;">(Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))</p>
                    <p class="MsoNormal" style="font-weight:bold; font-size:12pt; text-align:center; margin:0;">${cleanName !== 'Mau_Don' ? cccdHoten : ''}</p>
                </td>
            </tr>
        </table>
        `;
    }
    } else {
        // TẤT CẢ CÁC MẪU CÒN LẠI (TỜ KHAI THUẾ, ĐƠN GIAO ĐẤT, THUÊ ĐẤT, GIA HẠN...)
        const lines = (document.getElementById('formOutputText')?.value || '').split('\n');
        bodyHtml = "";
        let inTable = false;
        let tableRows = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let trimmed = line.trim();

            if (trimmed.startsWith('+--') || trimmed.startsWith('|--')) continue;

            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                if (!inTable) { inTable = true; tableRows = []; }
                const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
                tableRows.push(cells);
                continue;
            } else if (inTable) {
                bodyHtml += `<table class="data-table" border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000; margin:8pt 0;">`;
                tableRows.forEach((row, rIdx) => {
                    const isHeader = (rIdx === 0 || row.some(c => c.startsWith('[')));
                    const bg = isHeader ? 'background:#f2f2f2; font-weight:bold;' : '';
                    bodyHtml += `<tr style="${bg}">`;
                    row.forEach(cell => { bodyHtml += `<td style="border:1px solid #000; padding:4pt 6pt;">${cell || '&nbsp;'}</td>`; });
                    bodyHtml += `</tr>`;
                });
                bodyHtml += `</table>`;
                inTable = false;
                tableRows = [];
            }

            if (!trimmed) { bodyHtml += `<p class="MsoNormal" style="margin:2pt 0; font-size:6pt;">&nbsp;</p>`; continue; }

            if (trimmed.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM') || trimmed.includes('CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM')) {
                bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin-top:4pt;">${trimmed}</div>`;
            } else if (trimmed.includes('Độc lập - Tự do - Hạnh phúc') || trimmed.includes('Độc lập – Tự do – Hạnh phúc')) {
                bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin-bottom:10pt;"><u>${trimmed}</u></div>`;
            } else if (trimmed.startsWith('ĐƠN ') || trimmed.startsWith('TỜ KHAI ') || trimmed.startsWith('VĂN BẢN ĐỀ NGHỊ') || trimmed.startsWith('HỢP ĐỒNG ') || trimmed.startsWith('BÁO CÁO') || trimmed.startsWith('PHIẾU THÔNG TIN')) {
                bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:13.5pt; font-weight:bold; margin:12pt 0 4pt 0; text-transform:uppercase;">${trimmed}</div>`;
            } else if (trimmed.startsWith('Kính gửi:')) {
                bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin:8pt 0 12pt 0;">${trimmed}</div>`;
            } else if (trimmed.startsWith('Mẫu số')) {
                bodyHtml += `<div style="font-family:'Times New Roman', serif; font-size:11pt; font-weight:bold; margin-bottom:4pt;">${trimmed}</div>`;
            } else if (trimmed.startsWith('(Ban hành kèm theo') || trimmed.startsWith('(Kèm theo')) {
                bodyHtml += `<div style="font-family:'Times New Roman', serif; font-size:10pt; font-style:italic; margin-bottom:8pt;">${trimmed}</div>`;
            } else {
                let formattedLine = trimmed.replace(/^([0-9]+\.|\b[a-đ]\)|\b[I|V|X]+\.|\b\[[0-9a-zA-Z.]+\])/g, '<b>$1</b>');
                bodyHtml += `<p class="MsoNormal" style="margin:3pt 0; text-align:justify;">${formattedLine}</p>`;
            }
        }
    }

    const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset='utf-8'>
        <title>${formType}</title>
        <!--[if gte mso 9]>
        <xml>
            <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>100</w:Zoom>
                <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
            @page Section1 {
                size: 595.3pt 841.9pt;
                margin: 56.7pt 42.5pt 56.7pt 85.05pt;
                mso-header-margin: 36pt;
                mso-footer-margin: 36pt;
                mso-paper-source: 0;
            }
            div.Section1 {
                page: Section1;
            }
            body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.3;
                color: #000;
            }
            p.MsoNormal {
                margin: 0pt 0pt 3pt 0pt;
                line-height: 1.3;
                font-size: 12pt;
                font-family: 'Times New Roman', Times, serif;
            }
            table.data-table {
                border-collapse: collapse;
                width: 100%;
                margin: 8pt 0;
                font-family: 'Times New Roman', Times, serif;
            }
            table.data-table td, table.data-table th {
                border: 1px solid #000;
                padding: 4pt 6pt;
            }
            table.sign-table {
                border: none !important;
                border-collapse: collapse;
                width: 100%;
                margin-top: 16pt;
                font-family: 'Times New Roman', Times, serif;
            }
            table.sign-table td {
                border: none !important;
                padding: 0 !important;
                background: none !important;
            }
        </style>
    </head>
    <body>
        <div class="Section1">
            ${bodyHtml}
        </div>
    </body>
    </html>
    `;

    try {
        const blob = new Blob(['\ufeff', docHtml], {
            type: 'application/msword;charset=utf-8'
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        console.log("✅ Đã xuất file Word chuẩn xác không viền chữ ký:", filename);
    } catch (err) {
        alert("Lỗi xuất file Word: " + err.message);
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
});
