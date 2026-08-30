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
        // MẪU SỐ 01/LPTB CHUẨN TỪ G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tk lệ phí trước bạ.doc (Thông tư 89/2026/TT-BTC)
        fullDoc = `Mẫu số: 01/LPTB                                                   CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Kèm theo Thông tư số 89/2026/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                                TỜ KHAI LỆ PHÍ TRƯỚC BẠ
                                (Áp dụng đối với nhà, đất)

[01] Kỳ tính thuế: Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}
[02] Lần đầu: [x]              [03] Bổ sung lần thứ:……
[ ] Tổ chức, cá nhân được ủy quyền khai thay cho người nộp thuế

[04] Người nộp thuế: ${cccdHoten}
[05] Ngày, tháng, năm sinh (Đối với người nộp thuế là cá nhân): ${cccdNgaySinh}
[06] Mã số thuế: ......................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${cccdSo}
[08] Địa chỉ: ${cccdThuongtru}
[09] Xã/phường/đặc khu: .................................. [10] Tỉnh/Thành phố: Thanh Hóa
[11] Điện thoại: .....................  [12] Fax: .................. [13] Email: ..........................................
[14] Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế; hoặc Tổ chức, cá nhân được ủy quyền khai thay (nếu có): ......................................................................................
[15] Mã số thuế: ......................................................................................................................
[16] Hợp đồng dịch vụ làm thủ tục về thuế: Số: ................................ Ngày: ........................

ĐẶC ĐIỂM NHÀ ĐẤT:
1. Đất:
1.1. Thửa đất số (Số hiệu thửa đất): ${landThua} ; Tờ bản đồ số: ${landTobando}
1.2. Địa chỉ thửa đất: ${landDiachi}
1.3. Vị trí thửa đất (mặt tiền đường phố hay ngõ, hẻm): ...........................................................
1.4. Mục đích sử dụng đất: ${landMucdich}
1.5. Diện tích (m²): ${landDientich} m²
1.6. Nguồn gốc nhà đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu / Tặng cho / Thừa kế
a) Tên tổ chức, cá nhân chuyển giao QSDĐ: ............................................................................
- Mã số thuế: .................................... - Số định danh cá nhân / Số hộ chiếu: ..........................
- Địa chỉ người giao QSDĐ: ...................................................................................................
b) Thời điểm làm giấy tờ chuyển giao QSDĐ: Ngày ..... tháng ..... năm ${dateYear}
- Giấy chứng nhận quyền sử dụng đất số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso} do ${landNoiCap} cấp ngày ${landNgayCap}.
1.7. Giá trị đất thực tế chuyển giao (nếu có): ................................................... đồng

2. Nhà (nếu có công trình xây dựng gắn liền với đất):
2.1. Thông tin về nhà ở, nhà làm việc, nhà sử dụng cho mục đích khác:
- Cấp nhà: .................... Loại nhà: .................... Hạng nhà: ....................
- Diện tích xây dựng (m²): .................... ; Diện tích sàn xây dựng (m²): ....................
2.3. Nguồn gốc nhà: Tự xây dựng [ ] / Mua, thừa kế, tặng cho [ ]
2.4. Giá trị nhà (đồng): ...........................................................................................................

3. Giá trị nhà, đất thực tế nhận chuyển nhượng, nhận thừa kế, nhận tặng cho (đồng):
...............................................................................................................................................

4. Tài sản thuộc diện được miễn lệ phí trước bạ (lý do):
...............................................................................................................................................

5. Giấy tờ có liên quan gồm:
1. Hợp đồng chuyển quyền sử dụng đất, quyền sở hữu nhà ở có công chứng/chứng thực;
2. Giấy chứng nhận quyền sử dụng đất số phát hành: ${landSophathanh};
3. Giấy tờ chứng minh thuộc diện miễn lệ phí trước bạ (nếu có).

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ
(Ký, ghi rõ họ tên)                             (Ký, ghi rõ họ tên; chức vụ và đóng dấu)


                                                        ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'tk_thue_tncn') {
        // MẪU SỐ 03/BĐS-TNCN CHUẨN TỪ G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tờ khai thuế thu nhập cá nhân.docx (Thông tư 89/2026/TT-BTC)
        fullDoc = `Mẫu số: 03/BĐS-TNCN                                                   CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Kèm theo Thông tư số 89/2026/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                          TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
         (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản; 
             thu nhập từ nhận thừa kế và nhận quà tặng là bất động sản)

