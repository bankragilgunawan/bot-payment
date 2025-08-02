// Format waktu
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Set waktu awal
document.getElementById('initial-time').textContent = formatTime(new Date());

// Referensi elemen
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const sendSound = document.getElementById('sendSound');
const receiveSound = document.getElementById('receiveSound');

// Variabel global
let userPhoneNumber = '';
let cart = [];
let currentStep = 'ask_phone'; // ask_phone, main_menu, service_menu, form, checkout, rating, payment
let currentForm = ''; // Menyimpan form yang sedang aktif

// Fungsi untuk memainkan suara kirim
function playSendSound() {
    try {
        sendSound.currentTime = 0;
        sendSound.play().catch(e => console.log("Audio play error:", e));
    } catch (e) {
        console.log("Cannot play send sound");
    }
}

// Fungsi untuk memainkan suara terima
function playReceiveSound() {
    try {
        receiveSound.currentTime = 0;
        receiveSound.play().catch(e => console.log("Audio play error:", e));
    } catch (e) {
        console.log("Cannot play receive sound");
    }
}

// Fungsi untuk menambahkan pesan ke chat dengan jeda
function addMessageWithDelay(text, isUser = false, delay = 1500) {
    return new Promise(resolve => {
        // Tampilkan indikator mengetik
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Setelah jeda, tampilkan pesan
        setTimeout(() => {
            // Hapus indikator mengetik
            if (document.getElementById('typing-indicator')) {
                document.getElementById('typing-indicator').remove();
            }

            // Tambahkan pesan
            const messageDiv = document.createElement('div');
            messageDiv.className = `message-with-avatar ${isUser ? 'user-message-with-avatar' : 'bot-message-with-avatar'}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            
            if (!isUser) {
                const avatar = document.createElement('div');
                avatar.className = `avatar bot-avatar`;
                avatar.innerHTML = `<i class="fas fa-robot"></i>`;
                
                const messageBubble = document.createElement('div');
                messageBubble.className = `message bot-message`;
                messageBubble.innerHTML = `
                    <div>${text}</div>
                    <div class="message-time">${formatTime(new Date())}</div>
                `;
                
                messageContent.appendChild(avatar);
                messageContent.appendChild(messageBubble);
            } else {
                const avatar = document.createElement('div');
                avatar.className = `avatar user-avatar`;
                avatar.innerHTML = `<i class="fas fa-user"></i>`;
                
                const messageBubble = document.createElement('div');
                messageBubble.className = `message user-message`;
                messageBubble.innerHTML = `
                    <div>${text}</div>
                    <div class="message-time">${formatTime(new Date())}</div>
                `;
                
                messageContent.appendChild(avatar);
                messageContent.appendChild(messageBubble);
            }
            
            messageDiv.appendChild(messageContent);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Mainkan suara terima untuk pesan bot
            if (!isUser) {
                playReceiveSound();
            }
            
            resolve();
        }, delay);
    });
}

// Fungsi untuk menambahkan pesan user (tanpa jeda)
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-with-avatar ${isUser ? 'user-message-with-avatar' : 'bot-message-with-avatar'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (isUser) {
        const avatar = document.createElement('div');
        avatar.className = `avatar user-avatar`;
        avatar.innerHTML = `<i class="fas fa-user"></i>`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `message user-message`;
        messageBubble.innerHTML = `
            <div>${text}</div>
            <div class="message-time">${formatTime(new Date())}</div>
        `;
        
        messageContent.appendChild(avatar);
        messageContent.appendChild(messageBubble);
    }
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Mainkan suara kirim untuk pesan user
    if (isUser) {
        playSendSound();
    }
}

// Validasi nomor WhatsApp
function isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phoneRegex.test(phone);
}

// Menampilkan menu utama
function showMainMenu() {
    currentStep = 'main_menu';
    currentForm = '';
    messageInput.placeholder = "Ketik pesan Anda atau pilih kategori...";
    
    setTimeout(async () => {
        const menuHtml = `
            <div class="service-categories">
                <button class="category-button" onclick="showPulsaMenu()">Pulsa</button>
                <button class="category-button" onclick="showTransferMenu()">Transfer</button>
                <button class="category-button" onclick="showPPOBMenu()">PPOB</button>
                <button class="category-button" onclick="showLainnyaMenu()">Lainnya</button>
            </div>
        `;
        
        await addMessageWithDelay("Berikut layanan yang tersedia:");
        showMenuMessage(menuHtml);
    }, 500);
}

// Menampilkan pesan menu
function showMenuMessage(menuHtml) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-with-avatar bot-message-with-avatar';
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="avatar bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message bot-message">
                ${menuHtml}
                <div class="message-time">${formatTime(new Date())}</div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    playReceiveSound();
}

// Menu Pulsa
function showPulsaMenu() {
    addMessage("Pulsa", true);
    currentStep = 'service_menu';
    currentForm = '';
    
    setTimeout(async () => {
        const services = `
            <div class="service-buttons">
                <button class="service-button" onclick="showPulsaForm()">Pulsa Reguler</button>
                <button class="service-button" onclick="showDataForm()">Paket Data</button>
                <button class="service-button" onclick="showPulsaTransferForm()">Transfer Pulsa</button>
            </div>
        `;
        
        await addMessageWithDelay("Pilih layanan pulsa:");
        showMenuMessage(services);
    }, 500);
}

// Menu Transfer
function showTransferMenu() {
    addMessage("Transfer", true);
    currentStep = 'service_menu';
    currentForm = '';
    
    setTimeout(async () => {
        const services = `
            <div class="service-buttons">
                <button class="service-button" onclick="showTransferBankForm()">Transfer Bank</button>
                <button class="service-button" onclick="showTransferEmoneyForm()">Transfer E-Money</button>
                <button class="service-button" onclick="showTopupEmoneyForm()">Topup E-Money</button>
            </div>
        `;
        
        await addMessageWithDelay("Pilih layanan transfer:");
        showMenuMessage(services);
    }, 500);
}

// Menu PPOB
function showPPOBMenu() {
    addMessage("PPOB", true);
    currentStep = 'service_menu';
    currentForm = '';
    
    setTimeout(async () => {
        const services = `
            <div class="service-buttons">
                <button class="service-button" onclick="showPLNForm()">Token PLN</button>
                <button class="service-button" onclick="showPDAMForm()">PDAM</button>
                <button class="service-button" onclick="showBPJSForm()">BPJS</button>
                <button class="service-button" onclick="showInternetForm()">Internet</button>
                <button class="service-button" onclick="showTVForm()">TV Kabel</button>
                <button class="service-button" onclick="showTelkomForm()">Telkom</button>
            </div>
        `;
        
        await addMessageWithDelay("Pilih layanan PPOB:");
        showMenuMessage(services);
    }, 500);
}

// Menu Lainnya
function showLainnyaMenu() {
    addMessage("Lainnya", true);
    currentStep = 'service_menu';
    currentForm = '';
    
    setTimeout(async () => {
        const services = `
            <div class="service-buttons">
                <button class="service-button" onclick="showGameForm()">Voucher Game</button>
                <button class="service-button" onclick="showStreamingForm()">Voucher Streaming</button>
                <button class="service-button" onclick="showAsuransiForm()">Asuransi</button>
                <button class="service-button" onclick="showDonasiForm()">Donasi</button>
            </div>
        `;
        
        await addMessageWithDelay("Layanan lainnya:");
        showMenuMessage(services);
    }, 500);
}

// Form Pulsa Reguler
function showPulsaForm() {
    addMessage("Pulsa Reguler", true);
    currentStep = 'form';
    currentForm = 'pulsa';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Nomor HP Tujuan:</label>
                    <input type="tel" id="pulsa-nomor" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Nominal Pulsa:</label>
                    <select id="pulsa-nominal">
                        <option value="">Pilih Nominal</option>
                        <option value="5000">Rp 5.000</option>
                        <option value="10000">Rp 10.000</option>
                        <option value="20000">Rp 20.000</option>
                        <option value="25000">Rp 25.000</option>
                        <option value="50000">Rp 50.000</option>
                        <option value="100000">Rp 100.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="pulsa-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitPulsaForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form pulsa reguler:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Transfer Bank
function showTransferBankForm() {
    addMessage("Transfer Bank", true);
    currentStep = 'form';
    currentForm = 'transfer_bank';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Bank Tujuan:</label>
                    <select id="transfer-bank">
                        <option value="">Pilih Bank</option>
                        <option value="bca">BCA</option>
                        <option value="bni">BNI</option>
                        <option value="bri">BRI</option>
                        <option value="mandiri">Mandiri</option>
                        <option value="bsi">BSI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomor Rekening Tujuan:</label>
                    <input type="text" id="transfer-rek" placeholder="Nomor Rekening">
                </div>
                <div class="form-group">
                    <label>Jumlah Transfer:</label>
                    <input type="number" id="transfer-jumlah" placeholder="Rp">
                </div>
                <div class="form-group">
                    <label>Nama Pengirim:</label>
                    <input type="text" id="transfer-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitTransferBankForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form transfer bank:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Token PLN
function showPLNForm() {
    addMessage("Token PLN", true);
    currentStep = 'form';
    currentForm = 'pln';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>ID Pelanggan:</label>
                    <input type="text" id="pln-id" placeholder="123456789012">
                </div>
                <div class="form-group">
                    <label>Nominal Token:</label>
                    <select id="pln-nominal">
                        <option value="">Pilih Nominal</option>
                        <option value="20000">Rp 20.000</option>
                        <option value="50000">Rp 50.000</option>
                        <option value="100000">Rp 100.000</option>
                        <option value="200000">Rp 200.000</option>
                        <option value="500000">Rp 500.000</option>
                        <option value="1000000">Rp 1.000.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="pln-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitPLNForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form token PLN:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Paket Data
function showDataForm() {
    addMessage("Paket Data", true);
    currentStep = 'form';
    currentForm = 'data';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Nomor HP Tujuan:</label>
                    <input type="tel" id="data-nomor" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Operator:</label>
                    <select id="data-operator">
                        <option value="">Pilih Operator</option>
                        <option value="telkomsel">Telkomsel - Rp 50.000</option>
                        <option value="indosat">Indosat - Rp 45.000</option>
                        <option value="xl">XL - Rp 48.000</option>
                        <option value="tri">Tri - Rp 42.000</option>
                        <option value="axis">Axis - Rp 40.000</option>
                        <option value="smartfren">Smartfren - Rp 38.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="data-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitDataForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form paket ");
        showFormMessage(formHtml);
    }, 500);
}

// Form Transfer Pulsa
function showPulsaTransferForm() {
    addMessage("Transfer Pulsa", true);
    currentStep = 'form';
    currentForm = 'pulsa_transfer';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Nomor HP Pengirim:</label>
                    <input type="tel" id="transferpulsa-dari" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Nomor HP Tujuan:</label>
                    <input type="tel" id="transferpulsa-ke" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Nominal Transfer:</label>
                    <select id="transferpulsa-nominal">
                        <option value="">Pilih Nominal</option>
                        <option value="10000">Rp 10.000</option>
                        <option value="19500">Rp 20.000 (Harga: Rp 19.500)</option>
                        <option value="49000">Rp 50.000 (Harga: Rp 49.000)</option>
                        <option value="97500">Rp 100.000 (Harga: Rp 97.500)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pengirim:</label>
                    <input type="text" id="transferpulsa-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitPulsaTransferForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form transfer pulsa:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Transfer E-Money
function showTransferEmoneyForm() {
    addMessage("Transfer E-Money", true);
    currentStep = 'form';
    currentForm = 'transfer_emoney';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>E-Money:</label>
                    <select id="emoney-jenis">
                        <option value="">Pilih E-Money</option>
                        <option value="ovo">OVO</option>
                        <option value="gopay">GoPay</option>
                        <option value="dana">DANA</option>
                        <option value="linkaja">LinkAja</option>
                        <option value="shopeepay">ShopeePay</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomor HP Tujuan:</label>
                    <input type="tel" id="emoney-nomor" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Jumlah Transfer:</label>
                    <input type="number" id="emoney-jumlah" placeholder="Rp">
                </div>
                <div class="form-group">
                    <label>Nama Pengirim:</label>
                    <input type="text" id="emoney-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitTransferEmoneyForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form transfer e-money:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Topup E-Money
function showTopupEmoneyForm() {
    addMessage("Topup E-Money", true);
    currentStep = 'form';
    currentForm = 'topup_emoney';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>E-Money:</label>
                    <select id="topup-jenis">
                        <option value="">Pilih E-Money</option>
                        <option value="ovo">OVO</option>
                        <option value="gopay">GoPay</option>
                        <option value="dana">DANA</option>
                        <option value="linkaja">LinkAja</option>
                        <option value="shopeepay">ShopeePay</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomor HP:</label>
                    <input type="tel" id="topup-nomor" placeholder="081234567890">
                </div>
                <div class="form-group">
                    <label>Nominal Topup:</label>
                    <select id="topup-nominal">
                        <option value="">Pilih Nominal</option>
                        <option value="10000">Rp 10.000</option>
                        <option value="20000">Rp 20.000</option>
                        <option value="50000">Rp 50.000</option>
                        <option value="100000">Rp 100.000</option>
                        <option value="200000">Rp 200.000</option>
                        <option value="500000">Rp 500.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="topup-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitTopupEmoneyForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form topup e-money:");
        showFormMessage(formHtml);
    }, 500);
}

// Form PDAM
function showPDAMForm() {
    addMessage("PDAM", true);
    currentStep = 'form';
    currentForm = 'pdam';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>ID Pelanggan:</label>
                    <input type="text" id="pdam-id" placeholder="ID Pelanggan">
                </div>
                <div class="form-group">
                    <label>Nama Wilayah:</label>
                    <input type="text" id="pdam-wilayah" placeholder="Nama Wilayah">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="pdam-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitPDAMForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form PDAM:");
        showFormMessage(formHtml);
    }, 500);
}

// Form BPJS
function showBPJSForm() {
    addMessage("BPJS", true);
    currentStep = 'form';
    currentForm = 'bpjs';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>No. Kartu BPJS:</label>
                    <input type="text" id="bpjs-nomor" placeholder="No. Kartu BPJS">
                </div>
                <div class="form-group">
                    <label>Nama Peserta:</label>
                    <input type="text" id="bpjs-nama" placeholder="Nama Peserta">
                </div>
                <div class="form-group">
                    <label>Bulan Pembayaran:</label>
                    <select id="bpjs-bulan">
                        <option value="">Pilih Bulan</option>
                        <option value="januari">Januari - Rp 150.000</option>
                        <option value="februari">Februari - Rp 150.000</option>
                        <option value="maret">Maret - Rp 150.000</option>
                        <option value="april">April - Rp 150.000</option>
                        <option value="mei">Mei - Rp 150.000</option>
                        <option value="juni">Juni - Rp 150.000</option>
                        <option value="juli">Juli - Rp 150.000</option>
                        <option value="agustus">Agustus - Rp 150.000</option>
                        <option value="september">September - Rp 150.000</option>
                        <option value="oktober">Oktober - Rp 150.000</option>
                        <option value="november">November - Rp 150.000</option>
                        <option value="desember">Desember - Rp 150.000</option>
                    </select>
                </div>
                <button class="submit-form" onclick="submitBPJSForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form BPJS:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Internet
function showInternetForm() {
    addMessage("Internet", true);
    currentStep = 'form';
    currentForm = 'internet';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Provider Internet:</label>
                    <select id="internet-provider">
                        <option value="">Pilih Provider</option>
                        <option value="indihome">IndiHome - Rp 300.000</option>
                        <option value="myrepublic">MyRepublic - Rp 250.000</option>
                        <option value="biznet">Biznet - Rp 280.000</option>
                        <option value="firstmedia">FirstMedia - Rp 320.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>No. Pelanggan:</label>
                    <input type="text" id="internet-nomor" placeholder="No. Pelanggan">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="internet-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitInternetForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form internet:");
        showFormMessage(formHtml);
    }, 500);
}

// Form TV Kabel
function showTVForm() {
    addMessage("TV Kabel", true);
    currentStep = 'form';
    currentForm = 'tv';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Provider TV:</label>
                    <select id="tv-provider">
                        <option value="">Pilih Provider</option>
                        <option value="indihome">IndiHome TV - Rp 200.000</option>
                        <option value="firstmedia">FirstMedia - Rp 250.000</option>
                        <option value="myrepublic">MyRepublic TV - Rp 180.000</option>
                        <option value="biznet">Biznet TV - Rp 220.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>No. Pelanggan:</label>
                    <input type="text" id="tv-nomor" placeholder="No. Pelanggan">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="tv-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitTVForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form TV kabel:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Telkom
function showTelkomForm() {
    addMessage("Telkom", true);
    currentStep = 'form';
    currentForm = 'telkom';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>No. Telepon:</label>
                    <input type="tel" id="telkom-nomor" placeholder="No. Telepon">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="telkom-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitTelkomForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form Telkom:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Voucher Game
function showGameForm() {
    addMessage("Voucher Game", true);
    currentStep = 'form';
    currentForm = 'game';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Jenis Game:</label>
                    <select id="game-jenis">
                        <option value="">Pilih Game</option>
                        <option value="mobile-legends">Mobile Legends - Rp 50.000</option>
                        <option value="free-fire">Free Fire - Rp 25.000</option>
                        <option value="pubg-mobile">PUBG Mobile - Rp 75.000</option>
                        <option value="genshin-impact">Genshin Impact - Rp 150.000</option>
                        <option value="valorant">Valorant - Rp 100.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ID Player:</label>
                    <input type="text" id="game-id" placeholder="ID Player">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="game-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitGameForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form voucher game:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Voucher Streaming
function showStreamingForm() {
    addMessage("Voucher Streaming", true);
    currentStep = 'form';
    currentForm = 'streaming';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Platform Streaming:</label>
                    <select id="streaming-platform">
                        <option value="">Pilih Platform</option>
                        <option value="netflix">Netflix - Rp 150.000</option>
                        <option value="spotify">Spotify - Rp 50.000</option>
                        <option value="youtube">YouTube Premium - Rp 100.000</option>
                        <option value="disney">Disney+ - Rp 120.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Email/ID:</label>
                    <input type="text" id="streaming-id" placeholder="Email atau ID">
                </div>
                <div class="form-group">
                    <label>Nama Pembeli:</label>
                    <input type="text" id="streaming-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitStreamingForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form voucher streaming:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Asuransi
function showAsuransiForm() {
    addMessage("Asuransi", true);
    currentStep = 'form';
    currentForm = 'asuransi';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Jenis Asuransi:</label>
                    <select id="asuransi-jenis">
                        <option value="">Pilih Asuransi</option>
                        <option value="jiwa">Asuransi Jiwa - Rp 500.000</option>
                        <option value="kesehatan">Asuransi Kesehatan - Rp 300.000</option>
                        <option value="kendaraan">Asuransi Kendaraan - Rp 750.000</option>
                        <option value="properti">Asuransi Properti - Rp 1.000.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nama Pemilik:</label>
                    <input type="text" id="asuransi-nama" placeholder="Nama Lengkap">
                </div>
                <div class="form-group">
                    <label>Keterangan:</label>
                    <textarea id="asuransi-keterangan" placeholder="Keterangan tambahan" rows="3"></textarea>
                </div>
                <button class="submit-form" onclick="submitAsuransiForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form asuransi:");
        showFormMessage(formHtml);
    }, 500);
}

// Form Donasi
function showDonasiForm() {
    addMessage("Donasi", true);
    currentStep = 'form';
    currentForm = 'donasi';
    
    setTimeout(async () => {
        const formHtml = `
            <div class="form-container">
                <div class="form-group">
                    <label>Tujuan Donasi:</label>
                    <input type="text" id="donasi-tujuan" placeholder="Tujuan Donasi">
                </div>
                <div class="form-group">
                    <label>Jumlah Donasi:</label>
                    <input type="number" id="donasi-jumlah" placeholder="Rp">
                </div>
                <div class="form-group">
                    <label>Nama Donatur:</label>
                    <input type="text" id="donasi-nama" placeholder="Nama Lengkap">
                </div>
                <button class="submit-form" onclick="submitDonasiForm()">Tambah ke Keranjang</button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan isi form donasi:");
        showFormMessage(formHtml);
    }, 500);
}

// Fungsi umum untuk menampilkan form dengan jeda
function showFormMessage(formHtml) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-with-avatar bot-message-with-avatar';
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="avatar bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message bot-message">
                ${formHtml}
                <div class="message-time">${formatTime(new Date())}</div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    playReceiveSound();
}

// Submit Form Pulsa
function submitPulsaForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const nomor = document.getElementById('pulsa-nomor').value;
    const nominal = document.getElementById('pulsa-nominal').value;
    const nama = document.getElementById('pulsa-nama').value;
    
    if (!nomor || !nominal || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Pulsa Reguler',
        details: `Nomor: ${nomor}, Nominal: Rp ${nominal}`,
        price: parseInt(nominal)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Transfer Bank
function submitTransferBankForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const bank = document.getElementById('transfer-bank').value;
    const rek = document.getElementById('transfer-rek').value;
    const jumlah = document.getElementById('transfer-jumlah').value;
    const nama = document.getElementById('transfer-nama').value;
    
    if (!bank || !rek || !jumlah || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Transfer Bank',
        details: `Bank: ${bank}, Rek: ${rek}, Jumlah: Rp ${jumlah}`,
        price: parseInt(jumlah)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Token PLN
function submitPLNForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const idPelanggan = document.getElementById('pln-id').value;
    const nominal = document.getElementById('pln-nominal').value;
    const nama = document.getElementById('pln-nama').value;
    
    if (!idPelanggan || !nominal || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Token PLN',
        details: `ID: ${idPelanggan}, Nominal: Rp ${nominal}`,
        price: parseInt(nominal)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Paket Data
function submitDataForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const nomor = document.getElementById('data-nomor').value;
    const operator = document.getElementById('data-operator').value;
    const nama = document.getElementById('data-nama').value;
    
    if (!nomor || !operator || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari operator
    const operatorText = operator.split(' - Rp ')[0];
    const priceText = operator.split(' - Rp ')[1];
    const price = parseInt(priceText) || 50000;
    
    const item = {
        service: 'Paket Data',
        details: `Nomor: ${nomor}, Operator: ${operatorText}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Transfer Pulsa
function submitPulsaTransferForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const dari = document.getElementById('transferpulsa-dari').value;
    const ke = document.getElementById('transferpulsa-ke').value;
    const nominal = document.getElementById('transferpulsa-nominal').value;
    const nama = document.getElementById('transferpulsa-nama').value;
    
    if (!dari || !ke || !nominal || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Sesuaikan harga sesuai ketentuan
    let displayNominal = "10.000";
    let price = 10000;
    
    if (nominal === "10000") {
        displayNominal = "10.000";
        price = 10000;
    } else if (nominal === "19500") {
        displayNominal = "20.000";
        price = 19500;
    } else if (nominal === "49000") {
        displayNominal = "50.000";
        price = 49000;
    } else if (nominal === "97500") {
        displayNominal = "100.000";
        price = 97500;
    }
    
    const item = {
        service: 'Transfer Pulsa',
        details: `Dari: ${dari}, Ke: ${ke}, Nominal: Rp ${displayNominal}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Transfer E-Money
function submitTransferEmoneyForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const jenis = document.getElementById('emoney-jenis').value;
    const nomor = document.getElementById('emoney-nomor').value;
    const jumlah = document.getElementById('emoney-jumlah').value;
    const nama = document.getElementById('emoney-nama').value;
    
    if (!jenis || !nomor || !jumlah || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Transfer E-Money',
        details: `E-Money: ${jenis}, Nomor: ${nomor}, Jumlah: Rp ${jumlah}`,
        price: parseInt(jumlah)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Topup E-Money
function submitTopupEmoneyForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const jenis = document.getElementById('topup-jenis').value;
    const nomor = document.getElementById('topup-nomor').value;
    const nominal = document.getElementById('topup-nominal').value;
    const nama = document.getElementById('topup-nama').value;
    
    if (!jenis || !nomor || !nominal || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Topup E-Money',
        details: `E-Money: ${jenis}, Nomor: ${nomor}, Nominal: Rp ${nominal}`,
        price: parseInt(nominal)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form PDAM
function submitPDAMForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const id = document.getElementById('pdam-id').value;
    const wilayah = document.getElementById('pdam-wilayah').value;
    const nama = document.getElementById('pdam-nama').value;
    
    if (!id || !wilayah || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'PDAM',
        details: `ID: ${id}, Wilayah: ${wilayah}`,
        price: 100000 // Harga rata-rata PDAM
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form BPJS
function submitBPJSForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const nomor = document.getElementById('bpjs-nomor').value;
    const nama = document.getElementById('bpjs-nama').value;
    const bulan = document.getElementById('bpjs-bulan').value;
    
    if (!nomor || !nama || !bulan) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari bulan
    const bulanText = bulan.split(' - Rp ')[0];
    const priceText = bulan.split(' - Rp ')[1];
    const price = parseInt(priceText) || 150000;
    
    const item = {
        service: 'BPJS',
        details: `No. Kartu: ${nomor}, Nama: ${nama}, Bulan: ${bulanText}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Internet
function submitInternetForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const provider = document.getElementById('internet-provider').value;
    const nomor = document.getElementById('internet-nomor').value;
    const nama = document.getElementById('internet-nama').value;
    
    if (!provider || !nomor || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari provider
    const providerText = provider.split(' - Rp ')[0];
    const priceText = provider.split(' - Rp ')[1];
    const price = parseInt(priceText) || 300000;
    
    const item = {
        service: 'Internet',
        details: `Provider: ${providerText}, No. Pelanggan: ${nomor}, Nama: ${nama}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form TV Kabel
function submitTVForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const provider = document.getElementById('tv-provider').value;
    const nomor = document.getElementById('tv-nomor').value;
    const nama = document.getElementById('tv-nama').value;
    
    if (!provider || !nomor || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari provider
    const providerText = provider.split(' - Rp ')[0];
    const priceText = provider.split(' - Rp ')[1];
    const price = parseInt(priceText) || 200000;
    
    const item = {
        service: 'TV Kabel',
        details: `Provider: ${providerText}, No. Pelanggan: ${nomor}, Nama: ${nama}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Telkom
function submitTelkomForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const nomor = document.getElementById('telkom-nomor').value;
    const nama = document.getElementById('telkom-nama').value;
    
    if (!nomor || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Telkom',
        details: `No. Telepon: ${nomor}, Nama: ${nama}`,
        price: 150000 // Harga rata-rata telkom
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Voucher Game
function submitGameForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const jenis = document.getElementById('game-jenis').value;
    const id = document.getElementById('game-id').value;
    const nama = document.getElementById('game-nama').value;
    
    if (!jenis || !id || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari jenis game
    const jenisText = jenis.split(' - Rp ')[0];
    const priceText = jenis.split(' - Rp ')[1];
    const price = parseInt(priceText) || 50000;
    
    const item = {
        service: 'Voucher Game',
        details: `Game: ${jenisText}, ID Player: ${id}, Nama: ${nama}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Voucher Streaming
function submitStreamingForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const platform = document.getElementById('streaming-platform').value;
    const id = document.getElementById('streaming-id').value;
    const nama = document.getElementById('streaming-nama').value;
    
    if (!platform || !id || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari platform
    const platformText = platform.split(' - Rp ')[0];
    const priceText = platform.split(' - Rp ')[1];
    const price = parseInt(priceText) || 100000;
    
    const item = {
        service: 'Voucher Streaming',
        details: `Platform: ${platformText}, ID: ${id}, Nama: ${nama}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Asuransi
function submitAsuransiForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const jenis = document.getElementById('asuransi-jenis').value;
    const nama = document.getElementById('asuransi-nama').value;
    const keterangan = document.getElementById('asuransi-keterangan').value;
    
    if (!jenis || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Ambil harga dari jenis asuransi
    const jenisText = jenis.split(' - Rp ')[0];
    const priceText = jenis.split(' - Rp ')[1];
    const price = parseInt(priceText) || 500000;
    
    const item = {
        service: 'Asuransi',
        details: `Jenis: ${jenisText}, Nama: ${nama}, Keterangan: ${keterangan || '-'}`,
        price: price
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Submit Form Donasi
function submitDonasiForm() {
    playSendSound(); // Bunyi saat user klik tombol
    
    const tujuan = document.getElementById('donasi-tujuan').value;
    const jumlah = document.getElementById('donasi-jumlah').value;
    const nama = document.getElementById('donasi-nama').value;
    
    if (!tujuan || !jumlah || !nama) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const item = {
        service: 'Donasi',
        details: `Tujuan: ${tujuan}, Nama: ${nama}`,
        price: parseInt(jumlah)
    };
    
    cart.push(item);
    showCartConfirmation();
}

// Tampilkan konfirmasi keranjang dengan jeda
function showCartConfirmation() {
    currentStep = 'checkout';
    currentForm = '';
    
    setTimeout(async () => {
        let cartMessage = "Item telah ditambahkan ke keranjang:\n\n";
        cart.forEach((item, index) => {
            cartMessage += `${index + 1}. ${item.service}\n   ${item.details}\n   Harga: Rp ${item.price.toLocaleString('id-ID')}\n\n`;
        });
        
        cartMessage += "Apakah Anda ingin memesan layanan lain atau lanjut ke pembayaran?";
        
        const buttons = `
            <div class="service-buttons">
                <button class="service-button" onclick="showMainMenu()">Pesan Lagi</button>
                <button class="service-button" onclick="showRating()">Lanjut ke Pembayaran</button>
            </div>
        `;
        
        await addMessageWithDelay(cartMessage);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-with-avatar bot-message-with-avatar';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message bot-message">
                    ${buttons}
                    <div class="message-time">${formatTime(new Date())}</div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        playReceiveSound();
    }, 500);
}

// Tampilkan rating dengan jeda
function showRating() {
    addMessage("Lanjut ke Pembayaran", true);
    playSendSound();
    currentStep = 'rating';
    currentForm = '';
    
    setTimeout(async () => {
        const ratingHtml = `
            <div class="rating-container">
                <div>Bagaimana pengalaman Anda dengan layanan kami?</div>
                <div class="rating-stars" id="rating-stars">
                    <span class="star" onclick="setRating(1)">★</span>
                    <span class="star" onclick="setRating(2)">★</span>
                    <span class="star" onclick="setRating(3)">★</span>
                    <span class="star" onclick="setRating(4)">★</span>
                    <span class="star" onclick="setRating(5)">★</span>
                </div>
                <button class="payment-button" onclick="showPayment()" id="payment-button" style="display:none;">
                    Lanjut ke Pembayaran
                </button>
            </div>
        `;
        
        await addMessageWithDelay("Silakan berikan penilaian Anda:");
        showMenuMessage(ratingHtml);
    }, 500);
}

// Set rating
function setRating(rating) {
    playSendSound(); // Bunyi saat user memberi rating
    
    // Aktifkan bintang sesuai rating
    const stars = document.querySelectorAll('#rating-stars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Tampilkan tombol pembayaran
    document.getElementById('payment-button').style.display = 'block';
}

// Tampilkan pembayaran dengan jeda
function showPayment() {
    addMessage("Lanjut ke Pembayaran", true);
    playSendSound();
    currentStep = 'payment';
    currentForm = '';
    
    setTimeout(async () => {
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        
        const adminFee = total * 0.05; // Biaya admin 5%
        const grandTotal = total + adminFee;
        
        // Simpan total untuk pembayaran
        lastTotal = grandTotal;
        
        const paymentMessage = `
            <strong>RINCIAN PEMBAYARAN</strong>
            <br><br>
            ${cart.map((item, index) => 
                `${index + 1}. ${item.service}<br>
                 &nbsp;&nbsp;&nbsp;${item.details}<br>
                 &nbsp;&nbsp;&nbsp;Rp ${item.price.toLocaleString('id-ID')}`
            ).join('<br><br>')}
            <br><br>
            Sub Total: Rp ${total.toLocaleString('id-ID')}<br>
            Biaya Admin (5%): Rp ${adminFee.toLocaleString('id-ID')}<br>
            <strong>Grand Total: Rp ${grandTotal.toLocaleString('id-ID')}</strong>
            <br><br>
            Silakan lakukan pembayaran terlebih dahulu ke kasir kami sebesar <strong>Rp ${grandTotal.toLocaleString('id-ID')}</strong>.
        `;
        
        const paymentButton = `
            <button class="payment-button" onclick="sendToWhatsApp()">
                <i class="fab fa-whatsapp"></i> Kirim ke WhatsApp
            </button>
        `;
        
        await addMessageWithDelay("Berikut rincian pembayaran Anda:");
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-with-avatar bot-message-with-avatar';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message bot-message">
                    <div>${paymentMessage}</div>
                    ${paymentButton}
                    <div class="message-time">${formatTime(new Date())}</div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        playReceiveSound();
    }, 500);
}

// Fungsi untuk mengirim pesan ke WhatsApp
function sendToWhatsApp() {
    if (!hasPaid) {
        addMessage("lakukan pembayaran terlebih dahulu ke kasir kami dengan nominal " + lastTotal.toLocaleString('id-ID') + ", atau ketik <strong>menu</strong> untuk melihat menu layanan kami.", false);
        playReceiveSound();
        return;
    }
    
    playSendSound(); // Bunyi saat user klik kirim ke WhatsApp
    
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    
    const adminFee = total * 0.05; // Biaya admin 5%
    const grandTotal = total + adminFee;
    
    let message = `*PESANAN Bot Payment*\n\n`;
    message += `No. WhatsApp: ${userPhoneNumber}\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.service}\n`;
        message += `   ${item.details}\n`;
        message += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n\n`;
    });
    
    message += `Sub Total: Rp ${total.toLocaleString('id-ID')}\n`;
    message += `Biaya Admin (5%): Rp ${adminFee.toLocaleString('id-ID')}\n`;
    message += `*Grand Total: Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    message += `Silakan lakukan pembayaran dan konfirmasi pembayaran Anda.`;
    
    const whatsappUrl = `https://wa.me/0816308466?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset keranjang dan kembali ke menu utama
    setTimeout(() => {
        cart = [];
        showMainMenu();
        addMessage("Pesanan Anda telah dikirim ke WhatsApp. Terima kasih telah menggunakan layanan kami!", false);
    }, 2000);
}

// Database pertanyaan dan jawaban
const qaDatabase = {
    "halo": "Halo! Selamat datang di Bot Payment.",
    "hai": "Hai! Ada yang bisa saya bantu?",
    "apa kabar": "Saya baik, terima kasih! Bagaimana dengan Anda?",
    "siapa kamu": "Saya adalah chatbot Bot Payment yang siap membantu Anda dengan berbagai layanan digital.",
    "terima kasih": "Sama-sama! Jangan ragu untuk memesan layanan kami.",
    "sampai jumpa": "Sampai jumpa! Terima kasih telah menggunakan layanan kami.",
    "hello": "Hello! How can I help you today?",
    "help": "Silakan masukkan nomor WhatsApp Anda terlebih dahulu.",
    "pulsa": "Silakan pilih layanan pulsa seperti Pulsa Reguler, Paket Data, atau Transfer Pulsa.",
    "transfer": "Silakan pilih layanan transfer seperti Transfer Bank, Transfer E-Money, atau Topup E-Money.",
    "ppob": "Silakan pilih layanan PPOB seperti Token PLN, PDAM, BPJS, Internet, TV Kabel, atau Telkom.",
    "lainnya": "Layanan lainnya meliputi Voucher Game, Voucher Streaming, Asuransi, dan Donasi.",
    "menu": "Silakan pilih kategori layanan yang tersedia: Pulsa, Transfer, PPOB, atau Lainnya."
};

// Fungsi untuk menangani pesan teks saat ada form aktif
function handleFormMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Jika user ingin kembali ke menu
    if (lowerMessage.includes('menu') || lowerMessage.includes('kembali') || lowerMessage.includes('batal') || lowerMessage.includes('keluar')) {
        currentStep = 'main_menu';
        currentForm = '';
        showMainMenu();
        return "Anda telah kembali ke menu utama. Silakan pilih layanan yang tersedia.";
    }
    
    // Jika user mengetik layanan lain saat form aktif
    if (lowerMessage.includes('pulsa') || lowerMessage.includes('transfer') || lowerMessage.includes('ppob') || lowerMessage.includes('lainnya')) {
        return "Silakan selesaikan atau batalkan form yang sedang diisi terlebih dahulu, atau ketik <strong>menu</strong> untuk kembali ke menu utama.";
    }
    
    // Default response saat form aktif
    return "Silakan isi form yang tersedia di atas, atau ketik <strong>menu</strong> untuk kembali ke menu layanan kami.";
}

// Fungsi untuk menangani pesan teks
function handleTextMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Jika sedang dalam form, arahkan ke handler form
    if (currentStep === 'form' && currentForm !== '') {
        return handleFormMessage(message);
    }
    
    // Cek apakah ada jawaban yang sesuai di database
    for (const [key, value] of Object.entries(qaDatabase)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }

    // Jika tidak ada jawaban yang sesuai
    return "Maaf, saya belum memahami pertanyaan tersebut. Silakan pilih layanan yang tersedia atau hubungi kami langsung.";
}

// Fungsi untuk mengirim pesan
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Tambahkan pesan user
    addMessage(message, true);
    playSendSound(); // Bunyi saat user mengirim pesan
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Proses berdasarkan step saat ini
    if (currentStep === 'ask_phone') {
        // Validasi nomor WhatsApp
        if (isValidPhoneNumber(message)) {
            userPhoneNumber = message;
            setTimeout(() => {
                addMessageWithDelay("Terima kasih! Nomor WhatsApp Anda telah terdaftar.").then(() => {
                    showMainMenu();
                });
            }, 500);
        } else {
            setTimeout(() => {
                addMessageWithDelay("Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890)");
            }, 500);
        }
        return;
    }

    // Untuk step lainnya, tangani pesan teks
    if (currentStep !== 'form') {
        // Tampilkan indikator mengetik
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulasi delay untuk response
        setTimeout(() => {
            // Hapus indikator mengetik
            if (document.getElementById('typing-indicator')) {
                document.getElementById('typing-indicator').remove();
            }

            // Generate response
            const responseText = handleTextMessage(message);
            addMessageWithDelay(responseText).then(() => {
                // Jika tidak ada jawaban yang cocok, tampilkan menu
                const lowerMessage = message.toLowerCase().trim();
                let found = false;
                for (const key of Object.keys(qaDatabase)) {
                    if (lowerMessage.includes(key)) {
                        found = true;
                        break;
                    }
                }
                
                if (!found && currentStep === 'main_menu') {
                    setTimeout(showMainMenu, 500);
                }
            });
        }, 1000);
    } else {
        // Jika sedang dalam form, tangani pesan form
        setTimeout(() => {
            // Tampilkan indikator mengetik
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.id = 'typing-indicator';
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Simulasi delay untuk response
            setTimeout(() => {
                // Hapus indikator mengetik
                if (document.getElementById('typing-indicator')) {
                    document.getElementById('typing-indicator').remove();
                }

                // Generate response
                const responseText = handleFormMessage(message);
                addMessageWithDelay(responseText);
            }, 1000);
        }, 500);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Focus input saat halaman dimuat
messageInput.focus();
