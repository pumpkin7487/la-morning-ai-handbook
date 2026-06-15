/**
 * 晨間廚房 La Morning - AI 應用課程實戰手冊
 * 互動邏輯腳本 (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 優先從 localStorage 還原先前編輯儲存的內容
    const contentArea = document.querySelector('.content-area');
    const savedHTML = localStorage.getItem('gender-equality-boardgame-content');
    if (savedHTML) {
        contentArea.innerHTML = savedHTML;
    }

    // 2. 取得 DOM 元素（基於最新還原後的 DOM）
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const printBtn = document.getElementById('printBtn');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item');
    const pageContainers = document.querySelectorAll('.page-container');
    const welcomePanel = document.getElementById('welcome');
    
    // 建立手機版側邊欄遮罩幕 (Overlay)
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.querySelector('.app-container').appendChild(overlay);

    /* ==========================================================================
       1. 主題切換 (Theme Toggle) - 預設為深色模式，點擊切換為亮色模式
       ========================================================================== */
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        updateThemeIcon(false); // 顯示月亮
    } else {
        body.classList.remove('light-theme');
        updateThemeIcon(true); // 顯示太陽
    }

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon(!isLight);
    });

    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('svg');
        if (isDark) {
            icon.innerHTML = `<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.38-.38.38-1.02 0-1.41zM6.99 15.93c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41z" fill="currentColor"/>`;
        } else {
            icon.innerHTML = `<path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.9 6 2.7 11 2.1c.5-.1 1 .3.9.8-.1.4-.4.8-.8 1-3.6 1.7-5.9 5.3-5.9 9.3 0 5.1 4.2 9.3 9.3 9.3 3.8 0 7.2-2.2 8.7-5.6.2-.4.7-.7 1.1-.6.5.1.8.6.6 1.1-1.6 4.1-5.6 6.8-10.3 6.8z" fill="currentColor"/>`;
        }
    }

    /* ==========================================================================
       2. 路由與視圖切換 (SPA Router / Tabs)
       ========================================================================== */
    function showPage(pageId) {
        welcomePanel.style.display = 'none';
        
        pageContainers.forEach(page => {
            if (page.id === pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        menuItems.forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        closeSidebar();
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            window.location.hash = pageId;
            showPage(pageId);
            document.querySelector('.content-area').scrollTop = 0;
        });
    });

    // 監聽 URL Hash 變更
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            welcomePanel.style.display = 'flex';
            pageContainers.forEach(page => page.classList.remove('active'));
            menuItems.forEach(item => item.classList.remove('active'));
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    /* ==========================================================================
       3. 手動與響應式側邊欄控制 (Mobile Drawer & Overlay)
       ========================================================================== */
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    /* ==========================================================================
       4. 搜尋篩選功能 (Instant Filter / Search)
       ========================================================================== */
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        let matchCount = 0;
        
        const menuGroups = document.querySelectorAll('.menu-group');

        menuGroups.forEach(group => {
            let groupVisibleItems = 0;
            const items = group.querySelectorAll('.menu-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const pageId = item.getAttribute('data-page');
                const targetPage = document.getElementById(pageId);
                
                let extraText = "";
                if (targetPage) {
                    extraText = targetPage.textContent.toLowerCase();
                }

                if (text.includes(query) || extraText.includes(query)) {
                    item.style.display = 'flex';
                    groupVisibleItems++;
                    matchCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (groupVisibleItems === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });

        if (matchCount === 0 && query !== "") {
            noResults.style.display = 'block';
            welcomePanel.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            const activePage = document.querySelector('.page-container.active');
            if (!activePage && query === "") {
                welcomePanel.style.display = 'flex';
            }
        }
    });

    /* ==========================================================================
       5. 事件委派 (Event Delegation)
       包含提示詞複製按鈕與歡迎面板統計卡片跳轉（避免 InnerHTML 還原後監聽器失效）
       ========================================================================== */
    
    // 複製 Prompt 功能
    contentArea.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-copy');
        if (button) {
            const promptBody = button.closest('.prompt-card').querySelector('.prompt-text');
            const textToCopy = promptBody.innerText;

            navigator.clipboard.writeText(textToCopy).then(() => {
                button.classList.add('copied');
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    已複製
                `;

                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = originalHTML;
                }, 2000);
            }).catch(err => {
                console.error('複製失敗: ', err);
                alert('複製失敗，請手動框選文字複製。');
            });
        }
    });

    // 歡迎面板統計卡片跳轉
    contentArea.addEventListener('click', (e) => {
        const item = e.target.closest('.stat-item');
        if (item) {
            const targetCategory = item.getAttribute('data-category');
            if (targetCategory === 'copywriting') {
                window.location.hash = 'shuang-yong';
                showPage('shuang-yong');
            } else if (targetCategory === 'design') {
                window.location.hash = 'shi-dong';
                showPage('shi-dong');
            } else if (item.id === 'quickPrint') {
                window.print();
            } else {
                window.location.hash = 'shuang-yong';
                showPage('shuang-yong');
            }
        }
    });

    /* ==========================================================================
       6. 講義列印功能 (Print PDF Setup)
       ========================================================================== */
    printBtn.addEventListener('click', () => {
        window.print();
    });

    /* ==========================================================================
       7. 內建編輯模式與自動存檔 (Edit Mode & Auto Save)
       ========================================================================== */
    const editToggle = document.getElementById('editToggle');
    const savePageBtn = document.getElementById('savePageBtn');
    const insertImgBtn = document.getElementById('insertImgBtn');
    let isEditing = false;
    let savedSelectionRange = null;

    // 游標位置追蹤：當使用者點選編輯區時，即時儲存游標位置
    document.addEventListener('selectionchange', () => {
        if (!isEditing) return;
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (contentArea.contains(range.commonAncestorContainer)) {
                savedSelectionRange = range.cloneRange();
            }
        }
    });

    editToggle.addEventListener('click', () => {
        if (!isEditing) {
            const password = prompt('請輸入編輯密碼：');
            if (password !== '0515') {
                alert('密碼錯誤，無法開啟編輯模式！');
                return;
            }
        }
        
        isEditing = !isEditing;
        
        if (isEditing) {
            // 進入編輯模式
            contentArea.contentEditable = "true";
            contentArea.classList.add('editing-active');
            editToggle.classList.add('active');
            editToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                完成編輯
            `;
            savePageBtn.style.display = 'inline-flex';
            insertImgBtn.style.display = 'inline-flex';
        } else {
            // 完成編輯模式 (自動存檔至本機)
            hideResizerToolbar();
            contentArea.contentEditable = "false";
            contentArea.classList.remove('editing-active');
            editToggle.classList.remove('active');
            editToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                </svg>
                編輯模式
            `;
            savePageBtn.style.display = 'none';
            insertImgBtn.style.display = 'none';

            // 💾 儲存並覆蓋網頁內容到 LocalStorage
            localStorage.setItem('gender-equality-boardgame-content', contentArea.innerHTML);
            showToast('💾 變更已自動儲存！重新整理網頁仍會保留。');
        }
    });

    // 「儲存網頁」下載實體 HTML 的備用功能
    savePageBtn.addEventListener('click', () => {
        const wasEditing = isEditing;
        
        // 暫時關閉編輯狀態
        contentArea.contentEditable = "false";
        contentArea.classList.remove('editing-active');
        savePageBtn.style.display = 'none';
        insertImgBtn.style.display = 'none';
        editToggle.classList.remove('active');
        editToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
            </svg>
            編輯模式
        `;

        const doctype = "<!DOCTYPE html>\n";
        const htmlContent = doctype + document.documentElement.outerHTML;

        if (wasEditing) {
            contentArea.contentEditable = "true";
            contentArea.classList.add('editing-active');
            savePageBtn.style.display = 'inline-flex';
            insertImgBtn.style.display = 'inline-flex';
            editToggle.classList.add('active');
            editToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                完成編輯
            `;
        }

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 「重設網頁」回復出廠預設值
    const resetTemplateBtn = document.getElementById('resetTemplateBtn');
    if (resetTemplateBtn) {
        resetTemplateBtn.addEventListener('click', () => {
            if (confirm('確定要清除所有的自訂修改與圖片，恢復為原始的教材內容嗎？（此操作無法復原）')) {
                localStorage.removeItem('gender-equality-boardgame-content');
                window.location.reload();
            }
        });
    }

    /* ==========================================================================
       8. 插入圖片工具 Modal 邏輯
       ========================================================================== */
    const imageModal = document.getElementById('imageModal');
    const closeModal = document.getElementById('closeModal');
    const cancelImgBtn = document.getElementById('cancelImgBtn');
    const confirmImgBtn = document.getElementById('confirmImgBtn');
    const localImgInput = document.getElementById('localImgInput');
    const dropzone = document.getElementById('dropzone');
    const uploadStatusText = document.getElementById('uploadStatusText');
    const imgPreviewContainer = document.getElementById('imgPreviewContainer');
    const localImgPreview = document.getElementById('localImgPreview');
    const localImgName = document.getElementById('localImgName');
    const imgUrlInput = document.getElementById('imgUrlInput');
    
    const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
    const modalTabPanels = document.querySelectorAll('.modal-tab-panel');
    let currentTab = 'tab-local';
    let base64ImageString = '';

    // 開啟 Modal 並記錄游標位置
    insertImgBtn.addEventListener('click', () => {
        resetModalInputs(); // 1. 先重置所有輸入欄位與狀態
        
        // 2. 隨後記錄當前文字輸入游標位置
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (contentArea.contains(range.commonAncestorContainer)) {
                savedSelectionRange = range.cloneRange();
            }
        }
        
        imageModal.classList.add('active');
    });

    // 點擊上傳區觸發檔案瀏覽器
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            localImgInput.click();
        });
    }

    // 關閉 Modal
    function closeImgModal() {
        imageModal.classList.remove('active');
    }
    closeModal.addEventListener('click', closeImgModal);
    cancelImgBtn.addEventListener('click', closeImgModal);

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImgModal();
        }
    });

    // Tab 切換
    modalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalTabBtns.forEach(b => b.classList.remove('active'));
            modalTabPanels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-tab');
            document.getElementById(currentTab).classList.add('active');
        });
    });

    // 處理本機圖片選擇 (Base64 編碼)
    localImgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('注意：圖片大小超過 2MB！將圖片轉為 Base64 會使 HTML 檔案變大。建議先壓縮再進行嵌入。');
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            base64ImageString = evt.target.result;
            localImgPreview.src = base64ImageString;
            imgPreviewContainer.style.display = 'block';
            localImgName.innerText = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            uploadStatusText.innerText = '已選擇圖片，點擊更換';
        };
        reader.readAsDataURL(file);
    });

    // 確認插入圖片
    confirmImgBtn.addEventListener('click', () => {
        let imgSrc = '';

        if (currentTab === 'tab-local') {
            if (!base64ImageString) {
                alert('請先選擇圖片檔案！');
                return;
            }
            imgSrc = base64ImageString;
        } else {
            const urlVal = imgUrlInput.value.trim();
            if (!urlVal) {
                alert('請輸入相對圖片路徑（如 images/photo.png）或網路圖片網址！');
                return;
            }
            imgSrc = urlVal;
        }

        // 建立圖片標籤
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '使用者插入圖片';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '12px';
        img.style.margin = '20px 0';
        img.style.display = 'block';
        img.style.border = '1px solid var(--border)';
        img.style.boxShadow = 'var(--shadow-md)';

        // 插入到游標位置
        let inserted = false;
        
        if (savedSelectionRange && contentArea.contains(savedSelectionRange.commonAncestorContainer)) {
            try {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedSelectionRange);
                
                savedSelectionRange.deleteContents();
                savedSelectionRange.insertNode(img);
                
                savedSelectionRange.collapse(false);
                inserted = true;
            } catch (err) {
                console.warn('嘗試在游標插入圖片失敗，將改為追加到頁面底部。', err);
            }
        }

        // 直覺化防呆：若游標定位失敗，將圖片直接插入到當前 active 的 Page 頂部（標題正下方）
        if (!inserted) {
            const activePage = document.querySelector('.page-container.active');
            if (activePage) {
                const insertTarget = activePage.querySelector('.question-card') || activePage.firstChild;
                if (insertTarget && insertTarget.nextSibling) {
                    activePage.insertBefore(img, insertTarget.nextSibling);
                } else {
                    activePage.appendChild(img);
                }
                inserted = true;
            } else {
                // 若在歡迎頁面，插在 h1 標題下方
                const welcomeTitle = welcomePanel.querySelector('h1');
                if (welcomeTitle && welcomeTitle.nextSibling) {
                    welcomePanel.insertBefore(img, welcomeTitle.nextSibling);
                } else {
                    welcomePanel.appendChild(img);
                }
                inserted = true;
            }
        }

        closeImgModal();
        resetModalInputs();
        
        // 圖片插入後立即發送通知提示
        showToast('📷 圖片已成功插入！按「完成編輯」即可完成儲存。');
    });

    function resetModalInputs() {
        base64ImageString = '';
        localImgInput.value = '';
        localImgPreview.src = '';
        imgPreviewContainer.style.display = 'none';
        localImgName.innerText = '';
        uploadStatusText.innerText = '點擊選擇電腦中的圖片';
        imgUrlInput.value = '';
        savedSelectionRange = null;
    }

    /* ==========================================================================
       9. 提示通知功能 (Toast Notice)
       ========================================================================== */
    function showToast(message) {
        let toast = document.getElementById('toastNotice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toastNotice';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: var(--secondary);
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                font-weight: 600;
                font-size: 0.95rem;
                z-index: 10000;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
        }, 4000);
    }

    /* ==========================================================================
       10. 圖片大小調整與刪除工具列 (Image Resizing & Deletion Toolbar)
       ========================================================================== */
    const resizerToolbar = document.getElementById('imageResizerToolbar');
    let activeResizingImg = null;

    // 點擊圖片顯示工具列
    contentArea.addEventListener('click', (e) => {
        if (!isEditing) return;
        
        const img = e.target;
        if (img.tagName === 'IMG') {
            e.stopPropagation(); // 阻止事件冒泡關閉工具列
            
            // 清除先前編輯圖片的樣式
            if (activeResizingImg) {
                activeResizingImg.classList.remove('active-editing');
            }
            
            activeResizingImg = img;
            activeResizingImg.classList.add('active-editing');
            
            // 定位工具列位置 (置中於圖片上方)
            const rect = activeResizingImg.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            resizerToolbar.style.display = 'flex';
            resizerToolbar.style.top = `${rect.top + scrollTop - 10}px`;
            resizerToolbar.style.left = `${rect.left + rect.width / 2 + scrollLeft}px`;
        }
    });

    // 處理工具列中的調整大小按鈕與刪除按鈕
    resizerToolbar.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止點擊工具列本體關閉它
        
        const btn = e.target.closest('.resize-btn');
        if (!btn || !activeResizingImg) return;
        
        if (btn.classList.contains('delete-img-btn')) {
            // 刪除圖片
            if (confirm('確定要刪除這張圖片嗎？')) {
                activeResizingImg.remove();
                hideResizerToolbar();
                
                // 立即存檔以保持同步
                localStorage.setItem('gender-equality-boardgame-content', contentArea.innerHTML);
                showToast('🗑️ 圖片已成功刪除並自動存檔！');
            }
        } else {
            // 調整圖片寬度比例 (25%, 50%, 75%, 100%)
            const size = btn.getAttribute('data-size');
            activeResizingImg.style.width = `${size}%`;
            activeResizingImg.style.height = 'auto'; // 保留等比例
            
            // 重新計算工具列位置，因為圖片縮小後位置會變
            setTimeout(() => {
                const rect = activeResizingImg.getBoundingClientRect();
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                resizerToolbar.style.top = `${rect.top + scrollTop - 10}px`;
                resizerToolbar.style.left = `${rect.left + rect.width / 2 + scrollLeft}px`;
            }, 50);
        }
    });

    // 點擊其他地方隱藏工具列
    document.addEventListener('click', () => {
        hideResizerToolbar();
    });

    // 切換頁面或結束編輯時隱藏工具列
    function hideResizerToolbar() {
        if (resizerToolbar) {
            resizerToolbar.style.display = 'none';
        }
        if (activeResizingImg) {
            activeResizingImg.classList.remove('active-editing');
            activeResizingImg = null;
        }
    }
});
