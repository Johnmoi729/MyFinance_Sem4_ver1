import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * PDF Export Utilities for Reports
 * Uses jsPDF and jspdf-autotable for professional PDF generation
 */

// Configure font for Vietnamese support
const configurePDF = (doc) => {
    // jsPDF default font supports basic Latin characters
    // For full Vietnamese support, you would need to add custom fonts
    doc.setFont('helvetica');
};

/**
 * Format currency for PDF (without symbols)
 */
const formatCurrencyForPDF = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
};

/**
 * Add header to PDF
 */
const addPDFHeader = (doc, title, subtitle) => {
    configurePDF(doc);

    // Logo/Title
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('MyFinance', 14, 20);

    // Report Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 14, 32);

    // Subtitle
    if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(subtitle, 14, 40);
    }

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, 196, 45);

    return 50; // Return Y position for content start
};

/**
 * Add footer to PDF
 */
const addPDFFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);

        // Page number
        doc.text(
            `Trang ${i} / ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Generated date
        const now = new Date();
        doc.text(
            `Tao luc: ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`,
            14,
            doc.internal.pageSize.getHeight() - 10
        );
    }
};

/**
 * Export Monthly Report to PDF
 */
export const exportMonthlyReportToPDF = (report) => {
    if (!report) {
        alert('Khong co du lieu bao cao');
        return;
    }

    const doc = new jsPDF();
    const title = `Bao cao thang ${report.month}/${report.year}`;
    const subtitle = `${report.monthName} ${report.year}`;

    let yPos = addPDFHeader(doc, title, subtitle);

    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Tong quan', 14, yPos);
    yPos += 8;

    const summaryData = [
        ['Tong thu nhap', formatCurrencyForPDF(report.totalIncome) + ' VND'],
        ['Tong chi tieu', formatCurrencyForPDF(report.totalExpense) + ' VND'],
        ['Tiet kiem rong', formatCurrencyForPDF(report.netSavings) + ' VND'],
        ['Ty le tiet kiem', (report.savingsRate?.toFixed(1) || '0') + '%'],
        ['Tong giao dich', report.totalTransactions.toString()],
        ['Trung binh/giao dich', formatCurrencyForPDF(report.averageTransaction) + ' VND']
    ];

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right' }
        }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Top Expense Categories
    if (report.topExpenseCategories && report.topExpenseCategories.length > 0) {
        doc.setFontSize(12);
        doc.text('Top 5 danh muc chi tieu', 14, yPos);
        yPos += 8;

        const expenseData = report.topExpenseCategories.map((cat, index) => [
            (index + 1).toString(),
            cat.categoryName,
            formatCurrencyForPDF(cat.amount) + ' VND',
            cat.percentage.toFixed(1) + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Danh muc', 'So tien', '% Tong']],
            body: expenseData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [239, 68, 68] }, // Red
            columnStyles: {
                0: { cellWidth: 15 },
                2: { halign: 'right' },
                3: { halign: 'right' }
            }
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Top Income Categories
    if (report.topIncomeCategories && report.topIncomeCategories.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.text('Top 5 danh muc thu nhap', 14, yPos);
        yPos += 8;

        const incomeData = report.topIncomeCategories.map((cat, index) => [
            (index + 1).toString(),
            cat.categoryName,
            formatCurrencyForPDF(cat.amount) + ' VND',
            cat.percentage.toFixed(1) + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Danh muc', 'So tien', '% Tong']],
            body: incomeData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [16, 185, 129] }, // Green
            columnStyles: {
                0: { cellWidth: 15 },
                2: { halign: 'right' },
                3: { halign: 'right' }
            }
        });
    }

    addPDFFooter(doc);
    doc.save(`bao-cao-thang-${report.month}-${report.year}.pdf`);
};

/**
 * Export Yearly Report to PDF
 */
export const exportYearlyReportToPDF = (report) => {
    if (!report) {
        alert('Khong co du lieu bao cao');
        return;
    }

    const doc = new jsPDF();
    const title = `Bao cao nam ${report.year}`;

    let yPos = addPDFHeader(doc, title);

    // Summary Section
    doc.setFontSize(12);
    doc.text('Tong quan nam', 14, yPos);
    yPos += 8;

    const summaryData = [
        ['Tong thu nhap', formatCurrencyForPDF(report.totalIncome) + ' VND'],
        ['Tong chi tieu', formatCurrencyForPDF(report.totalExpense) + ' VND'],
        ['Tiet kiem rong', formatCurrencyForPDF(report.netSavings) + ' VND'],
        ['Ty le tiet kiem', (report.savingsRate?.toFixed(1) || '0') + '%'],
        ['Tong giao dich', report.totalTransactions.toString()],
        ['TB thu nhap/thang', formatCurrencyForPDF(report.averageMonthlyIncome) + ' VND'],
        ['TB chi tieu/thang', formatCurrencyForPDF(report.averageMonthlyExpense) + ' VND']
    ];

    autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right' }
        }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Monthly Trends
    if (report.monthlyTrends && report.monthlyTrends.length > 0) {
        doc.addPage();
        yPos = 20;

        doc.setFontSize(12);
        doc.text('Xu huong theo thang', 14, yPos);
        yPos += 8;

        const trendData = report.monthlyTrends.map(trend => [
            trend.monthName,
            formatCurrencyForPDF(trend.income),
            formatCurrencyForPDF(trend.expense),
            formatCurrencyForPDF(trend.savings),
            (trend.savingsRate?.toFixed(1) || '0') + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Thang', 'Thu nhap', 'Chi tieu', 'Tiet kiem', 'TL Tiet kiem']],
            body: trendData,
            theme: 'striped',
            styles: { fontSize: 8, font: 'helvetica' },
            headStyles: { fillColor: [59, 130, 246] }, // Blue
            columnStyles: {
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            }
        });
    }

    addPDFFooter(doc);
    doc.save(`bao-cao-nam-${report.year}.pdf`);
};

/**
 * Export Category Report to PDF
 */
export const exportCategoryReportToPDF = (report) => {
    if (!report) {
        alert('Khong co du lieu bao cao');
        return;
    }

    const doc = new jsPDF();
    const title = `Bao cao danh muc: ${report.categoryName}`;
    const subtitle = `Tu ${report.startDate} den ${report.endDate}`;

    let yPos = addPDFHeader(doc, title, subtitle);

    // Summary Section
    doc.setFontSize(12);
    doc.text('Thong ke tong hop', 14, yPos);
    yPos += 8;

    const summaryData = [
        ['Loai danh muc', report.categoryType === 'INCOME' ? 'Thu nhap' : 'Chi tieu'],
        ['Tong so tien', formatCurrencyForPDF(report.totalAmount) + ' VND'],
        ['So giao dich', report.transactionCount.toString()],
        ['Trung binh/giao dich', formatCurrencyForPDF(report.averageTransaction) + ' VND'],
        ['Gia tri nho nhat', formatCurrencyForPDF(report.minTransaction) + ' VND'],
        ['Gia tri lon nhat', formatCurrencyForPDF(report.maxTransaction) + ' VND']
    ];

    autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right' }
        }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Period Summaries
    if (report.periodSummaries && report.periodSummaries.length > 0) {
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.text('Xu huong theo thoi gian', 14, yPos);
        yPos += 8;

        const periodData = report.periodSummaries.map(period => [
            period.periodLabel,
            formatCurrencyForPDF(period.amount) + ' VND',
            period.transactionCount.toString()
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Khoang thoi gian', 'So tien', 'Giao dich']],
            body: periodData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [59, 130, 246] },
            columnStyles: {
                1: { halign: 'right' },
                2: { halign: 'right' }
            }
        });
    }

    addPDFFooter(doc);
    const filename = `bao-cao-danh-muc-${report.categoryName.replace(/\s+/g, '-')}.pdf`;
    doc.save(filename);
};
