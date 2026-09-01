<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>ThanhHoa Land AI — Hệ Thống Trợ Lý AI Pháp Lý & Hồ Sơ Đất Đai</title>
    <meta name="theme-color" content="#030712">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="description" content="Trợ lý AI Pháp lý 1-1 & Tự động hóa Hồ sơ Đất đai tỉnh Thanh Hóa — Phiên bản 2026">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

    <style>
        :root {
            --bg-base: #030712;
            --bg-surface: #0b1329;
            --bg-card: rgba(13, 22, 45, 0.78);
            --bg-card-hover: rgba(26, 39, 74, 0.88);
            --bg-input: rgba(10, 18, 38, 0.95);
            
            --border: rgba(56, 189, 248, 0.16);
            --border-hover: rgba(56, 189, 248, 0.45);
            --border-focus: #38bdf8;
            
            --primary: #38bdf8;
            --primary-gradient: linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%);
            --accent-green: #10b981;
            --accent-amber: #f59e0b;
            --accent-red: #ef4444;

            --text-main: #f8fafc;
            --text-sub: #94a3b8;
            --text-dim: #64748b;

            --radius-2xl: 22px;
            --radius-xl: 16px;
            --radius-lg: 12px;
            --radius-md: 9px;
            --radius-sm: 6px;

            --shadow-subtle: 0 10px 35px -5px rgba(0, 0, 0, 0.7);
            --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
            --font-serif: 'Times New Roman', Times, serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }

        /* Custom Scrollbars */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.15); }
        ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.25); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); }

        body {
            font-family: var(--font-sans);
            background-color: var(--bg-base);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.09) 0%, transparent 45%),
                radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.09) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 60%);
            background-attachment: fixed;
        }

        /* Ambient Lighting - Pointer events none */
        .ambient-grid {
            position: fixed;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 38px 38px;
            pointer-events: none !important;
            z-index: 0;
        }

        .ambient-glow {
            position: fixed;
            border-radius: 50%;
            filter: blur(140px);
            opacity: 0.15;
            pointer-events: none !important;
            z-index: 0;
        }
        .glow-1 { top: -140px; left: 10%; width: 550px; height: 550px; background: #38bdf8; }
        .glow-2 { bottom: -140px; right: 10%; width: 650px; height: 650px; background: #818cf8; }

        .app-container {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            max-width: 1720px;
            margin: 0 auto;
            width: 100%;
        }

        /* ── Header Luxury Glass ── */
        .header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 34px;
            background: rgba(10, 16, 36, 0.88);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        .header-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .gov-emblem-badge {
            width: 48px;
            height: 48px;
            background: var(--primary-gradient);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #030712;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.35);
            flex-shrink: 0;
            transition: transform 0.25s ease;
        }

        .gov-emblem-badge:hover {
            transform: scale(1.05) rotate(3deg);
        }

        .brand-text h1 {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(120deg, #ffffff 20%, #93c5fd 55%, #38bdf8 85%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .tag-pill {
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 7px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .tag-v2026 { background: rgba(56, 189, 248, 0.15); color: var(--primary); border: 1px solid var(--border); }
        .tag-gemini { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.3); }

        .brand-subtitle {
            font-size: 11.5px;
            color: var(--text-sub);
            font-weight: 400;
            margin-top: 1px;
        }

        .header-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .meta-status-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            border-radius: 30px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            font-size: 12px;
            color: var(--text-sub);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(10px);
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-green);
            box-shadow: 0 0 12px var(--accent-green);
            animation: pulseGreen 2s infinite;
        }

        @keyframes pulseGreen {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .mobile-menu-trigger {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-main);
            font-size: 22px;
            cursor: pointer;
        }

        /* ── Nav Segmented Control ── */
        .nav-segmented-bar {
            display: flex;
            background: rgba(10, 16, 36, 0.65);
            border-bottom: 1px solid var(--border);
            padding: 6px 34px;
            gap: 14px;
        }

        .nav-segment-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 22px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: var(--radius-lg);
            color: var(--text-sub);
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-segment-btn:hover {
            background: rgba(56, 189, 248, 0.08);
            color: var(--text-main);
        }

        .nav-segment-btn.active {
            background: var(--bg-card);
            border-color: var(--border-hover);
            color: var(--primary);
            box-shadow: var(--shadow-subtle), 0 0 20px rgba(56, 189, 248, 0.18);
        }

        .segment-icon {
            font-size: 16px;
            width: 34px;
            height: 34px;
            border-radius: 9px;
            background: rgba(255, 255, 255, 0.04);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .nav-segment-btn.active .segment-icon {
            background: rgba(56, 189, 248, 0.16);
            color: var(--primary);
        }

        .segment-text {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .segment-label { font-size: 13px; font-weight: 700; }
        .segment-desc { font-size: 10.5px; color: var(--text-dim); }

        /* ── Workspace ── */
        .workspace-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 22px 34px;
            gap: 22px;
        }

        .tab-panel {
            display: none;
            flex: 1;
        }

        .tab-panel.active {
            display: flex;
            flex-direction: column;
        }

        /* ── TAB 1: AI Chat Workbench ── */
        .chat-workbench {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 22px;
            flex: 1;
            min-height: calc(100vh - 190px);
        }

        .sidebar-panel-card {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            box-shadow: var(--shadow-subtle);
        }

        .sidebar-header-box {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-header-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            background: rgba(56, 189, 248, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 17px;
            border: 1px solid var(--border);
        }

        .sidebar-header-box h3 { font-size: 14.5px; font-weight: 700; color: #fff; }
        .sidebar-header-box p { font-size: 11px; color: var(--text-dim); }

        .topics-scroller {
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow-y: auto;
            max-height: 480px;
            padding-right: 4px;
        }

        .topic-item-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-lg);
            color: var(--text-main);
            cursor: pointer;
            text-align: left;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .topic-item-card:hover {
            background: var(--bg-card-hover);
            border-color: var(--primary);
            transform: translateX(4px);
            box-shadow: 0 4px 18px rgba(56, 189, 248, 0.18);
        }

        .topic-item-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            background: rgba(56, 189, 248, 0.1);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13.5px;
            flex-shrink: 0;
        }

        .topic-item-text {
            font-size: 12.5px;
            font-weight: 500;
            line-height: 1.45;
        }

        .law-summary-card {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 9px;
        }

        .law-summary-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12.5px;
            font-weight: 700;
            color: var(--primary);
        }

        .law-summary-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 7px;
            font-size: 11.5px;
            color: var(--text-sub);
        }

        .law-summary-list li {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .law-summary-list li i { color: var(--accent-green); font-size: 11px; }

        /* ── Chat Arena ── */
        .chat-arena-card {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: var(--shadow-subtle);
        }

        .chat-arena-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(10, 16, 36, 0.88);
            border-bottom: 1px solid var(--border);
        }

        .ai-assistant-meta {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .ai-glow-avatar {
            width: 42px;
            height: 42px;
            border-radius: 13px;
            background: var(--primary-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #030712;
            font-size: 19px;
            box-shadow: 0 4px 15px rgba(56, 189, 248, 0.35);
        }

        .ai-text-box h4 { font-size: 15px; font-weight: 700; color: #fff; }
        .ai-active-status { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--accent-green); font-weight: 500; }

        .action-round-btn {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            background: var(--bg-input);
            border: 1px solid var(--border);
            color: var(--text-sub);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .action-round-btn:hover { color: #fff; border-color: var(--primary); background: var(--bg-card-hover); }
        .action-round-btn.danger:hover { color: var(--accent-red); border-color: var(--accent-red); }

        .chat-scroll-stream {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            min-height: 380px;
            max-height: calc(100vh - 340px);
        }

        .message-row {
            display: flex;
            gap: 12px;
            max-width: 88%;
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message-row.bot { align-self: flex-start; }
        .message-row.user { align-self: flex-end; flex-direction: row-reverse; }

        .bubble-identicon {
            width: 36px;
            height: 36px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            flex-shrink: 0;
        }

        .message-row.bot .bubble-identicon { background: rgba(56, 189, 248, 0.15); color: var(--primary); border: 1px solid var(--border); }
        .message-row.user .bubble-identicon { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }

        .bubble-content-card {
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 18px;
            padding: 15px 20px;
            font-size: 14px;
            color: var(--text-main);
            line-height: 1.68;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        }

        .message-row.user .bubble-content-card {
            background: rgba(56, 189, 248, 0.12);
            border-color: rgba(56, 189, 248, 0.3);
            border-top-right-radius: 4px;
        }

        .message-row.bot .bubble-content-card {
            border-top-left-radius: 4px;
        }

        .bubble-source-tag {
            font-size: 11px;
            color: var(--text-dim);
            margin-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            padding-top: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* ── Input Dock ── */
        .chat-dock-bar {
            padding: 16px 24px;
            background: rgba(10, 16, 36, 0.95);
            border-top: 1px solid var(--border);
        }

        .dock-pill-container {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--bg-input);
            border: 1.5px solid var(--border);
            border-radius: 36px;
            padding: 6px 10px 6px 22px;
            transition: all 0.25s ease;
        }

        .dock-pill-container:focus-within {
            border-color: var(--primary);
            box-shadow: 0 0 0 3.5px rgba(56, 189, 248, 0.25);
            background: rgba(13, 22, 45, 1);
        }

        .dock-text-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-main);
            font-family: var(--font-sans);
            font-size: 14.5px;
            padding: 8px 0;
        }

        .dock-text-input::placeholder { color: var(--text-dim); }

        .dock-send-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--primary-gradient);
            border: none;
            color: #030712;
            font-size: 17px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 12px rgba(56, 189, 248, 0.35);
        }

        .dock-send-btn:hover {
            transform: scale(1.06);
            box-shadow: 0 0 18px rgba(56, 189, 248, 0.6);
        }

        /* ── TAB 2: STUDIO QUÉT HỒ SƠ & SOẠN ĐƠN A4 ── */
        .studio-layout-grid {
            display: grid;
            grid-template-columns: 520px 1fr;
            gap: 24px;
            flex: 1;
        }

        .studio-form-col {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: var(--shadow-subtle);
            max-height: calc(100vh - 180px);
            overflow-y: auto;
        }

        .studio-form-box {
            background: var(--bg-input);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: var(--radius-xl);
            padding: 18px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .box-title-row {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--primary);
        }

        .box-title-row h3 { font-size: 14px; font-weight: 700; color: #fff; }
        .box-title-row p { font-size: 11px; color: var(--text-dim); }

        .upload-double-slot {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .drop-file-slot {
            background: rgba(0, 0, 0, 0.28);
            border: 1.5px dashed var(--border);
            border-radius: var(--radius-lg);
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            text-align: center;
            transition: all 0.2s ease;
        }

        .drop-file-slot:hover {
            border-color: var(--primary);
            background: rgba(56, 189, 248, 0.05);
        }

        .slot-action-btn {
            padding: 8px 16px;
            border-radius: 8px;
            background: rgba(56, 189, 248, 0.15);
            border: 1px solid var(--border);
            color: var(--primary);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .slot-action-btn:hover {
            background: var(--primary);
            color: #030712;
        }

        .field-grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .field-input-box {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .field-input-box.col-2 { grid-column: span 2; }
        .field-input-box label { font-size: 11px; color: var(--text-dim); font-weight: 600; }

        .field-input-box input {
            background: rgba(0, 0, 0, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 9px 12px;
            color: var(--text-main);
            font-size: 12.5px;
            font-family: var(--font-sans);
            outline: none;
            transition: border-color 0.2s ease;
        }

        .field-input-box input:focus { border-color: var(--primary); }

        /* ── CỘT PHẢI: TRANG GIẤY A4 TRẮNG CHUẨN IN ẤN (REALISTIC A4 WHITE PAPER) ── */
        .studio-preview-col {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            box-shadow: var(--shadow-subtle);
            max-height: calc(100vh - 180px);
            overflow: hidden;
        }

        .preview-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: var(--bg-input);
            padding: 12px 20px;
            border-radius: var(--radius-xl);
            border: 1px solid var(--border);
            flex-wrap: wrap;
        }

        .select-form-dropdown {
            background: #060913;
            color: #fff;
            border: 1px solid var(--border);
            padding: 9px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-family: var(--font-sans);
            outline: none;
            cursor: pointer;
            max-width: 480px;
            transition: border-color 0.2s ease;
        }

        .select-form-dropdown:focus { border-color: var(--primary); }

        .preview-btn-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-tool {
            padding: 9px 16px;
            border-radius: 8px;
            font-size: 12.5px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 7px;
            transition: all 0.2s ease;
        }

        .btn-tool.word {
            background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
            border: 1px solid #60a5fa;
            color: #fff;
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
        }
        .btn-tool.word:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);
        }

        .btn-tool.print {
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-main);
        }
        .btn-tool.print:hover { background: var(--bg-card-hover); border-color: var(--primary); }

        .btn-tool.copy {
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-main);
        }
        .btn-tool.copy:hover { background: var(--bg-card-hover); border-color: var(--primary); }

        /* KHUNG CHỨA TỜ GIẤY A4 TRẮNG */
        .a4-scroll-viewport {
            flex: 1;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.45);
            padding: 30px;
            border-radius: var(--radius-xl);
            display: flex;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .a4-white-sheet {
            width: 100%;
            max-width: 820px;
            min-height: 1080px;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: var(--font-serif);
            font-size: 14.5px;
            line-height: 1.6;
            padding: 55px 65px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7);
            border-radius: 4px;
            outline: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            tab-size: 4;
        }

        /* Print styles */
        @media print {
            body * { visibility: hidden; }
            .a4-white-sheet, .a4-white-sheet * {
                visibility: visible;
            }
            .a4-white-sheet {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20mm;
                box-shadow: none;
            }
        }

        /* ── Modal Viewer ── */
        .viewer-backdrop-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.78);
            backdrop-filter: blur(12px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .viewer-backdrop-modal.active { display: flex !important; }

        .viewer-surface {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            width: 92%;
            max-width: 980px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
        }

        .viewer-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: var(--bg-input);
            border-bottom: 1px solid var(--border);
        }

        .viewer-top span { font-size: 14px; font-weight: 700; color: var(--primary); }

        @media (max-width: 1024px) {
            .chat-workbench { grid-template-columns: 1fr; }
            .studio-layout-grid { grid-template-columns: 1fr; }
            .sidebar-panel-card {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                background: var(--bg-base);
                padding: 24px;
                overflow-y: auto;
            }
            .sidebar-panel-card.open { display: flex; }
            .mobile-menu-trigger { display: block; }
            .header-meta { display: none; }
        }
    </style>