[01] Kỳ tính thuế: Lần phát sinh: Ngày … tháng … năm ${dateYear}
[02] Lần đầu: [x]      [03.1] Bổ sung lần thứ:…       [03.2] Số Thông báo liền kề:….

I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
1. Họ và tên: ${cccdHoten}
2. Mã số thuế / Số định danh cá nhân: ${cccdSo}
3. Ngày, tháng, năm sinh: ${cccdNgaySinh}
4. Điện thoại: ........................................ ; Email: ........................................
5. Nơi thường trú: ${cccdThuongtru}
6. Tỷ lệ sở hữu: 100%
[05] Tổ chức, cá nhân khai, nộp thuế thay (nếu có): ..........................................................
[07] Văn bản ủy quyền (nếu có): Số ..............ngày ..... tháng ..... năm ..........

II. THÔNG TIN NGƯỜI NHẬN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
1. Họ và tên: .......................................................................................................................
2. Mã số thuế / Số định danh cá nhân: ................................................................................
3. Ngày, tháng, năm sinh: ...../...../.......... ; Điện thoại: .....................................................
4. Nơi thường trú: ...............................................................................................................
5. Tỷ lệ sở hữu (%): 100%

III. LOẠI BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
[12] Quyền sử dụng đất và tài sản gắn liền trên đất: [x]
[13] Quyền sở hữu hoặc sử dụng nhà ở: [ ]
[14] Quyền thuê đất, thuê mặt nước: [ ]
[15] Bất động sản khác: [ ]

IV. ĐẶC ĐIỂM BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG:
[16] Giấy tờ về quyền sử dụng đất:
[16.1] Loại giấy tờ: Giấy chứng nhận quyền sử dụng đất
[16.2] Số phát hành: ${landSophathanh} ; [16.3] Nơi cấp: ${landNoiCap} ; [16.4] Ngày cấp: ${landNgayCap}
[18] Hợp đồng chuyển nhượng trao đổi bất động sản:
[18.1] Số: .................... [18.2] Nơi lập: VP Công chứng .................... [18.3] Ngày lập: ...../...../..........
[20] Thông tin về đất:
[20.1] Thửa đất số: ${landThua} ; [20.2] Tờ bản đồ số: ${landTobando}
[20.3] Địa chỉ: ${landDiachi}
[20.6] Loại đất: ${landMucdich} ; Diện tích: ${landDientich} m²
[20.7] Nguồn gốc đất: Nhận chuyển nhượng / Cấp GCN lần đầu
[20.8] Thời hạn sử dụng đất: Ổn định lâu dài [x]
[20.9] Giá trị đất thực tế chuyển giao: ................................................... đồng

[21] Thông tin về nhà ở, công trình xây dựng (nếu có):
- Cấp nhà ở: .................... Diện tích sàn xây dựng: .................... m²
[22] Tài sản gắn liền với đất: .................................................................................................

V. THU NHẬP TỪ CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN / THỪA KẾ / QUÀ TẶNG:
[23.1] Thu nhập từ chuyển nhượng bất động sản: [x]
[24] Giá trị chuyển nhượng bất động sản và tài sản khác gắn liền với đất: .................... đồng
[26] Miễn thuế thu nhập cá nhân (nếu thuộc đối tượng miễn thuế):
[ ] Chuyển nhượng giữa vợ chồng, cha mẹ với con, ông bà với cháu, anh chị em ruột.
[ ] Chuyển nhượng nhà ở, đất ở duy nhất của cá nhân theo quy định.

VI. HỒ SƠ KÈM THEO GỒM:
1. Hợp đồng chuyển nhượng quyền sử dụng đất (bản chính có công chứng);
2. Bản sao Giấy chứng nhận quyền sử dụng đất số ${landSophathanh};
3. Bản sao CCCD của các bên chuyển nhượng và nhận chuyển nhượng.

