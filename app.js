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
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim() || '...................................................';
    const cccdSo = (document.getElementById('cccd_so')?.value || '').trim() || '........................';
    const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim() || '...../...../..........';
    const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim() || '...../...../..........';
    const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim() || '...........................................................................................';
    
    const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim() || '........................';
    const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim() || '........................';
    const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim() || '...../...../..........';
    const landNoiCap = (document.getElementById('land_noicap')?.value || '').trim() || 'Chi nhánh VPĐKĐĐ';
    const landThua = (document.getElementById('land_thua')?.value || '').trim() || '........';
    const landTobando = (document.getElementById('land_tobando')?.value || '').trim() || '........';
    const landDiachi = (document.getElementById('land_diachi')?.value || '').trim() || '...........................................................................................';
    const landDientich = (document.getElementById('land_dientich')?.value || '').trim() || '........';
    const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim() || '...................................................';

    const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
    const dateYear = new Date().getFullYear();
    const dateStr = `Thanh Hóa, ngày ..... tháng ..... năm ${dateYear}`;

    let fullDoc = "";

    if (formType === 'mau_18_nd151' || formType === 'mau_29_qd2604') {
        fullDoc = `Mẫu số 29                                                         CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
QĐ 2604/QĐ-VP Thanh Hóa                                                 Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

              ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
            (Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)

                                Kính gửi: ${recipientStr}

I. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:
- Họ và tên: ${cccdHoten}
- Thẻ CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
- Nơi thường trú: ${cccdThuongtru}

II. Thửa đất đề nghị đăng ký biến động:
+ Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
+ Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
+ Giấy chứng nhận đã cấp số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso} do ${landNoiCap} cấp ngày ${landNgayCap}.

III. Nội dung đề nghị biến động:
Đăng ký biến động quyền sử dụng đất (chuyển nhượng / tặng cho / cấp đổi / đính chính thông tin) theo quy định của Luật Đất đai 2024.

IV. Giấy tờ nộp kèm theo hồ sơ:
1. Bản gốc Giấy chứng nhận quyền sử dụng đất số phát hành ${landSophathanh};
2. Hợp đồng chuyển quyền sử dụng đất được công chứng/chứng thực;
3. Bản sao Thẻ CCCD và các Tờ khai nghĩa vụ tài chính liên quan.

Tôi xin cam đoan toàn bộ nội dung kê khai trên đơn là hoàn toàn đúng sự thật và chịu trách nhiệm trước pháp luật.

   XÁC NHẬN CỦA UBND CẤP XÃ                                       ${dateStr}
(Về hiện trạng sử dụng đất và tình trạng tranh chấp)                    NGƯỜI LÀM ĐƠN
                                                                    (Ký và ghi rõ họ tên)
     (Ký, đóng dấu và ghi rõ họ tên)


                                                                    ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'don_tach_thua' || formType === 'mau_35_qd2604') {
        fullDoc = `Mẫu số 35                                                         CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
QĐ 2604/QĐ-VP Thanh Hóa                                                 Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                      ĐƠN ĐỀ NGHỊ TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT
            (Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)

                                Kính gửi: ${recipientStr}

1. Người làm đơn:
- Họ và tên: ${cccdHoten}
- Thẻ CCCD số: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
- Địa chỉ thường trú: ${cccdThuongtru}

2. Thông tin thửa đất đề nghị tách/hợp thửa:
- Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
- Diện tích hiện tại: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
- Giấy chứng nhận QSDĐ số: ${landSophathanh} ; Số vào sổ: ${landSovaoso}

3. Nội dung và lý do đề nghị:
- Đề nghị Chi nhánh Văn phòng Đăng ký đất đai thực hiện trích đo địa chính và thẩm định thủ tục tách thửa đất.
- Kích thước và diện tích các thửa đất sau khi tách đảm bảo đáp ứng đầy đủ điều kiện diện tích tối thiểu theo Quyết định số 18/2026/QĐ-UBND của UBND tỉnh Thanh Hóa.

Tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật.

                                                                  ${dateStr}
                                                                 NGƯỜI LÀM ĐƠN
                                                             (Ký và ghi rõ họ tên)


                                                             ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        fullDoc = `Mẫu số: 01/LPTB                                                   CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Ban hành kèm theo TT 80/2021/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                                TỜ KHAI LỆ PHÍ TRƯỚC BẠ
                                (Áp dụng đối với nhà, đất)

[01] Kỳ tính thuế: Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}
[02] Người nộp thuế: ${cccdHoten}
[03] Mã số thuế / Số CCCD: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
[04] Địa chỉ thường trú: ${cccdThuongtru}
[05] Số điện thoại: ............................  [06] Email: ............................

I. ĐẶC ĐIỂM NHÀ, ĐẤT KÊ KHAI LỆ PHÍ TRƯỚC BẠ:
1. Đất:
a) Địa chỉ thửa đất: ${landDiachi}
b) Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando}
c) Diện tích đất chịu lệ phí trước bạ: ${landDientich} m² (Sử dụng riêng: ${landDientich} m²; Sử dụng chung: 0 m²)
d) Nguồn gốc sử dụng đất: Nhận chuyển nhượng / Cấp GCN lần đầu / Tặng cho / Thừa kế
đ) Giấy chứng nhận QSDĐ số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso} do ${landNoiCap} cấp ngày ${landNgayCap}.
2. Nhà: (nếu có công trình gắn liền với đất)
- Cấp nhà/hạng nhà: ............................ ; Diện tích sàn: ............................ m²

II. GIẤY TỜ CHỨNG MINH THUỘC DIỆN MIỄN LỆ PHÍ TRƯỚC BẠ (nếu có):
- Giấy tờ chứng minh quan hệ nhân thân giữa người chuyển giao và người nhận quyền sử dụng đất.

Tôi cam đoan số liệu kê khai trên là đúng sự thật và chịu trách nhiệm trước pháp luật về số liệu đã kê khai.

                                                                  ${dateStr}
                                                                NGƯỜI NỘP THUẾ
                                                             (Ký và ghi rõ họ tên)


                                                             ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'tk_thue_tncn') {
        fullDoc = `Mẫu số: 03/BĐS-TNCN                                               CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Ban hành kèm theo TT 80/2021/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                              TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
    (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng BĐS, thừa kế, quà tặng BĐS)

[01] Kỳ tính thuế: Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}
[02] Tên người nộp thuế (Người chuyển nhượng): ${cccdHoten}
[03] Mã số thuế / Số CCCD: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
[04] Địa chỉ thường trú: ${cccdThuongtru}
[05] Số điện thoại: ............................