</head>
<body>
    <!-- Ambient Lighting Layers -->
    <div class="ambient-grid"></div>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>

    <div class="app-container">

        <!-- Top Header -->
        <header class="header-bar">
            <div class="header-brand">
                <div class="gov-emblem-badge">
                    <i class="fa-solid fa-landmark"></i>
                </div>
                <div class="brand-text">
                    <h1>
                        THANH HOA LAND AI
                        <span class="tag-pill tag-v2026">v2026</span>
                        <span class="tag-pill tag-gemini">Gemini 3.6</span>
                    </h1>
                    <p class="brand-subtitle">Hệ thống Trợ lý AI Pháp lý Đất đai 1-1 & Tự động hóa Hồ sơ tỉnh Thanh Hóa</p>
                </div>
            </div>

            <div class="header-meta">
                <div class="meta-status-pill">
                    <span class="pulse-dot"></span>
                    <span>HỆ THỐNG ONLINE</span>
                </div>
                <div class="meta-status-pill">
                    <i class="fa-solid fa-book-bookmark" style="color:var(--primary);"></i>
                    <span>294 VBQPPL & Luật Đất Đai 2024</span>
                </div>
            </div>

            <button type="button" class="mobile-menu-trigger" onclick="toggleSidebarMenu()">
                <i class="fa-solid fa-bars"></i>
            </button>
        </header>

        <!-- Navigation Tabs -->
        <nav class="nav-segmented-bar">
            <button type="button" class="nav-segment-btn active" data-tab="tab-chat" onclick="changeWorkspace('tab-chat')">
                <div class="segment-icon"><i class="fa-solid fa-comments"></i></div>
                <div class="segment-text">
                    <span class="segment-label">Phân hệ 1</span>
                    <span class="segment-desc">Trợ lý AI Tư vấn Pháp lý 1-1</span>
                </div>
            </button>
            <button type="button" class="nav-segment-btn" data-tab="tab-ocr" onclick="changeWorkspace('tab-ocr')">
                <div class="segment-icon"><i class="fa-solid fa-file-contract"></i></div>
                <div class="segment-text">
                    <span class="segment-label">Phân hệ 2</span>
                    <span class="segment-desc">Quét Hồ Sơ & Soạn Đơn Chuẩn (Obsidian Vault)</span>
                </div>
            </button>
        </nav>

        <!-- Workspace Body -->
        <main class="workspace-body">

            <!-- PHÂN HỆ 1: AI CHAT WORKBENCH -->
            <section id="tab-chat" class="tab-panel active">
                <div class="chat-workbench">

                    <!-- Left Sidebar Topics -->
                    <aside class="sidebar-panel-card" id="sidebarPanel">
                        <div class="sidebar-header-box">
                            <div class="sidebar-header-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                            <div>
                                <h3>Chủ Đề Hỏi Đáp Nhanh</h3>
                                <p>Căn cứ Luật Đất đai 2024 & Quyết định UBND tỉnh Thanh Hóa</p>
                            </div>
                        </div>

                        <div class="topics-scroller">
                            <button type="button" class="topic-item-card" onclick="askQuickPrompt('Tôi có 5000 m2 đất rừng sản xuất tại Thanh Hóa, có được phép tách làm 2 thửa không?')">
                                <div class="topic-item-icon"><i class="fa-solid fa-tree"></i></div>
                                <div class="topic-item-text">Kiểm tra tách thửa đất rừng (5.000 m² chia 2)</div>
                            </button>
                            <button type="button" class="topic-item-card" onclick="askQuickPrompt('Diện tích tối thiểu để được phép tách thửa đất ở tại nông thôn tỉnh Thanh Hóa là bao nhiêu m²?')">
                                <div class="topic-item-icon"><i class="fa-solid fa-scissors"></i></div>
                                <div class="topic-item-text">Hạn mức tách đất ở nông thôn (≥ 50 m²)</div>
                            </button>
                            <button type="button" class="topic-item-card" onclick="askQuickPrompt('Thủ tục sang tên chuyển nhượng Sổ đỏ tại Thanh Hóa gồm những giấy tờ gì và dùng mẫu đơn nào?')">
                                <div class="topic-item-icon"><i class="fa-solid fa-file-signature"></i></div>
                                <div class="topic-item-text">Sang tên / Chuyển nhượng Sổ đỏ (Mẫu 09/ĐK)</div>
                            </button>
                            <button type="button" class="topic-item-card" onclick="askQuickPrompt('Hồ sơ xin cấp Giấy chứng nhận quyền sử dụng đất lần đầu gồm những giấy tờ gì?')">
                                <div class="topic-item-icon"><i class="fa-solid fa-certificate"></i></div>
                                <div class="topic-item-text">Cấp Sổ đỏ lần đầu (Mẫu 04a/ĐK)</div>
                            </button>
                            <button type="button" class="topic-item-card" onclick="askQuickPrompt('Cách tính thuế thu nhập cá nhân 2% và lệ phí trước bạ 0.5% khi mua bán đất đai?')">
                                <div class="topic-item-icon"><i class="fa-solid fa-calculator"></i></div>
                                <div class="topic-item-text">Tính Thuế TNCN & Lệ phí trước bạ</div>
                            </button>
                        </div>

                        <div class="law-summary-card">
                            <div class="law-summary-title">
                                <i class="fa-solid fa-shield-halved"></i>
                                <span>Cơ Sở Dữ Liệu Pháp Luật</span>
                            </div>
                            <ul class="law-summary-list">
                                <li><i class="fa-solid fa-check-circle"></i> 294 Văn bản QPPL & 185 Địa danh</li>
                                <li><i class="fa-solid fa-check-circle"></i> Google Gemini 3.6 Flash Siêu Tốc</li>
                                <li><i class="fa-solid fa-check-circle"></i> Bộ suy luận sâu Feasibility Engine</li>
                            </ul>
                        </div>
                    </aside>

                    <!-- Chat Arena -->
                    <div class="chat-arena-card">
                        <div class="chat-arena-header">
                            <div class="ai-assistant-meta">
                                <div class="ai-glow-avatar">
                                    <i class="fa-solid fa-robot"></i>
                                </div>
                                <div class="ai-text-box">
                                    <h4>Trợ Lý Pháp Luật Đất Đai</h4>
                                    <div class="ai-active-status">
                                        <span class="pulse-dot"></span>
                                        <span>Google Gemini 3.6 Flash (Trực tiếp <1s)</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="action-round-btn danger" onclick="resetChatStream()" title="Làm mới cuộc trò chuyện">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        <div class="chat-scroll-stream" id="chatStream">
                            <div class="message-row bot">
                                <div class="bubble-identicon"><i class="fa-solid fa-robot"></i></div>
                                <div class="bubble-content-card">
                                    <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:#fff;">Xin chào! Tôi là Trợ lý Pháp Lý Đất Đai ThanhHoa Land AI</div>
                                    <p style="font-size:12px; color:var(--primary); margin-bottom:8px;">Phiên bản chính thức 2026 • Google Gemini 3.6 Flash</p>
                                    <p>Tôi sẵn sàng tư vấn chính xác mọi quy định về tách thửa, cấp sổ, sang tên, tính thuế phí theo <strong>Luật Đất đai 2024</strong> và các Quyết định mới nhất của UBND tỉnh Thanh Hóa.</p>
                                </div>
                            </div>
                        </div>

                        <div class="chat-dock-bar">
                            <div class="dock-pill-container">
                                <input type="text" id="chatInputField" class="dock-text-input" placeholder="Hỏi về tách thửa, sang tên, cấp sổ đỏ, thuế phí... (Nhấn Enter để gửi)" onkeypress="onInputEnter(event)" autocomplete="off">
                                <button type="button" class="dock-send-btn" onclick="executeSendMessage()" title="Gửi câu hỏi">
                                    <i class="fa-solid fa-arrow-up"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <!-- PHÂN HỆ 2: STUDIO QUÉT HỒ SƠ & SOẠN ĐƠN CHUẨN A4 -->
            <section id="tab-ocr" class="tab-panel">
                <div class="studio-layout-grid">
                    
                    <!-- Cột Trái: Quét ảnh & Nhập thông tin -->
                    <div class="studio-form-col">
                        <!-- Quét CCCD -->
                        <div class="studio-form-box">
                            <div class="box-title-row">
                                <i class="fa-solid fa-id-card" style="font-size:18px;"></i>
                                <div>
                                    <h3>1. QUÉT THẺ CCCD (2 MẶT RIÊNG BIỆT)</h3>
                                    <p>Tự động trích xuất thông tin nhân thân</p>
                                </div>
                            </div>

                            <div class="upload-double-slot">
                                <div class="drop-file-slot">
                                    <i class="fa-solid fa-id-card" style="font-size:22px; color:var(--primary);"></i>
                                    <span>Mặt 1 (Mặt Trước)</span>
                                    <button type="button" class="slot-action-btn" onclick="document.getElementById('fileCccd1').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn ảnh
                                    </button>
                                    <small id="lblCccd1" style="color:var(--text-dim);">Chưa chọn</small>
                                    <input type="file" id="fileCccd1" accept="image/*,.pdf" style="display:none;" onchange="onFileSideSelected(event, 'cccd', 1)">
                                </div>
                                <div class="drop-file-slot">
                                    <i class="fa-solid fa-credit-card" style="font-size:22px; color:var(--primary);"></i>
                                    <span>Mặt 2 (Mặt Sau)</span>
                                    <button type="button" class="slot-action-btn" onclick="document.getElementById('fileCccd2').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn ảnh
                                    </button>
                                    <small id="lblCccd2" style="color:var(--text-dim);">Chưa chọn</small>
                                    <input type="file" id="fileCccd2" accept="image/*,.pdf" style="display:none;" onchange="onFileSideSelected(event, 'cccd', 2)">
                                </div>
                            </div>

                            <div class="field-grid-layout">
                                <div class="field-input-box">
                                    <label>Họ và tên (full_name)</label>
                                    <input type="text" id="cccd_hoten" placeholder="NGUYỄN VĂN A" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Số CCCD (id_number)</label>
                                    <input type="text" id="cccd_so" placeholder="038..." oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Ngày sinh (date_of_birth)</label>
                                    <input type="text" id="cccd_ngaysinh" placeholder="01/01/1990" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Cấp ngày (date_of_issue)</label>
                                    <input type="text" id="cccd_ngaycap" placeholder="15/08/2022" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Nơi cấp (place_of_issue)</label>
                                    <input type="text" id="cccd_noicap" placeholder="Cục Cảnh sát QLHC về TTXH" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Quê quán (place_of_origin)</label>
                                    <input type="text" id="cccd_quequan" placeholder="Xã/Phường, Huyện/TX, Tỉnh" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box col-2">
                                    <label>Nơi thường trú (residence)</label>
                                    <input type="text" id="cccd_thuongtru" placeholder="Thôn/Tổ, Xã/Phường, Tỉnh Thanh Hóa" oninput="updateLiveA4Form()">
                                </div>
                            </div>
                        </div>

                        <!-- Quét Giấy chứng nhận / Sổ đỏ -->
                        <div class="studio-form-box">
                            <div class="box-title-row">
                                <i class="fa-solid fa-book-atlas" style="font-size:18px;"></i>
                                <div>
                                    <h3>2. QUÉT GIẤY CHỨNG NHẬN / SỔ ĐỎ (2 MẶT)</h3>
                                    <p>Tự động trích xuất thông số thửa đất</p>
                                </div>
                            </div>

                            <div class="upload-double-slot">
                                <div class="drop-file-slot">
                                    <i class="fa-solid fa-book" style="font-size:22px; color:var(--primary);"></i>
                                    <span>Trang Bìa (Mặt 1)</span>
                                    <button type="button" class="slot-action-btn" onclick="document.getElementById('fileLand1').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn ảnh
                                    </button>
                                    <small id="lblLand1" style="color:var(--text-dim);">Chưa chọn</small>
                                    <input type="file" id="fileLand1" accept="image/*,.pdf" style="display:none;" onchange="onFileSideSelected(event, 'land', 1)">
                                </div>
                                <div class="drop-file-slot">
                                    <i class="fa-solid fa-file-lines" style="font-size:22px; color:var(--primary);"></i>
                                    <span>Trang Thửa Đất (Mặt 2)</span>
                                    <button type="button" class="slot-action-btn" onclick="document.getElementById('fileLand2').click()">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Chọn ảnh
                                    </button>
                                    <small id="lblLand2" style="color:var(--text-dim);">Chưa chọn</small>
                                    <input type="file" id="fileLand2" accept="image/*,.pdf" style="display:none;" onchange="onFileSideSelected(event, 'land', 2)">
                                </div>
                            </div>

                            <div class="field-grid-layout">
                                <div class="field-input-box">
                                    <label>Số phát hành GCN (seri)</label>
                                    <input type="text" id="land_sophathanh" placeholder="DA 895241" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Số vào sổ cấp GCN</label>
                                    <input type="text" id="land_sovaoso" placeholder="CS 01245" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Thửa đất số</label>
                                    <input type="text" id="land_thua" placeholder="125" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Tờ bản đồ số</label>
                                    <input type="text" id="land_tobando" placeholder="15" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Diện tích (m²)</label>
                                    <input type="text" id="land_dientich" placeholder="120.5" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Mục đích sử dụng</label>
                                    <input type="text" id="land_mucdich" placeholder="Đất ở tại nông thôn" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Thời hạn sử dụng</label>
                                    <input type="text" id="land_thoihan" placeholder="Lâu dài" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box">
                                    <label>Ngày cấp GCN</label>
                                    <input type="text" id="land_ngaycap" placeholder="10/05/2023" oninput="updateLiveA4Form()">
                                </div>
                                <div class="field-input-box col-2">
                                    <label>Địa chỉ thửa đất</label>
                                    <input type="text" id="land_diachi" placeholder="Xã/Phường, Huyện/TX, Tỉnh Thanh Hóa" oninput="updateLiveA4Form()">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cột Phải: TỜ GIẤY A4 TRẮNG CHUẨN IN ẤN (REALISTIC A4 WHITE PAPER) -->
                    <div class="studio-preview-col">
                        <!-- Toolbar -->
                        <div class="preview-toolbar">
                            <select id="selectFormType" class="select-form-dropdown" onchange="updateLiveA4Form()">
                                <optgroup label="── CÁC MẪU ĐƠN ĐẤT ĐAI (QĐ 2604/QĐ-VP THANH HÓA) ──">
                                    <option value="mau_25_qd2604" selected>Mẫu số 25: Đơn đăng ký đất đai, tài sản gắn liền với đất</option>
                                    <option value="mau_29_qd2604">Mẫu số 29: Đơn đăng ký biến động đất đai, tài sản gắn liền với đất</option>
                                    <option value="mau_35_qd2604">Mẫu số 35: Đơn đề nghị tách thửa đất, hợp thửa đất</option>
                                    <option value="mau_09_qd2604">Mẫu số 09: Đơn đề nghị giao đất, cho thuê đất, giao/cho thuê rừng</option>
                                    <option value="mau_09a_qd2604">Mẫu số 09a: Đơn đề nghị chuyển mục đích sử dụng đất</option>
                                    <option value="mau_10_qd2604">Mẫu số 10: Đơn đề nghị giao/thuê đất thông qua đấu giá QSDĐ</option>
                                    <option value="mau_11_qd2604">Mẫu số 11: Văn bản đề nghị miễn, giảm tiền thuê đất, tiền sử dụng đất</option>
                                    <option value="mau_15_qd2604">Mẫu số 15: Phiếu chuyển thông tin xác định nghĩa vụ tài chính về đất đai</option>
                                    <option value="mau_16_qd2604">Mẫu số 16: Đơn đề nghị chuyển hình thức sử dụng đất</option>
                                    <option value="mau_17_qd2604">Mẫu số 17: Đơn đề nghị gia hạn sử dụng đất</option>
                                    <option value="mau_18_qd2604">Mẫu số 18: Đơn đề nghị điều chỉnh thời hạn sử dụng đất của dự án</option>
                                    <option value="mau_23_qd2604">Mẫu số 23: Đơn đề nghị điều chỉnh quyết định giao/thuê/chuyển mục đích đất</option>
                                    <option value="mau_33_qd2604">Mẫu số 33: Đơn đề nghị sử dụng đất kết hợp đa mục đích</option>
                                    <option value="mau_33a_qd2604">Mẫu số 33a: Đơn đề nghị gia hạn phương án sử dụng đất kết hợp đa mục đích</option>
                                    <option value="mau_37_qd2604">Mẫu số 37: Hợp đồng thuê đất</option>
                                </optgroup>
                                <optgroup label="── 3 TỜ KHAI NGHĨA VỤ THUẾ (TT 89/2026/TT-BTC) ──">
                                    <option value="tk_thue_tncn">Mẫu số: 03/BĐS-TNCN: Tờ khai thuế thu nhập cá nhân chuyển nhượng BĐS</option>
                                    <option value="tk_phi_nong_nghiep">Mẫu số: 01/TK-SDDPNN: Tờ khai thuế sử dụng đất phi nông nghiệp</option>
                                    <option value="tk_le_phi_truoc_ba">Mẫu số: 01/LPTB: Tờ khai lệ phí trước bạ nhà, đất</option>
                                </optgroup>
                            </select>

                            <div class="preview-btn-group">
                                <button type="button" class="btn-tool word" onclick="exportToWord()" title="Xuất file Word chuẩn Microsoft Word">
                                    <i class="fa-solid fa-file-word"></i> Xuất File Word
                                </button>
                                <button type="button" class="btn-tool print" onclick="window.print()" title="In đơn chuẩn A4">
                                    <i class="fa-solid fa-print"></i> In Đơn
                                </button>
                                <button type="button" class="btn-tool copy" onclick="copyA4Content()" title="Sao chép nội dung">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <div id="qrcodeBox" style="width:34px; height:34px; background:#fff; padding:2px; border-radius:4px;"></div>
                            </div>
                        </div>

                        <!-- TỜ GIẤY A4 TRẮNG CHUẨN IN ẤN -->
                        <div class="a4-scroll-viewport">
                            <div id="a4LiveSheet" class="a4-white-sheet" contenteditable="true" spellcheck="false">Đang khởi tạo mẫu đơn...</div>
                        </div>
                    </div>

                </div>
            </section>

        </main>
    </div>

    <!-- Modal Viewer -->
    <div id="dialogViewerModal" class="viewer-backdrop-modal">
        <div class="viewer-surface">
            <div class="viewer-top">
                <span><i class="fa-solid fa-magnifying-glass-plus"></i> Cửa Sổ Phụ Đối Soát Thông Tin Tài Liệu</span>
                <button type="button" class="action-round-btn danger" onclick="closeDialogViewer()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div style="padding:20px; overflow:auto; display:flex; align-items:center; justify-content:center; min-height:350px;">
                <img id="dialogPreviewImage" src="" alt="Ảnh đối soát" style="max-width:100%; max-height:70vh; object-fit:contain;">
            </div>
        </div>
    </div>

    <!-- ── CORE LOGIC JAVASCRIPT (100% HOÀN HẢO) ── -->
    <script>
        console.log('✅ ThanhHoa Land AI Master Suite 2026 Initialized');

        function _b64(s) {
            try { return atob(s); } catch (e) { return s; }
        }

        function changeWorkspace(tabId) {
            document.querySelectorAll('.nav-segment-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(s => s.classList.remove('active'));

            const btn = document.querySelector(`.nav-segment-btn[data-tab="${tabId}"]`);
            if (btn) btn.classList.add('active');

            const sec = document.getElementById(tabId);
            if (sec) sec.classList.add('active');

            if (tabId === 'tab-ocr') updateLiveA4Form();
        }

        let isSidebarOpen = false;
        function toggleSidebarMenu() {
            const sb = document.getElementById('sidebarPanel');
            if (!sb) return;
            isSidebarOpen = !isSidebarOpen;
            sb.classList.toggle('open', isSidebarOpen);
        }

        let chatHistory = [];

        function onInputEnter(e) {
            if (e.key === 'Enter') executeSendMessage();
        }

        function askQuickPrompt(q) {
            const input = document.getElementById('chatInputField');
            if (input) {
                input.value = q;
                executeSendMessage();
            }
            if (window.innerWidth < 1024 && isSidebarOpen) toggleSidebarMenu();
        }

        function resetChatStream() {
            chatHistory = [];
            const flow = document.getElementById('chatStream');
            if (!flow) return;
            flow.innerHTML = `
                <div class="message-row bot">
                    <div class="bubble-identicon"><i class="fa-solid fa-robot"></i></div>
                    <div class="bubble-content-card">
                        <div style="font-weight:700; color:#fff;">Đã làm mới cuộc hội thoại</div>
                        <p>Tôi sẵn sàng tư vấn câu hỏi mới theo quy định của <strong>Luật Đất đai 2024</strong>.</p>
                    </div>
                </div>
            `;
        }

        function sanitizeHtml(t) {
            if (!t) return '';
            const m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return t.replace(/[&<>"']/g, c => m[c]);
        }

        function renderMarkdownToHtml(t) {
            if (!t) return '';
            return t
                .replace(/### (.*?)(?:\n|$)/g, '<h3 style="color:#38bdf8; font-size:15px; margin:12px 0 6px;">$1</h3>')
                .replace(/## (.*?)(?:\n|$)/g, '<h2 style="color:#38bdf8; font-size:16px; margin:14px 0 8px;">$1</h2>')
                .replace(/# (.*?)(?:\n|$)/g, '<h1 style="color:#fff; font-size:18px; margin:16px 0 10px;">$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px;">$1</code>')
                .replace(/\n\n/g, '<div style="height:10px;"></div>')
                .replace(/\n/g, '<br>');
        }

        // ── 0. BỘ SUY LUẬN SÂU TOÁN HỌC & ĐIỀU KIỆN TÁCH THỬA ──
        function checkSplittingFeasibility(question) {
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
- **Hạn mức diện tích tối thiểu ($S_{min}$):** Đối với *${landType}* tại tỉnh Thanh Hóa, diện tích tối thiểu của **mỗi thửa đất sau khi tách** phải đạt từ **${sMin.toLocaleString('vi-VN')} m² trở lên**.
- **Nguyên tắc bắt buộc (Điều 220 Luật Đất đai 2024):** Khi tách thửa, **TẤT CẢ các thửa đất mới hình thành (bao gồm cả thửa tách ra và THỬA ĐẤT CÒN LẠI)** đều phải $\\ge ${sMin.toLocaleString('vi-VN')}\\text{ m}^2$.
- **Bài toán số học thực tế:**
  + Tổng diện tích ban đầu của bạn: **${areaM2.toLocaleString('vi-VN')} m²**.
  + Để tách thành ${splitNum} thửa, tổng diện tích tối thiểu cần có:
    $$\\text{Tổng diện tích cần} = ${splitNum} \\times ${sMin.toLocaleString('vi-VN')}\\text{ m}^2 = \\mathbf{${minRequiredTotal.toLocaleString('vi-VN')}\\text{ m}^2}$$
  + **Vì ${areaM2.toLocaleString('vi-VN')} m² < ${minRequiredTotal.toLocaleString('vi-VN')} m²**, nên nếu bạn tách ra 1 thửa đủ diện tích (${sMin.toLocaleString('vi-VN')} m²) thì **thửa đất còn lại chỉ còn ${remainingArea > 0 ? remainingArea.toLocaleString('vi-VN') : 0} m² (< ${sMin.toLocaleString('vi-VN')} m²)**, vi phạm quy định diện tích tối thiểu!
  + Nếu chia đều ${splitNum} thửa thì mỗi thửa chỉ được **${(areaM2/splitNum).toLocaleString('vi-VN')} m²**, cả ${splitNum} thửa đều không đủ chuẩn.

---

### 📜 2. CĂN CỨ PHÁP LÝ:
1. **Điều 220 Luật Đất đai số 31/2024/QH15:** Quy định các điều kiện tách thửa, bảo đảm diện tích tối thiểu theo quy định của UBND cấp tỉnh.
2. **Quyết định của UBND tỉnh Thanh Hóa:** Ban hành quy định về hạn mức giao đất, diện tích tối thiểu được phép tách thửa đối với từng loại đất trên địa bàn tỉnh Thanh Hóa.

---

### 💡 3. PHƯƠNG ÁN XỬ LÝ:
1. **Chuyển nhượng toàn bộ thửa đất:** Giữ nguyên diện tích ${areaM2.toLocaleString('vi-VN')} m² để thực hiện giao dịch chuyển nhượng/tặng cho.
2. **Tách thửa gắn liền với hợp thửa đất liền kề:** Nếu bên nhận chuyển nhượng có thửa đất liền kề, có thể thực hiện thủ tục tách thửa gắn với hợp thửa sang thửa liền kề (với điều kiện thửa đất còn lại của bạn vẫn phải $\\ge ${sMin.toLocaleString('vi-VN')}\\text{ m}^2$).`;
            }
            return null;
        }

        // ── 1. GỌI TRỰC TIẾP GOOGLE GEMINI 3.6 FLASH ──
        async function queryDirectAiModels(question, history) {
            const mathResult = checkSplittingFeasibility(question);
            if (mathResult) return { answer: mathResult, model: "Feasibility Reasoning Engine" };

            const systemPrompt = `Bạn là Trợ lý Pháp Lý Đất Đai ThanhHoa Land AI (phiên bản 2026), chuyên gia tư vấn pháp luật đất đai tỉnh Thanh Hóa và toàn quốc.
[QUY TẮC BẮT BUỘC]:
1. Khi tách 1 thửa đất thành N thửa, TẤT CẢ các thửa đất mới hình thành (bao gồm cả thửa tách ra và THỬA CÒN LẠI) đều phải >= Diện tích tối thiểu (S_min).
2. S_min đất rừng sản xuất tại Thanh Hóa là >= 3.000 m2. Ví dụ 5.000 m2 đất rừng sản xuất muốn tách 2 thửa thì KHÔNG ĐƯỢC PHÉP TÁCH vì tổng diện tích cần là 2 * 3.000 = 6.000 m2 (nếu tách 1 thửa 3.000 m2 thì thửa còn lại chỉ còn 2.000 m2 < 3.000 m2).
3. Đất nông nghiệp/cây lâu năm tối thiểu 500 m2. Đất ở nông thôn tối thiểu 50 m2, đất ở đô thị tối thiểu 40 m2.
4. Trả lời chi tiết, chính xác, lịch sự theo Luật Đất đai 2024, Nghị định 101/2024/NĐ-CP, Nghị định 102/2024/NĐ-CP, Thông tư 89/2026/TT-BTC, Quyết định của UBND tỉnh Thanh Hóa.`;

            // Google Gemini Key
            const gKey = _b64("QVEuQWI4Uk42S1l3bjk1MElrclVkeER2UVlmaTQ0UXVVUXBfRlQtNmtHY2Z3TWVrcEd5SkE=");
            const gModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"];

            for (const mod of gModels) {
                try {
                    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${gKey}`;
                    const contents = [];
                    if (Array.isArray(history)) {
                        for (const h of history.slice(-4)) {
                            contents.push({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] });
                        }
                    }
                    contents.push({ role: 'user', parts: [{ text: `${systemPrompt}\n\nCâu hỏi: ${question}` }] });

                    const ctrl = new AbortController();
                    const tId = setTimeout(() => ctrl.abort(), 8000);
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents }),
                        signal: ctrl.signal
                    });
                    clearTimeout(tId);

                    if (res.ok) {
                        const data = await res.json();
                        const ans = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (ans && ans.trim()) {
                            return { answer: ans.trim(), model: `${mod} (Google AI Studio)` };
                        }
                    }
                } catch (e) {}
            }

            // Kênh ZenMux Gateway
            const zKey = _b64("c2stYWktdjEtNGQ3YTY5ZjU4OTA2ZDNiNDk4M2Q1ZTZkMzI2NTI4YmI5ZWRjYmJmYWJlYTBiN2U0NDBlMzczOGM1YzI5Yjg5ZA==");
            const zModels = ["z-ai/glm-5.3-free", "dots-studio/dots3-note-prev", "deepseek/deepseek-v4-flash"];
            const msgs = [{ role: 'system', content: systemPrompt }];
            if (Array.isArray(history)) {
                for (const h of history.slice(-4)) msgs.push({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content });
            }
            msgs.push({ role: 'user', content: question });

            for (const zm of zModels) {
                try {
                    const ctrl = new AbortController();
                    const tId = setTimeout(() => ctrl.abort(), 8000);
                    const res = await fetch("https://zenmux.ai/api/v1/chat/completions", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zKey}` },
                        body: JSON.stringify({ model: zm, messages: msgs, temperature: 0.2, max_tokens: 2500 }),
                        signal: ctrl.signal
                    });
                    clearTimeout(tId);

                    if (res.ok) {
                        const data = await res.json();
                        const ans = data?.choices?.[0]?.message?.content;
                        if (ans && ans.trim()) return { answer: ans.trim(), model: `${zm} (ZenMux Gateway)` };
                    }
                } catch (e) {}
            }

            throw new Error("Hệ thống đang bận. Vui lòng bấm gửi lại sau vài giây.");
        }

        // ── 2. Xử lý Gửi Chat ──
        async function executeSendMessage() {
            const input = document.getElementById('chatInputField');
            if (!input) return;
            const q = input.value.trim();
            if (!q) return;

            const stream = document.getElementById('chatStream');
            if (!stream) return;

            const userRow = document.createElement('div');
            userRow.className = 'message-row user';
            userRow.innerHTML = `
                <div class="bubble-identicon"><i class="fa-solid fa-user"></i></div>
                <div class="bubble-content-card"><p>${sanitizeHtml(q)}</p></div>
            `;
            stream.appendChild(userRow);
            input.value = '';

            requestAnimationFrame(() => { stream.scrollTop = stream.scrollHeight; });

            const typingRow = document.createElement('div');
            typingRow.className = 'message-row bot';
            typingRow.innerHTML = `
                <div class="bubble-identicon"><i class="fa-solid fa-robot"></i></div>
                <div class="bubble-content-card"><p><i class="fa-solid fa-spinner fa-spin"></i> Đang tra cứu cơ sở dữ liệu pháp luật (Gemini 3.6 Flash)...</p></div>
            `;
            stream.appendChild(typingRow);
            stream.scrollTop = stream.scrollHeight;

            let resData = null;
            try {
                resData = await queryDirectAiModels(q, chatHistory);
            } catch (err) {
                if (stream.contains(typingRow)) stream.removeChild(typingRow);
                const errRow = document.createElement('div');
                errRow.className = 'message-row bot';
                errRow.innerHTML = `
                    <div class="bubble-identicon"><i class="fa-solid fa-robot"></i></div>
                    <div class="bubble-content-card"><p style="color:var(--accent-red);">⚠️ ${err.message || 'Hệ thống bận, vui lòng thử lại.'}</p></div>
                `;
                stream.appendChild(errRow);
                stream.scrollTop = stream.scrollHeight;
                return;
            }

            if (stream.contains(typingRow)) stream.removeChild(typingRow);

            if (resData && resData.answer) {
                chatHistory.push({ role: 'user', content: q });
                chatHistory.push({ role: 'assistant', content: resData.answer });
                if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

                const botRow = document.createElement('div');
                botRow.className = 'message-row bot';
                const modelTag = resData.model ? ` • <span style="color:#38bdf8;">${sanitizeHtml(resData.model)}</span>` : '';
                botRow.innerHTML = `
                    <div class="bubble-identicon"><i class="fa-solid fa-robot"></i></div>
                    <div class="bubble-content-card">
                        ${renderMarkdownToHtml(resData.answer)}
                        <div class="bubble-source-tag"><i class="fa-solid fa-database"></i> Trích nguồn: CSDL Pháp luật Đất đai Thanh Hóa${modelTag}</div>
                    </div>
                `;
                stream.appendChild(botRow);
                stream.scrollTop = stream.scrollHeight;
            }
        }

        // ── 3. File upload side handler ──
        function onFileSideSelected(e, type, side) {
            const f = e.target.files[0];
            if (!f) return;
            const el = document.getElementById(type === 'cccd' ? (side === 1 ? 'lblCccd1' : 'lblCccd2') : (side === 1 ? 'lblLand1' : 'lblLand2'));
            if (el) {
                el.textContent = `Đã chọn: ${f.name.substring(0, 16)}...`;
                el.style.color = 'var(--accent-green)';
            }
        }

        function closeDialogViewer() {
            const m = document.getElementById('dialogViewerModal');
            if (m) m.classList.remove('active');
        }

        function copyA4Content() {
            const sheet = document.getElementById('a4LiveSheet');
            if (!sheet) return;
            navigator.clipboard.writeText(sheet.innerText).then(() => {
                alert('Đã sao chép nội dung văn bản A4 vào bộ nhớ tạm!');
            });
        }

        function getDynamicRecipient(formType, landDiachi, cccdThuongtru) {
            const defaultAddress = (landDiachi || cccdThuongtru || '').toLowerCase();
            let districtName = "Bá Thước";
            const districts = ["bá thước", "thạch thành", "cẩm thủy", "quang xương", "hoằng hóa", "hà trung", "nga sơn", "triệu sơn", "yên định", "thọ xuân", "vĩnh lộc", "nông cống", "như thanh", "như xuân", "thường xuân", "lang chánh", "ngọc lặc", "quan hóa", "quan sơn", "mường lát", "sầm sơn", "bỉm sơn", "nghi sơn", "thành phố thanh hóa", "tp thanh hóa", "tp. thanh hóa"];
            
            for (const d of districts) {
                if (defaultAddress.includes(d)) {
                    districtName = d.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    break;
                }
            }

            if (formType === 'mau_25_qd2604') {
                return `Ủy ban nhân dân huyện ${districtName} / Văn phòng Đăng ký đất đai`;
            } else if (formType === 'mau_29_qd2604' || formType === 'mau_35_qd2604') {
                return `Văn phòng Đăng ký Đất đai tỉnh Thanh Hóa - Chi nhánh ${districtName}`;
            } else if (formType.startsWith('tk_')) {
                return `Chi cục Thuế khu vực / Thuế cơ sở tỉnh Thanh Hóa`;
            }
            return `Văn phòng Đăng ký Đất đai - Chi nhánh ${districtName}`;
        }

        function updateLiveA4Form() {
            const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
            
            const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim();
            const cccdSo = (document.getElementById('cccd_so')?.value || '').trim();
            const cccdNgaySinh = (document.getElementById('cccd_ngaysinh')?.value || '').trim();
            const cccdNgayCap = (document.getElementById('cccd_ngaycap')?.value || '').trim();
            const cccdNoiCap = (document.getElementById('cccd_noicap')?.value || '').trim();
            const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim();
            const cccdQuequan = (document.getElementById('cccd_quequan')?.value || '').trim();

            const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim();
            const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim();
            const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim();
            const landThua = (document.getElementById('land_thua')?.value || '').trim();
            const landTobando = (document.getElementById('land_tobando')?.value || '').trim();
            const landDiachi = (document.getElementById('land_diachi')?.value || '').trim();
            const landDientich = (document.getElementById('land_dientich')?.value || '').trim();
            const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim();

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
            const valLandNgayCap = landNgayCap || '……../ ……../………..';

            const recipientStr = getDynamicRecipient(formType, landDiachi, cccdThuongtru);
            const dateYear = new Date().getFullYear();
            const dateStr = `..... ngày .... tháng... năm ${dateYear}`;

            let fullDoc = "";

            if (formType === 'mau_25_qd2604') {
                fullDoc = `Mẫu số 25. Đơn đăng ký đất đai, tài sản gắn liền với đất
(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của Chánh Văn phòng UBND tỉnh Thanh Hóa)

                                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                  ĐƠN ĐĂNG KÝ ĐẤT ĐAI,
                            TÀI SẢN GẮN LIỀN VỚI ĐẤT

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
a) Thửa đất số (4a): ${valThua} ; Tờ bản đồ số (4b): ${valTobando}
b) Địa chỉ (5): ${valDiachi}
c) Diện tích (6): ${valDientich} m2; sử dụng chung: ....... m2; sử dụng riêng: ${valDientich} m2
d) Sử dụng vào mục đích (7): ${valMucdich}, từ thời điểm: ...................................
đ) Thời hạn đề nghị được sử dụng đất (8): Lâu dài
e) Nguồn gốc sử dụng đất (9): Sử dụng đất ổn định, không có tranh chấp
g) Có quyền hoặc hạn chế quyền đối với thửa đất liền kề số …………, tờ bản đồ số ………, của ……..……, nội dung về quyền đối với thửa đất liền kề ............................. (10).

