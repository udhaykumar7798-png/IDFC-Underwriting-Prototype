// Global Application State
let currentView = 'loan-officer';
let currentModule = 'dashboard';

// Sample Data
const sampleCustomers = [
    {
        name: "Rohit Sharma",
        age: 28,
        type: "Salaried",
        location: "Pune",
        loan_amount: "25,00,000",
        mobile: "9876543210",
        pan: "ABCDE1234F",
        upi_transactions: 450,
        payment_failures: 2,
        risk_score: 720,
        avg_spend: "₹45,000",
        utility_score: 85,
        on_time_payments: "92%"
    },
    {
        name: "Shabir Ahmed",
        age: 35,
        type: "MSME Owner",
        location: "Indore",
        loan_amount: "18,00,000",
        mobile: "9876543211",
        pan: "FGHIJ5678K",
        upi_transactions: 280,
        payment_failures: 5,
        risk_score: 680,
        avg_spend: "₹32,000",
        utility_score: 78,
        on_time_payments: "88%"
    }
];

const circleRates = [
    {city: "Pune", area: "Baner", rate: "12,500", market_rate: "18,000"},
    {city: "Indore", area: "Vijay Nagar", rate: "8,500", market_rate: "12,000"},
    {city: "Nashik", area: "College Road", rate: "6,800", market_rate: "9,500"}
];

// Charts
let riskChart = null;
let valuationChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showDashboard();
    updateViewBasedOnRole();
}

function setupEventListeners() {
    // Role toggle
    const roleToggle = document.getElementById('roleToggle');
    if (roleToggle) {
        roleToggle.addEventListener('change', toggleUserRole);
    }

    // Form validations
    setupFormValidation();
}

// Navigation Functions
function showDashboard() {
    hideAllModules();
    document.getElementById('dashboard').classList.remove('hidden');
    currentModule = 'dashboard';
}

function showModule(moduleName) {
    hideAllModules();
    
    if (currentView === 'consumer' && moduleName === 'underwriting') {
        // Redirect consumers to simplified view
        document.getElementById('consumer-view').classList.remove('hidden');
        currentModule = 'consumer';
        return;
    }
    
    const moduleElement = document.getElementById(moduleName + '-module');
    if (moduleElement) {
        moduleElement.classList.remove('hidden');
        currentModule = moduleName;
    }
}

function hideAllModules() {
    const modules = ['dashboard', 'underwriting-module', 'valuation-module', 'consumer-view'];
    modules.forEach(moduleId => {
        const element = document.getElementById(moduleId);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

// Role Toggle - Fixed
function toggleUserRole() {
    const roleToggle = document.getElementById('roleToggle');
    const toggleText = document.querySelector('.toggle-text');
    const userNameElement = document.querySelector('.user-name');
    
    if (roleToggle.checked) {
        currentView = 'consumer';
        toggleText.textContent = 'Loan Officer View';
        userNameElement.textContent = 'Rohit Sharma';
        showConsumerView();
    } else {
        currentView = 'loan-officer';
        toggleText.textContent = 'Consumer View';
        userNameElement.textContent = 'Loan Officer';
        showDashboard();
    }
    
    updateViewBasedOnRole();
}

function showConsumerView() {
    hideAllModules();
    document.getElementById('consumer-view').classList.remove('hidden');
    currentModule = 'consumer';
}

function updateViewBasedOnRole() {
    const dashboardStats = document.querySelector('.quick-stats');
    const moduleSelector = document.querySelector('.module-selector');
    const dashboardHeader = document.querySelector('.dashboard-header h1');
    
    if (currentView === 'consumer') {
        // Show consumer-specific content
        if (dashboardStats) {
            dashboardStats.style.display = 'none';
        }
        if (moduleSelector) {
            moduleSelector.style.display = 'none';
        }
        if (dashboardHeader) {
            dashboardHeader.textContent = 'Welcome Back, Rohit';
        }
    } else {
        // Show loan officer content
        if (dashboardStats) {
            dashboardStats.style.display = 'grid';
        }
        if (moduleSelector) {
            moduleSelector.style.display = 'grid';
        }
        if (dashboardHeader) {
            dashboardHeader.textContent = 'Dashboard Overview';
        }
    }
}

// Form Validation
function setupFormValidation() {
    const panInput = document.getElementById('panNumber');
    const mobileInput = document.getElementById('mobileNumber');
    
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            validatePAN(this);
        });
    }
    
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            validateMobile(this);
        });
    }
}

