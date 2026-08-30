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
    const dateStr = `ngày ..... tháng ..... năm ${dateYear}`;

    let fullDoc = "";

    if (formType === 'mau_25_qd2604') {
        // MẪU SỐ 25 (TRANG 49-51 PLIV_signed.pdf)
        fullDoc = `Mẫu số 25. Đơn đăng ký đất đai, tài sản gắn liền với đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------
ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT

Kính gửi: ${recipientStr} (1)

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:
(Trường hợp nhiều người cùng sử dụng đất, cùng sở hữu tài sản thì kê khai tên người cùng sử dụng đất, cùng sở hữu tài sản đó theo Mẫu số 25a)
a) Họ và tên (2): ${cccdHoten}                     Năm sinh: ${cccdNgaySinh}
b) Giấy tờ nhân thân/pháp nhân (3): ${cccdSo} ; Cấp ngày: ${cccdNgayCap} ; Nơi cấp: Cục Cảnh sát QLHC về TTXH
c) Mã số thuế (nếu có): .........................................................................................................
d) Địa chỉ (4): ${cccdThuongtru}
đ) Điện thoại liên hệ (nếu có): ……………….. Hộp thư điện tử (nếu có): .........................

2. Thửa đất đăng ký (người sử dụng đất là tổ chức thì không phải kê khai mục này):
(Trường hợp đăng ký nhiều thửa đất nông nghiệp mà không đề nghị cấp Giấy chứng nhận hoặc đề nghị cấp chung một Giấy chứng nhận cho nhiều thửa đất nông nghiệp thì không kê khai các nội dung tại Mục này mà chỉ ghi tổng số thửa và kê khai từng thửa đất theo Mẫu số 25b)
a) Thửa đất số (4a): ${landThua} ; Tờ bản đồ số (4b): ${landTobando}
b) Địa chỉ (5): ${landDiachi}
c) Diện tích (6): ${landDientich} m²; sử dụng chung: ....... m²; sử dụng riêng: ${landDientich} m²
d) Sử dụng vào mục đích (7): ${landMucdich}, từ thời điểm: ....................
đ) Thời hạn đề nghị được sử dụng đất (8): Ổn định lâu dài
e) Nguồn gốc sử dụng đất (9): Sử dụng đất ổn định, không có tranh chấp
g) Có quyền hoặc hạn chế quyền đối với thửa đất liền kề số ……, tờ bản đồ số ……, của ……, nội dung về quyền đối với thửa đất liền kề (10): Không.

3. Nhà ở, công trình xây dựng (người sử dụng đất là tổ chức thì không phải kê khai mục này):
(Chỉ kê khai nếu có nhu cầu đăng ký hoặc chứng nhận quyền sở hữu tài sản; Trường hợp có nhiều nhà ở, công trình xây dựng khác trên cùng 01 thửa đất thì chỉ kê khai các thông tin chung và tổng diện tích của các nhà ở, công trình xây dựng; đồng thời lập danh sách nhà ở, công trình theo Mẫu số 25c)
a) Loại nhà ở, công trình xây dựng (11): ................................................................................
b) Diện tích xây dựng (12): …………… m²
c) Diện tích sàn xây dựng/diện tích sử dụng (13): …………….. m²
d) Sở hữu chung (14): …………… m², sở hữu riêng (14): ……………….. m²
đ) Số tầng: …….. tầng; trong đó, số tầng nổi: ……… tầng, số tầng hầm: ………. tầng
e) Nguồn gốc (15): Tự xây dựng
g) Năm hoàn thành xây dựng (16): ....................
h) Thời hạn sở hữu đến (17): ..............................................................................
i) Cam kết chịu trách nhiệm về nhà ở, công trình xây dựng (18): □

4. Đề nghị của người sử dụng đất, chủ sở hữu tài sản gắn liền với đất: (Đánh dấu vào ô lựa chọn)
a) Đề nghị đăng ký đất đai, tài sản gắn liền với đất [x]
b) Đề nghị cấp Giấy chứng nhận [x]
c) Đề nghị ghi nợ tiền sử dụng đất (đối với cá nhân) □
d) Đề nghị khác (nếu có): .....................................................................................................

5. Thông tin về đối tượng được miễn tiền sử dụng đất, tiền thuê đất (nếu có)(19): 
...............................................................................................................................................

6. Những giấy tờ nộp kèm theo (20):
(1) Bản trích đo địa chính thửa đất số ${landThua};
(2) Bản sao Thẻ Căn cước công dân số ${cccdSo};
(3) Các giấy tờ chứng minh quyền sử dụng đất theo quy định của Luật Đất đai 2024.

Tôi/chúng tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật, nếu sai tôi/chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật.

                                                                  ..., ${dateStr}
                                                      Người sử dụng đất/Người kê khai
                                                   (Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}

Hướng dẫn kê khai đơn: “Lưu ý: xem kỹ hướng dẫn viết Đơn trước khi kê khai; không tẩy xóa, sửa chữa trên Đơn”
(1) Đối với hộ gia đình, cá nhân, cộng đồng dân cư thì ghi: “Ủy ban nhân dân/Chủ tịch UBND xã/phường/đặc khu …”; đối với tổ chức, người gốc Việt Nam định cư nước ngoài thì ghi: “Sở Nông nghiệp và Môi trường …” .
(2) Cá nhân: Ghi họ và tên bằng chữ in hoa, năm sinh theo giấy tờ nhân thân. Người gốc Việt Nam định cư ở nước ngoài: Ghi họ tên, năm sinh, quốc tịch. Cộng đồng dân cư: Ghi tên của cộng đồng dân cư. Tổ chức: Ghi theo quyết định thành lập hoặc giấy đăng ký kinh doanh.
(3) Cá nhân: Ghi số định danh cá nhân hoặc số, ngày cấp và nơi cấp hộ chiếu. Tổ chức: Ghi số, ngày ký, cơ quan ký văn bản theo quyết định thành lập hoặc giấy đăng ký kinh doanh.
(4) Cá nhân: Ghi địa chỉ nơi đăng ký thường trú.
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
a) Tên (2): ${cccdHoten}
b) Giấy tờ nhân thân/pháp nhân (2): CCCD số ${cccdSo} cấp ngày ${cccdNgayCap} tại Cục Cảnh sát QLHC về TTXH
c) Địa chỉ (2): ${cccdThuongtru}
d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...........
(Trường hợp có nhiều đồng sử dụng, sở hữu thì kê khai thông tin một người đại diện; đồng thời lập danh sách theo bảng 01 kèm theo)

2. Giấy chứng nhận đã cấp (3)
2.1. Số vào sổ cấp Giấy chứng nhận: ${landSovaoso};
2.2. Số phát hành Giấy chứng nhận (Số seri): ${landSophathanh};
2.3. Ngày cấp Giấy chứng nhận: ${landNgayCap};

3. Nội dung biến động (4):
Đăng ký biến động quyền sử dụng đất đối với thửa đất số ${landThua}, tờ bản đồ số ${landTobando} tại ${landDiachi} do nhận chuyển nhượng / tặng cho / thừa kế / cấp đổi / đính chính thông tin theo quy định.

4. Thông tin về đối tượng được miễn, giảm nghĩa vụ tài chính về đất đai (nếu có)(5):
.................................................................................................................................

5. Giấy tờ liên quan đến nội dung biến động nộp kèm theo đơn này gồm có (6):
(1) Giấy chứng nhận đã cấp số phát hành ${landSophathanh};
(2) Hợp đồng chuyển quyền sử dụng đất được công chứng/chứng thực;
(3) Bản sao Thẻ CCCD và các tờ khai nghĩa vụ tài chính liên quan.

[x] Có nhu cầu cấp mới Giấy chứng nhận (7)
[ ] Không có nhu cầu cấp mới Giấy chứng nhận

Cam đoan nội dung kê khai trên đơn là đúng sự thật và chịu trách nhiệm trước pháp luật.

                                                                  ..., ${dateStr}
                                                                  Người viết đơn
                                                       (Ký, ghi rõ họ tên và đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}

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
a) Tên: ${cccdHoten}
b) Giấy tờ nhân thân/pháp nhân số (2): ${cccdSo}
c) Địa chỉ: ${cccdThuongtru}
d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...............

2. Đề nghị tách thửa đất, hợp thửa đất (3) như sau:
a) Tách thửa đất số ${landThua}, tờ bản đồ số: ${landTobando}, diện tích: ${landDientich} m²; loại đất: ${landMucdich}; địa chỉ thửa đất: ${landDiachi}; Giấy chứng nhận: số vào sổ cấp GCN: ${landSovaoso}, ngày cấp GCN: ${landNgayCap}, thành ……… thửa:
Thửa thứ nhất: diện tích: …..…… m²; loại đất: ${landMucdich}
Thửa thứ hai: diện tích: ……..… m²; loại đất: ${landMucdich}
(Liệt kê các thửa đất tách thửa): ......................................................................................................................

b) Hợp thửa đất số .……....., tờ bản đồ số: ………...…, diện tích: ……...…… m²; loại đất: …………, địa chỉ thửa đất: ..........................................................; Giấy chứng nhận: số vào sổ cấp GCN: ….. ……...…, ngày cấp GCN: ..........................., với: Thửa đất số: ……..., tờ bản đồ số: …....…, diện tích: ……..…… m²; loại đất: ……………..., địa chỉ thửa đất: ...................; Giấy chứng nhận: số vào sổ cấp GCN: ….…, ngày cấp GCN: .....................
(liệt kê các thửa đất cần hợp): .........................................................................................................................
Thành thửa đất mới: Diện tích: ……… m²; loại đất: ……………………..…...
(liệt kê các thửa đất sau hợp thửa): ....................................................................................................................

c) Tách đồng thời với hợp thửa đất:
........................................................................................................................................................
(Mô tả chi tiết việc tách, hợp thửa): ....................................................................................................................

3. Lý do tách, hợp thửa đất: Phân chia quyền sử dụng đất / tặng cho / chuyển nhượng theo quy định.

4. Giấy tờ nộp kèm theo đơn này gồm có:
- Giấy chứng nhận số phát hành ${landSophathanh} và Bản vẽ tách thửa đất, hợp thửa đất các thửa đất nêu trên;
- Bản sao CCCD của người sử dụng đất.

5. Đề nghị cấp Giấy chứng nhận: Có đề nghị cấp Giấy chứng nhận cho các thửa đất mới sau khi tách thửa.
(ghi có hoặc không thay đổi người sử dụng đất)

Tôi cam đoan nội dung kê khai trên đơn là đúng.

                                                                  ……, ${dateStr}
                                                                  Người viết đơn (4)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}

II. Ý KIẾN CỦA VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI/CHI NHÁNH VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI (5)
.................................................................................................................................................................
.................................................................................................................................................................

Ngày ……. tháng …… năm …...                              Ngày ……. tháng …… năm …...
       Người kiểm tra                                      Văn phòng đăng ký đất đai/Chi nhánh
(Ký, ghi rõ họ tên, chức vụ)                                    Văn phòng đăng ký đất đai
                                                              (Ký, ghi rõ họ tên, chức vụ, đóng dấu)

Hướng dẫn viết đơn:
(1) Ghi tên người sử dụng đất theo Giấy chứng nhận.
(2) Ghi số định danh cá nhân hoặc số, ngày cấp và nơi cấp hộ chiếu.
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

1. Người đề nghị (3): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): Điện thoại: .................... Email: ....................
4. Địa điểm thửa đất/khu đất/khu rừng: ${landDiachi} (Thửa số: ${landThua}, Tờ bản đồ: ${landTobando})
5. Diện tích đất (m²): ${landDientich} m²
6. Diện tích đất chuyên trồng lúa phải nộp tiền theo quy định (m²) (nếu có): ....................
7. Diện tích rừng (m²) (nếu có): ....................
8. Để sử dụng vào mục đích (4): ${landMucdich}
9. Hình thức sử dụng đất (5): Cho thuê đất thu tiền thuê đất hằng năm [x] / Giao đất có thu tiền sử dụng đất [ ]
10. Thời hạn sử dụng đất: 50 năm
11. Xác định trường hợp được miễn tiền sử dụng đất, tiền thuê đất theo quy định (nếu có)(6): .....................................................
12. Cam kết sử dụng đất, sử dụng rừng đúng mục đích, chấp hành quy định của pháp luật về đất đai, pháp luật về lâm nghiệp; nộp đầy đủ nghĩa vụ tài chính đúng hạn.
13. Tài liệu gửi kèm (nếu có)(7): Trích đo địa chính, Dự án đầu tư.

                                                                  Người làm đơn (8)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_09a_qd2604') {
        // MẪU SỐ 09A (TRANG 17 PLIV_signed.pdf)
        fullDoc = `Mẫu số 09a. Đơn đề nghị chuyển mục đích sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (9): ${recipientStr}

1. Người đề nghị chuyển mục đích sử dụng đất (10): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): Điện thoại: .................... Email: ....................
4. Thông tin thửa đất/khu đất:
- Địa điểm thửa đất/khu đất: ${landDiachi} (Thửa đất số: ${landThua}, Tờ bản đồ số: ${landTobando})
- Diện tích và mục đích sử dụng hiện tại (11): ${landDientich} m², Loại đất: ${landMucdich}
- Thời hạn sử dụng đất: Lâu dài
- Hình thức sử dụng đất (12): Giao đất có thu tiền sử dụng đất / Công nhận QSDĐ
- Số, ngày tháng năm ban hành văn bản của cấp có thẩm quyền: Giấy chứng nhận QSDĐ số ${landSophathanh} cấp ngày ${landNgayCap}.
5. Nội dung đề nghị chuyển mục đích sử dụng đất:
- Diện tích và mục đích sử dụng đất đề nghị chuyển: Chuyển ${landDientich} m² sang Đất ở tại nông thôn (ONT) / Đất ở tại đô thị (ODT).
- Thời hạn sử dụng đất: Ổn định lâu dài
- Hình thức sử dụng đất (13): Giao đất có thu tiền sử dụng đất.
6. Xác định trường hợp được miễn tiền sử dụng đất, tiền thuê đất theo quy định (nếu có)(14): .....................................................
7. Cam kết sử dụng đất đúng mục đích, chấp hành quy định của pháp luật về đất đai; nộp tiền sử dụng đất đầy đủ, đúng hạn.
8. Tài liệu gửi kèm (nếu có) (15): Bản gốc Giấy chứng nhận QSDĐ số ${landSophathanh}, Bản sao Thẻ CCCD.

                                                                  Người làm đơn (16)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_10_qd2604') {
        // MẪU SỐ 10 (TRANG 19 PLIV_signed.pdf)
        fullDoc = `Mẫu số 10. Đơn đề nghị giao đất; cho thuê đất đối với trường hợp giao đất, cho thuê đất thông qua đấu giá quyền sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ (20)
Kính gửi: Cơ quan, người có thẩm quyền (21): ${recipientStr}

1. Người đề nghị (22): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin liên hệ (điện thoại, fax, email...): .........................................................................................
4. Địa điểm thửa đất/khu đất/khu rừng: ${landDiachi} (Thửa số: ${landThua}, Tờ bản đồ: ${landTobando})
5. Diện tích đất (m²): ${landDientich} m²
6. Để sử dụng vào mục đích (23): ${landMucdich}
7. Hình thức sử dụng đất (24): Giao đất có thu tiền sử dụng đất / Cho thuê đất thu tiền một lần
8. Thời hạn sử dụng đất: Ổn định lâu dài / 50 năm
9. Cam kết sử dụng đất đúng mục đích, nộp tiền trúng đấu giá quyền sử dụng đất đầy đủ, đúng hạn.
10. Tài liệu gửi kèm (nếu có) (25): Quyết định công nhận kết quả trúng đấu giá QSDĐ.

                                                                  Người làm đơn (26)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_11_qd2604') {
        // MẪU SỐ 11 (TRANG 20 PLIV_signed.pdf)
        fullDoc = `Mẫu số 11. Văn bản đề nghị miễn, giảm tiền thuê đất, tiền sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
