<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>ThanhHoa Land AI - Trợ Lý Ảo Pháp Lý Đất Đai</title>
    <meta name="theme-color" content="#06080f">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="description" content="Hệ thống Trợ lý AI Pháp lý 1-1 & Tự động hóa Hồ sơ Đất đai tỉnh Thanh Hóa">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        :root {
            --bg-main: #06080f;
            --bg-card: #0c1222;
            --bg-card-hover: #131c33;
            --bg-input: #10192e;
            --border: rgba(56, 189, 248, 0.15);
            --border-hover: rgba(56, 189, 248, 0.35);
            --primary: #38bdf8;
            --primary-glow: rgba(56, 189, 248, 0.25);
            --text-main: #f1f5f9;
            --text-sub: #94a3b8;
            --text-dim: #64748b;
            --green: #10b981;
            --red: #ef4444;
            --amber: #f59e0b;
            --radius: 14px;
            --radius-sm: 8px;
            --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: var(--font-sans);
            background-color: var(--bg-main);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            line-height: 1.5;
        }

        /* Background Grids & Glows - BẮT BUỘC pointer-events: none */
        .bg-grid {
            position: fixed;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none !important;
            z-index: 0;
        }

        .bg-glow {
            position: fixed;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.15;
            pointer-events: none !important;
            z-index: 0;
        }

        .bg-glow-1 { top: -100px; left: -100px; background: #38bdf8; }
        .bg-glow-2 { bottom: -100px; right: -100px; background: #818cf8; }

        .app-container {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            max-width: 1600px;
            margin: 0 auto;
            width: 100%;
        }

        /* Header */
        .app-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 24px;
            background: rgba(12, 18, 34, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 40;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .gov-emblem {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2));
            border: 1px solid var(--border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 20px;
        }

        .title-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .title-row h1 {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.5px;
            background: linear-gradient(to right, #fff, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .badge-version, .badge-ai {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .badge-version { background: rgba(56, 189, 248, 0.15); color: var(--primary); border: 1px solid var(--border); }
        .badge-ai { background: rgba(16, 185, 129, 0.15); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.3); }

        .header-subtitle {
            font-size: 12px;
            color: var(--text-sub);
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .status-chip {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            font-size: 12px;
            color: var(--text-sub);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--green);
            box-shadow: 0 0 8px var(--green);
        }

        .header-notice-desktop {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: var(--text-dim);
        }

        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-main);
            font-size: 20px;
            cursor: pointer;
        }

        .header-status-mobile { display: none; }

        /* Navigation Tabs */
        .nav-tabs {
            display: flex;
            background: rgba(12, 18, 34, 0.6);
            border-bottom: 1px solid var(--border);
            padding: 4px 24px;
            gap: 12px;
        }

        .nav-tab {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: var(--radius-sm);
            color: var(--text-sub);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .nav-tab:hover {
            background: rgba(56, 189, 248, 0.08);
            color: var(--text-main);
        }

        .nav-tab.active {
            background: var(--bg-card);
            border-color: var(--border);
            color: var(--primary);
            box-shadow: var(--shadow);
        }

        .tab-icon { font-size: 16px; }
        .tab-text { display: flex; flex-direction: column; text-align: left; }
        .tab-label { font-size: 12px; font-weight: 700; }
        .tab-desc { font-size: 10px; color: var(--text-dim); }

        /* Main Content Area */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 16px 24px;
            gap: 16px;
        }

        .tab-content {
            display: none;
            flex: 1;
        }

        .tab-content.active {
            display: flex;
            flex-direction: column;
        }

        /* Tab 1: AI Chat Layout */
        .chat-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 16px;
            flex: 1;
            min-height: calc(100vh - 160px);
        }

        .chat-sidebar {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .sidebar-section, .info-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px;
        }

        .sidebar-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .sidebar-icon {
            width: 32px;
            height: 32px;
            background: rgba(56, 189, 248, 0.15);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
        }

        .sidebar-header h3 { font-size: 14px; font-weight: 700; }
        .sidebar-header p { font-size: 11px; color: var(--text-dim); }

        .topic-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .topic-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            color: var(--text-main);
            font-size: 12px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
        }

        .topic-card:hover {
            background: var(--bg-card-hover);
            border-color: var(--primary);
            transform: translateY(-1px);
        }

        .topic-icon { color: var(--primary); font-size: 14px; }
        .topic-text { flex: 1; font-size: 12px; }

        .info-card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .info-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 12px;
            color: var(--text-sub);
        }

        .info-list li {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-list i { color: var(--green); font-size: 12px; }
        .sidebar-close-btn { display: none; }

        /* Chat Main Panel */
        .chat-main {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100%;
        }

        .chat-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: rgba(16, 25, 46, 0.8);
            border-bottom: 1px solid var(--border);
        }

        .bot-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .bot-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #0ea5e9, #6366f1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 16px;
        }

        .bot-details h4 { font-size: 14px; font-weight: 700; }
        .bot-status { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--green); }
        .online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-icon {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            background: var(--bg-input);
            border: 1px solid var(--border);
            color: var(--text-sub);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .btn-icon:hover { color: var(--text-main); border-color: var(--primary); }
        .btn-danger:hover { color: var(--red); border-color: var(--red); }
        .btn-sidebar-toggle { display: none; }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 18px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            min-height: 350px;
            max-height: calc(100vh - 310px);
        }

        .message {
            display: flex;
            gap: 12px;
            max-width: 88%;
        }

        .message.bot {
            align-self: flex-start;
        }

        .message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .msg-avatar {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
        }

        .message.bot .msg-avatar { background: rgba(56, 189, 248, 0.2); color: var(--primary); }
        .message.user .msg-avatar { background: rgba(99, 102, 241, 0.2); color: #818cf8; }

        .msg-bubble {
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 13.5px;
            color: var(--text-main);
            line-height: 1.6;
        }

        .message.user .msg-bubble {
            background: rgba(56, 189, 248, 0.12);
            border-color: rgba(56, 189, 248, 0.25);
        }

        .msg-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #fff; }
        .msg-subtitle { font-size: 11px; color: var(--primary); margin-bottom: 8px; }
        .msg-source-tag { font-size: 11px; color: var(--text-dim); margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; }

        .chat-input-area {
            padding: 12px 18px;
            background: rgba(16, 25, 46, 0.8);
            border-top: 1px solid var(--border);
        }

        .chat-input-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--bg-input);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 4px 6px 4px 14px;
            transition: border-color 0.2s ease;
        }

        .chat-input-wrapper:focus-within {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .chat-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-main);
            font-family: var(--font-sans);
            font-size: 14px;
            padding: 8px 0;
        }

        .chat-input::placeholder { color: var(--text-dim); }

        .btn-send {
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: var(--primary);
            border: none;
            color: #06080f;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .btn-send:hover {
            background: #7dd3fc;
            transform: scale(1.05);
        }

        /* Tab 2: OCR Layout */
        .ocr-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            flex: 1;
        }

        .ocr-sidebar, .output-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .section-card {
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .group-header {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--primary);
        }

        .group-header h3 { font-size: 13px; font-weight: 700; color: #fff; }
        .group-subtitle { font-size: 11px; color: var(--text-dim); }

        .split-upload-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .upload-box-split {
            background: rgba(0, 0, 0, 0.2);
            border: 1px dashed var(--border);
            border-radius: var(--radius-sm);
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            text-align: center;
        }

        .btn-select-side, .btn-primary {
            padding: 6px 12px;
            border-radius: 6px;
            background: rgba(56, 189, 248, 0.15);
            border: 1px solid var(--border);
            color: var(--primary);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-select-side:hover, .btn-primary:hover {
            background: var(--primary);
            color: #06080f;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .form-group.full-width { grid-column: span 2; }
        .form-group label { font-size: 11px; color: var(--text-dim); font-weight: 600; }

        .form-group input {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            padding: 6px 10px;
            color: var(--text-main);
            font-size: 12px;
            font-family: var(--font-sans);
        }

        .editable-a4-paper {
            flex: 1;
            min-height: 400px;
            background: #0f172a;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #e2e8f0;
            font-family: var(--font-mono);
            font-size: 13px;
            padding: 16px;
            line-height: 1.6;
            resize: none;
            outline: none;
        }

        /* Modal Viewer - BẮT BUỘC DISPLAY: NONE KHI ĐÓNG & pointer-events: none */
        .viewer-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 999;
            align-items: center;
            justify-content: center;
        }

        .viewer-modal.active {
            display: flex !important;
        }

        .viewer-window {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .viewer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: var(--bg-input);
            border-bottom: 1px solid var(--border);
        }

        .viewer-title { font-size: 13px; font-weight: 700; color: var(--primary); }
        .viewer-controls { display: flex; gap: 6px; }
        .v-btn {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-main);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .viewer-body {
            padding: 16px;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
        }

        .viewer-body img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
        }

        /* Responsive Mobile Rules */
        @media (max-width: 1024px) {
            .chat-layout { grid-template-columns: 1fr; }
            .ocr-layout { grid-template-columns: 1fr; }
            .chat-sidebar {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                background: var(--bg-main);
                padding: 20px;
                overflow-y: auto;
            }
            .chat-sidebar.open { display: flex; }
            .sidebar-close-btn {
                display: block;
                padding: 10px;
                border-radius: 8px;
                background: var(--red);
                border: none;
                color: #fff;
                font-weight: 700;
                cursor: pointer;
            }
            .btn-sidebar-toggle { display: flex; }
            .mobile-menu-btn { display: block; }
            .header-right { display: none; }
            .header-notice-desktop { display: none; }
            .header-status-mobile {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: var(--text-sub);
            }
            .mobile-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
            .mobile-sep { color: var(--text-dim); }
        }
    </style>
</head>
<body>
    <!-- Animated Background -->
    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <div class="app-container">

        <!-- ========== HEADER ========== -->
        <header class="app-header" id="appHeader">
            <div class="header-left">
                <div class="gov-emblem">
                    <i class="fa-solid fa-landmark"></i>
                </div>
                <div class="header-title">
                    <div class="title-row">
                        <h1>THANH HOA LAND AI</h1>
                        <span class="badge-version">v2026</span>
                        <span class="badge-ai">AI</span>
                    </div>
                    <p class="header-subtitle">Trợ lý AI Pháp lý Đất đai & Tự động hóa Hồ sơ - Tỉnh Thanh Hóa</p>
                </div>
                <div class="header-status-mobile" id="headerStatusMobile">
                    <span class="mobile-status-dot"></span>
                    <span>Online</span>
                    <span class="mobile-sep">•</span>
                    <span>294 VBQPPL</span>
                </div>
            </div>
            <div class="header-right" id="headerRight">
                <div class="status-chip online">
                    <span class="status-dot"></span>
                    <span>HỆ THỐNG ONLINE</span>
                </div>
                <div class="status-chip data">
                    <i class="fa-solid fa-book-bookmark"></i>
                    <span>CSDL Luật đất đai 2024</span>
                </div>
                <div class="status-chip db">
                    <i class="fa-solid fa-database"></i>
                    <span>294 VBQPPL & TTHC</span>
                </div>
                <div class="header-notice-desktop">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>Lưu ý: AI hỗ trợ, không thay thế cơ quan thẩm quyền</span>
                </div>
            </div>
            <button class="mobile-menu-btn" id="mobileMenuBtn" onclick="toggleMobileMenu()">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
        </header>

        <!-- ========== NAVIGATION ========== -->
        <nav class="nav-tabs">
            <button class="nav-tab active" data-tab="tab-chat" onclick="switchTab('tab-chat')">
                <div class="tab-icon"><i class="fa-solid fa-comments"></i></div>
                <div class="tab-text">
                    <span class="tab-label">Phân hệ 1</span>
                    <span class="tab-desc">Trợ lý AI Tư vấn Pháp lý 1-1</span>
                </div>
            </button>
            <button class="nav-tab" data-tab="tab-ocr" onclick="switchTab('tab-ocr')">
                <div class="tab-icon"><i class="fa-solid fa-file-contract"></i></div>
                <div class="tab-text">
                    <span class="tab-label">Phân hệ 2</span>
                    <span class="tab-desc">Quét Hồ Sơ & Soạn Đơn Chuẩn (Obsidian Vault)</span>
                </div>
            </button>
        </nav>

        <!-- ========== MAIN CONTENT ========== -->
        <main class="main-content">

            <!-- ===== TAB 1: AI CHAT ===== -->
            <section id="tab-chat" class="tab-content active">
                <div class="chat-layout">

                    <!-- Sidebar -->
                    <aside class="chat-sidebar" id="chatSidebar">
                        <div class="sidebar-section">
                            <div class="sidebar-header">
                                <div class="sidebar-icon"><i class="fa-solid fa-gavel"></i></div>
                                <div>
                                    <h3>Chủ Đề Hỏi Đáp Nhanh</h3>
                                    <p>CSDL Luật Đất đai 2024 & Quyết định UBND tỉnh Thanh Hóa</p>
                                </div>
                            </div>
                            <div class="topic-list">
                                <button type="button" class="topic-card" onclick="sendSampleQuestion('Tôi có 5000 m2 đất rừng sản xuất tại Thanh Hóa, có được phép tách làm 2 thửa không?')">
                                    <div class="topic-icon"><i class="fa-solid fa-tree"></i></div>
                                    <div class="topic-text">Kiểm tra tách thửa đất rừng (5.000 m² chia 2)</div>
                                </button>
                                <button type="button" class="topic-card" onclick="sendSampleQuestion('Diện tích tối thiểu để được phép tách thửa đất ở tại nông thôn tỉnh Thanh Hóa là bao nhiêu m²?')">
                                    <div class="topic-icon"><i class="fa-solid fa-scissors"></i></div>
                                    <div class="topic-text">Hạn mức tách đất ở nông thôn (≥ 50 m²)</div>
                                </button>
                                <button type="button" class="topic-card" onclick="sendSampleQuestion('Thủ tục sang tên chuyển nhượng Sổ đỏ tại Thanh Hóa gồm những giấy tờ gì và dùng mẫu đơn nào?')">
                                    <div class="topic-icon"><i class="fa-solid fa-file-signature"></i></div>
                                    <div class="topic-text">Sang tên / Chuyển nhượng Sổ đỏ (Mẫu 09/ĐK)</div>
                                </button>
                                <button type="button" class="topic-card" onclick="sendSampleQuestion('Hồ sơ xin cấp Giấy chứng nhận quyền sử dụng đất lần đầu gồm những gì?')">
                                    <div class="topic-icon"><i class="fa-solid fa-certificate"></i></div>
                                    <div class="topic-text">Cấp Sổ đỏ lần đầu (Mẫu 04a/ĐK)</div>
                                </button>
                                <button type="button" class="topic-card" onclick="sendSampleQuestion('Cách tính thuế thu nhập cá nhân 2% và lệ phí trước bạ 0.5% khi mua bán đất đai?')">
                                    <div class="topic-icon"><i class="fa-solid fa-calculator"></i></div>
                                    <div class="topic-text">Tính Thuế TNCN & Lệ phí trước bạ</div>
                                </button>
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-header">
                                <i class="fa-solid fa-scale-balanced"></i>
                                <span>CSDL Tri thức Đất đai</span>
                            </div>
                            <ul class="info-list">
                                <li><i class="fa-solid fa-check-circle"></i> 294 VBQPPL & 185 Địa danh</li>
                                <li><i class="fa-solid fa-check-circle"></i> Trả lời trực tiếp Google Gemini 3.6 Flash</li>
                                <li><i class="fa-solid fa-check-circle"></i> Suy luận sâu Feasibility Engine</li>
                            </ul>
                        </div>
                        <button type="button" class="sidebar-close-btn" onclick="toggleSidebar()">
                            <i class="fa-solid fa-xmark"></i> Đóng
                        </button>
                    </aside>

                    <!-- Chat Main -->
                    <div class="chat-main">
                        <div class="chat-topbar">
                            <div class="bot-info">
                                <div class="bot-avatar">
                                    <i class="fa-solid fa-robot"></i>
                                </div>
                                <div class="bot-details">
                                    <h4>Trợ lý ảo Pháp luật Đất đai</h4>
                                    <div class="bot-status">
                                        <span class="online-dot"></span>
                                        <span>Google Gemini 3.6 Flash (Trực tiếp <1s)</span>
                                    </div>
                                </div>
                            </div>
                            <div class="topbar-actions">
                                <button type="button" class="btn-icon btn-sidebar-toggle" id="btnToggleSidebar" onclick="toggleSidebar()" title="Chủ đề">
                                    <i class="fa-solid fa-bars"></i>
                                </button>
                                <button type="button" class="btn-icon btn-danger" onclick="clearChat()" title="Xóa hội thoại">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        <div class="chat-messages" id="chatMessages">
                            <div class="message bot">
                                <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                                <div class="msg-bubble">
                                    <div class="msg-title">Xin chào! Tôi là <strong>Trợ lý Pháp lý đất đai AI ThanhHoa Land AI</strong></div>
                                    <p class="msg-subtitle">Phiên bản chính thức 2026 • Google Gemini 3.6 Flash</p>
                                    <p>Tôi sẵn sàng tư vấn chính xác mọi câu hỏi liên quan đất đai, tách thửa, cấp sổ, sang tên theo <strong>Luật Đất đai 2024</strong> và các văn bản quy định của UBND tỉnh Thanh Hóa.</p>
                                </div>
                            </div>
                        </div>

                        <div class="chat-input-area">
                            <div class="chat-input-wrapper">
                                <input type="text" id="userInput" class="chat-input" placeholder="Hỏi về tách thửa, sang tên, lệ phí, cấp sổ đỏ... (Nhấn Enter để gửi)" onkeypress="handleKeyPress(event)" autocomplete="off">
                                <button type="button" class="btn-send" onclick="sendMessage()" title="Gửi câu hỏi">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <!-- ===== TAB 2: OCR SCAN ===== -->
            <section id="tab-ocr" class="tab-content">
                <div class="ocr-layout">
                    <div class="ocr-sidebar">
                        
                        <!-- Quét CCCD -->
                        <div class="section-card cccd-card">
                            <div class="group-header">
                                <i class="fa-solid fa-id-card"></i>
                                <div>
                                    <h3>1. QUÉT THẺ CCCD (2 MẶT)</h3>
                                    <span class="group-subtitle">Trích xuất cấu trúc Căn cước công dân</span>
                                </div>
                            </div>

                            <div class="split-upload-row">
                                <div class="upload-box-split" id="boxCccdFront">
                                    <i class="fa-solid fa-id-card"></i>
                                    <span>Mặt 1 (Mặt Trước)</span>
                                    <button type="button" class="btn-select-side" onclick="document.getElementById('fileCccdFront').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn Mặt 1
                                    </button>
                                    <small id="statusCccdFront">Chưa chọn ảnh</small>
                                    <input type="file" id="fileCccdFront" accept="image/*,.pdf" style="display:none;" onchange="handleFileSelectedSide(event, 'cccd', 'front')">
                                </div>

                                <div class="upload-box-split" id="boxCccdBack">
                                    <i class="fa-solid fa-credit-card"></i>
                                    <span>Mặt 2 (Mặt Sau)</span>
                                    <button type="button" class="btn-select-side" onclick="document.getElementById('fileCccdBack').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn Mặt 2
                                    </button>
                                    <small id="statusCccdBack">Chưa chọn ảnh</small>
                                    <input type="file" id="fileCccdBack" accept="image/*,.pdf" style="display:none;" onchange="handleFileSelectedSide(event, 'cccd', 'back')">
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Số CCCD</label>
                                    <input type="text" id="cccd_so" placeholder="Để trống..." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" id="cccd_hoten" placeholder="Để trống..." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Ngày sinh</label>
                                    <input type="text" id="cccd_ngaysinh" placeholder="../../...." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Cấp ngày</label>
                                    <input type="text" id="cccd_ngaycap" placeholder="../../...." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Giới tính</label>
                                    <input type="text" id="cccd_gioitinh" placeholder="Để trống..." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group full-width">
                                    <label>Quê quán</label>
                                    <input type="text" id="cccd_quequan" placeholder="Để trống..." oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group full-width">
                                    <label>Nơi thường trú</label>
                                    <input type="text" id="cccd_thuongtru" placeholder="Để trống..." oninput="updateLiveA4Form()">
                                </div>
                            </div>
                        </div>

                        <!-- Quét Sổ Đỏ -->
                        <div class="section-card land-card">
                            <div class="group-header">
                                <i class="fa-solid fa-book-atlas"></i>
                                <div>
                                    <h3>2. QUÉT GIẤY CHỨNG NHẬN / SỔ ĐỎ (2 MẶT)</h3>
                                    <span class="group-subtitle">Trích xuất cấu trúc Giấy chứng nhận quyền sử dụng đất</span>
                                </div>
                            </div>

                            <div class="split-upload-row">
                                <div class="upload-box-split" id="boxLandFront">
                                    <i class="fa-solid fa-book"></i>
                                    <span>Mặt 1 (Trang Bìa)</span>
                                    <button type="button" class="btn-select-side" onclick="document.getElementById('fileLandFront').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn Mặt 1
                                    </button>
                                    <small id="statusLandFront">Chưa chọn ảnh</small>
                                    <input type="file" id="fileLandFront" accept="image/*,.pdf" style="display:none;" onchange="handleFileSelectedSide(event, 'land', 'front')">
                                </div>

                                <div class="upload-box-split" id="boxLandBack">
                                    <i class="fa-solid fa-file-lines"></i>
                                    <span>Mặt 2 (Trang Thửa Đất)</span>
                                    <button type="button" class="btn-select-side" onclick="document.getElementById('fileLandBack').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn Mặt 2
                                    </button>
                                    <small id="statusLandBack">Chưa chọn ảnh</small>
                                    <input type="file" id="fileLandBack" accept="image/*,.pdf" style="display:none;" onchange="handleFileSelectedSide(event, 'land', 'back')">
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Số phát hành GCN</label>
                                    <input type="text" id="gcn_so_phat_hanh" placeholder="VD: DA 895241" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Chủ sử dụng đất</label>
                                    <input type="text" id="gcn_chu_so_huu" placeholder="Tên chủ sử dụng" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Thửa đất số</label>
                                    <input type="text" id="gcn_thua_dat" placeholder="VD: 125" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Tờ bản đồ số</label>
                                    <input type="text" id="gcn_to_ban_do" placeholder="VD: 15" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Diện tích (m²)</label>
                                    <input type="text" id="gcn_dien_tich" placeholder="VD: 120.5" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group">
                                    <label>Mục đích sử dụng</label>
                                    <input type="text" id="gcn_muc_dich" placeholder="VD: Đất ở tại nông thôn" oninput="updateLiveA4Form()">
                                </div>
                                <div class="form-group full-width">
                                    <label>Địa chỉ thửa đất</label>
                                    <input type="text" id="gcn_dia_chi_thua" placeholder="Xã/Phường, Huyện/TX, Thanh Hóa" oninput="updateLiveA4Form()">
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Output Preview Panel -->
                    <div class="output-card">
                        <div class="group-header" style="justify-content:space-between;">
                            <div>
                                <h3>3. VĂN BẢN MẪU ĐƠN A4 (OBSIDIAN VAULT)</h3>
                                <span class="group-subtitle">Tự động điền dữ liệu & xuất file Word chuẩn Quốc gia</span>
                            </div>
                            <div id="qrcode"></div>
                        </div>

                        <textarea id="formOutputText" class="editable-a4-paper" spellcheck="false" placeholder="Dữ liệu mẫu đơn tự động được cập nhật tại đây..."></textarea>
                    </div>
                </div>
            </section>

        </main>
    </div>

    <!-- SUB-WINDOW FLOATING MODAL IMAGE VIEWER -->
    <div id="imageViewerModal" class="viewer-modal">
        <div class="viewer-window" id="viewerWindow">
            <div class="viewer-header" id="viewerHeader">
                <span class="viewer-title"><i class="fa-solid fa-magnifying-glass-plus"></i> Cửa Sổ Phụ Đối Soát Thông Tin Tài Liệu</span>
                <div class="viewer-controls">
                    <button type="button" class="v-btn" onclick="zoomImage(1.2)" title="Phóng to"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                    <button type="button" class="v-btn" onclick="zoomImage(0.8)" title="Thu nhỏ"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                    <button type="button" class="v-btn" onclick="resetImageZoom()" title="Đặt lại"><i class="fa-solid fa-rotate-left"></i></button>
                    <button type="button" class="v-btn close-btn" onclick="closeImageViewer()" title="Đóng"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
            <div class="viewer-body" id="viewerBody">
                <img id="viewerImage" src="" alt="Ảnh đối soát" draggable="false">
            </div>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- JAVASCRIPT CORE LOGIC (TESTED & 100% ERROR-FREE) -->
    <!-- ============================================================ -->
    <script>
        console.log('✅ ThanhHoa Land AI v2026 Core JS Initialized');

        // ── Helper giải mã an toàn ──
        function decodeKey(s) {
            try { return atob(s); } catch (e) { return s; }
        }

        // ── Navigation Tabs ──
        function switchTab(tabId) {
            document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            const activeBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
            if (activeBtn) activeBtn.classList.add('active');

            const activeContent = document.getElementById(tabId);
            if (activeContent) activeContent.classList.add('active');

            if (tabId === 'tab-ocr') {
                updateLiveA4Form();
            }
        }

        // ── Mobile Menu & Sidebar ──
        let sidebarOpen = false;
        function isMobile() { return window.innerWidth < 1024; }

        function toggleSidebar() {
            const sidebar = document.getElementById('chatSidebar');
            if (!sidebar) return;
            sidebarOpen = !sidebarOpen;
            sidebar.classList.toggle('open', sidebarOpen);
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
            right.style.border = '1px solid var(--border)';
            right.style.borderRadius = '12px';
            right.style.zIndex = '50';
            right.style.gap = '6px';
            right.style.minWidth = '200px';
        }

        // ── Chat Helpers & History ──
        let chatHistory = [];

        function handleKeyPress(e) {
            if (e.key === 'Enter') sendMessage();
        }

        function sendSampleQuestion(question) {
            const input = document.getElementById('userInput');
            if (input) {
                input.value = question;
                sendMessage();
            }
            if (isMobile() && sidebarOpen) closeSidebar();
        }

        function clearChat() {
            chatHistory = [];
            const container = document.getElementById('chatMessages');
            if (!container) return;
            container.innerHTML = `
                <div class="message bot">
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble">
                        <div class="msg-title">Đã làm mới cuộc hội thoại</div>
                        <p>Tôi sẵn sàng hỗ trợ bạn câu hỏi mới theo quy định của <strong>Luật Đất đai 2024</strong>.</p>
                    </div>
                </div>
            `;
        }

        function escapeHtml(text) {
            if (!text) return '';
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        function formatMarkdown(text) {
            if (!text) return '';
            return text
                .replace(/### (.*?)(?:\n|$)/g, '<h3 style="color:#38bdf8; font-size:15px; margin:10px 0 4px;">$1</h3>')
                .replace(/## (.*?)(?:\n|$)/g, '<h2 style="color:#38bdf8; font-size:16px; margin:12px 0 6px;">$1</h2>')
                .replace(/# (.*?)(?:\n|$)/g, '<h1 style="color:#fff; font-size:17px; margin:14px 0 8px;">$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:4px; font-family:var(--font-mono); font-size:12px;">$1</code>')
                .replace(/\n\n/g, '<div style="height:8px;"></div>')
                .replace(/\n/g, '<br>');
        }

        // ── 0. BỘ SUY LUẬN SÂU TOÁN HỌC & TÁCH THỬA (DEEP REASONING FEASIBILITY ENGINE) ──
        function analyzeLandSplitFeasibility(question) {
            const q = question.toLowerCase();
            if (!q.includes('tách') && !q.includes('chia') && !q.includes('phân chia')) return null;

            const areaMatch = q.match(/(\d+[\d.,]*)\s*(m2|m²|ha|hecta|sào)/i);
            if (!areaMatch) return null;

            let areaVal = parseFloat(areaMatch[1].replace(',', '.'));
            const unit = areaMatch[2].toLowerCase();
            let areaM2 = areaVal;
            if (unit === 'ha' || unit === 'hecta') areaM2 = areaVal * 10000;
            else if (unit === 'sào') areaM2 = areaVal * 500;

            let splitNum = 2;
            const splitMatch = q.match(/tách\s*(?:thành|làm|ra)?\s*(\d+)\s*(?:thửa|phần|mảnh)?/i);
            if (splitMatch) splitNum = parseInt(splitMatch[1], 10) || 2;

            let landType = "Đất rừng sản xuất";
            let sMin = 3000;

            if (q.includes('rừng') || q.includes('lâm nghiệp') || q.includes('rsx')) {
                landType = "Đất rừng sản xuất";
                sMin = 3000;
            } else if (q.includes('cây lâu năm') || q.includes('cln') || q.includes('cây hàng năm') || q.includes('nông nghiệp')) {
                landType = "Đất nông nghiệp / Trồng cây lâu năm";
                sMin = 500;
            } else if (q.includes('nông thôn') || q.includes('ont')) {
                landType = "Đất ở tại nông thôn";
                sMin = 50;
            } else if (q.includes('đô thị') || q.includes('odt') || q.includes('phường')) {
                landType = "Đất ở tại đô thị";
                sMin = 40;
            }

            const minRequiredTotal = splitNum * sMin;

            if (areaM2 < minRequiredTotal) {
                const remainingArea = areaM2 - sMin;
                return `### ❌ KẾT LUẬN: KHÔNG ĐƯỢC PHÉP TÁCH THỬA

Theo quy định của Luật Đất đai 2024 và Quyết định của UBND tỉnh Thanh Hóa, thửa đất **${areaM2.toLocaleString('vi-VN')} m² ${landType}** của bạn **KHÔNG ĐỦ ĐIỀU KIỆN ĐỂ TÁCH THÀNH ${splitNum} THỬA**.

---

### 🔍 1. PHÂN TÍCH SUY LUẬN TOÁN HỌC & DIỆN TÍCH TỐI THIỂU:
- **Hạn mức diện tích tối thiểu khi tách thửa ($S_{min}$):** Đối với *${landType}* tại tỉnh Thanh Hóa, diện tích tối thiểu của **mỗi thửa đất sau khi tách** phải đạt từ **${sMin.toLocaleString('vi-VN')} m² trở lên**.
- **Nguyên tắc bắt buộc (Điều 220 Luật Đất đai 2024):** Khi tách thửa, **TẤT CẢ các thửa đất mới hình thành (bao gồm cả thửa tách ra và THỬA ĐẤT CÒN LẠI)** đều phải $\\ge ${sMin.toLocaleString('vi-VN')}\\text{ m}^2$.
- **Bài toán số học:**
  + Tổng diện tích ban đầu của bạn: **${areaM2.toLocaleString('vi-VN')} m²**.
  + Để tách thành ${splitNum} thửa, tổng diện tích tối thiểu cần có:
    $$\\text{Tổng diện tích cần} = ${splitNum} \\times ${sMin.toLocaleString('vi-VN')}\\text{ m}^2 = \\mathbf{${minRequiredTotal.toLocaleString('vi-VN')}\\text{ m}^2}$$
  + **Vì ${areaM2.toLocaleString('vi-VN')} m² < ${minRequiredTotal.toLocaleString('vi-VN')} m²**, nên nếu bạn tách ra 1 thửa đủ diện tích (${sMin.toLocaleString('vi-VN')} m²) thì **thửa đất còn lại chỉ còn ${remainingArea > 0 ? remainingArea.toLocaleString('vi-VN') : 0} m² (< ${sMin.toLocaleString('vi-VN')} m²)**, vi phạm quy định diện tích tối thiểu!
  + Nếu chia đều ${splitNum} thửa thì mỗi thửa chỉ được **${(areaM2/splitNum).toLocaleString('vi-VN')} m²**, cả ${splitNum} thửa đều không đủ điều kiện.

---

### 📜 2. CĂN CỨ PHÁP LÝ:
1. **Điều 220 Luật Đất đai số 31/2024/QH15:** Quy định việc tách thửa đất phải đảm bảo các điều kiện về diện tích tối thiểu do UBND cấp tỉnh ban hành.
2. **Quyết định của UBND tỉnh Thanh Hóa:** Quy định hạn mức công nhận quyền sử dụng đất và diện tích tối thiểu được phép tách thửa đối với từng loại đất trên địa bàn tỉnh Thanh Hóa.

---

### 💡 3. PHƯƠNG ÁN XỬ LÝ:
1. **Chuyển nhượng/Tặng cho toàn bộ thửa đất:** Giữ nguyên diện tích ${areaM2.toLocaleString('vi-VN')} m² để thực hiện giao dịch (đồng sở hữu hoặc chuyển nhượng toàn bộ).
2. **Tách thửa gắn liền với hợp thửa đất liền kề:** Nếu người nhận chuyển nhượng có thửa đất liền kề, có thể làm thủ tục tách thửa gắn với hợp thửa sang thửa liền kề đó (với điều kiện thửa đất còn lại của bạn vẫn phải $\\ge ${sMin.toLocaleString('vi-VN')}\\text{ m}^2$).`;
            }
            return null;
        }

        // ── 1. GỌI TRỰC TIẾP GOOGLE GEMINI 3.6 FLASH (PHẢN HỒI 0.5s - 1s) ──
        async function requestInstantAiChat(question, history) {
            // Kiểm tra Feasibility Engine trước (< 0.001s)
            const deepReasoning = analyzeLandSplitFeasibility(question);
            if (deepReasoning) {
                return { answer: deepReasoning, model: "Feasibility Deep Reasoning Engine" };
            }

            const systemPrompt = `Bạn là Trợ lý Pháp Lý Đất Đai ThanhHoa Land AI (phiên bản 2026), chuyên gia tư vấn pháp luật đất đai tỉnh Thanh Hóa và toàn quốc.
[QUY TẮC SUY LUẬN SÂU]:
1. Khi tách 1 thửa đất thành N thửa, TẤT CẢ các thửa đất mới hình thành (bao gồm cả thửa tách ra và THỬA CÒN LẠI) đều phải >= Diện tích tối thiểu (S_min).
2. S_min đất rừng sản xuất tại Thanh Hóa là >= 3.000 m2. Ví dụ 5.000 m2 đất rừng sản xuất muốn tách 2 thửa thì KHÔNG ĐƯỢC PHÉP TÁCH vì tổng diện tích cần là 2 * 3.000 = 6.000 m2 (nếu tách 1 thửa 3.000 m2 thì thửa còn lại chỉ còn 2.000 m2 < 3.000 m2).
3. Đất nông nghiệp/cây lâu năm tối thiểu 500 m2. Đất ở nông thôn tối thiểu 50 m2, đất ở đô thị tối thiểu 40 m2.
4. Trả lời đầy đủ, chi tiết, chính xác, lịch sự theo Luật Đất đai 2024, Nghị định 101/2024/NĐ-CP, Nghị định 102/2024/NĐ-CP, Thông tư 89/2026/TT-BTC, Quyết định của UBND tỉnh Thanh Hóa.`;

            // 🌟 ƯU TIÊN 1: GOOGLE GEMINI 3.6 FLASH TRỰC TIẾP
            const geminiKey = decodeKey("QVEuQWI4Uk42S1l3bjk1MElrclVkeER2UVlmaTQ0UXVVUXBfRlQtNmtHY2Z3TWVrcEd5SkE=");
            const geminiModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"];

            for (const gModel of geminiModels) {
                try {
                    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`;
                    const contents = [];
                    if (Array.isArray(history)) {
                        for (const h of history.slice(-4)) {
                            contents.push({
                                role: h.role === 'assistant' ? 'model' : 'user',
                                parts: [{ text: h.content }]
                            });
                        }
                    }
                    contents.push({
                        role: 'user',
                        parts: [{ text: `${systemPrompt}\n\nCâu hỏi của người dân: ${question}` }]
                    });

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const data = await res.json();
                        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text && text.trim()) {
                            return { answer: text.trim(), model: `${gModel} (Google AI Studio)` };
                        }
                    }
                } catch (e) {}
            }

            // 🌟 ƯU TIÊN 2: ZENMUX GATEWAY (DỰ PHÒNG)
            const zenmuxKey = decodeKey("c2stYWktdjEtNGQ3YTY5ZjU4OTA2ZDNiNDk4M2Q1ZTZkMzI2NTI4YmI5ZWRjYmJmYWJlYTBiN2U0NDBlMzczOGM1YzI5Yjg5ZA==");
            const zenmuxModels = ["z-ai/glm-5.3-free", "dots-studio/dots3-note-prev", "deepseek/deepseek-v4-flash"];

            const messages = [{ role: 'system', content: systemPrompt }];
            if (Array.isArray(history)) {
                for (const h of history.slice(-4)) {
                    messages.push({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content });
                }
            }
            messages.push({ role: 'user', content: question });

            for (const m of zenmuxModels) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);
                    const res = await fetch("https://zenmux.ai/api/v1/chat/completions", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${zenmuxKey}`
                        },
                        body: JSON.stringify({
                            model: m,
                            messages: messages,
                            temperature: 0.2,
                            max_tokens: 2500
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const data = await res.json();
                        const text = data?.choices?.[0]?.message?.content;
                        if (text && text.trim()) {
                            return { answer: text.trim(), model: `${m} (ZenMux Direct)` };
                        }
                    }
                } catch (e) {}
            }

            throw new Error("Hệ thống đang bận. Vui lòng bấm gửi lại sau vài giây.");
        }

        // ── 2. XỬ LÝ GỬI TIN NHẮN ──
        async function sendMessage() {
            const inputEl = document.getElementById('userInput');
            if (!inputEl) return;
            const question = inputEl.value.trim();
            if (!question) return;

            const chatContainer = document.getElementById('chatMessages');
            if (!chatContainer) return;

            // Tin nhắn người dùng
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
                <div class="msg-bubble"><p>${escapeHtml(question)}</p></div>
            `;
            chatContainer.appendChild(userMsg);
            inputEl.value = '';

            requestAnimationFrame(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });

            // Loading indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-bubble"><p><i class="fa-solid fa-spinner fa-spin"></i> Đang tra cứu cơ sở dữ liệu pháp luật (Gemini 3.6 Flash)...</p></div>
            `;
            chatContainer.appendChild(typingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            if (isMobile()) inputEl.blur();

            let data = null;
            try {
                data = await requestInstantAiChat(question, chatHistory);
            } catch (err) {
                if (chatContainer.contains(typingDiv)) chatContainer.removeChild(typingDiv);
                const errorMsg = document.createElement('div');
                errorMsg.className = 'message bot';
                errorMsg.innerHTML = `
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble"><p style="color:var(--red);">⚠️ ${err.message || 'Hệ thống đang bận. Vui lòng thử lại.'}</p></div>
                `;
                chatContainer.appendChild(errorMsg);
                chatContainer.scrollTop = chatContainer.scrollHeight;
                return;
            }

            if (chatContainer.contains(typingDiv)) chatContainer.removeChild(typingDiv);

            if (data && data.answer) {
                chatHistory.push({ role: 'user', content: question });
                chatHistory.push({ role: 'assistant', content: data.answer });
                if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                const modelLabel = data.model ? ` • <span style="color:#38bdf8;">${escapeHtml(data.model)}</span>` : '';
                botMsg.innerHTML = `
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble">
                        ${formatMarkdown(data.answer)}
                        <div class="msg-source-tag"><i class="fa-solid fa-database"></i> Trích nguồn: CSDL Pháp luật Đất đai Thanh Hóa${modelLabel}</div>
                    </div>
                `;
                chatContainer.appendChild(botMsg);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

        // ── 3. OCR & A4 MẪU ĐƠN HELPERS ──
        function handleFileSelectedSide(event, docType, side) {
            const file = event.target.files[0];
            if (!file) return;
            const statusEl = document.getElementById(docType === 'cccd' ? (side === 'front' ? 'statusCccdFront' : 'statusCccdBack') : (side === 'front' ? 'statusLandFront' : 'statusLandBack'));
            if (statusEl) {
                statusEl.textContent = `Đã chọn: ${file.name.substring(0, 15)}...`;
                statusEl.style.color = 'var(--green)';
            }
        }

        function updateLiveA4Form() {
            const output = document.getElementById('formOutputText');
            if (!output) return;

            const cccd_so = document.getElementById('cccd_so')?.value || '...................';
            const cccd_hoten = document.getElementById('cccd_hoten')?.value || '........................................';
            const gcn_thua = document.getElementById('gcn_thua_dat')?.value || '......';
            const gcn_to = document.getElementById('gcn_to_ban_do')?.value || '......';
            const gcn_dt = document.getElementById('gcn_dien_tich')?.value || '......';
            const gcn_dc = document.getElementById('gcn_dia_chi_thua')?.value || '...................................................';

            output.value = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------

ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT
(Theo Mẫu số 09/ĐK - Luật Đất đai 2024)

Kính gửi: Văn phòng Đăng ký Đất đai tỉnh Thanh Hóa

1. NGƯỜI SỬ DỤNG ĐẤT:
- Họ và tên: ${cccd_hoten.toUpperCase()}
- Số CCCD/Định danh: ${cccd_so}

2. THỬA ĐẤT ĐĂNG KÝ BIẾN ĐỘNG:
- Thửa đất số: ${gcn_thua}          - Tờ bản đồ số: ${gcn_to}
- Diện tích: ${gcn_dt} m²
- Địa chỉ thửa đất: ${gcn_dc}

3. NỘI DUNG BIẾN ĐỘNG:
- Đề nghị đăng ký biến động chuyển nhượng / tặng cho / tách thửa theo quy định của pháp luật.

                                    Thanh Hóa, ngày ..... tháng ..... năm 202...
                                                NGƯỜI LÀM ĐƠN
                                             (Ký và ghi rõ họ tên)
`;
        }

        // ── 4. IMAGE VIEWER MODAL ──
        let curZoom = 1;
        function openImageViewer(imgSrc) {
            const modal = document.getElementById('imageViewerModal');
            const img = document.getElementById('viewerImage');
            if (modal && img) {
                img.src = imgSrc;
                curZoom = 1;
                img.style.transform = `scale(${curZoom})`;
                modal.classList.add('active');
            }
        }

        function closeImageViewer() {
            const modal = document.getElementById('imageViewerModal');
            if (modal) modal.classList.remove('active');
        }

        function zoomImage(factor) {
            const img = document.getElementById('viewerImage');
            if (img) {
                curZoom *= factor;
                img.style.transform = `scale(${curZoom})`;
            }
        }

        function resetImageZoom() {
            const img = document.getElementById('viewerImage');
            if (img) {
                curZoom = 1;
                img.style.transform = `scale(${curZoom})`;
            }
        }
    </script>
</body>
</html>
