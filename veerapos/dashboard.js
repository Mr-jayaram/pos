/* Dashboard Logic */

function initDashboard() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 &&
                !sidebar.contains(e.target) &&
                !mobileMenuBtn.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Date
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // Settings Modal Logic
    setupSettingsModal();

    renderCharts();
}

function setupSettingsModal() {
    let gstEnabled = localStorage.getItem('gstEnabled') === 'true'; // Persist state

    const settingsModal = document.getElementById('settings-modal');
    const gstToggle = document.getElementById('gst-toggle');
    const closeSettingsBtn = document.getElementById('close-settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const settingsMenuBtn = document.querySelector('.menu-item[title="Settings"]');

    // Open Settings
    if (settingsMenuBtn) {
        settingsMenuBtn.addEventListener('click', () => {
            if (gstToggle) gstToggle.checked = gstEnabled; // Sync UI
            if (settingsModal) settingsModal.classList.remove('hidden');
        });
    }

    // Close Settings
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            if (settingsModal) settingsModal.classList.add('hidden');
        });
    }

    // Save Settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            gstEnabled = gstToggle.checked;
            localStorage.setItem('gstEnabled', gstEnabled); // Save to local storage
            if (settingsModal) settingsModal.classList.add('hidden');
            // No need to update totals on dashboard as it's read-only
        });
    }
}

function renderCharts() {
    if (typeof ApexCharts === 'undefined') return;

    // Sales Chart
    const salesOptions = {
        series: [{
            name: 'Total Purchase',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Total Sales',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        chart: {
            type: 'bar',
            height: 320,
            toolbar: { show: false },
            fontFamily: 'Outfit, sans-serif'
        },
        colors: ['#fdba74', '#ea580c'], // Updated to match Orange Theme
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
                borderRadius: 4,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: ['2 am', '4 am', '6 am', '8 am', '10 am', '12 am', '14 pm', '16 pm', '18 pm'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8' } }
        },
        yaxis: {
            labels: { style: { colors: '#94a3b8' } }
        },
        fill: { opacity: 1 },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
        },
        legend: { show: false }
    };

    const salesChart = new ApexCharts(document.querySelector("#sales-chart"), salesOptions);
    salesChart.render();

    // Customer Donut
    const customerOptions = {
        series: [5500, 3500],
        labels: ['First Time', 'Return'],
        chart: {
            type: 'donut',
            height: 220,
            fontFamily: 'Outfit, sans-serif'
        },
        colors: ['#ea580c', '#10b981'], // Use Orange/Green
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: false
                    }
                }
            }
        },
        stroke: { width: 0 }
    };

    const customerChart = new ApexCharts(document.querySelector("#customer-chart"), customerOptions);
    customerChart.render();
}

// Run init
initDashboard();