..., ngày ... tháng ... năm ...

VĂN BẢN ĐỀ NGHỊ MIỄN, GIẢM TIỀN SỬ DỤNG ĐẤT, TIỀN THUÊ ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (27): ${recipientStr}

1. Người đề nghị (28): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin liên hệ: .................................................................................................................
4. Địa điểm thửa đất: ${landDiachi} (Thửa số: ${landThua}, Tờ bản đồ: ${landTobando})
5. Mục đích sử dụng đất (29): ${landMucdich}
6. Hình thức sử dụng đất (30): Giao đất có thu tiền sử dụng đất / Thuê đất
7. Thời hạn sử dụng đất: Ổn định lâu dài
8. Miễn tiền sử dụng đất, tiền thuê đất: Đối tượng, lý do miễn: .....................................................
9. Giảm tiền sử dụng đất, tiền thuê đất (31): Mức đề nghị giảm: ...................................................
12. Các cam kết khác: Cam kết kê khai đúng sự thật và chấp hành nghiêm chỉnh quy định pháp luật.
13. Tài liệu gửi kèm: Giấy tờ chứng minh thuộc đối tượng miễn, giảm nghĩa vụ tài chính.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
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
1. Tên (4): ${cccdHoten}
2. Địa chỉ (5): ${cccdThuongtru}
3. Mã số thuế / Số định danh cá nhân (6): ${cccdSo} ; Ngày sinh: ${cccdNgaySinh}