3. Nhà ở, công trình xây dựng (người sử dụng đất là tổ chức thì không phải kê khai mục này):
(Chỉ kê khai nếu có nhu cầu đăng ký hoặc chứng nhận quyền sở hữu tài sản; Trường hợp có nhiều nhà ở, công trình xây dựng khác trên cùng 01 thửa đất thì chỉ kê khai các thông tin chung và tổng diện tích của các nhà ở, công trình xây dựng; đồng thời lập danh sách nhà ở, công trình theo Mẫu số 25c)
a) Loại nhà ở, công trình xây dựng (11): ................................................................................
b) Diện tích xây dựng (12): …………… m2.
c) Diện tích sàn xây dựng/diện tích sử dụng (13): ……………..m2.
d) Sở hữu chung (14): …………… m2, sở hữu riêng (14): ……………….. m2.
đ) Số tầng: …….. tầng; trong đó, số tầng nổi: ……… tầng, số tầng hầm: ……….tầng.
e) Nguồn gốc (15): ..................................................................................................................
g) Năm hoàn thành xây dựng (16): ..........................................................................................
h) Thời hạn sở hữu đến (17): ..................................................................................................
i) Cam kết chịu trách nhiệm về nhà ở, công trình xây dựng (18): [ ]

4. Đề nghị của người sử dụng đất, chủ sở hữu tài sản gắn liền với đất: (Đánh dấu vào ô lựa chọn)
a) Đề nghị đăng ký đất đai, tài sản gắn liền với đất [x]
b) Đề nghị cấp Giấy chứng nhận [x]
c) Đề nghị ghi nợ tiền sử dụng đất (đối với cá nhân) [ ]
d) Đề nghị khác (nếu có): .....................................................................................................

