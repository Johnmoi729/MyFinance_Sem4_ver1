import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * PDF Export Utilities for Reports
 * Uses jsPDF and jspdf-autotable for professional PDF generation
 *
 * IMPORTANT: Vietnamese Unicode Support
 * jsPDF's standard fonts (Helvetica, Courier, Times) use WinAnsiEncoding which doesn't support
 * Vietnamese diacritics. We romanize Vietnamese text to ASCII for PDF compatibility.
 */

/**
 * Romanize Vietnamese text by removing diacritics
 */
const romanizeVietnamese = (text) => {
    if (!text) return text;

    const vietnameseMap = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D'
    };

    return text.split('').map(char => vietnameseMap[char] || char).join('');
};

// Configure font for PDF
const configurePDF = (doc) => {
    doc.setFont('helvetica', 'normal');
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
    doc.text(romanizeVietnamese(title), 14, 32);

    // Subtitle
    if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(romanizeVietnamese(subtitle), 14, 40);
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
            romanizeVietnamese(`Trang ${i} / ${pageCount}`),
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Generated date
        const now = new Date();
        doc.text(
            romanizeVietnamese(`Tao luc: ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`),
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
    doc.text(romanizeVietnamese('Tong quan'), 14, yPos);
    yPos += 8;

    const summaryData = [
        [romanizeVietnamese('Tong thu nhap'), formatCurrencyForPDF(report.totalIncome) + ' VND'],
        [romanizeVietnamese('Tong chi tieu'), formatCurrencyForPDF(report.totalExpense) + ' VND'],
        [romanizeVietnamese('Tiet kiem rong'), formatCurrencyForPDF(report.netSavings) + ' VND'],
        [romanizeVietnamese('Ty le tiet kiem'), (report.savingsRate?.toFixed(1) || '0') + '%'],
        [romanizeVietnamese('Tong giao dich'), report.totalTransactions.toString()],
        [romanizeVietnamese('Trung binh/giao dich'), formatCurrencyForPDF(report.averageTransaction) + ' VND']
    ];

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: summaryData,
        theme: 'grid',
        styles: {
            fontSize: 10,
            font: 'helvetica',
            fontStyle: 'normal'
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right' }
        }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Top Expense Categories
    if (report.topExpenseCategories && report.topExpenseCategories.length > 0) {
        doc.setFontSize(12);
        doc.text(romanizeVietnamese('Top 5 danh muc chi tieu'), 14, yPos);
        yPos += 8;

        const expenseData = report.topExpenseCategories.map((cat, index) => [
            (index + 1).toString(),
            romanizeVietnamese(cat.categoryName),
            formatCurrencyForPDF(cat.amount) + ' VND',
            cat.percentage.toFixed(1) + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [[romanizeVietnamese('#'), romanizeVietnamese('Danh muc'), romanizeVietnamese('So tien'), romanizeVietnamese('% Tong')]],
            body: expenseData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [239, 68, 68], fontStyle: 'bold' }, // Red
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
        doc.text(romanizeVietnamese('Top 5 danh muc thu nhap'), 14, yPos);
        yPos += 8;

        const incomeData = report.topIncomeCategories.map((cat, index) => [
            (index + 1).toString(),
            romanizeVietnamese(cat.categoryName),
            formatCurrencyForPDF(cat.amount) + ' VND',
            cat.percentage.toFixed(1) + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [[romanizeVietnamese('#'), romanizeVietnamese('Danh muc'), romanizeVietnamese('So tien'), romanizeVietnamese('% Tong')]],
            body: incomeData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [16, 185, 129], fontStyle: 'bold' }, // Green
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
    doc.text(romanizeVietnamese('Tong quan nam'), 14, yPos);
    yPos += 8;

    const summaryData = [
        [romanizeVietnamese('Tong thu nhap'), formatCurrencyForPDF(report.totalIncome) + ' VND'],
        [romanizeVietnamese('Tong chi tieu'), formatCurrencyForPDF(report.totalExpense) + ' VND'],
        [romanizeVietnamese('Tiet kiem rong'), formatCurrencyForPDF(report.netSavings) + ' VND'],
        [romanizeVietnamese('Ty le tiet kiem'), (report.savingsRate?.toFixed(1) || '0') + '%'],
        [romanizeVietnamese('Tong giao dich'), report.totalTransactions.toString()],
        [romanizeVietnamese('TB thu nhap/thang'), formatCurrencyForPDF(report.averageMonthlyIncome) + ' VND'],
        [romanizeVietnamese('TB chi tieu/thang'), formatCurrencyForPDF(report.averageMonthlyExpense) + ' VND']
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
        doc.text(romanizeVietnamese('Xu huong theo thang'), 14, yPos);
        yPos += 8;

        const trendData = report.monthlyTrends.map(trend => [
            romanizeVietnamese(trend.monthName),
            formatCurrencyForPDF(trend.income),
            formatCurrencyForPDF(trend.expense),
            formatCurrencyForPDF(trend.savings),
            (trend.savingsRate?.toFixed(1) || '0') + '%'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [[romanizeVietnamese('Thang'), romanizeVietnamese('Thu nhap'), romanizeVietnamese('Chi tieu'), romanizeVietnamese('Tiet kiem'), romanizeVietnamese('TL Tiet kiem')]],
            body: trendData,
            theme: 'striped',
            styles: { fontSize: 8, font: 'helvetica' },
            headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' }, // Blue
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
    doc.text(romanizeVietnamese('Thong ke tong hop'), 14, yPos);
    yPos += 8;

    const summaryData = [
        [romanizeVietnamese('Loai danh muc'), romanizeVietnamese(report.categoryType === 'INCOME' ? 'Thu nhap' : 'Chi tieu')],
        [romanizeVietnamese('Tong so tien'), formatCurrencyForPDF(report.totalAmount) + ' VND'],
        [romanizeVietnamese('So giao dich'), report.transactionCount.toString()],
        [romanizeVietnamese('Trung binh/giao dich'), formatCurrencyForPDF(report.averageTransaction) + ' VND'],
        [romanizeVietnamese('Gia tri nho nhat'), formatCurrencyForPDF(report.minTransaction) + ' VND'],
        [romanizeVietnamese('Gia tri lon nhat'), formatCurrencyForPDF(report.maxTransaction) + ' VND']
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
        doc.text(romanizeVietnamese('Xu huong theo thoi gian'), 14, yPos);
        yPos += 8;

        const periodData = report.periodSummaries.map(period => [
            romanizeVietnamese(period.periodLabel),
            formatCurrencyForPDF(period.amount) + ' VND',
            period.transactionCount.toString()
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [[romanizeVietnamese('Khoang thoi gian'), romanizeVietnamese('So tien'), romanizeVietnamese('Giao dich')]],
            body: periodData,
            theme: 'striped',
            styles: { fontSize: 9, font: 'helvetica' },
            headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
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