function validatePAN(input) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const isValid = panRegex.test(input.value);
    
    if (input.value.length > 0) {
        if (isValid) {
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '#dc3545';
        }
    } else {
        input.style.borderColor = '';
    }
}

function validateMobile(input) {
    const mobileRegex = /^[6-9]\d{9}$/;
    const isValid = mobileRegex.test(input.value);
    
    if (input.value.length > 0) {
        if (isValid) {
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '#dc3545';
        }
    } else {
        input.style.borderColor = '';
    }
}

// Alternative Underwriting Functions
function analyzeCustomer() {
    const customerName = document.getElementById('customerName').value;
    const employmentType = document.getElementById('employmentType').value;
    
    if (!customerName || !employmentType) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    const analyzeButton = document.querySelector('button[onclick="analyzeCustomer()"]');
    analyzeButton.textContent = 'Analyzing...';
    analyzeButton.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        const customerData = getCustomerData(customerName);
        displayAlternativeDataAnalysis(customerData);
        displayRiskAssessment(customerData);
        
        analyzeButton.textContent = 'Analyze Customer';
        analyzeButton.classList.remove('loading');
    }, 2000);
}

function getCustomerData(name) {
    // Check if name matches sample customers or generate mock data
    const sampleCustomer = sampleCustomers.find(customer => 
        customer.name.toLowerCase().includes(name.toLowerCase())
    );
    
    if (sampleCustomer) {
        return sampleCustomer;
    }
    
    // Generate mock data for other customers
    return {
        name: name,
        upi_transactions: Math.floor(Math.random() * 400) + 200,
        payment_failures: Math.floor(Math.random() * 8) + 1,
        risk_score: Math.floor(Math.random() * 200) + 600,
        avg_spend: `₹${(Math.floor(Math.random() * 50000) + 20000).toLocaleString()}`,
        utility_score: Math.floor(Math.random() * 30) + 70,
        on_time_payments: `${Math.floor(Math.random() * 20) + 80}%`
    };
}

function displayAlternativeDataAnalysis(customerData) {
    document.getElementById('upiTransactions').textContent = customerData.upi_transactions;
    document.getElementById('paymentSuccess').textContent = `${100 - (customerData.payment_failures * 2)}%`;
    document.getElementById('avgSpend').textContent = customerData.avg_spend;
    document.getElementById('paymentFailures').textContent = customerData.payment_failures;
    document.getElementById('utilityScore').textContent = `${customerData.utility_score}/100`;
    document.getElementById('onTimePayments').textContent = customerData.on_time_payments;
}

function displayRiskAssessment(customerData) {
    const riskScore = customerData.risk_score;
    document.getElementById('riskScore').textContent = riskScore;
    
    // Determine recommendation
    let recommendation, status, details;
    if (riskScore >= 750) {
        recommendation = 'APPROVED';
        status = 'status--approved';
        details = 'Excellent credit profile. Customer shows strong financial behavior with consistent payment patterns. Recommend approval with standard terms.';
    } else if (riskScore >= 680) {
        recommendation = 'MANUAL REVIEW';
        status = 'status--manual-review';
        details = 'Good credit profile with some areas of concern. Recommend manual review to assess specific risk factors before final decision.';
    } else {
        recommendation = 'REJECTED';
        status = 'status--rejected';
        details = 'High risk profile detected. Multiple payment failures and inconsistent financial behavior. Not recommended for approval.';
    }
    
    const recommendationElement = document.getElementById('recommendationStatus');
    const detailsElement = document.getElementById('recommendationDetails');
    const badgeElement = document.getElementById('recommendationBadge');
    
    recommendationElement.textContent = recommendation;
    recommendationElement.className = `status ${status}`;
    detailsElement.textContent = details;
    
    // Create risk factors chart
    createRiskChart(customerData);
}