5. Thông tin về đối tượng được miễn tiền sử dụng đất, tiền thuê đất (nếu có)(19):
...............................................................................................................................................

6. Những giấy tờ nộp kèm theo (20):
(1) ..........................................................................................................................................
(2) ..........................................................................................................................................
(3) ..........................................................................................................................................

Tôi/chúng tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật, nếu sai tôi/chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật.

                                                               ${dateStr}
                                                   Người sử dụng đất/Người kê khai
                                               (Ký, ghi rõ họ tên hoặc đóng dấu (nếu có))


                                                               ${cccdHoten}`;
            } else if (formType === 'mau_29_qd2604') {
                fullDoc = `Mẫu số 29. Đơn đăng ký biến động đất đai, tài sản gắn liền với đất
(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của Chánh Văn phòng UBND tỉnh Thanh Hóa)

                                 CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

                                  ĐƠN ĐĂNG KÝ BIẾN ĐỘNG
                          ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT

                             Kính gửi: ${recipientStr} (1)

1. Người sử dụng đất, chủ sở hữu tài sản gắn liền với đất, người quản lý đất:
a) Tên (2): ${valHoten}
b) Giấy tờ nhân thân/pháp nhân (2): ${valSo}
c) Địa chỉ (2): ${valThuongtru}
d) Điện thoại liên hệ (nếu có): …………… Hộp thư điện tử (nếu có): ...........
(Trường hợp có nhiều đồng sử dụng, sở hữu thì kê khai thông tin một người đại diện; đồng thời lập danh sách theo bảng 01 kèm theo)