III. THÔNG TIN VỀ ĐẤT
1. Thửa đất số (8): ${landThua} ; Tờ bản đồ số: ${landTobando}
2. Địa chỉ tại: ${landDiachi}
3. Diện tích thửa đất: ${landDientich} m² (Sử dụng riêng: ${landDientich} m²)
4. Nguồn gốc sử dụng đất: Sử dụng đất ổn định, nhận chuyển nhượng / Cấp GCN lần đầu
5. Mục đích sử dụng đất (9): ${landMucdich}
6. Thời hạn sử dụng đất: Ổn định lâu dài [x]
7. Giấy tờ về quyền sử dụng đất (11): GCN QSDĐ số ${landSophathanh} cấp ngày ${landNgayCap}.

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

1. Người đề nghị (57): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin liên hệ: .................................................................................................................
4. Thông tin thửa đất/khu đất:
- Địa điểm: ${landDiachi} (Thửa đất số: ${landThua}, Tờ bản đồ số: ${landTobando})
- Diện tích: ${landDientich} m², Mục đích hiện tại: ${landMucdich}
- Hình thức sử dụng đất hiện tại (59): Thuê đất trả tiền hằng năm
5. Nội dung đề nghị chuyển hình thức sử dụng đất:
- Diện tích (m²): ${landDientich} m²
- Chuyển từ hình thức: Thuê đất trả tiền hằng năm sang Thuê đất trả tiền một lần cho cả thời gian thuê (hoặc Giao đất có thu tiền).
6. Cam kết sử dụng đất đúng mục đích và nộp đầy đủ nghĩa vụ tài chính đúng hạn.

                                                                  Người làm đơn (64)
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_17_qd2604') {
        // MẪU SỐ 17 (TRANG 35 PLIV_signed.pdf)
        fullDoc = `Mẫu số 17. Đơn đề nghị gia hạn sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ GIA HẠN SỬ DỤNG ĐẤT
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người đề nghị (2): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin về thửa đất/khu đất:
a) Thửa đất số: ${landThua} ; 4.2. Tờ bản đồ số: ${landTobando}
b) Diện tích đất (m²): ${landDientich} m²
c) Mục đích sử dụng đất (3): ${landMucdich}
d) Địa điểm: ${landDiachi}
g) GCN đã cấp: Số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso}, ngày cấp: ${landNgayCap}.
5. Nội dung đề nghị gia hạn: Thời gian gia hạn: .......... năm (đến ngày ...../...../..........)
Lý do gia hạn: Tiếp tục sử dụng đất đúng mục đích, phục vụ sản xuất kinh doanh / đời sống ổn định.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
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

1. Người sử dụng đất (2): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin về thửa đất đang sử dụng: Thửa số: ${landThua} ; Tờ bản đồ: ${landTobando} ; Diện tích: ${landDientich} m² tại ${landDiachi}.
4. GCN đã cấp: Số phát hành: ${landSophathanh} ; Ngày cấp: ${landNgayCap}.
5. Nội dung xin điều chỉnh thời hạn sử dụng đất: Phù hợp theo Quyết định điều chỉnh tiến độ dự án đầu tư.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_23_qd2604') {
        // MẪU SỐ 23 (TRANG 45-46 PLIV_signed.pdf)
        fullDoc = `Mẫu số 23. Đơn đề nghị điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_______________________________________________
..., ngày ... tháng ... năm ...

ĐƠN ĐỀ NGHỊ ĐIỀU CHỈNH QUYẾT ĐỊNH (109)
Kính gửi: Cơ quan, người có thẩm quyền (110): ${recipientStr}

1. Người đề nghị (111): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin thửa đất: Thửa số ${landThua}, Tờ bản đồ ${landTobando}, Diện tích: ${landDientich} m² tại ${landDiachi}.
4. Lý do đề nghị điều chỉnh: Điều chỉnh ranh giới, diện tích thửa đất / sửa chữa thông tin sai sót kỹ thuật theo kết quả đo đạc địa chính mới nhất.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_33_qd2604') {
        // MẪU SỐ 33 (TRANG 76 PLIV_signed.pdf)
        fullDoc = `Mẫu số 33. Đơn đề nghị sử dụng đất kết hợp đa mục đích
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ SỬ DỤNG ĐẤT KẾT HỢP ĐA MỤC ĐÍCH
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người sử dụng đất (2): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin về thửa đất: Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} ; Diện tích: ${landDientich} m² tại ${landDiachi}.
4. Nội dung đề nghị sử dụng đất kết hợp: Sử dụng đất nông nghiệp kết hợp mục đích thương mại, dịch vụ, du lịch sinh thái (Điều 218 Luật Đất đai 2024).

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
    } else if (formType === 'mau_33a_qd2604') {
        // MẪU SỐ 33A (TRANG 77 PLIV_signed.pdf)
        fullDoc = `Mẫu số 33a. Đơn đề nghị gia hạn phương án sử dụng đất kết hợp đa mục đích
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
_____________________________________
............., ngày .... tháng ... năm ......

ĐƠN ĐỀ NGHỊ GIA HẠN PHƯƠNG ÁN SỬ DỤNG ĐẤT KẾT HỢP ĐA MỤC ĐÍCH
Kính gửi: Cơ quan, người có thẩm quyền (1): ${recipientStr}

