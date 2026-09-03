/* ===== CONFIG ===== */
const FRIZERS = {
    1: { name: 'Frizer 1', color: '#C0392B', gradient: 'linear-gradient(135deg, #C0392B, #E74C3C)', password: 'frizer1' },
    2: { name: 'Frizer 2', color: '#2980B9', gradient: 'linear-gradient(135deg, #2980B9, #3498DB)', password: 'frizer2' },
    3: { name: 'Frizer 3', color: '#1a1a1a', gradient: 'linear-gradient(135deg, #1a1a1a, #333)', password: 'frizer3' }
};

const SERVICES = {
    'Šišanje': { price: 1200, duration: 60 },
    'Feniranje': { price: 800, duration: 45 },
    'Bojenje': { price: 3500, duration: 120 },
    'Svečana frizura': { price: 2500, duration: 90 },
    'Nega kose': { price: 1500, duration: 60 },
    'Manikir': { price: 1000, duration: 45 },
    'Pedikir': { price: 1200, duration: 60 },
    'Šminkanje': { price: 2000, duration: 60 }
};

const HOURS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const DAY_NAMES = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
const DAY_SHORT = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

/* ===== STATE ===== */
let currentUser = null;
let currentWeekOffset = 0;
let selectedSlot = null;
let editingAppointment = null;

/* ===== STORAGE ===== */
function getStorageKey() {
    return 'minea_appointments_v2';
}

function loadAppointments() {
    try {
        return JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    } catch(e) {
        return [];
    }
}

function saveAppointments(list) {
    localStorage.setItem(getStorageKey(), JSON.stringify(list));
}

function getSession() {
    try {
        return JSON.parse(sessionStorage.getItem('minea_session') || 'null');
    } catch(e) {
        return null;
    }
}

function setSession(session) {
    sessionStorage.setItem('minea_session', JSON.stringify(session));
}

function clearSession() {
    sessionStorage.removeItem('minea_session');
}