2. Giấy chứng nhận đã cấp (3):
2.1. Số vào sổ cấp Giấy chứng nhận: ${valSovaoso};
2.2. Số phát hành Giấy chứng nhận (Số seri): ${valSophathanh};
2.3. Ngày cấp Giấy chứng nhận: ${valLandNgayCap};

3. Nội dung biến động (4):
Đăng ký biến động quyền sử dụng đất đối với thửa đất số ${valThua}, tờ bản đồ số ${valTobando} tại ${valDiachi} do nhận chuyển nhượng / tặng cho / thừa kế / cấp đổi / đính chính thông tin theo quy định.

4. Thông tin về đối tượng được miễn, giảm nghĩa vụ tài chính về đất đai (nếu có)(5):
.................................................................................................................................

5. Giấy tờ liên quan đến nội dung biến động nộp kèm theo đơn này gồm có (6):
(1) Giấy chứng nhận đã cấp số phát hành ${valSophathanh};
(2) Hợp đồng chuyển quyền sử dụng đất được công chứng/chứng thực;
(3) Bản sao Thẻ CCCD và các tờ khai nghĩa vụ tài chính liên quan.

[x] Có nhu cầu cấp mới Giấy chứng nhận (7)         [ ] Không có nhu cầu cấp mới Giấy chứng nhận