1. Người sử dụng đất (2): ${cccdHoten}
2. Địa chỉ/trụ sở chính: ${cccdThuongtru}
3. Thông tin thửa đất: Thửa đất số: ${landThua} ; Tờ bản đồ số: ${landTobando} ; Diện tích: ${landDientich} m² tại ${landDiachi}.
4. Nội dung đề nghị: Gia hạn thời gian thực hiện phương án sử dụng đất đa mục đích đã được phê duyệt.

                                                                  Người làm đơn
                                                       (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                              ${cccdHoten !== '...................................................' ? cccdHoten : ''}`;
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
II. BÊN THUÊ ĐẤT: ${cccdHoten}, CCCD/MST: ${cccdSo}, Địa chỉ: ${cccdThuongtru}.
III. ĐIỀU KHOẢN HỢP ĐỒNG: Cho thuê thửa đất số ${landThua}, Tờ bản đồ ${landTobando}, Diện tích: ${landDientich} m² tại ${landDiachi}.

            BÊN THUÊ ĐẤT                                              BÊN CHO THUÊ ĐẤT
(Ký và ghi rõ họ tên, đóng dấu nếu có)                     (Ký và ghi rõ họ tên, đóng dấu)`;
    } else if (formType === 'tk_thue_tncn') {
        // MẪU 03/BĐS-TNCN (TRANG 99-105 PLIV_signed.pdf)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 03/BĐS-TNCN                                       |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                     |
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
|  1  | ${cccdHoten.padEnd(20)} | ${cccdSo.padEnd(19)} | ${cccdNgaySinh.padEnd(13)} |                                 |            |       | 100%               |
+-----+----------------------+---------------------+---------------+---------------------------------+------------+-------+--------------------+

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
[16.2] Số: ${landSophathanh} ; [16.3] Nơi cấp: ${landNoiCap} ; [16.4] Ngày cấp: ${landNgayCap}
[18] Hợp đồng chuyển nhượng trao đổi bất động sản: Số .................... Nơi lập: VP Công chứng .................... Ngày lập: ...../...../..........
[20] Thông tin về đất:
[20.1] Thửa đất số: ${landThua} ; [20.2] Tờ bản đồ số: ${landTobando}
[20.3] Địa chỉ: ${landDiachi}
[20.6] Loại đất, vị trí thửa đất:
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
| STT | Đường              | Đoạn đường         | Vị trí  | Loại đất             | Hệ số (nếu có)   | Diện tích (m²)   |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
| (1) | (2)                | (3)                | (4)     | (5)                  | (6)              | (7)              |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
|  1  |                    |                    |         | ${landMucdich.padEnd(20)} |                  | ${landDientich.padEnd(16)} |
+-----+--------------------+--------------------+---------+----------------------+------------------+------------------+
[20.7] Nguồn gốc đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu
[20.8] Thời hạn sử dụng đất: - Ổn định lâu dài [x]   - Có thời hạn: ..... năm
[20.9] Giá trị đất thực tế chuyển giao (nếu có): ................................................... đồng

V. THU NHẬP TỪ CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN / THỪA KẾ / QUÀ TẶNG:
[23] Loại thu nhập: [23.1] Thu nhập từ chuyển nhượng bất động sản [x]     [23.2] Thu nhập từ nhận thừa kế, quà tặng [ ]
[24] Giá trị chuyển nhượng bất động sản và tài sản khác gắn liền với đất: ................................................... đồng

VI. HỒ SƠ KÈM THEO GỒM:
- Hợp đồng chuyển nhượng quyền sử dụng đất, tài sản gắn liền với đất;
- Bản sao Giấy chứng nhận quyền sử dụng đất số ${landSophathanh};
- Bản sao Thẻ Căn cước công dân của các bên tham gia giao dịch.

Tôi cam đoan những nội dung kê khai là đúng và chịu trách nhiệm trước pháp luật về những nội dung đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ hoặc
Họ và tên: ..............................                     ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ
Chứng chỉ NV thuế số: ...................                     (Ký, ghi rõ họ tên; chức vụ và đóng dấu)`;
    } else if (formType === 'tk_phi_nong_nghiep') {
        // MẪU 01/TK-SDDPNN (TRANG 91-93 PLIV_signed.pdf)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 01/TK-SDDPNN                                      |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                     |
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
[04] Họ và tên: ${cccdHoten}
[05] Ngày, tháng, năm sinh: ${cccdNgaySinh}
[06] Mã số thuế: .....................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${cccdSo}
[08] Địa chỉ cư trú: ${cccdThuongtru}
[09] Địa chỉ nhận thông báo thuế: ${cccdThuongtru}
[10] Điện thoại: ......................................................................................................................

3. Thửa đất chịu thuế: 
[14] Thông tin người sử dụng đất:
+-----+----------------------+---------------------+---------------------------------+--------------------+
| STT |      Họ và tên       | Mã số thuế          | Số định danh cá nhân/Hộ chiếu   | Tỷ lệ              |
+-----+----------------------+---------------------+---------------------------------+--------------------+
|  1  | ${cccdHoten.padEnd(20)} |                     | ${cccdSo.padEnd(31)} | 100%               |
+-----+----------------------+---------------------+---------------------------------+--------------------+
[15] Nguồn gốc thửa đất: Sử dụng đất ổn định, nhận chuyển nhượng / cấp Giấy chứng nhận lần đầu
[16] Địa chỉ thửa đất: ${landDiachi}
[17] Là thửa đất duy nhất: [x]
[18] Đăng ký kê khai tổng hợp tại: ${landDiachi}
[19] Đã có giấy chứng nhận: [x]
[19.1] Số giấy chứng nhận: ${landSophathanh}            [19.2] Ngày cấp: ${landNgayCap}
[19.3] Thửa đất số: ${landThua}                         [19.4] Tờ bản đồ số: ${landTobando}
[19.5] Diện tích: ${landDientich} m²                    [19.6] Loại đất/ Mục đích sử dụng: ${landMucdich}
[20] Tổng diện tích thực tế sử dụng cho mục đích phi nông nghiệp: ${landDientich} m²
[20.1] Diện tích đất sử dụng đúng mục đích: ${landDientich} m²

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

NGƯỜI TRỰC TIẾP THỰC HIỆN                                     ${dateStr}
DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ                                  NGƯỜI NỘP THUẾ hoặc
Họ và tên: ..............................                     ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ
Chứng chỉ NV thuế số: ...................                     (Ký, ghi rõ họ tên; chức vụ và đóng dấu)`;
    } else if (formType === 'tk_phi_nong_nghiep_to_chuc') {
        // MẪU 02/TK-SDDPNN (TRANG 94-96 PLIV_signed.pdf)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 02/TK-SDDPNN                                      |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                     |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
                                        (Áp dụng đối với tổ chức)

   [01] Kỳ tính thuế: Năm ${dateYear}
   [02] Lần đầu: [x]                       [03] Bổ sung lần thứ:……

1. Người nộp thuế:
[04] Tên người nộp thuế: ${cccdHoten}
[05] Mã số thuế: ${cccdSo}
[06] Địa chỉ trụ sở: ${cccdThuongtru}

3. Thửa đất chịu thuế:
[10] Thông tin người sử dụng đất: ${cccdHoten}
[11] Nguồn gốc thửa đất: Nhà nước giao đất có thu tiền sử dụng đất / thuê đất
[12] Địa chỉ thửa đất: ${landDiachi}
[13] Đã có giấy chứng nhận: [x]
[13.1] Số GCN: ${landSophathanh}            [13.2] Ngày cấp: ${landNgayCap}
[13.3] Thửa đất số: ${landThua}             [13.4] Tờ bản đồ số: ${landTobando}
[13.5] Diện tích: ${landDientich} m²        [13.6] Loại đất/Mục đích: ${landMucdich}
[17] Diện tích đất thực tế sử dụng: ${landDientich} m²
[20] Số thuế phải nộp: ................................................... đồng

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

                                                                  ${dateStr}
                                                                  NGƯỜI NỘP THUẾ
                                                              (Ký, ghi rõ họ tên, đóng dấu)`;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        // MẪU 01/LPTB (TRANG 89-90 PLIV_signed.pdf)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 01/LPTB                                           |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                     |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                    TỜ KHAI LỆ PHÍ TRƯỚC BẠ
                                    (Áp dụng đối với nhà, đất)

[01] Kỳ tính thuế: Theo từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}
[02] Lần đầu: [x]              [03] Bổ sung lần thứ:……

[04] Người nộp thuế: ${cccdHoten}
[05] Ngày, tháng, năm sinh: ${cccdNgaySinh}
[06] Mã số thuế: ......................................................................................................................
[07] Số định danh cá nhân/Số hộ chiếu: ${cccdSo}
[08] Địa chỉ: ${cccdThuongtru}
[09] Xã/phường/đặc khu: .................................. [10] Tỉnh/Thành phố: Thanh Hóa

ĐẶC ĐIỂM NHÀ ĐẤT:
1. Đất:
1.1. Thửa đất số (Số hiệu thửa đất): ${landThua} ; Tờ bản đồ số: ${landTobando}
1.2. Địa chỉ thửa đất: ${landDiachi}
1.4. Mục đích sử dụng đất: ${landMucdich}
1.5. Diện tích (m²): ${landDientich} m²
1.6. Nguồn gốc nhà đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu
- Giấy chứng nhận quyền sử dụng đất số phát hành: ${landSophathanh} ; Số vào sổ: ${landSovaoso} do ${landNoiCap} cấp ngày ${landNgayCap}.

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

                                                                  ${dateStr}
                                                                  NGƯỜI NỘP THUẾ
                                                              (Ký, ghi rõ họ tên, đóng dấu)`;
    } else if (formType === 'tk_tndn') {
        // MẪU 02/TNDN (TRANG 97-98 PLIV_signed.pdf)
        fullDoc = `                                                  +-----------------------------------------------------------+
                                                  | Mẫu số: 02/TNDN                                           |
                                                  | (Kèm theo Thông tư số 89/2026/TT-BTC                      |
                                                  | ngày 30 tháng 6 năm 2026 của Bộ trưởng                     |
                                                  | Bộ Tài chính)                                             |
                                                  +-----------------------------------------------------------+

                                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                               TỜ KHAI THUẾ THU NHẬP DOANH NGHIỆP
            (Áp dụng đối với hoạt động chuyển nhượng bất động sản, tài sản khác theo từng lần phát sinh)

   [x] Bất động sản                                   [ ] Tài sản khác

[01] Kỳ tính thuế: Từng lần phát sinh ngày ..... tháng ..... năm ${dateYear}
[02] Lần đầu: [x]                                    [03] Bổ sung lần thứ:……

1. Bên chuyển nhượng: ${cccdHoten}, MST: ${cccdSo}
2. Bên nhận chuyển nhượng: ............................................................................................
3. Địa chỉ BĐS chuyển nhượng: ${landDiachi} (Thửa số: ${landThua}, Tờ bản đồ: ${landTobando})

STT    Chỉ tiêu                                              Mã chỉ tiêu    Số tiền (VNĐ)
(1)    (2)                                                   (3)            (4)
1      Doanh thu từ hoạt động chuyển nhượng                  [16]           ....................
2      Chi phí từ hoạt động chuyển nhượng                    [17]           ....................
3      Thu nhập từ hoạt động chuyển nhượng ([24]=[16]-[17])  [24]           ....................
4      Thuế suất thuế TNDN                                   [25]           20%
5      Thuế TNDN phải nộp ([26]=[24] x [25])                 [26]           ....................

Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.

                                                                  ${dateStr}
                                                                  NGƯỜI NỘP THUẾ
                                                              (Ký, ghi rõ họ tên, đóng dấu)`;
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
            const qrText = `PLIV QĐ 2604/QĐ-VP THANH HOA | MAU: ${formType} | HO TEN: ${cleanName} | CCCD: ${cleanCccd} | THUA: ${landThua} | TBD: ${landTobando}`;
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

function exportToWord() {
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

    const dateYear = new Date().getFullYear();
    const dateStr = `ngày ..... tháng ..... năm ${dateYear}`;
    const filename = `${formType}_${cccdHoten !== '...................................................' ? cccdHoten.replace(/\\s+/g, '_') : 'Mau_Don'}.doc`;

    let bodyHtml = "";

    if (formType === 'tk_thue_tncn') {
        // MẪU 03/BĐS-TNCN CHUẨN 100%
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom: 10px;">
            <tr>
                <td width="45%"></td>
                <td width="55%" align="right">
                    <table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
                        <tr>
                            <td>
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

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin-top:5px;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin-top:15px; text-transform:uppercase;">
            TỜ KHAI THUẾ THU NHẬP CÁ NHÂN
        </div>
        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:11pt; font-style:italic; margin-bottom:12px;">
            (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản;<br>
            thu nhập từ nhận thừa kế và nhận quà tặng là bất động sản)
        </div>

        <p style="margin:4px 0;"><b>[01] Kỳ tính thuế:</b> Lần phát sinh: Ngày … tháng … năm ${dateYear}</p>
        <p style="margin:4px 0;"><b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03.1] Bổ sung lần thứ:</b> …… &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03.2] Số Thông báo lần trước liền kề:</b> ……</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td rowspan="2" width="5%">STT</td>
                <td rowspan="2" width="18%">Họ và tên</td>
                <td rowspan="2" width="14%">Mã số thuế/Số định danh cá nhân</td>
                <td rowspan="2" width="10%">Ngày, tháng, năm sinh</td>
                <td colspan="3" width="23%">Hộ chiếu (trường hợp cá nhân không có quốc tịch Việt Nam)</td>
                <td rowspan="2" width="10%">Điện thoại</td>
                <td rowspan="2" width="10%">Email</td>
                <td rowspan="2" width="10%">Diện tích sử dụng/Tỷ lệ sở hữu (%)</td>
            </tr>
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td width="8%">Số</td>
                <td width="7%">Ngày cấp</td>
                <td width="8%">Nơi cấp</td>
            </tr>
            <tr style="font-size:9pt; font-style:italic; background:#f0f0f0;">
                <td>[04.1]</td>
                <td>[04.2]</td>
                <td>[04.3]</td>
                <td>[04.4]</td>
                <td>[04.5]</td>
                <td>[04.6]</td>
                <td>[04.7]</td>
                <td>[04.8]</td>
                <td>[04.9]</td>
                <td>[04.10]</td>
            </tr>
            <tr>
                <td>1</td>
                <td align="left"><b>${cccdHoten !== '...................................................' ? cccdHoten.toUpperCase() : ''}</b></td>
                <td><b>${cccdSo !== '........................' ? cccdSo : ''}</b></td>
                <td>${cccdNgaySinh !== '...../...../..........' ? cccdNgaySinh : ''}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>100%</td>
            </tr>
            <tr>
                <td>2</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>....</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>

        <p style="margin:6px 0;"><b>[05] Tổ chức, cá nhân khai, nộp thuế thay (nếu có):</b> .........................................................................................................</p>
        <p style="margin:4px 0;"><b>[06] Mã số thuế (nếu có):</b> ...................................................................................................................................................</p>
        <p style="margin:4px 0;"><b>[07] Văn bản ủy quyền (nếu có):</b> Số .................... ngày ..... tháng ..... năm ..........</p>
        <p style="margin:4px 0;"><b>[08] Tên tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế (nếu có):</b> ...................................................................................</p>
        <p style="margin:4px 0;"><b>[09] Mã số thuế:</b> ...................................................................................................................................................................</p>
        <p style="margin:4px 0;"><b>[10] Hợp đồng dịch vụ làm thủ tục về thuế:</b> Số ........................ ngày ........................</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">II. THÔNG TIN NGƯỜI NHẬN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td rowspan="2" width="6%">STT</td>
                <td rowspan="2" width="24%">Họ và tên</td>
                <td rowspan="2" width="18%">Mã số thuế/Số định danh cá nhân</td>
                <td rowspan="2" width="14%">Ngày, tháng, năm sinh</td>
                <td colspan="3" width="26%">Hộ chiếu (trường hợp cá nhân không có quốc tịch Việt Nam)</td>
                <td rowspan="2" width="12%">Tỷ lệ sở hữu (%)</td>
            </tr>
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td width="9%">Số</td>
                <td width="8%">Ngày cấp</td>
                <td width="9%">Nơi cấp</td>
            </tr>
            <tr style="font-size:9pt; font-style:italic; background:#f0f0f0;">
                <td>[11.1]</td>
                <td>[11.2]</td>
                <td>[11.3]</td>
                <td>[11.4]</td>
                <td>[11.5]</td>
                <td>[11.6]</td>
                <td>[11.7]</td>
                <td>[11.8]</td>
            </tr>
            <tr>
                <td>1</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>100%</td>
            </tr>
            <tr>
                <td>2</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>....</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>

        <p style="font-weight:bold; margin:12px 0 6px 0;">III. LOẠI BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <p style="margin:4px 0;"><b>[12] Quyền sử dụng đất và tài sản gắn liền trên đất:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp; <b>[13] Quyền sở hữu hoặc sử dụng nhà ở:</b> [ ]</p>
        <p style="margin:4px 0;"><b>[14] Quyền thuê đất, thuê mặt nước:</b> [ ] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[15] Bất động sản khác:</b> [ ]</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">IV. ĐẶC ĐIỂM BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
        <p style="margin:4px 0;"><b>[16] Giấy tờ về quyền sử dụng đất:</b> [16.1] Loại: Giấy chứng nhận quyền sử dụng đất &nbsp;;&nbsp; [16.2] Số: <b>${landSophathanh}</b> &nbsp;;&nbsp; [16.3] Nơi cấp: ${landNoiCap} &nbsp;;&nbsp; [16.4] Ngày cấp: ${landNgayCap}</p>
        <p style="margin:4px 0;"><b>[18] Hợp đồng chuyển nhượng trao đổi bất động sản:</b> [18.1] Số: .................... [18.2] Nơi lập: VP Công chứng .................... [18.3] Ngày lập: ...../...../..........</p>
        <p style="margin:4px 0;"><b>[20] Thông tin về đất:</b> [20.1] Thửa đất số: <b>${landThua}</b> &nbsp;;&nbsp; [20.2] Tờ bản đồ số: <b>${landTobando}</b> &nbsp;;&nbsp; [20.3] Địa chỉ: ${landDiachi}</p>
        
        <p style="margin:4px 0; font-style:italic;">[20.6] Loại đất, vị trí thửa đất (1, 2, 3, 4…):</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td width="6%">STT</td>
                <td width="20%">Đường</td>
                <td width="20%">Đoạn đường</td>
                <td width="10%">Vị trí</td>
                <td width="18%">Loại đất</td>
                <td width="12%">Hệ số (nếu có)</td>
                <td width="14%">Diện tích (m²)</td>
            </tr>
            <tr style="font-size:9pt; font-style:italic; background:#f0f0f0;">
                <td>(1)</td>
                <td>(2)</td>
                <td>(3)</td>
                <td>(4)</td>
                <td>(5)</td>
                <td>(6)</td>
                <td>(7)</td>
            </tr>
            <tr>
                <td>1</td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>${landMucdich}</b></td>
                <td></td>
                <td><b>${landDientich}</b></td>
            </tr>
        </table>
        <p style="margin:4px 0;"><b>[20.7] Nguồn gốc đất:</b> Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu</p>
        <p style="margin:4px 0;"><b>[20.8] Thời hạn sử dụng đất:</b> - Ổn định lâu dài [x] &nbsp;&nbsp;&nbsp;&nbsp; - Có thời hạn: ..... năm</p>
        <p style="margin:4px 0;"><b>[20.9] Giá trị đất thực tế chuyển giao (nếu có):</b> ................................................................................................. đồng</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">V. THU NHẬP TỪ CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN; TỪ NHẬN THỪA KẾ, QUÀ TẶNG LÀ BẤT ĐỘNG SẢN</p>
        <p style="margin:4px 0;"><b>[23] Loại thu nhập:</b> [23.1] Thu nhập từ chuyển nhượng BĐS [x] &nbsp;&nbsp;&nbsp;&nbsp; [23.2] Thu nhập từ nhận thừa kế, quà tặng [ ]</p>
        <p style="margin:4px 0;"><b>[24] Giá trị chuyển nhượng bất động sản và tài sản khác gắn liền với đất:</b> ................................................................. đồng</p>
        <p style="margin:4px 0;"><b>[26] Miễn thuế thu nhập từ chuyển nhượng bất động sản (nếu có):</b></p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td width="6%">STT</td>
                <td width="24%">Họ và tên</td>
                <td width="20%">Mã số thuế/Số định danh cá nhân</td>
                <td width="30%">Lý do cá nhân được miễn thuế đối với nhà ở, quyền sử dụng đất ở duy nhất</td>
                <td width="20%">Lý do miễn khác</td>
            </tr>
            <tr style="font-size:9pt; font-style:italic; background:#f0f0f0;">
                <td>[26.1]</td>
                <td>[26.2]</td>
                <td>[26.3]</td>
                <td>[26.4]</td>
                <td>[26.5]</td>
            </tr>
            <tr>
                <td>1</td>
                <td></td>
                <td></td>
                <td>[ ]</td>
                <td></td>
            </tr>
        </table>

        <p style="font-weight:bold; margin:12px 0 6px 0;">VI. HỒ SƠ KÈM THEO GỒM:</p>
        <p style="margin:3px 0;">- Hợp đồng chuyển nhượng quyền sử dụng đất, tài sản gắn liền với đất (bản chính công chứng);</p>
        <p style="margin:3px 0;">- Bản sao Giấy chứng nhận quyền sử dụng đất số phát hành: <b>${landSophathanh}</b>;</p>
        <p style="margin:3px 0;">- Bản sao Thẻ Căn cước công dân của các bên chuyển nhượng và nhận chuyển nhượng.</p>

        <p style="margin:10px 0; text-align:justify;">Tôi cam đoan những nội dung kê khai là đúng và chịu trách nhiệm trước pháp luật về những nội dung đã khai./.</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên)</div>
                    <div style="height:65px;"></div>
                    <div style="font-size:10pt;">Họ và tên: ........................................</div>
                </td>
                <td width="50%" align="center" valign="top">
                    <div style="font-style:italic; font-size:11pt; margin-bottom:4px;">..., ${dateStr}</div>
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI NỘP THUẾ hoặc<br>ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên; chức vụ và đóng dấu)</div>
                    <div style="height:65px;"></div>
                    <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'tk_phi_nong_nghiep') {
        // MẪU 01/TK-SDDPNN CHUẨN 100%
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom: 10px;">
            <tr>
                <td width="45%"></td>
                <td width="55%" align="right">
                    <table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
                        <tr>
                            <td>
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

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin-top:5px;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin-top:15px; text-transform:uppercase;">
            TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP
        </div>
        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:11pt; font-style:italic; margin-bottom:12px;">
            (Áp dụng đối với hộ gia đình, cá nhân)
        </div>

        <p style="margin:4px 0;"><b>[01] Kỳ tính thuế:</b> Năm ${dateYear} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03] Bổ sung lần thứ:</b> ……</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">1. Người nộp thuế:</p>
        <p style="margin:4px 0;"><b>[04] Họ và tên:</b> <b>${cccdHoten !== '...................................................' ? cccdHoten.toUpperCase() : ''}</b></p>
        <p style="margin:4px 0;"><b>[05] Ngày, tháng, năm sinh:</b> ${cccdNgaySinh} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[06] Mã số thuế:</b> ........................................................................</p>
        <p style="margin:4px 0;"><b>[07] Số định danh cá nhân/Số hộ chiếu:</b> <b>${cccdSo}</b></p>
        <p style="margin:4px 0;"><b>[08] Địa chỉ cư trú:</b> ${cccdThuongtru}</p>
        <p style="margin:4px 0;"><b>[09] Địa chỉ nhận thông báo thuế:</b> ${cccdThuongtru} &nbsp;&nbsp;&nbsp;&nbsp; <b>[10] Điện thoại:</b> ........................................</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">2. Tổ chức, cá nhân cung cấp dịch vụ làm thủ tục về thuế (nếu có):</p>
        <p style="margin:4px 0;">[11] Tên tổ chức/cá nhân: ........................................................................ [12] Mã số thuế: ........................................</p>
        <p style="margin:4px 0;">[13] Hợp đồng dịch vụ: Số ................................ ngày ................................</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">3. Thửa đất chịu thuế:</p>
        <p style="margin:4px 0; font-style:italic;">[14] Thông tin người sử dụng đất:</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
            <tr style="font-weight:bold; background:#f9f9f9;">
                <td width="8%">STT</td>
                <td width="30%">Họ và tên</td>
                <td width="22%">Mã số thuế</td>
                <td width="26%">Số định danh cá nhân/Số hộ chiếu</td>
                <td width="14%">Tỷ lệ</td>
            </tr>
            <tr>
                <td>1</td>
                <td align="left"><b>${cccdHoten !== '...................................................' ? cccdHoten.toUpperCase() : ''}</b></td>
                <td></td>
                <td><b>${cccdSo !== '........................' ? cccdSo : ''}</b></td>
                <td>100%</td>
            </tr>
        </table>

        <p style="margin:6px 0;"><b>[15] Nguồn gốc thửa đất:</b> Sử dụng đất ổn định, nhận chuyển nhượng / cấp GCN lần đầu</p>
        <p style="margin:4px 0;"><b>[16] Địa chỉ thửa đất:</b> ${landDiachi}</p>
        <p style="margin:4px 0;"><b>[17] Là thửa đất duy nhất:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[18] Đăng ký kê khai tổng hợp tại:</b> ${landDiachi}</p>
        <p style="margin:4px 0;"><b>[19] Đã có giấy chứng nhận:</b></p>
        <p style="margin:4px 0 4px 15px;">- [19.1] Số giấy chứng nhận: <b>${landSophathanh}</b> &nbsp;&nbsp;&nbsp;&nbsp; [19.2] Ngày cấp: <b>${landNgayCap}</b></p>
        <p style="margin:4px 0 4px 15px;">- [19.3] Thửa đất số: <b>${landThua}</b> &nbsp;&nbsp;&nbsp;&nbsp; [19.4] Tờ bản đồ số: <b>${landTobando}</b></p>
        <p style="margin:4px 0 4px 15px;">- [19.5] Diện tích: <b>${landDientich} m²</b> &nbsp;&nbsp;&nbsp;&nbsp; [19.6] Loại đất/ Mục đích sử dụng: <b>${landMucdich}</b></p>

        <p style="margin:6px 0;"><b>[20] Tổng diện tích thực tế sử dụng cho mục đích phi nông nghiệp:</b> <b>${landDientich} m²</b></p>
        <p style="margin:3px 0 3px 15px;">- [20.1] Diện tích đất sử dụng đúng mục đích: <b>${landDientich} m²</b></p>
        <p style="margin:3px 0 3px 15px;">- [20.2] Diện tích đất sử dụng không đúng mục đích: 0 m²</p>
        <p style="margin:3px 0 3px 15px;">- [20.3] Diện tích đất chưa sử dụng theo đúng quy định: 0 m²</p>
        <p style="margin:3px 0 3px 15px;">- [20.4] Hạn mức (nếu có): ........................................ m² &nbsp;&nbsp;&nbsp;&nbsp; [20.5] Diện tích đất lấn, chiếm: 0 m²</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">4. Đối với đất ở nhà nhiều tầng nhiều hộ ở, nhà chung cư [24]:</p>
        <p style="margin:4px 0;">[24.1] Loại nhà: .................... [24.2] Diện tích: ................ [24.3] Hệ số phân bổ: ..........</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">5. Miễn, giảm thuế [25]:</p>
        <p style="margin:4px 0;">[25.1] Trường hợp miễn, giảm: ..................................................................................................................................</p>
        <p style="margin:4px 0;">[25.2] Kỳ tính thuế đề nghị miễn, giảm: .......................................................................................................................</p>

        <p style="margin:10px 0; text-align:justify;">Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên)</div>
                    <div style="height:65px;"></div>
                    <div style="font-size:10pt;">Họ và tên: ........................................</div>
                </td>
                <td width="50%" align="center" valign="top">
                    <div style="font-style:italic; font-size:11pt; margin-bottom:4px;">..., ${dateStr}</div>
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI NỘP THUẾ hoặc<br>ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên; chức vụ và đóng dấu)</div>
                    <div style="height:65px;"></div>
                    <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'tk_le_phi_truoc_ba') {
        // MẪU 01/LPTB CHUẨN 100%
        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom: 10px;">
            <tr>
                <td width="45%"></td>
                <td width="55%" align="right">
                    <table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse; font-size:10pt; text-align:center; font-family:'Times New Roman', serif; border:1px solid #000;">
                        <tr>
                            <td>
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

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin-top:5px;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập - Tự do - Hạnh phúc</u>
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin-top:15px; text-transform:uppercase;">
            TỜ KHAI LỆ PHÍ TRƯỚC BẠ
        </div>
        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:11pt; font-style:italic; margin-bottom:12px;">
            (Áp dụng đối với nhà, đất)
        </div>

        <p style="margin:4px 0;"><b>[01] Kỳ tính thuế:</b> Theo từng lần phát sinh ngày … tháng … năm ${dateYear}</p>
        <p style="margin:4px 0;"><b>[02] Lần đầu:</b> [x] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[03] Bổ sung lần thứ:</b> ……</p>
        <p style="margin:4px 0;">[ ] Tổ chức, cá nhân được ủy quyền khai thay cho người nộp thuế</p>

        <p style="margin:4px 0;"><b>[04] Người nộp thuế:</b> <b>${cccdHoten !== '...................................................' ? cccdHoten.toUpperCase() : ''}</b></p>
        <p style="margin:4px 0;"><b>[05] Ngày, tháng, năm sinh:</b> ${cccdNgaySinh} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>[06] Mã số thuế:</b> ........................................................................</p>
        <p style="margin:4px 0;"><b>[07] Số định danh cá nhân/Số hộ chiếu:</b> <b>${cccdSo}</b></p>
        <p style="margin:4px 0;"><b>[08] Địa chỉ:</b> ${cccdThuongtru}</p>
        <p style="margin:4px 0;"><b>[09] Xã/phường/đặc khu:</b> .................................. <b>[10] Tỉnh/Thành phố:</b> Thanh Hóa</p>
        <p style="margin:4px 0;"><b>[11] Điện thoại:</b> ..................... <b>[12] Fax:</b> .................. <b>[13] Email:</b> ..........................................</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">ĐẶC ĐIỂM NHÀ ĐẤT:</p>
        <p style="margin:4px 0;"><b>1. Đất:</b></p>
        <p style="margin:3px 0 3px 15px;">1.1. Thửa đất số: <b>${landThua}</b> &nbsp;;&nbsp; Tờ bản đồ số: <b>${landTobando}</b></p>
        <p style="margin:3px 0 3px 15px;">1.2. Địa chỉ thửa đất: ${landDiachi}</p>
        <p style="margin:3px 0 3px 15px;">1.3. Vị trí thửa đất: ...................................................................................................................................................</p>
        <p style="margin:3px 0 3px 15px;">1.4. Mục đích sử dụng đất: <b>${landMucdich}</b></p>
        <p style="margin:3px 0 3px 15px;">1.5. Diện tích (m²): <b>${landDientich} m²</b></p>
        <p style="margin:3px 0 3px 15px;">1.6. Nguồn gốc nhà đất: Nhận chuyển nhượng / Cấp Giấy chứng nhận lần đầu / Tặng cho / Thừa kế</p>
        <p style="margin:3px 0 3px 15px;">- Giấy chứng nhận quyền sử dụng đất số phát hành: <b>${landSophathanh}</b> ; Số vào sổ: <b>${landSovaoso}</b> do ${landNoiCap} cấp ngày ${landNgayCap}.</p>
        <p style="margin:3px 0 3px 15px;">1.7. Giá trị đất thực tế chuyển giao (nếu có): ................................................................................................. đồng</p>

        <p style="margin:4px 0;"><b>2. Nhà (nếu có):</b></p>
        <p style="margin:3px 0 3px 15px;">2.1. Cấp nhà: .................... Loại nhà: .................... Hạng nhà: ....................</p>
        <p style="margin:3px 0 3px 15px;">2.2. Diện tích xây dựng (m²): .................... ; Diện tích sàn xây dựng (m²): ....................</p>
        <p style="margin:3px 0 3px 15px;">2.4. Giá trị nhà (đồng): ...........................................................................................................................................</p>

        <p style="margin:6px 0;"><b>3. Giá trị nhà, đất thực tế nhận chuyển nhượng, thừa kế, tặng cho (đồng):</b> .................................................................</p>
        <p style="margin:4px 0;"><b>4. Tài sản thuộc diện được miễn lệ phí trước bạ (lý do):</b> .............................................................................................</p>

        <p style="font-weight:bold; margin:12px 0 6px 0;">5. Giấy tờ có liên quan gồm:</p>
        <p style="margin:3px 0;">- Hợp đồng chuyển quyền sử dụng đất, tài sản gắn liền với đất;</p>
        <p style="margin:3px 0;">- Bản sao Giấy chứng nhận quyền sử dụng đất số phát hành: <b>${landSophathanh}</b>;</p>
        <p style="margin:3px 0;">- Giấy tờ chứng minh thuộc diện miễn lệ phí trước bạ (nếu có).</p>

        <p style="margin:10px 0; text-align:justify;">Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI TRỰC TIẾP THỰC HIỆN<br>DỊCH VỤ LÀM THỦ TỤC VỀ THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên)</div>
                    <div style="height:65px;"></div>
                    <div style="font-size:10pt;">Họ và tên: ........................................</div>
                </td>
                <td width="50%" align="center" valign="top">
                    <div style="font-style:italic; font-size:11pt; margin-bottom:4px;">..., ${dateStr}</div>
                    <div style="font-weight:bold; font-size:11pt; text-transform:uppercase;">NGƯỜI NỘP THUẾ hoặc<br>ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:3px;">(Ký, ghi rõ họ tên; chức vụ và đóng dấu)</div>
                    <div style="height:65px;"></div>
                    <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>
        `;
    } else if (formType === 'don_thu_hoi_gcn') {
        // ĐƠN THU HỒI GCN CHUẨN 100%
        bodyHtml = `
        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            <u>Độc lập – Tự do – Hạnh phúc</u>
        </div>

        <div style="text-align:right; font-style:italic; font-family:'Times New Roman', serif; font-size:11pt; margin: 10px 0;">
            ..., ${dateStr}
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin-top:10px; text-transform:uppercase;">
            ĐƠN ĐỀ NGHỊ THU HỒI, CẤP LẠI GIẤY CHỨNG NHẬN<br>QUYỀN SỬ DỤNG ĐẤT
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin:12px 0 16px 0;">
            Kính gửi: Uỷ ban nhân dân xã
        </div>

        <p style="margin:4px 0;">Tên tôi là: <b>${cccdHoten !== '...................................................' ? cccdHoten : ''}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sinh năm: ${cccdNgaySinh}</p>
        <p style="margin:4px 0;">CCCD số: <b>${cccdSo}</b> &nbsp;&nbsp;&nbsp;&nbsp; Cấp ngày: ${cccdNgayCap} &nbsp;&nbsp;&nbsp;&nbsp; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p style="margin:4px 0;">Địa chỉ thường trú: ${cccdThuongtru}</p>

        <p style="margin:8px 0; font-weight:bold;">Tôi xin trình bày lý do như sau:</p>
        <p style="margin:4px 0; text-align:justify;">Chúng tôi hiện đang sử dụng thửa đất số <b>${landThua}</b>, tờ bản đồ số <b>${landTobando}</b>, tại ${landDiachi}, được cấp giấy chứng nhận QSD đất số <b>${landSophathanh}</b> cấp ngày ${landNgayCap}, diện tích: <b>${landDientich} m²</b>, mục đích sử dụng đất: <b>${landMucdich}</b>.</p>
        <p style="margin:4px 0; text-align:justify;">Chúng tôi đã đăng ký đo đạc hiện trạng thửa đất với chi nhánh VPĐKĐĐ Bá Thước để chuyển quyền sử dụng đất, thì phát hiện GCN QSD đất được cấp không đúng với hiện trạng sử dụng thực tế, cụ thể: diện tích và hình thể của thửa đất được cấp tại GCN không đúng với hiện trạng mà gia đình đang sử dụng.</p>
        <p style="margin:4px 0; text-align:justify;"><b>Nguyên nhân sai lệch:</b> Do thời điểm cấp GCN QSDĐ do chưa có máy móc đo đạc chuyên dụng và hình thể thửa đất đặc thù khu vực miền núi rất nhiều góc cạnh nên chưa thể hiện chính xác hình thể cũng như diện tích thực tế của thửa đất mà gia đình đang sử dụng ổn định.</p>
        <p style="margin:4px 0; text-align:justify;">Trong quá trình nhận GCN QSD đất, gia đình tôi đã không kiểm tra lại nên không phát hiện sai sót. Nay chúng tôi làm đơn này đề nghị UBND huyện Bá Thước xem xét thu hồi GCN QSD đất số <b>${landSophathanh}</b> cấp ngày ${landNgayCap} để cấp lại GCN QSD đất cho chúng tôi theo đúng hiện trạng, hình thể thửa đất thuộc quyền sử dụng của chúng tôi.</p>
        <p style="margin:4px 0; text-align:justify;">Chúng tôi cam kết chưa nhận chuyển nhượng, tặng cho với bất cứ tổ chức hay cá nhân nào mà không đăng ký với cơ quan cấp có thẩm quyền hoặc tự ý thay đổi ranh giới thửa đất; đồng thời cam kết không có các ý kiến khiếu kiện, khiếu nại có liên quan đến nội dung đơn.</p>
        <p style="margin:4px 0; text-align:justify;">Tôi xin cam đoan những gì tôi viết trên đây là đúng sự thật, nếu có điều gì không đúng tôi xin hoàn toàn chịu trách nhiệm theo quy định của pháp luật./.</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:15px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%"></td>
                <td width="50%" align="center">
                    <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">NGƯỜI VIẾT ĐƠN</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:2px;">(Ký, ghi rõ họ tên)</div>
                    <div style="height:60px;"></div>
                    <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">XÁC NHẬN CỦA TRƯỞNG THÔN</div>
                    <div style="height:60px;"></div>
                    <div style="font-size:10pt;">..................................................</div>
                </td>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">XÁC NHẬN CỦA UBND XÃ</div>
                    <div style="height:60px;"></div>
                    <div style="font-size:10pt;">..................................................</div>
                </td>
            </tr>
        </table>
        `;
    } else {
        // MẪU SỐ 04/ĐK, MẪU 18, MẪU 25, MẪU 29, MẪU 35
        const isM35 = (formType === 'don_tach_thua' || formType === 'mau_35_qd2604');
        const isM29 = (formType === 'mau_18_nd151' || formType === 'mau_29_qd2604');
        
        let mTitle = "ĐƠN ĐĂNG KÝ ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT";
        let mMauSo = "Mẫu số 04/ĐK";
        let mSub = "QĐ 2604/QĐ-VP Thanh Hóa";
        
        if (isM35) {
            mTitle = "ĐƠN ĐỀ NGHỊ TÁCH THỬA ĐẤT, HỢP THỬA ĐẤT";
            mMauSo = "Mẫu số 35";
            mSub = "Chi nhánh VPĐKĐĐ Bá Thước";
        } else if (isM29) {
            mTitle = "ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT";
            mMauSo = "Mẫu số 18 / 29";
            mSub = "Nghị định 151/2025/NĐ-CP & QĐ 2604";
        }

        bodyHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom: 12px;">
            <tr>
                <td width="40%" align="left" valign="top" style="font-family:'Times New Roman', serif; font-size:11pt; font-weight:bold;">
                    ${mMauSo}<br>
                    <span style="font-size:10pt; font-style:italic; font-weight:normal;">${mSub}</span>
                </td>
                <td width="60%" align="center" valign="top" style="font-family:'Times New Roman', serif;">
                    <div style="font-size:12pt; font-weight:bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style="font-size:12pt; font-weight:bold; margin-top:2px;">Độc lập - Tự do - Hạnh phúc</div>
                    <div style="width:140px; height:1px; background:#000; margin:4px auto 0 auto;"></div>
                </td>
            </tr>
        </table>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:14pt; font-weight:bold; margin:16px 0 4px 0; text-transform:uppercase;">
            ${mTitle}
        </div>

        <div style="text-align:center; font-family:'Times New Roman', serif; font-size:12pt; font-weight:bold; margin:12px 0 16px 0;">
            Kính gửi: ${getDynamicRecipient(formType, landDiachi, cccdThuongtru)}
        </div>

        <p style="font-weight:bold; margin:8px 0 4px 0;">1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất:</p>
        <p style="margin:3px 0;">- Họ và tên: <b>${cccdHoten !== '...................................................' ? cccdHoten : ''}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Năm sinh: ${cccdNgaySinh}</p>
        <p style="margin:3px 0;">- Số CCCD: <b>${cccdSo}</b> &nbsp;;&nbsp; Cấp ngày: ${cccdNgayCap} &nbsp;;&nbsp; Nơi cấp: Cục Cảnh sát QLHC về TTXH</p>
        <p style="margin:3px 0;">- Nơi thường trú: ${cccdThuongtru}</p>

        <p style="font-weight:bold; margin:8px 0 4px 0;">2. Thửa đất đề nghị đăng ký:</p>
        <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; width:100%; font-size:11pt; font-family:'Times New Roman', serif; border:1px solid #000; margin:6px 0;">
            <tr style="font-weight:bold; background:#f9f9f9; text-align:center;">
                <td width="12%">Thửa đất số</td>
                <td width="12%">Tờ bản đồ</td>
                <td width="44%">Địa chỉ thửa đất</td>
                <td width="14%">Diện tích</td>
                <td width="18%">Mục đích</td>
            </tr>
            <tr>
                <td align="center"><b>${landThua}</b></td>
                <td align="center"><b>${landTobando}</b></td>
                <td>${landDiachi}</td>
                <td align="center"><b>${landDientich} m²</b></td>
                <td>${landMucdich}</td>
            </tr>
        </table>
        <p style="margin:3px 0;">- Nguồn gốc sử dụng: Sử dụng đất ổn định, không có tranh chấp, phù hợp quy hoạch sử dụng đất.</p>
        <p style="margin:3px 0;">- Đề nghị: Đăng ký và cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu theo Luật Đất đai 2024.</p>

        <p style="margin:10px 0; text-align:justify;">Tôi xin cam đoan toàn bộ nội dung kê khai trên đơn là hoàn toàn đúng sự thật, thửa đất không có tranh chấp, khiếu kiện và xin chịu hoàn toàn trách nhiệm trước pháp luật.</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:20px; font-family:'Times New Roman', serif;">
            <tr>
                <td width="50%" align="center" valign="top">
                    <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">XÁC NHẬN CỦA UBND CẤP XÃ</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:2px;">(Về hiện trạng sử dụng đất và tình trạng tranh chấp)</div>
                    <div style="height:60px;"></div>
                    <div style="font-size:11pt; font-style:italic;">(Ký, đóng dấu và ghi rõ họ tên)</div>
                </td>
                <td width="50%" align="center" valign="top">
                    <div style="font-style:italic; font-size:11pt; margin-bottom:4px;">..., ${dateStr}</div>
                    <div style="font-weight:bold; font-size:11.5pt; text-transform:uppercase;">NGƯỜI LÀM ĐƠN / NGƯỜI VIẾT ĐƠN</div>
                    <div style="font-size:10pt; font-style:italic; margin-top:2px;">(Ký và ghi rõ họ tên)</div>
                    <div style="height:60px;"></div>
                    <div style="font-weight:bold; font-size:12pt;">${cccdHoten !== '...................................................' ? cccdHoten : ''}</div>
                </td>
            </tr>
        </table>
        `;
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
        const blob = new Blob(['\\ufeff', docHtml], {
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