/* ===== DATE UTILS ===== */
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateDisplay(date) {
    return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(date) {
    return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function isPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/* ===== AUTH ===== */
let selectedFrizerId = null;

function selectFrizer(id) {
    selectedFrizerId = id;
    document.querySelectorAll('.frizer-card').forEach(card => {
        card.classList.toggle('selected', parseInt(card.dataset.id) === id);
    });
    document.getElementById('password-section').classList.remove('hidden');
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
    document.getElementById('login-error').classList.add('hidden');
}

function doLogin() {
    const password = document.getElementById('password-input').value;
    if (!selectedFrizerId) {
        showToast('Izaberite frizera prvo');
        return;
    }

    const frizer = FRIZERS[selectedFrizerId];
    if (password === frizer.password) {
        currentUser = selectedFrizerId;
        setSession({ frizerId: selectedFrizerId, loginTime: new Date().toISOString() });
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        initApp();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
        document.getElementById('password-input').value = '';
        document.getElementById('password-input').focus();
    }
}

function logout() {
    currentUser = null;
    selectedFrizerId = null;
    currentWeekOffset = 0;
    clearSession();
    document.getElementById('app-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
    document.querySelectorAll('.frizer-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('password-section').classList.add('hidden');
    document.getElementById('password-input').value = '';
    document.getElementById('login-error').classList.add('hidden');
}

function checkSession() {
    const session = getSession();
    if (session && session.frizerId && FRIZERS[session.frizerId]) {
        currentUser = session.frizerId;
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        initApp();
        return true;
    }
    return false;
}

/* ===== APP INIT ===== */
function initApp() {
    const frizer = FRIZERS[currentUser];
    document.getElementById('user-avatar').textContent = 'F' + currentUser;
    document.getElementById('sidebar-user-name').textContent = frizer.name;
    document.getElementById('user-avatar').style.background = frizer.gradient;

    document.getElementById('header-date').textContent = formatDateDisplay(new Date());

    showView('calendar');
    renderCalendar();
    renderClients();
    renderStats();
}

/* ===== NAVIGATION ===== */
function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById('view-' + viewName).classList.add('active');
    event.currentTarget.classList.add('active');

    const titles = {
        calendar: 'Kalendar',
        clients: 'Klijenti',
        stats: 'Statistika'
    };
    document.getElementById('page-title').textContent = titles[viewName];

    if (viewName === 'clients') renderClients();
    if (viewName === 'stats') renderStats();
}

/* ===== CALENDAR ===== */
function changeWeek(offset) {
    currentWeekOffset += offset;
    renderCalendar();
}

function goToToday() {
    currentWeekOffset = 0;
    renderCalendar();
}

function renderCalendar() {
    const today = new Date();
    const weekStart = getWeekStart(today);
    weekStart.setDate(weekStart.getDate() + currentWeekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
    }

    // Week range label
    const endDay = days[6];
    document.getElementById('week-range').textContent = 
        formatDateShort(weekStart) + ' — ' + formatDateShort(endDay);

    // Header
    const headerEl = document.getElementById('calendar-header');
    headerEl.innerHTML = '<div class="cal-header-cell time-header"><span>VREME</span></div>' +
        days.map((d, i) => {
            const todayClass = isToday(d) ? 'today' : '';
            return `<div class="cal-header-cell ${todayClass}">
                <div class="day-name">${DAY_SHORT[i]}</div>
                <div class="day-num">${d.getDate()}</div>
            </div>`;
        }).join('');

    // Body
    const apps = loadAppointments();
    const bodyEl = document.getElementById('calendar-body');

    bodyEl.innerHTML = HOURS.map(hour => {
        return `<div class="cal-row">
            <div class="time-slot">${hour}</div>
            ${days.map((d, di) => {
                const dateStr = formatDate(d);
                const slotKey = `${dateStr}_${hour}`;
                const slotApps = apps.filter(a => a.date === dateStr && a.time === hour);
                const pastClass = isPast(d) ? 'past' : '';
                const hasApp = slotApps.length > 0 ? 'has-appointment' : '';

                return `<div class="day-slot ${pastClass} ${hasApp}" data-date="${dateStr}" data-time="${hour}" onclick="handleSlotClick('${dateStr}', '${hour}')">
                    ${slotApps.map(a => renderAppointmentCard(a)).join('')}
                </div>`;
            }).join('')}
        </div>`;
    }).join('');
}

function renderAppointmentCard(app) {
    const frizer = FRIZERS[app.frizerId];
    const isMine = app.frizerId === currentUser;
    const canEdit = isMine && !isPast(new Date(app.date));

    return `<div class="appointment-card" style="background: ${frizer.gradient}; border-left-color: ${frizer.color};">
        <div class="app-client">${escapeHtml(app.client)}</div>
        <div class="app-service">${escapeHtml(app.service)}</div>
        <div class="app-time-small">${app.duration} min</div>
        ${canEdit ? `<div class="app-actions">
            <button class="app-btn" onclick="event.stopPropagation(); editAppointment('${app.id}')" title="Izmeni">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
            </button>
            <button class="app-btn" onclick="event.stopPropagation(); deleteAppointment('${app.id}')" title="Obriši">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>` : ''}
    </div>`;
}

function handleSlotClick(date, time) {
    if (isPast(new Date(date))) return;

    const apps = loadAppointments();
    const existing = apps.filter(a => a.date === date && a.time === time && a.frizerId === currentUser);

    if (existing.length > 0) {
        showToast('Već imate termin u ovom slotu');
        return;
    }

    openNewAppointmentModal(date, time);
}

/* ===== APPOINTMENT MODAL ===== */
function openNewAppointmentModal(date, time) {
    editingAppointment = null;
    document.getElementById('modal-title').textContent = 'Novi termin';
    document.getElementById('edit-id').value = '';
    document.getElementById('app-client').value = '';
    document.getElementById('app-date').value = date || formatDate(new Date());
    document.getElementById('app-time').value = time || '09:00';
    document.getElementById('app-service').value = 'Šišanje';
    document.getElementById('app-duration').value = '60';
    document.getElementById('app-note').value = '';
    document.getElementById('btn-delete').classList.add('hidden');

    document.getElementById('appointment-modal').classList.remove('hidden');
    setTimeout(() => document.getElementById('app-client').focus(), 50);
}

function editAppointment(id) {
    const apps = loadAppointments();
    const app = apps.find(a => a.id === id);
    if (!app) return;

    if (app.frizerId !== currentUser) {
        showToast('Možete menjati samo svoje termine');
        return;
    }

    editingAppointment = app;
    document.getElementById('modal-title').textContent = 'Izmeni termin';
    document.getElementById('edit-id').value = app.id;
    document.getElementById('app-client').value = app.client;
    document.getElementById('app-date').value = app.date;
    document.getElementById('app-time').value = app.time;
    document.getElementById('app-service').value = app.service;
    document.getElementById('app-duration').value = app.duration;
    document.getElementById('app-note').value = app.note || '';
    document.getElementById('btn-delete').classList.remove('hidden');

    document.getElementById('appointment-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('appointment-modal').classList.add('hidden');
    editingAppointment = null;
}

function saveAppointment() {
    const client = document.getElementById('app-client').value.trim();
    const date = document.getElementById('app-date').value;
    const time = document.getElementById('app-time').value;
    const service = document.getElementById('app-service').value;
    const duration = parseInt(document.getElementById('app-duration').value);
    const note = document.getElementById('app-note').value.trim();

    if (!client) {
        showToast('Unesite ime klijenta');
        document.getElementById('app-client').focus();
        return;
    }

    if (!date) {
        showToast('Izaberite datum');
        return;
    }

    let apps = loadAppointments();

    if (editingAppointment) {
        // Update existing
        const idx = apps.findIndex(a => a.id === editingAppointment.id);
        if (idx !== -1) {
            apps[idx] = {
                ...editingAppointment,
                client,
                date,
                time,
                service,
                duration,
                note,
                updatedAt: new Date().toISOString()
            };
        }
        showToast('Termin uspešno izmenjen');
    } else {
        // Check for conflicts
        const conflict = apps.find(a => a.date === date && a.time === time && a.frizerId === currentUser);
        if (conflict) {
            showToast('Već imate termin u ovom slotu');
            return;
        }

        // Create new
        apps.push({
            id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            frizerId: currentUser,
            client,
            date,
            time,
            service,
            duration,
            note,
            createdAt: new Date().toISOString()
        });
        showToast('Termin uspešno zakazan');
    }

    saveAppointments(apps);
    closeModal();
    renderCalendar();
    renderClients();
    renderStats();
}

function deleteAppointment(id) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) return;

    let apps = loadAppointments();
    const app = apps.find(a => a.id === id);

    if (app && app.frizerId !== currentUser) {
        showToast('Možete brisati samo svoje termine');
        return;
    }

    apps = apps.filter(a => a.id !== id);
    saveAppointments(apps);
    closeModal();
    renderCalendar();
    renderClients();
    renderStats();
    showToast('Termin obrisan');
}

/* ===== CLIENTS ===== */
function renderClients() {
    const apps = loadAppointments();
    const search = document.getElementById('client-search').value.toLowerCase();

    // Group by client
    const clients = {};
    apps.forEach(app => {
        const key = app.client.toLowerCase();
        if (!clients[key]) {
            clients[key] = {
                name: app.client,
                visits: 0,
                services: new Set(),
                lastVisit: app.date
            };
        }
        clients[key].visits++;
        clients[key].services.add(app.service);
        if (app.date > clients[key].lastVisit) {
            clients[key].lastVisit = app.date;
        }
    });

    let clientList = Object.values(clients);
    if (search) {
        clientList = clientList.filter(c => c.name.toLowerCase().includes(search));
    }

    clientList.sort((a, b) => b.visits - a.visits);

    const grid = document.getElementById('clients-grid');
    if (clientList.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-tertiary);">' +
            '<p>Nema pronađenih klijenata</p></div>';
        return;
    }

    grid.innerHTML = clientList.map(c => {
        const initials = c.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const services = Array.from(c.services).slice(0, 3);

        return `<div class="client-card">
            <div class="client-card-header">
                <div class="client-avatar">${initials}</div>
                <div>
                    <div class="client-name">${escapeHtml(c.name)}</div>
                    <div class="client-visits">${c.visits} poseta · Poslednja: ${formatDateShort(new Date(c.lastVisit))}</div>
                </div>
            </div>
            <div class="client-services">
                ${services.map(s => `<span class="service-tag">${escapeHtml(s)}</span>`).join('')}
                ${c.services.size > 3 ? `<span class="service-tag">+${c.services.size - 3}</span>` : ''}
            </div>
        </div>`;
    }).join('');
}

function filterClients() {
    renderClients();
}

/* ===== STATISTICS ===== */
function renderStats() {
    const apps = loadAppointments();

    // Total clients
    const uniqueClients = new Set(apps.map(a => a.client.toLowerCase()));
    document.getElementById('stat-total-clients').textContent = uniqueClients.size;

    // Total appointments
    document.getElementById('stat-total-appointments').textContent = apps.length;

    // Total hours
    const totalMinutes = apps.reduce((sum, a) => sum + (parseInt(a.duration) || 60), 0);
    document.getElementById('stat-hours').textContent = Math.round(totalMinutes / 60);

    // Revenue
    const revenue = apps.reduce((sum, a) => sum + (SERVICES[a.service]?.price || 0), 0);
    document.getElementById('stat-revenue').textContent = revenue.toLocaleString('sr-RS') + ' RSD';

    // Chart: by frizer
    const frizerCounts = { 1: 0, 2: 0, 3: 0 };
    apps.forEach(a => { if (frizerCounts[a.frizerId] !== undefined) frizerCounts[a.frizerId]++; });
    const maxFrizer = Math.max(...Object.values(frizerCounts), 1);

    document.getElementById('chart-frizers').innerHTML = Object.entries(frizerCounts).map(([id, count]) => {
        const f = FRIZERS[id];
        const pct = (count / maxFrizer * 100).toFixed(1);
        return `<div class="chart-bar-item">
            <div class="chart-bar-header">
                <span class="chart-bar-label">${f.name}</span>
                <span class="chart-bar-value">${count} termina</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${pct}%; background: ${f.gradient};"></div>
            </div>
        </div>`;
    }).join('');

    // Chart: by service
    const serviceCounts = {};
    apps.forEach(a => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
    const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxService = Math.max(...sortedServices.map(s => s[1]), 1);

    document.getElementById('chart-services').innerHTML = sortedServices.map(([service, count]) => {
        const pct = (count / maxService * 100).toFixed(1);
        return `<div class="chart-bar-item">
            <div class="chart-bar-header">
                <span class="chart-bar-label">${escapeHtml(service)}</span>
                <span class="chart-bar-value">${count}</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${pct}%;"></div>
            </div>
        </div>`;
    }).join('');
}

/* ===== TOAST ===== */
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

/* ===== UTILS ===== */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===== SEED DATA ===== */
function seedDemoData() {
    const key = getStorageKey();
    if (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key)).length > 0) {
        return; // Already has data
    }

    const today = new Date();
    const weekStart = getWeekStart(today);

    const demoData = [
        { id: 'd1', frizerId: 1, client: 'Ana Petrović', date: formatDate(today), time: '10:00', service: 'Šišanje', duration: 60, note: '' },
        { id: 'd2', frizerId: 2, client: 'Marko Jovanović', date: formatDate(today), time: '11:00', service: 'Bojenje', duration: 90, note: 'Plava boja' },
        { id: 'd3', frizerId: 3, client: 'Jovana Nikolić', date: formatDate(today), time: '14:00', service: 'Feniranje', duration: 45, note: '' },
        { id: 'd4', frizerId: 1, client: 'Milica Stojanović', date: formatDate(addDays(today, 1)), time: '09:30', service: 'Manikir', duration: 45, note: '' },
        { id: 'd5', frizerId: 2, client: 'Stefan Đorđević', date: formatDate(addDays(today, 1)), time: '15:00', service: 'Šišanje', duration: 60, note: '' },
        { id: 'd6', frizerId: 3, client: 'Tamara Ilić', date: formatDate(addDays(today, 2)), time: '10:00', service: 'Svečana frizura', duration: 90, note: 'Za venčanje' },
        { id: 'd7', frizerId: 1, client: 'Nikola Marković', date: formatDate(addDays(today, -1)), time: '16:00', service: 'Šišanje', duration: 30, note: '' },
        { id: 'd8', frizerId: 2, client: 'Marija Popović', date: formatDate(addDays(today, -1)), time: '11:30', service: 'Nega kose', duration: 60, note: '' },
    ];

    localStorage.setItem(key, JSON.stringify(demoData));
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    seedDemoData();

    // Check for existing session
    if (!checkSession()) {
        document.getElementById('login-screen').classList.add('active');
    }

    // Close modal on overlay click
    document.getElementById('appointment-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