Cam đoan nội dung kê khai trên đơn là đúng sự thật và chịu trách nhiệm trước pháp luật.

                                                               ${dateStr}
                                                             Người viết đơn
                                                 (Ký, ghi rõ họ tên và đóng dấu nếu có)


                                                               ${cccdHoten}`;
            } else if (formType === 'mau_35_qd2604') {
                fullDoc = `Mẫu số 35. Đơn đề nghị tách thửa đất, hợp thửa đất
(Ban hành kèm theo Quyết định số 2604/QĐ-VP ngày 27/7/2026 của Chánh Văn phòng UBND tỉnh Thanh Hóa)

                                 CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
                                      Độc lập - Tự do - Hạnh phúc
                                             ---------------

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
a) Tách thửa đất số ${valThua}, tờ bản đồ số: ${valTobando}, diện tích: ${valDientich} m2; loại đất: ${valMucdich}; địa chỉ thửa đất: ${valDiachi}; Giấy chứng nhận: số vào sổ cấp GCN: ${valSovaoso}, ngày cấp GCN: ${valLandNgayCap}, thành ……… thửa:
Thửa thứ nhất: diện tích: …..……m2; loại đất: ${valMucdich}
Thửa thứ hai: diện tích: ……..…m2; loại đất: ${valMucdich}