[06] Tên người nhận chuyển nhượng: ...................................................
[07] Số CCCD người nhận: ....................................  [08] Địa chỉ: ...................................................

I. THÔNG TIN BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG:
1. Địa chỉ thửa đất: ${landDiachi}
2. Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando}
3. Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
4. Giấy chứng nhận QSDĐ số phát hành: ${landSophathanh} ; Số vào sổ cấp GCN: ${landSovaoso}
5. Hợp đồng chuyển nhượng công chứng số: .................... ngày ...../...../..........
6. Giá trị chuyển nhượng theo hợp đồng: ................................................... đồng.

II. TRƯỜNG HỢP THUỘC DIỆN MIỄN THUẾ TNCN (nếu có):
[ ] Chuyển nhượng/tặng cho/thừa kế giữa vợ chồng, cha mẹ với con, ông bà với cháu, anh chị em ruột.
[ ] Chuyển nhượng nhà ở, đất ở duy nhất của cá nhân theo quy định của Luật Thuế TNCN.

Tôi cam đoan nội dung kê khai là đúng sự thật và chịu trách nhiệm trước pháp luật về số liệu đã kê khai.

                                                                  ${dateStr}
                                                                NGƯỜI KÊ KHAI
                                                             (Ký và ghi rõ họ tên)


                                                             ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'tk_phi_nong_nghiep') {
        fullDoc = `Mẫu số: 01/TK-SDDPNN                                              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Ban hành kèm theo TT 80/2021/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                      TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
                            (Dùng cho hộ gia đình, cá nhân)

[01] Năm tính thuế: ${dateYear}      [02] Khai lần đầu: [x]      [03] Khai bổ sung: [ ]

I. THÔNG TIN NGƯỜI NỘP THUẾ:
1. Tên người nộp thuế: ${cccdHoten}
2. Mã số thuế / Số định danh cá nhân (CCCD): ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát
3. Địa chỉ thường trú: ${cccdThuongtru}
4. Số điện thoại liên hệ: ............................

II. THÔNG TIN THỬA ĐẤT CHỊU THUẾ:
1. Địa chỉ thửa đất: ${landDiachi}
2. Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando}
3. Diện tích thửa đất: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
   - Diện tích đất trong hạn mức: ............... m² (Thuế suất 0.03%)
   - Diện tích đất vượt không quá 3 lần hạn mức: ............... m² (Thuế suất 0.07%)
   - Diện tích đất vượt trên 3 lần hạn mức: ............... m² (Thuế suất 0.15%)
4. Giấy chứng nhận quyền sử dụng đất số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso} do ${landNoiCap} cấp.

III. TRƯỜNG HỢP MIỄN, GIẢM THUẾ (nếu có):
- Thuộc diện gia đình chính sách, người có công cách mạng, vùng đặc biệt khó khăn...

Tôi xin cam đoan các thông tin kê khai trên là đúng sự thật và chịu hoàn toàn trách nhiệm trước pháp luật.

                                                                  ${dateStr}
                                                                NGƯỜI NỘP THUẾ
                                                             (Ký và ghi rõ họ tên)


                                                             ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else {
        // Mẫu số 25 chuẩn theo Image 1
        fullDoc = `Mẫu số 25                                                         CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
QĐ 2604/QĐ-VP Thanh Hóa                                                 Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                    ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
            (Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)

                                Kính gửi: ${recipientStr}

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:
- Họ và tên: ${cccdHoten}                     Năm sinh: ${cccdNgaySinh}
- Số CCCD: ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
- Nơi thường trú: ${cccdThuongtru}

2. Thửa đất đề nghị cấp Giấy chứng nhận:
+ Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} tại ${landDiachi}
+ Diện tích: ${landDientich} m² ; Mục đích sử dụng: ${landMucdich}
- Nguồn gốc sử dụng: Sử dụng đất ổn định, không có tranh chấp, phù hợp quy hoạch sử dụng đất.
- Đề nghị: Đăng ký và cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu theo Luật Đất đai 2024.