function createRiskChart(customerData) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    if (riskChart) {
        riskChart.destroy();
    }
    
    riskChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Payment History',
                'UPI Activity',
                'Spending Pattern',
                'Utility Payments',
                'Digital Footprint',
                'Financial Stability'
            ],
            datasets: [{
                label: 'Risk Factors',
                data: [
                    Math.min(100 - customerData.payment_failures * 10, 100),
                    Math.min(customerData.upi_transactions / 5, 100),
                    Math.random() * 30 + 70,
                    customerData.utility_score,
                    Math.random() * 25 + 65,
                    Math.min(customerData.risk_score / 8.5, 100)
                ],
                fill: true,
                backgroundColor: 'rgba(156, 29, 38, 0.2)',
                borderColor: '#9C1D26',
                pointBackgroundColor: '#9C1D26',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#9C1D26'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 2
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Property Valuation Functions
function valuateProperty() {
    const propertyType = document.getElementById('propertyType').value;
    const city = document.getElementById('propertyCity').value;
    const area = document.getElementById('propertyArea').value;
    const size = document.getElementById('propertySize').value;
    
    if (!propertyType || !city || !area || !size) {
        alert('Please fill in all property details');
        return;
    }
    
    // Show loading state
    const valuateButton = document.querySelector('button[onclick="valuateProperty()"]');
    valuateButton.textContent = 'Calculating...';
    valuateButton.classList.add('loading');
    
    setTimeout(() => {
        const valuationData = calculatePropertyValuation(city, area, size);
        displayValuationResults(valuationData);
        
        valuateButton.textContent = 'Get Valuation';
        valuateButton.classList.remove('loading');
    }, 2500);
}

function calculatePropertyValuation(city, area, size) {
    // Find circle rate data
    const rateData = circleRates.find(rate => 
        rate.city.toLowerCase() === city.toLowerCase() && 
        rate.area.toLowerCase().includes(area.toLowerCase())
    ) || circleRates[0]; // Fallback to first entry
    
    const circleRate = parseInt(rateData.rate.replace(',', ''));
    const marketRate = parseInt(rateData.market_rate.replace(',', ''));
    const propertySize = parseInt(size);
    
    const circleValue = circleRate * propertySize;
    const marketValue = marketRate * propertySize;
    const estimatedValue = (circleValue + marketValue) / 2;
    
    return {
        circleRate: `₹${circleRate.toLocaleString()}/sq ft`,
        marketRate: `₹${marketRate.toLocaleString()}/sq ft`,
        geoData: 'Verified',
        registryData: 'Clear Title',
        estimatedValue: estimatedValue,
        confidenceScore: Math.floor(Math.random() * 15) + 85,
        maxLoanAmount: estimatedValue * 0.8
    };
}

function displayValuationResults(valuationData) {
    document.getElementById('circleRate').textContent = valuationData.circleRate;
    document.getElementById('marketRate').textContent = valuationData.marketRate;
    document.getElementById('geoData').textContent = valuationData.geoData;
    document.getElementById('registryData').textContent = valuationData.registryData;
    
    document.getElementById('estimatedValue').textContent = 
        (valuationData.estimatedValue / 100000).toFixed(1) + 'L';
    document.getElementById('confidenceScore').textContent = valuationData.confidenceScore;
    document.getElementById('maxLoanAmount').textContent = 
        `₹${(valuationData.maxLoanAmount / 100000).toFixed(1)} Lakhs`;
    
    createValuationChart(valuationData);
}

function createValuationChart(valuationData) {
    const ctx = document.getElementById('valuationChart').getContext('2d');
    
    if (valuationChart) {
        valuationChart.destroy();
    }
    
    const circleRate = parseInt(document.getElementById('circleRate').textContent.replace(/[₹,\/sq ft]/g, ''));
    const marketRate = parseInt(document.getElementById('marketRate').textContent.replace(/[₹,\/sq ft]/g, ''));
    
    valuationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Circle Rate', 'Market Rate', 'Estimated Value', 'Loan Eligibility'],
            datasets: [{
                label: 'Amount (₹/sq ft)',
                data: [
                    circleRate,
                    marketRate,
                    (circleRate + marketRate) / 2,
                    ((circleRate + marketRate) / 2) * 0.8
                ],
                backgroundColor: [
                    '#1FB8CD',
                    '#FFC185',
                    '#9C1D26',
                    '#B4413C'
                ],
                borderColor: [
                    '#1FB8CD',
                    '#FFC185',
                    '#9C1D26',
                    '#B4413C'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Modal Functions
function generateDetailedReport() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Detailed Property Valuation Report';
    
    const reportContent = `
        <div class="report-section">
            <h4>Property Assessment Summary</h4>
            <div class="report-item">
                <strong>Property Type:</strong> ${document.getElementById('propertyType').value || 'Not specified'}
            </div>
            <div class="report-item">
                <strong>Location:</strong> ${document.getElementById('propertyArea').value}, ${document.getElementById('propertyCity').value}
            </div>
            <div class="report-item">
                <strong>Area:</strong> ${document.getElementById('propertySize').value} sq ft
            </div>
        </div>
        
        <div class="report-section">
            <h4>Valuation Analysis</h4>
            <div class="report-item">
                <strong>Circle Rate:</strong> ${document.getElementById('circleRate').textContent}
            </div>
            <div class="report-item">
                <strong>Market Rate:</strong> ${document.getElementById('marketRate').textContent}
            </div>
            <div class="report-item">
                <strong>Estimated Value:</strong> ₹${document.getElementById('estimatedValue').textContent}
            </div>
            <div class="report-item">
                <strong>Confidence Score:</strong> ${document.getElementById('confidenceScore').textContent}%
            </div>
        </div>
        
        <div class="report-section">
            <h4>Data Sources</h4>
            <ul>
                <li>Government Circle Rate Database</li>
                <li>GPS Geo-tagging Verification</li>
                <li>Property Registry Records</li>
                <li>Satellite Imagery Analysis</li>
                <li>Comparable Sales Data</li>
                <li>Infrastructure Development Plans</li>
            </ul>
        </div>
        
        <div class="report-section">
            <h4>Risk Assessment</h4>
            <div class="report-item">
                <strong>Title Status:</strong> Clear
            </div>
            <div class="report-item">
                <strong>Legal Compliance:</strong> Verified
            </div>
            <div class="report-item">
                <strong>Market Liquidity:</strong> High
            </div>
        </div>
    `;
    
    modalBody.innerHTML = reportContent;
    showModal();
}

function requestLoanQuote() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Loan Quote Request';
    
    const maxLoan = document.getElementById('maxLoanAmount').textContent;
    const interestRate = (Math.random() * 2 + 8.5).toFixed(2);
    
    const quoteContent = `
        <div class="quote-section">
            <h4>Loan Eligibility Details</h4>
            <div class="quote-item">
                <strong>Maximum Loan Amount:</strong> ${maxLoan}
            </div>
            <div class="quote-item">
                <strong>Interest Rate:</strong> ${interestRate}% p.a. onwards
            </div>
            <div class="quote-item">
                <strong>Loan Tenure:</strong> Up to 30 years
            </div>
            <div class="quote-item">
                <strong>Processing Fee:</strong> 0.50% of loan amount
            </div>
        </div>
        
        <div class="quote-section">
            <h4>EMI Calculator</h4>
            <p>For a loan of ${maxLoan} at ${interestRate}% for 20 years:</p>
            <div class="emi-display">
                <strong>Monthly EMI: ₹${calculateEMI(parseFloat(maxLoan.replace(/[₹,Lakhs\s]/g, '')) * 100000, parseFloat(interestRate), 20).toLocaleString()}</strong>
            </div>
        </div>
        
        <div class="quote-section">
            <h4>Next Steps</h4>
            <ol>
                <li>Submit formal loan application</li>
                <li>Property legal verification</li>
                <li>Credit assessment and approval</li>
                <li>Final disbursement</li>
            </ol>
        </div>
        
        <div class="quote-section">
            <p><em>This is an indicative quote. Final terms subject to credit assessment and property verification.</em></p>
        </div>
    `;
    
    modalBody.innerHTML = quoteContent;
    showModal();
}

function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
}

function showModal() {
    document.getElementById('reportModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('reportModal').classList.add('hidden');
}

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Add some sample data loading for demo purposes
function loadSampleCustomerData() {
    const customerForm = document.getElementById('customerForm');
    if (!customerForm) return;
    
    const customerSelect = document.createElement('select');
    customerSelect.className = 'form-control';
    customerSelect.innerHTML = `
        <option value="">Select sample customer</option>
        <option value="Rohit Sharma">Rohit Sharma (Salaried)</option>
        <option value="Shabir Ahmed">Shabir Ahmed (MSME)</option>
    `;
    
    customerSelect.addEventListener('change', function() {
        if (this.value) {
            const customer = sampleCustomers.find(c => c.name === this.value);
            if (customer) {
                document.getElementById('customerName').value = customer.name;
                document.getElementById('mobileNumber').value = customer.mobile;
                document.getElementById('panNumber').value = customer.pan;
                document.getElementById('loanAmount').value = customer.loan_amount.replace(',', '');
                document.getElementById('employmentType').value = customer.type.toLowerCase().replace(' ', '-');
            }
        }
    });
    
    const sampleDiv = document.createElement('div');
    sampleDiv.className = 'form-group';
    sampleDiv.innerHTML = '<label class="form-label">Load Sample Data:</label>';
    sampleDiv.appendChild(customerSelect);
    customerForm.insertBefore(sampleDiv, customerForm.firstChild);
}

// Initialize sample data loader
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSampleCustomerData, 500);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + D for dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        showDashboard();
    }
});

// Add click outside modal to close
const reportModal = document.getElementById('reportModal');
if (reportModal) {
    reportModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

console.log('IDFC First Bank Alternative Underwriting & Property Valuation System Loaded Successfully');