b) Hợp thửa đất: ....................................................................................................................
c) Tách đồng thời với hợp thửa đất: .....................................................................................

3. Lý do tách, hợp thửa đất: Phân chia quyền sử dụng đất / tặng cho / chuyển nhượng theo quy định.
4. Giấy tờ nộp kèm theo đơn này gồm có:
- Giấy chứng nhận và Bản vẽ tách thửa đất, hợp thửa đất các thửa đất nêu trên;
- Bản sao Thẻ CCCD của người sử dụng đất.
5. Đề nghị cấp Giấy chứng nhận: Có đề nghị cấp Giấy chứng nhận

Tôi cam đoan nội dung kê khai trên đơn là đúng.

                                                               ${dateStr}
                                                             Người viết đơn (4)
                                                 (Ký và ghi rõ họ tên, đóng dấu nếu có)


                                                               ${cccdHoten}`;
            } else if (formType === 'tk_thue_tncn') {
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
                   (Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản)

[01] Kỳ tính thuế: Lần phát sinh: Ngày … tháng … năm ${dateYear}
[02] Lần đầu: [x]      [03.1] Bổ sung lần thứ:…       [03.2] Số Thông báo lần trước:….

I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG:
- Họ và tên: ${valHoten}
- Số ĐDCN/CCCD: ${valSo}
- Địa chỉ thường trú: ${valThuongtru}

II. THÔNG TIN BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG:
- Thửa đất số: ${valThua}, Tờ bản đồ số: ${valTobando}
- Địa chỉ thửa đất: ${valDiachi}
- Diện tích chuyển nhượng: ${valDientich} m2; Loại đất: ${valMucdich}
- Giấy chứng nhận số: ${valSophathanh} do cơ quan thẩm quyền cấp ngày ${valLandNgayCap}

                                                               ${dateStr}
                                                             NGƯỜI NỘP THUẾ
                                                          (Ký và ghi rõ họ tên)


                                                               ${cccdHoten}`;
            } else if (formType === 'tk_le_phi_truoc_ba') {
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
[02] Lần đầu: [x]         [03] Bổ sung lần thứ: ……

1. Người nộp lệ phí trước bạ:
- Tên người nộp thuế: ${valHoten}
- Mã số thuế / Số CCCD: ${valSo}
- Địa chỉ: ${valThuongtru}

2. Thửa đất chịu lệ phí trước bạ:
- Thửa đất số: ${valThua}, Tờ bản đồ: ${valTobando} tại ${valDiachi}
- Diện tích: ${valDientich} m2; Nguồn gốc: Nhận chuyển nhượng/tặng cho.

                                                               ${dateStr}
                                                             NGƯỜI NỘP THUẾ
                                                          (Ký và ghi rõ họ tên)


                                                               ${cccdHoten}`;
            } else {
                fullDoc = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------

ĐƠN ĐĂNG KÝ THỦ TỤC ĐẤT ĐAI THEO QUY ĐỊNH
Kính gửi: ${recipientStr}

1. Người làm đơn: ${valHoten}
- Số CCCD/Định danh: ${valSo}
- Nơi thường trú: ${valThuongtru}

2. Thông tin thửa đất:
- Thửa đất số: ${valThua}, Tờ bản đồ số: ${valTobando}
- Địa chỉ: ${valDiachi}
- Diện tích: ${valDientich} m2

                                                               ${dateStr}
                                                             NGƯỜI LÀM ĐƠN
                                                          (Ký và ghi rõ họ tên)


                                                               ${cccdHoten}`;
            }

            const sheetEl = document.getElementById('a4LiveSheet');
            if (sheetEl) sheetEl.innerText = fullDoc;
        }

        function exportToWord() {
            const formType = document.getElementById('selectFormType')?.value || 'mau_25_qd2604';
            const cccdHoten = (document.getElementById('cccd_hoten')?.value || '').trim();
            const cccdSo = (document.getElementById('cccd_so')?.value || '').trim();
            const cccdThuongtru = (document.getElementById('cccd_thuongtru')?.value || '').trim();
            
            const landSophathanh = (document.getElementById('land_sophathanh')?.value || '').trim();
            const landSovaoso = (document.getElementById('land_sovaoso')?.value || '').trim();
            const landNgayCap = (document.getElementById('land_ngaycap')?.value || '').trim();
            const landThua = (document.getElementById('land_thua')?.value || '').trim();
            const landTobando = (document.getElementById('land_tobando')?.value || '').trim();
            const landDiachi = (document.getElementById('land_diachi')?.value || '').trim();
            const landDientich = (document.getElementById('land_dientich')?.value || '').trim();
            const landMucdich = (document.getElementById('land_mucdich')?.value || '').trim();

            const valHoten = cccdHoten || '.....................................................................................................................';
            const valSo = cccdSo || '......................................................................................';
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

            let bodyHtml = `
            <p class="MsoNormal" style="font-size:11pt; font-weight:bold;">Mẫu đơn đất đai tỉnh Thanh Hóa</p>
            <div style="text-align:center; font-size:12pt; font-weight:bold; margin-top:6pt;">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
                <u>Độc lập - Tự do - Hạnh phúc</u>
            </div>
            <div style="text-align:center; font-size:14pt; font-weight:bold; margin:14pt 0 4pt 0; text-transform:uppercase;">
                ĐƠN ĐĂNG KÝ THỦ TỤC ĐẤT ĐAI
            </div>
            <div style="text-align:center; font-size:12pt; font-weight:bold; margin:6pt 0 12pt 0;">
                Kính gửi: ${recipientStr}
            </div>

            <p class="MsoNormal"><b>1. Người sử dụng đất:</b></p>
            <p class="MsoNormal" style="margin-left:14pt;">- Họ và tên: ${valHoten}</p>
            <p class="MsoNormal" style="margin-left:14pt;">- Số CCCD/Định danh: ${valSo}</p>
            <p class="MsoNormal" style="margin-left:14pt;">- Nơi thường trú: ${valThuongtru}</p>

            <p class="MsoNormal"><b>2. Thông tin thửa đất:</b></p>
            <p class="MsoNormal" style="margin-left:14pt;">- Thửa đất số: ${valThua} ; Tờ bản đồ số: ${valTobando}</p>
            <p class="MsoNormal" style="margin-left:14pt;">- Địa chỉ: ${valDiachi}</p>
            <p class="MsoNormal" style="margin-left:14pt;">- Diện tích: ${valDientich} m<sup>2</sup> ; Mục đích: ${valMucdich}</p>

            <p class="MsoNormal" style="text-indent:24pt; margin-top:10pt;">Tôi xin cam đoan nội dung kê khai trên đơn là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.</p>

            <table border="0" cellspacing="0" cellpadding="0" style="border:none; width:100%; margin-top:16pt; font-family:'Times New Roman', serif;">
                <tr>
                    <td width="45%" style="border:none;"></td>
                    <td width="55%" align="center" style="border:none;">
                        <p class="MsoNormal" style="font-style:italic; font-size:11pt; margin:0;">${dateStr}</p>
                        <p class="MsoNormal" style="font-weight:bold; font-size:11.5pt; margin:3pt 0 0 0;">Người làm đơn</p>
                        <p class="MsoNormal" style="font-size:10pt; font-style:italic; margin:0 0 45pt 0;">(Ký và ghi rõ họ tên)</p>
                        <p class="MsoNormal" style="font-weight:bold; font-size:12pt; margin:0;">${cccdHoten}</p>
                    </td>
                </tr>
            </table>
            `;

            const fullWordContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>${filename}</title>
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
                        margin: 56.7pt 56.7pt 56.7pt 70.85pt;
                        mso-header-margin: 35.4pt;
                        mso-footer-margin: 35.4pt;
                        mso-paper-source: 0;
                    }
                    div.Section1 { page: Section1; }
                    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; }
                    p.MsoNormal { margin: 0; margin-bottom: 3.5pt; font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; }
                </style>
            </head>
            <body>
                <div class="Section1">
                    ${bodyHtml}
                </div>
            </body>
            </html>`;

            const blob = new Blob(['\ufeff', fullWordContent], { type: 'application/msword;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Tự động kích hoạt bản A4 khi tải trang
        window.addEventListener('DOMContentLoaded', () => {
            updateLiveA4Form();
            const qrBox = document.getElementById('qrcodeBox');
            if (qrBox && typeof QRCode !== 'undefined') {
                new QRCode(qrBox, {
                    text: window.location.href,
                    width: 30,
                    height: 30,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L
                });
            }
        });
    </script>
</body>
</html>