Tôi cam đoan những nội dung kê khai là đúng và chịu trách nhiệm trước pháp luật về những nội dung đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ
(Ký, ghi rõ họ tên)                             (Ký, ghi rõ họ tên; chức vụ và đóng dấu)


                                                        ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'tk_phi_nong_nghiep') {
        // MẪU SỐ 01/TK-SDDPNN CHUẨN TỪ G:\My Drive\BOT CHẠY\obsidian_vault\cac to khai thue\tk phi nông nghiệp.docx (Thông tư 89/2026/TT-BTC)
        fullDoc = `Mẫu số: 01/TK-SDDPNN                                              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
(Kèm theo Thông tư số 89/2026/TT-BTC)                                   Độc lập - Tự do - Hạnh phúc
                                                                               ---------------

                     TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
                         (Áp dụng đối với hộ gia đình, cá nhân)

   [01] Kỳ tính thuế: Năm ${dateYear}
   [02] Lần đầu: [x]                       [03] Bổ sung lần thứ:……

1. Người nộp thuế:      
[04] Họ và tên: ${cccdHoten}
[05] Ngày, tháng, năm sinh: ${cccdNgaySinh}
[06] Mã số thuế: .....................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${cccdSo}
[08] Địa chỉ cư trú: ${cccdThuongtru}
[09] Địa chỉ nhận thông báo thuế: ${cccdThuongtru}
[10] Điện thoại: ......................................................................................................................

2. Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế (nếu có):      
[11] Tên tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế: ...........................................
[12] Mã số thuế: ....................................................................................................................
[13] Hợp đồng dịch vụ làm thủ tục về thuế: Số: ................................ Ngày: ........................

3. Thửa đất chịu thuế: 
[14] Thông tin người sử dụng đất:
- Họ và tên: ${cccdHoten} | Mã số thuế: .................... | Số CCCD/Định danh: ${cccdSo} | Tỷ lệ: 100%
[15] Nguồn gốc thửa đất: Sử dụng đất ổn định, nhận chuyển nhượng / cấp GCN lần đầu
[16] Địa chỉ thửa đất: ${landDiachi}
[17] Là thửa đất duy nhất: [x]
[18] Đăng ký kê khai tổng hợp tại: ${landDiachi}
[19] Đã có giấy chứng nhận:
[19.1] Số giấy chứng nhận: ${landSophathanh}            [19.2] Ngày cấp: ${landNgayCap}
[19.3] Thửa đất số: ${landThua}                         [19.4] Tờ bản đồ số: ${landTobando}
[19.5] Diện tích: ${landDientich} m²                    [19.6] Loại đất/ Mục đích sử dụng: ${landMucdich}
[20] Tổng diện tích thực tế sử dụng cho mục đích phi nông nghiệp: ${landDientich} m²
[20.1] Diện tích đất sử dụng đúng mục đích: ${landDientich} m²
[20.2] Diện tích đất sử dụng không đúng mục đích: 0 m²
[20.3] Diện tích đất chưa sử dụng theo đúng quy định: 0 m²
[20.4] Hạn mức (nếu có): ......................................................................................................
[20.5] Diện tích đất lấn, chiếm: 0 m²
[21] Chưa có giấy chứng nhận:   
[21.1] Diện tích: ................. [21.2] Loại đất/ Mục đích đang sử dụng: ...........................
[22] Thời điểm bắt đầu sử dụng đất: ...................................................................................... 
[23] Thời điểm thay đổi thông tin của thửa đất: ......................................................................

4. Đối với đất ở nhà nhiều tầng nhiều hộ ở, nhà chung cư [24]: 
[24.1] Loại nhà: ................... [24.2] Diện tích: ................ [24.3] Hệ số phân bổ: ..........

5. Miễn, giảm thuế [25]: 
[25.1] Trường hợp miễn, giảm: ................................................................................................
[25.2] Kỳ tính thuế/Khoảng thời gian đề nghị miễn, giảm: ...............................................

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ
(Ký, ghi rõ họ tên)                             (Ký, ghi rõ họ tên; chức vụ và đóng dấu)


                                                        ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else {
        // Mẫu số 25 chuẩn theo Quyết định 2604/QĐ-VP Thanh Hóa
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
            console.warn("QR Code render bypass:", err);
        }
    }
}

// ============================================================
// XUẤT FILE WORD NGUYÊN BẢN CHUẨN 100% TỪ VĂN BẢN ĐANG SOẠN TRÊN KHUNG A4
// GIỮ NGUYÊN HOÀN TOÀN CẤU TRÚC MẪU ĐƠN VÀ NỘI DUNG NGƯỜI DÙNG ĐANG CHỈNH SỬA
// ============================================================
function exportToWord() {
    const rawContent = (document.getElementById('formOutputText')?.value || '').trim();
    if (!rawContent) {
        alert("Chưa có nội dung mẫu đơn để xuất file Word!");
        return;
    }

    const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
    const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim() || 'Mau_Don';
    const filename = `${formType}_${cccdHoten.replace(/\s+/g, '_')}.doc`;

    // Convert raw plain text from A4 textarea into rich structured Word HTML
    const lines = rawContent.split('\n');
    let bodyHtml = "";

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trimEnd();
        if (!line.trim()) {
            bodyHtml += `<p style="margin: 0; line-height: 12pt; font-size: 11pt;">&nbsp;</p>\n`;
            continue;
        }

        // Escape HTML
        let escaped = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Check if line is national header (Cộng hòa xã hội...)
        if (escaped.includes("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM") || escaped.includes("CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM")) {
            bodyHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom:12px;">
                <tr>
                    <td width="40%" align="left" valign="top" style="font-family:'Times New Roman', serif; font-size:11pt; font-weight:bold;">
                        ${lines[0] ? lines[0].split('   ')[0] : ''}<br>
                        <span style="font-size:10pt; font-style:italic; font-weight:normal;">${lines[1] ? lines[1].split('   ')[0] : ''}</span>
                    </td>
                    <td width="60%" align="center" valign="top" style="font-family:'Times New Roman', serif;">
                        <div style="font-size:12pt; font-weight:bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div style="font-size:12pt; font-weight:bold; margin-top:2px;">Độc lập - Tự do - Hạnh phúc</div>
                        <div style="width:140px; height:1px; background:#000; margin:4px auto 0 auto;"></div>
                    </td>
                </tr>
            </table>\n`;
            // Skip next line if it was Doc lap tu do
            if (i + 1 < lines.length && lines[i+1].includes("Độc lập")) i++;
            if (i + 1 < lines.length && lines[i+1].includes("---")) i++;
            continue;
        }

        // Check if line is main document title
        if (escaped.includes("ĐƠN ĐĂNG KÝ") || escaped.includes("ĐƠN ĐỀ NGHỊ") || escaped.includes("TỜ KHAI THUẾ") || escaped.includes("TỜ KHAI LỆ PHÍ")) {
            bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin:16px 0 4px 0; text-transform:uppercase;">${escaped}</div>\n`;
            continue;
        }

        // Subtitle (Ban hành kèm theo...)
        if (escaped.startsWith("(") && escaped.endsWith(")")) {
            bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:11pt; font-style:italic; margin-bottom:12px;">${escaped}</div>\n`;
            continue;
        }

        // Kính gửi
        if (escaped.includes("Kính gửi:")) {
            bodyHtml += `<div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin:12px 0 16px 0;">${escaped}</div>\n`;
            continue;
        }

        // Section heading
        if (escaped.match(/^[I|V|X]+\./) || escaped.match(/^[1-9]\./)) {
            bodyHtml += `<p style="font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin:8px 0 4px 0;">${escaped}</p>\n`;
            continue;
        }

        // Signatures 2-column detection
        if (escaped.includes("XÁC NHẬN CỦA UBND") || escaped.includes("NGƯỜI TRỰC TIẾP THỰC HIỆN")) {
            bodyHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
                <tr>
                    <td width="50%" align="center" valign="top">
                        <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">${escaped.split('   ')[0]}</div>
                        <div style="font-size:10pt; font-style:italic; margin-top:2px;">(Ký, đóng dấu và ghi rõ họ tên)</div>
                        <div style="height:60px;"></div>
                    </td>
                    <td width="50%" align="center" valign="top">
                        <div style="font-style:italic; font-size:11pt; margin-bottom:4px;">Thanh Hóa, ngày ..... tháng ..... năm ${new Date().getFullYear()}</div>
                        <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">NGƯỜI LÀM ĐƠN / NỘP THUẾ</div>
                        <div style="font-size:10pt; font-style:italic; margin-top:2px;">(Ký và ghi rõ họ tên)</div>
                        <div style="height:60px;"></div>
                        <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== 'Mau_Don' && !cccdHoten.includes('.') ? cccdHoten : ''}</div>
                    </td>
                </tr>
            </table>\n`;
            // Skip remaining signature lines
            break;
        }

        // Default paragraph
        bodyHtml += `<p style="font-family:'Times New Roman', serif; font-size:12pt; line-height:1.3; margin:3px 0; text-align:justify;">${escaped}</p>\n`;
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
                size: 210mm 297mm;
                margin: 20mm 15mm 20mm 30mm; /* Chuẩn thể thức văn bản: Trên 2cm, Dưới 2cm, Trái 3cm, Phải 1.5cm */
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
            p {
                margin: 3px 0;
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
        console.log("✅ Đã xuất chuẩn xác mẫu đơn nguyên bản:", filename);
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