Tôi xin cam đoan toàn bộ nội dung kê khai trên đơn là hoàn toàn đúng sự thật, thửa đất không có tranh chấp, khiếu kiện và xin chịu hoàn toàn trách nhiệm trước pháp luật.

   XÁC NHẬN CỦA UBND CẤP XÃ                                       ${dateStr}
(Về hiện trạng sử dụng đất và tình trạng tranh chấp)                    NGƯỜI LÀM ĐƠN
                                                                    (Ký và ghi rõ họ tên)
     (Ký, đóng dấu và ghi rõ họ tên)


                                                                    ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
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

// XUẤT FILE WORD (.DOC) CHUẨN XÁC 100% VỚI HÌNH ẢNH MẪU ĐƠN NHÀ NƯỚC (IMAGE 1 & OBSIDIAN VAULT 04_MAUDON)
function exportToWord() {
    const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
    
    // Thu thập dữ liệu các trường
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim() || '...................................................';
    const cccdSo = (document.getElementById('cccd_so')?.value || '').trim() || '........................';
    const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim() || '...../...../..........';
    const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim() || '...../...../..........';
    const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim() || '...........................................................................................';
    
    const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim() || '........................';
    const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim() || '........................';
    const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim() || '...../...../..........';
    const landNoiCap = (document.getElementById('land_noicap')?.value || '').trim() || 'Chi nhánh VPĐKĐĐ';
    const landThua = (document.getElementById('land_thua')?.value || '').trim() || '........';
    const landTobando = (document.getElementById('land_tobando')?.value || '').trim() || '........';
    const landDiachi = (document.getElementById('land_diachi')?.value || '').trim() || '...........................................................................................';
    const landDientich = (document.getElementById('land_dientich')?.value || '').trim() || '........';
    const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim() || '...................................................';

    const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
    const dateYear = new Date().getFullYear();
    const dateStr = `Thanh Hóa, ngày ..... tháng ..... năm ${dateYear}`;

    let docMauSo = "Mẫu số 25";
    let docSubCode = "QĐ 2604/QĐ-VP Thanh Hóa";
    let docTitle = "ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT";
    let docSubTitle = "(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)";
    let docBodyHtml = "";
    let isTwoColumnSign = true;

    if (formType === 'mau_18_nd151' || formType === 'mau_29_qd2604') {
        docMauSo = "Mẫu số 29";
        docSubCode = "QĐ 2604/QĐ-VP Thanh Hóa";
        docTitle = "ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT";
        docSubTitle = "(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)";
        docBodyHtml = `
        <p class="section-heading"><b>I. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:</b></p>
        <p class="indent-p">- Họ và tên: <b>${cccdHoten.toUpperCase()}</b></p>
        <p class="indent-p">- Thẻ CCCD số: <b>${cccdSo}</b> ; Ngày cấp: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p class="indent-p">- Nơi thường trú: ${cccdThuongtru}</p>

        <p class="section-heading"><b>II. Thửa đất đề nghị đăng ký biến động:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Giấy chứng nhận đã cấp số phát hành: <b>${landSophathanh}</b> ; Số vào sổ cấp GCN: <b>${landSovaoso}</b> do ${landNoiCap} cấp ngày ${landNgayCap}.</p>

        <p class="section-heading"><b>III. Nội dung đề nghị biến động:</b></p>
        <p class="indent-p">Đăng ký biến động quyền sử dụng đất (chuyển nhượng / tặng cho / cấp đổi / đính chính thông tin) theo quy định của Luật Đất đai 2024 và Quyết định số 2604/QĐ-VP tỉnh Thanh Hóa.</p>

        <p class="section-heading"><b>IV. Giấy tờ nộp kèm theo hồ sơ:</b></p>
        <p class="indent-p">1. Bản gốc Giấy chứng nhận quyền sử dụng đất số phát hành ${landSophathanh};</p>
        <p class="indent-p">2. Hợp đồng chuyển quyền sử dụng đất được công chứng/chứng thực;</p>
        <p class="indent-p">3. Bản sao thẻ Căn cước công dân và các Tờ khai nghĩa vụ tài chính liên quan.</p>
        `;
    } else if (formType === 'don_tach_thua' || formType === 'mau_35_qd2604') {
        docMauSo = "Mẫu số 35";
        docSubCode = "QĐ 2604/QĐ-VP Thanh Hóa";
        docTitle = "ĐƠN ĐỀ NGHỊ TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT";
        docSubTitle = "(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)";
        isTwoColumnSign = false;
        docBodyHtml = `
        <p class="section-heading"><b>1. Người làm đơn:</b></p>
        <p class="indent-p">- Họ và tên: <b>${cccdHoten.toUpperCase()}</b></p>
        <p class="indent-p">- Thẻ CCCD số: <b>${cccdSo}</b> ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p class="indent-p">- Địa chỉ thường trú: ${cccdThuongtru}</p>

        <p class="section-heading"><b>2. Thông tin thửa đất đề nghị tách/hợp thửa:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Giấy chứng nhận QSDĐ số phát hành: <b>${landSophathanh}</b> ; Số vào sổ: <b>${landSovaoso}</b>.</p>

        <p class="section-heading"><b>3. Nội dung và lý do đề nghị:</b></p>
        <p class="indent-p">- Đề nghị Chi nhánh Văn phòng Đăng ký đất đai thực hiện trích đo địa chính và thẩm định thủ tục tách thửa đất.</p>
        <p class="indent-p">- Kích thước và diện tích các thửa đất sau khi tách đảm bảo đáp ứng đầy đủ điều kiện diện tích tối thiểu theo Quyết định số 18/2026/QĐ-UBND của UBND tỉnh Thanh Hóa.</p>
        `;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        docMauSo = "Mẫu số: 01/LPTB";
        docSubCode = "Thông tư số 80/2021/TT-BTC";
        docTitle = "TỜ KHAI LỆ PHÍ TRƯỚC BẠ";
        docSubTitle = "(Áp dụng đối với nhà, đất)";
        isTwoColumnSign = false;
        docBodyHtml = `
        <p class="indent-p"><b>[01] Kỳ tính thuế:</b> Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}</p>
        <p class="indent-p"><b>[02] Người nộp thuế:</b> <b>${cccdHoten.toUpperCase()}</b></p>
        <p class="indent-p"><b>[03] Mã số thuế / Số CCCD:</b> <b>${cccdSo}</b> &nbsp;;&nbsp; Cấp ngày: ${cccdNgayCap} &nbsp;;&nbsp; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p class="indent-p"><b>[04] Địa chỉ thường trú:</b> ${cccdThuongtru}</p>
        <p class="indent-p"><b>[05] Số điện thoại:</b> ........................................ &nbsp;&nbsp;&nbsp;&nbsp; <b>[06] Email:</b> ........................................</p>

        <p class="section-heading"><b>I. ĐẶC ĐIỂM NHÀ, ĐẤT KÊ KHAI LỆ PHÍ TRƯỚC BẠ:</b></p>
        <p class="indent-p"><b>1. Đất:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Nguồn gốc sử dụng đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu / Tặng cho / Thừa kế.</p>
        <p class="indent-p">- Giấy chứng nhận quyền sử dụng đất số phát hành: <b>${landSophathanh}</b> ; Số vào sổ: <b>${landSovaoso}</b> do ${landNoiCap} cấp ngày ${landNgayCap}.</p>
        <p class="indent-p"><b>2. Nhà:</b> (nếu có công trình xây dựng gắn liền với đất)</p>
        <p class="indent-p">- Cấp nhà / Hạng nhà: ........................................ &nbsp;;&nbsp; Diện tích sàn xây dựng: ............................ m²</p>

        <p class="section-heading"><b>II. GIẤY TỜ CHỨNG MINH THUỘC DIỆN MIỄN LỆ PHÍ TRƯỚC BẠ (nếu có):</b></p>
        <p class="indent-p">- Giấy tờ chứng minh quan hệ nhân thân giữa người chuyển giao và người nhận quyền sử dụng đất.</p>
        `;
    } else if (formType === 'tk_thue_tncn') {
        docMauSo = "Mẫu số: 03/BĐS-TNCN";
        docSubCode = "Thông tư số 80/2021/TT-BTC";
        docTitle = "TỜ KHAI THUẾ THU NHẬP CÁ NHÂN";
        docSubTitle = "(Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản; nhận thừa kế, quà tặng là bất động sản)";
        isTwoColumnSign = false;
        docBodyHtml = `
        <p class="indent-p"><b>[01] Kỳ tính thuế:</b> Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}</p>
        <p class="indent-p"><b>[02] Tên người nộp thuế (Người chuyển nhượng):</b> <b>${cccdHoten.toUpperCase()}</b></p>
        <p class="indent-p"><b>[03] Mã số thuế / Số CCCD:</b> <b>${cccdSo}</b> &nbsp;;&nbsp; Cấp ngày: ${cccdNgayCap} &nbsp;;&nbsp; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p class="indent-p"><b>[04] Địa chỉ thường trú:</b> ${cccdThuongtru}</p>
        <p class="indent-p"><b>[05] Số điện thoại:</b> ........................................</p>
        <p class="indent-p"><b>[06] Tên người nhận chuyển nhượng:</b> .....................................................................................</p>
        <p class="indent-p"><b>[07] Số CCCD người nhận:</b> .................................... &nbsp;;&nbsp; <b>[08] Địa chỉ:</b> ...................................................</p>

        <p class="section-heading"><b>I. THÔNG TIN BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Giấy chứng nhận QSDĐ số phát hành: <b>${landSophathanh}</b> ; Số vào sổ cấp GCN: <b>${landSovaoso}</b>.</p>
        <p class="indent-p">- Hợp đồng chuyển nhượng công chứng số: .................... ngày ...../...../.......... do VP Công chứng .................... lập.</p>
        <p class="indent-p">- Giá trị chuyển nhượng theo Hợp đồng: ................................................... đồng.</p>

        <p class="section-heading"><b>II. TRƯỜNG HỢP THUỘC DIỆN MIỄN THUẾ TNCN (nếu có):</b></p>
        <p class="indent-p">[ ] Chuyển nhượng/tặng cho/thừa kế giữa vợ chồng, cha mẹ với con, ông bà với cháu, anh chị em ruột.</p>
        <p class="indent-p">[ ] Chuyển nhượng nhà ở, đất ở duy nhất của cá nhân theo quy định của Luật Thuế TNCN.</p>
        `;
    } else if (formType === 'tk_phi_nong_nghiep') {
        docMauSo = "Mẫu số: 01/TK-SDDPNN";
        docSubCode = "Thông tư số 80/2021/TT-BTC";
        docTitle = "TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP";
        docSubTitle = "(Dùng cho hộ gia đình, cá nhân)";
        isTwoColumnSign = false;
        docBodyHtml = `
        <p class="indent-p"><b>[01] Năm tính thuế:</b> ${dateYear} &nbsp;&nbsp;&nbsp;&nbsp; <b>[02] Khai lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp; <b>[03] Khai bổ sung:</b> [ ]</p>
        <p class="section-heading"><b>I. THÔNG TIN NGƯỜI NỘP THUẾ:</b></p>
        <p class="indent-p">1. Tên người nộp thuế: <b>${cccdHoten.toUpperCase()}</b></p>
        <p class="indent-p">2. Mã số thuế / Số định danh cá nhân (CCCD): <b>${cccdSo}</b> ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát</p>
        <p class="indent-p">3. Địa chỉ thường trú: ${cccdThuongtru}</p>
        <p class="indent-p">4. Số điện thoại liên hệ: ........................................</p>

        <p class="section-heading"><b>II. THÔNG TIN THỬA ĐẤT CHỊU THUẾ:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Diện tích đất trong hạn mức: ............... m² (Thuế suất 0.03%)</p>
        <p class="indent-p">- Diện tích đất vượt không quá 3 lần hạn mức: ............... m² (Thuế suất 0.07%)</p>
        <p class="indent-p">- Diện tích đất vượt trên 3 lần hạn mức: ............... m² (Thuế suất 0.15%)</p>
        <p class="indent-p">- Giấy chứng nhận QSDĐ số: <b>${landSophathanh}</b> ; Số vào sổ: <b>${landSovaoso}</b> do ${landNoiCap} cấp.</p>

        <p class="section-heading"><b>III. TRƯỜNG HỢP MIỄN, GIẢM THUẾ (nếu có):</b></p>
        <p class="indent-p">- Thuộc diện gia đình chính sách, người có công cách mạng, vùng có điều kiện KTXH đặc biệt khó khăn...</p>
        `;
    } else {
        // MẪU SỐ 25 CHUẨN THEO IMAGE 1
        docMauSo = "Mẫu số 25";
        docSubCode = "QĐ 2604/QĐ-VP Thanh Hóa";
        docTitle = "ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT";
        docSubTitle = "(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của UBND tỉnh Thanh Hóa)";
        isTwoColumnSign = true;
        docBodyHtml = `
        <p class="section-heading"><b>1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:</b></p>
        <p class="indent-p">- Họ và tên: <b>${cccdHoten}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Năm sinh: ${cccdNgaySinh}</p>
        <p class="indent-p">- Số CCCD: <b>${cccdSo}</b> &nbsp;;&nbsp; Cấp ngày: ${cccdNgayCap} &nbsp;;&nbsp; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p class="indent-p">- Nơi thường trú: ${cccdThuongtru}</p>

        <p class="section-heading"><b>2. Thửa đất đề nghị cấp Giấy chứng nhận:</b></p>
        <table class="gov-table">
            <tr>
                <th width="12%">Thửa đất số</th>
                <th width="12%">Tờ bản đồ</th>
                <th width="44%">Địa chỉ thửa đất</th>
                <th width="14%">Diện tích</th>
                <th width="18%">Mục đích</th>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p class="indent-p">- Nguồn gốc sử dụng: Sử dụng đất ổn định, không có tranh chấp, phù hợp quy hoạch sử dụng đất.</p>
        <p class="indent-p">- Đề nghị: Đăng ký và cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu theo Luật Đất đai 2024.</p>
        `;
    }

    let signTitle = "NGƯỜI LÀM ĐƠN";
    if (formType === 'tk_le_phi_truoc_ba' || formType === 'tk_phi_nong_nghiep') {
        signTitle = "NGƯỜI NỘP THUẾ";
    } else if (formType === 'tk_thue_tncn') {
        signTitle = "NGƯỜI KÊ KHAI, NỘP THUẾ";
    }

    let signTableHtml = "";
    if (isTwoColumnSign) {
        signTableHtml = `
        <table class="sign-table">
            <tr>
                <td width="50%">
                    <div class="sign-title">XÁC NHẬN CỦA UBND CẤP XÃ</div>
                    <div class="sign-note">(Về hiện trạng sử dụng đất và tình trạng tranh chấp)</div>
                    <div class="sign-space"></div>
                    <div style="font-size: 11pt; font-style: italic;">(Ký, đóng dấu và ghi rõ họ tên)</div>
                </td>
                <td width="50%">
                    <div style="font-style: italic; font-size: 12pt; margin-bottom: 4px;">${dateStr}</div>
                    <div class="sign-title">${signTitle}</div>
                    <div class="sign-note">(Ký và ghi rõ họ tên)</div>
                    <div class="sign-space"></div>
                    <div class="sign-name">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>`;
    } else {
        signTableHtml = `
        <table class="sign-table">
            <tr>
                <td width="50%"></td>
                <td width="50%">
                    <div style="font-style: italic; font-size: 12pt; margin-bottom: 4px;">${dateStr}</div>
                    <div class="sign-title">${signTitle}</div>
                    <div class="sign-note">(Ký và ghi rõ họ tên)</div>
                    <div class="sign-space"></div>
                    <div class="sign-name">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>`;
    }

    let recipientHtml = "";
    if (!formType.startsWith('tk_')) {
        recipientHtml = `
        <div class="recipients-block">
            <b>Kính gửi:</b> <b>${recipientStr}</b>
        </div>`;
    }

    const filename = `${docMauSo.replace(/[:\/ ]+/g, '_')}_${cccdHoten.replace(/\s+/g, '_')}.doc`;

    try {
        const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${docTitle}</title>
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
                    size: 21.0cm 29.7cm; /* Khổ giấy A4 chuẩn */
                    margin: 2.0cm 1.5cm 2.0cm 3.0cm; /* Căn lề chuẩn NĐ 30/2020: Trên 2cm, Dưới 2cm, Trái 3cm, Phải 1.5cm */
                    mso-header-margin: 36.0pt;
                    mso-footer-margin: 36.0pt;
                    mso-paper-source: 0;
                }
                div.Section1 { page: Section1; }
                body {
                    font-family: 'Times New Roman', 'Times', serif;
                    font-size: 13.0pt;
                    line-height: 1.35;
                    color: #000000;
                    text-align: justify;
                }
                .header-table { width: 100%; border: none; border-collapse: collapse; margin-bottom: 6px; }
                .header-table td { border: none; padding: 0px; vertical-align: top; }
                .doc-code { font-size: 12pt; font-weight: bold; }
                .national-title { font-size: 12pt; font-weight: bold; text-align: center; text-transform: uppercase; }
                .national-motto { font-size: 13pt; font-weight: bold; text-align: center; }
                .motto-line { width: 150px; height: 1px; background-color: #000; margin: 4px auto 0 auto; }
                .doc-title { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 16px 0 4px 0; }
                .doc-subtitle { font-size: 11pt; font-style: italic; text-align: center; margin-bottom: 14px; }
                .recipients-block { text-align: center; margin: 10px 0 14px 0; font-size: 13pt; }
                .section-heading { font-size: 13pt; margin: 8px 0 4px 0; }
                .indent-p { font-size: 13pt; margin: 4px 0; text-indent: 1.27cm; }
                .gov-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 12pt; }
                .gov-table th, .gov-table td { border: 1px solid #000; padding: 5px 8px; }
                .gov-table th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
                .sign-table { width: 100%; border: none; border-collapse: collapse; margin-top: 25px; }
                .sign-table td { border: none; padding: 0px; text-align: center; vertical-align: top; font-size: 13pt; }
                .sign-title { font-weight: bold; text-transform: uppercase; }
                .sign-note { font-style: italic; font-size: 11pt; }
                .sign-space { height: 75px; }
                .sign-name { font-weight: bold; font-size: 13pt; }
            </style>
        </head>
        <body>
            <div class="Section1">
                <!-- PHẦN ĐẦU: QUỐC HIỆU, TIÊU NGỮ & MÃ BIỂU MẪU CHUẨN NGHỊ ĐỊNH 30/2020 -->
                <table class="header-table">
                    <tr>
                        <td width="40%" align="left">
                            <div class="doc-code">${docMauSo}</div>
                            <div style="font-size: 11pt; font-style: italic;">${docSubCode}</div>
                        </td>
                        <td width="60%" align="center">
                            <div class="national-title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                            <div class="national-motto">Độc lập - Tự do - Hạnh phúc</div>
                            <div class="motto-line"></div>
                        </td>
                    </tr>
                </table>

                <!-- TIÊU ĐỀ VĂN BẢN -->
                <div class="doc-title">${docTitle}</div>
                <div class="doc-subtitle">${docSubTitle}</div>

                <!-- KÍNH GỬI -->
                ${recipientHtml}

                <!-- NỘI DUNG VĂN BẢN -->
                ${docBodyHtml}

                <p class="indent-p" style="margin-top: 10px;">Tôi xin cam đoan toàn bộ nội dung kê khai trên đơn là hoàn toàn đúng sự thật và xin chịu hoàn toàn trách nhiệm trước pháp luật.</p>

                <!-- PHẦN CHỮ KÝ -->
                ${signTableHtml}
            </div>
        </body>
        </html>
        `;

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

        console.log("✅ Đã xuất chuẩn xác mẫu đơn theo QĐ 2604 & TT 80/2021/TT-BTC:", filename);
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
