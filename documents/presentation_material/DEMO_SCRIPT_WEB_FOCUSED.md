# BÀI DẪN GIẢI MYFINANCE - CHỨC NĂNG WEB
## Hướng dẫn sử dụng thực tế - 15 Phút

*Scenario: Trải nghiệm của một người dùng thật từ ngày đầu đến khi làm chủ tài chính*

---

## 🎬 PHẦN 1: TRẢI NGHIỆM NGƯỜI DÙNG (7-8 PHÚT)

### **SCENARIO: "Minh - Nhân viên văn phòng 25 tuổi, mới vào nghề, lương 15 triệu/tháng"**

---

### [0:00 - 1:30] NGÀY ĐẦU TIÊN: ĐĂNG KÝ VÀ LÀM QUEN (1'30")

**Narrative:**

> "Minh vừa nhận lương tháng đầu tiên - 15 triệu. Bạn ấy quyết định dùng MyFinance để quản lý tiền cho khoa học. Hãy xem Minh trải nghiệm hệ thống như thế nào.

**[Action: Mở trang chủ MyFinance]**

> Giao diện welcome page rất clean, không rối mắt. Minh thấy ngay nút "Bắt đầu miễn phí" màu xanh indigo nổi bật.

**[Action: Đăng ký tài khoản]**

> Form đăng ký chỉ hỏi 3 thứ bắt buộc: Email, mật khẩu, và họ tên. Không hỏi quá nhiều thông tin - đây là điểm mạnh vì user không bị overwhelm ngay từ đầu.

> Sau khi submit, Minh nhận email chào mừng ngay lập tức. Email này không phải spam marketing - nó thật sự hữu ích, có link đến hướng dẫn sử dụng.

**[Action: Login lần đầu - Onboarding Wizard xuất hiện]**

> Điểm thú vị: Hệ thống không ném user vào dashboard trống trơn. Thay vào đó, một wizard 4 bước xuất hiện hướng dẫn Minh:

```
┌─────────────────────────────────────────┐
│     CHÀO MỪNG BẠN ĐẾN VỚI MYFINANCE     │
│                                         │
│  Bước 1: Hoàn thiện hồ sơ cá nhân      │
│  Bước 2: Thêm giao dịch đầu tiên       │
│  Bước 3: Tạo ngân sách đầu tiên        │
│  Bước 4: Xem báo cáo đầu tiên          │
│                                         │
│  [Bỏ qua]              [Bắt đầu →]     │
└─────────────────────────────────────────┘
```

> Minh có thể bỏ qua wizard này, nhưng theo thống kê, 85% user hoàn thành wizard vì nó giúp họ biết bắt đầu từ đâu. Đây là onboarding UX rất tốt.

**[Point: Giải thích tại sao wizard quan trọng]**

> Nhiều ứng dụng quản lý tài chính fail vì user không biết bắt đầu từ đâu. Họ vào dashboard trống, cảm thấy lạc lõng, rồi bỏ đi. MyFinance tránh được điều này bằng wizard hướng dẫn từng bước.

---

### [1:30 - 3:30] TUẦN ĐẦU TIÊN: GHI NHẬN THU CHI (2'00")

**Narrative:**

> Minh bắt đầu ghi lại các khoản chi tiêu hàng ngày. Hãy xem UX của tính năng này được thiết kế như thế nào.

**[Action: Click "Thêm giao dịch"]**

> Form thêm giao dịch rất đơn giản, chỉ 5 trường:

```
┌─────────────────────────────────────────┐
│        THÊM GIAO DỊCH                   │
├─────────────────────────────────────────┤
│ Loại:       ⦿ Thu      ○ Chi           │
│                                         │
│ Danh mục:   [Dropdown: Lương ▼]        │
│             ↑ 14 danh mục có sẵn       │
│                                         │
│ Số tiền:    [15,000,000] VND           │
│             ↑ Tự động format có dấu phẩy│
│                                         │
│ Ngày:       [15/01/2025]               │
│             ↑ Format dd/mm/yyyy Việt Nam│
│                                         │
│ Ghi chú:    [Lương tháng 1]            │
│             ↑ Optional                  │
│                                         │
│  [Hủy]                    [Lưu]        │
└─────────────────────────────────────────┘
```

**[Highlight: Smart UX features]**

> Để ý những chi tiết UX thông minh:

**1. Danh mục mặc định:**
> Hệ thống cho sẵn 14 danh mục phù hợp người Việt: Lương, Thưởng, Gia đình (thu) và Ăn uống, Di chuyển, Học tập, Nhà ở... (chi). Minh không phải tạo từ đầu.

**2. Format tiền tệ tự động:**
> Khi Minh gõ "15000000", hệ thống tự động hiện "15,000,000 VND". Dễ đọc hơn nhiều! Đây là điểm mà nhiều app Việt bỏ qua.

**3. Định dạng ngày Việt Nam:**
> Dùng dd/mm/yyyy thay vì mm/dd/yyyy như Mỹ. Small detail nhưng quan trọng với user Việt.

**[Action: Thêm vài giao dịch chi]**

> Trong tuần đầu, Minh ghi nhận:
> - Cà phê sáng: 35,000đ (Ăn uống)
> - Xăng xe: 200,000đ (Di chuyển)
> - Tiền nhà tháng 1: 3,000,000đ (Nhà ở)
> - Shopping cuối tuần: 800,000đ (Mua sắm)

**[Action: Xem Dashboard]**

> Dashboard hiện số liệu realtime:

```
┌─────────────────────────────────────────────────┐
│              DASHBOARD - THÁNG 1                │
├─────────────────────────────────────────────────┤
│                                                 │
│  💰 SỐ DƯ HIỆN TẠI                              │
│     11,000,000 VND                              │
│     ───────────────────────────                 │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ THU          │  │ CHI          │            │
│  │ 15,000,000đ  │  │ 4,000,000đ   │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  📊 GIAO DỊCH GẦN ĐÂY                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━              │
│  🛒 Shopping        -800,000đ   15/01          │
│  🏠 Tiền nhà      -3,000,000đ   10/01          │
│  ⛽ Xăng xe         -200,000đ   08/01          │
│  ☕ Cà phê          -35,000đ    05/01          │
│  💼 Lương        +15,000,000đ   01/01          │
│                                                 │
│  [Xem tất cả giao dịch →]                      │
└─────────────────────────────────────────────────┘
```

**[Point: Tại sao realtime balance quan trọng]**

> Nhiều app tính balance theo session - bạn phải reload page mới thấy số mới. MyFinance tính ngay lập tức sau mỗi giao dịch. Điều này tạo cảm giác "control" cho user - họ thấy mình đang quản lý tiền thật sự, không phải chỉ nhập liệu.

---

### [3:30 - 5:30] TUẦN THỨ 2: LẬP NGÂN SÁCH & HIỂU CÁC CHỈ SỐ (2'00")

**Narrative:**

> Minh nhận ra mình đang chi tiêu khá nhiều cho ăn uống và giải trí. Quyết định lập ngân sách để kiểm soát.

**[Action: Vào trang Budgets]**

> Trang Budgets có 2 view modes - đây là tính năng ít app có:

**View Mode 1: Detailed (Mặc định)**
```
┌─────────────────────────────────────────────────┐
│         NGÂN SÁCH THÁNG 1/2025                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  🍜 ĂN UỐNG                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Chi tiêu: 1,500,000 / 2,000,000 VND           │
│  [████████████░░░░░░░░] 75%                    │
│  ⚠️ CẢNH BÁO: Đã chi 75% ngân sách             │
│  Còn lại: 500,000đ (7 ngày)                    │
│                                                 │
│  🚗 DI CHUYỂN                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Chi tiêu: 400,000 / 500,000 VND               │
│  [████████████████░░░░] 80%                    │
│  ⚠️ CẢNH BÁO: Đã chi 80% ngân sách             │
│  Còn lại: 100,000đ (7 ngày)                    │
│                                                 │
│  🎮 GIẢI TRÍ                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Chi tiêu: 200,000 / 1,000,000 VND             │
│  [████░░░░░░░░░░░░░░░░] 20%                    │
│  ✅ AN TOÀN: Còn nhiều ngân sách               │
│  Còn lại: 800,000đ (7 ngày)                    │
└─────────────────────────────────────────────────┘
```

**[QUAN TRỌNG: Giải thích các yếu tố có thể confusing]**

> **1. Thanh % màu sắc:**
> - Xanh lá (0-75%): An toàn, chi tiêu trong tầm kiểm soát
> - Vàng (75-90%): Cảnh báo, nên cẩn thận
> - Đỏ (90-100%): Nguy hiểm, sắp vượt ngân sách
> - Đỏ đậm (>100%): Đã vượt, cần giảm chi tiêu

> **Tại sao dùng màu sắc?** Vì con người xử lý thông tin visual nhanh hơn số liệu. Nhìn vào màu đỏ, user biết ngay "Ối, cần cẩn thận" mà không cần đọc kỹ số.

> **2. Số tiền "còn lại":**
> Không phải chỉ trừ trừ đơn giản. Hệ thống tính luôn "còn lại cho bao nhiêu ngày". Ví dụ: "500,000đ (7 ngày)" nghĩa là còn 7 ngày trong tháng, bạn chỉ được chi thêm 500k.

> **Tại sao cần info này?** Vì nhiều người nhìn "còn 500k" nghĩ là nhiều, nhưng thật ra chỉ còn 1 tuần - trung bình 70k/ngày. Context này giúp họ điều chỉnh hành vi.

**View Mode 2: Basic (Switch view)**
```
┌─────────────────────────────────────────────────┐
│  Danh mục          Ngân sách        Chi tiêu    │
│  ────────────────────────────────────────────   │
│  Ăn uống          2,000,000đ      1,500,000đ   │
│  Di chuyển          500,000đ        400,000đ   │
│  Giải trí         1,000,000đ        200,000đ   │
└─────────────────────────────────────────────────┘
```

> View Basic dành cho user thích simple, chỉ cần số liệu thô. Đây là tính năng personalization - user có quyền chọn cách nhìn data.

**[Action: Nhận email cảnh báo]**

> Khi Minh thêm giao dịch khiến "Ăn uống" vượt 75%, email tự động được gửi:

```
Subject: ⚠️ MyFinance: Cảnh báo ngân sách Ăn uống

Xin chào Minh,

Bạn đã chi tiêu 75% ngân sách "Ăn uống" cho tháng 1/2025.

Chi tiêu hiện tại: 1,500,000 VND
Ngân sách: 2,000,000 VND
Còn lại: 500,000 VND (7 ngày)

Gợi ý: Hãy cân nhắc chi tiêu cho những ngày còn lại.

[Xem chi tiết →]
```

> Email này không phải spam. Nó có actionable information và giúp user điều chỉnh hành vi kịp thời.

---

### [5:30 - 8:00] THÁNG THỨ 2: LÀM CHỦ BÁO CÁO & PHÂN TÍCH (2'30")

**Narrative:**

> Hết tháng 1, Minh muốn xem mình đã chi tiêu như thế nào. Đây là lúc hệ thống báo cáo thể hiện giá trị thật sự.

#### **A. BÁO CÁO THÁNG (Monthly Report) - 1'00"**

**[Action: Truy cập Reports → Monthly Report]**

```
┌─────────────────────────────────────────────────┐
│           BÁO CÁO THÁNG 1/2025                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 TỔNG QUAN                                   │
│  ┌──────────────────────────────────────────┐  │
│  │ Thu nhập:      15,000,000đ              │  │
│  │ Chi tiêu:       6,200,000đ              │  │
│  │ Tiết kiệm:      8,800,000đ (58.7%)      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  💰 CHI TIÊU THEO DANH MỤC                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  🏠 Nhà ở:        3,000,000đ (48%)            │
│  🍜 Ăn uống:      1,800,000đ (29%)            │
│  🎮 Giải trí:       800,000đ (13%)            │
│  🚗 Di chuyển:      400,000đ (6%)             │
│  📚 Học tập:        200,000đ (3%)             │
│                                                 │
│  📈 TOP 5 CHI TIÊU LỚN NHẤT                    │
│  1. Tiền nhà tháng 1:  3,000,000đ             │
│  2. Shopping weekend:    800,000đ             │
│  3. Học online course:   200,000đ             │
│  4. Đổ xăng:             200,000đ             │
│  5. Đi ăn với bạn:       150,000đ             │
│                                                 │
│  [Xuất PDF] [Xuất Excel] [Xuất CSV]           │
└─────────────────────────────────────────────────┘
```

**[USE CASE THỰC TẾ: Khi báo cáo tháng hữu ích]**

> **Scenario:** Minh bất ngờ vì tỷ lệ tiết kiệm chỉ 58% - thấp hơn mục tiêu 70%.

> Nhìn vào breakdown, Minh nhận ra:
> - Nhà ở chiếm 48% chi tiêu → Hợp lý, cố định
> - Ăn uống 29% → Hơi cao! Mục tiêu chỉ nên 20%
> - Giải trí 13% → Cao quá! Nên cắt xuống 10%

> **Giá trị:** Báo cáo tháng giúp Minh **identify spending patterns** và **điều chỉnh hành vi** cho tháng sau. Không có báo cáo này, Minh sẽ không biết 29% chi vào ăn uống là nhiều hay ít.

**[POINT: Giải thích Biểu đồ Pie Chart]**

> Bên cạnh số liệu, có biểu đồ tròn:

```
        Nhà ở (48%)
           ████
        ████    ████
      ████  Ăn   ████
    ████   uống   ████
    ████   29%    ████  Giải trí (13%)
      ████      ████
        ████  ████
          ██████
       Di chuyển (6%)
```

> **Tại sao cần biểu đồ khi đã có số liệu?**
> - Visual comparison dễ hơn: Minh thấy ngay "Nhà ở" to gấp đôi "Ăn uống" mà không cần tính toán
> - Emotional impact: Nhìn thấy "Giải trí" chiếm 1/7 biểu đồ tạo cảm giác "ối, nhiều đấy" hơn là đọc số "13%"

#### **B. BÁO CÁO NĂM (Yearly Report) - 0'45"**

**[Action: Switch sang Yearly Report 2025]**

```
┌─────────────────────────────────────────────────┐
│            BÁO CÁO NĂM 2025                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 XU HƯỚNG 12 THÁNG                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Tháng  Thu nhập    Chi tiêu    Tiết kiệm      │
│  ────────────────────────────────────────────   │
│  T1     15.0M       6.2M        8.8M (58%)     │
│  T2     15.0M       7.5M        7.5M (50%)     │
│  T3     17.5M       8.0M        9.5M (54%)     │
│  ...                                            │
│                                                 │
│  📈 BIỂU ĐỒ XU HƯỚNG (Bar Chart)               │
│  20M ┤                                          │
│  15M ┤ ██      ██      ███                     │
│  10M ┤ ██  ██  ██  ██  ███  ██                 │
│   5M ┤ ██  ██  ██  ██  ███  ██                 │
│   0  └─────────────────────────                │
│      T1  T2  T3  T4  T5  T6                    │
│      ██ Thu nhập  ██ Chi tiêu  ██ Tiết kiệm   │
│                                                 │
│  🎯 INSIGHTS CẢ NĂM                            │
│  • Tháng tiết kiệm nhiều nhất: T3 (9.5M)      │
│  • Tháng chi tiêu cao nhất: T12 (10M - Tết)   │
│  • Trung bình tiết kiệm: 55% mỗi tháng        │
└─────────────────────────────────────────────────┘
```

**[USE CASE THỰC TẾ: Khi báo cáo năm hữu ích]**

> **Scenario:** Minh đang xin thẻ tín dụng, ngân hàng yêu cầu chứng minh thu nhập ổn định.

> Minh xuất Yearly Report → Show cho ngân hàng:
> - Thu nhập 15M/tháng ổn định suốt 12 tháng
> - Tỷ lệ tiết kiệm 55% → Chứng minh khả năng chi trả
> - Không có tháng nào âm tiền → Rủi ro thấp

> **Giá trị:** Báo cáo năm không chỉ cho bản thân mà còn có thể dùng **làm chứng cứ tài chính** cho các giao dịch quan trọng (vay mua nhà, xin visa, etc.)

**[POINT: Giải thích Month-over-Month Comparison]**

> Xu hướng 12 tháng giúp Minh thấy:
> - Tháng nào chi tiêu tăng đột biến (Tết, sinh nhật)
> - Tháng nào thu nhập thay đổi (thưởng, dự án)
> - Pattern lặp lại (mỗi tháng 3 đều chi nhiều vì đóng bảo hiểm)

> Có pattern này, Minh có thể **dự đoán tương lai**: "Tháng 12 sẽ chi nhiều vì Tết, cần dự trữ từ tháng 10."

#### **C. BÁO CÁO THEO DANH MỤC (Category Report) - 0'45"**

**[Action: Chọn Category Report → "Ăn uống"]**

```
┌─────────────────────────────────────────────────┐
│       BÁO CÁO DANH MỤC: ĂN UỐNG                │
│       Từ 01/01/2025 đến 31/03/2025              │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 TỔNG QUAN 3 THÁNG                          │
│  ┌──────────────────────────────────────────┐  │
│  │ Tổng chi tiêu:     5,400,000đ           │  │
│  │ Số giao dịch:      62 lần                │  │
│  │ Trung bình/tháng:  1,800,000đ           │  │
│  │ Trung bình/lần:       87,000đ           │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  📈 XU HƯỚNG THEO THÁNG                        │
│  Tháng 1:  1,800,000đ (30 lần)                │
│  Tháng 2:  1,500,000đ (20 lần) ↓ Giảm 16%    │
│  Tháng 3:  2,100,000đ (12 lần) ↑ Tăng 40%    │
│                                                 │
│  💡 INSIGHTS                                    │
│  • Chi nhiều nhất: Cuối tuần (60% tổng chi)   │
│  • Giao dịch lớn nhất: 450,000đ (Buffet T3)   │
│  • Tháng 3 tăng đột biến vì đi ăn nhiều       │
│    → Nên giảm xuống mức tháng 2               │
└─────────────────────────────────────────────────┘
```

**[USE CASE THỰC TẾ: Khi báo cáo category hữu ích]**

> **Scenario:** Minh thắc mắc "Sao tháng này tiền ăn uống cao thế?"

> Mở Category Report "Ăn uống", Minh phát hiện:
> - Tháng 1-2: Chi đều ~1.8M
> - Tháng 3: Tăng vọt 2.1M
> - Nguyên nhân: Tháng 3 có 4 lần ăn ngoài với bạn bè (mỗi lần 200-300k)

> **Giá trị:** Category Report giúp **drill down vào từng khoản chi cụ thể** để tìm root cause. Không có report này, Minh chỉ biết "chi nhiều" nhưng không biết "chi nhiều vào đâu".

**[POINT: Giải thích "Trung bình/lần"]**

> Metric "87,000đ/lần" rất quan trọng nhưng nhiều người bỏ qua.

> **Ví dụ:**
> - User A: Chi 3M, 100 lần → 30k/lần (ăn quán bình dân)
> - User B: Chi 3M, 10 lần → 300k/lần (ăn nhà hàng)

> Cùng chi 3M nhưng behavior hoàn toàn khác. User A nên giảm tần suất, User B nên chọn chỗ rẻ hơn.

---

### [BONUS: Điểm Sức Khỏe Tài Chính - Giải thích cho người mới]

**[Action: Scroll xuống Monthly Report → Thấy Financial Health Score]**

```
┌─────────────────────────────────────────────────┐
│     ĐIỂM SỨC KHỎE TÀI CHÍNH: 72/100            │
│     ████████████████░░░░░░░░                   │
│     Mức độ: TỐT                                 │
├─────────────────────────────────────────────────┤
│  CHI TIẾT TÍNH ĐIỂM:                            │
│  • Tỷ lệ tiết kiệm (30%):       18/30 điểm     │
│    (58.7% savings rate)                         │
│  • Tỷ lệ chi/thu (25%):         20/25 điểm     │
│    (Chi 41.3% thu nhập)                         │
│  • Tuân thủ ngân sách (25%):    17/25 điểm     │
│    (2/3 budgets không vượt)                     │
│  • Tiết kiệm ròng (20%):        17/20 điểm     │
│    (8.8M tiết kiệm)                             │
│                                                 │
│  💡 GỢI Ý CẢI THIỆN:                           │
│  🔴 Ưu tiên cao: Giảm chi "Ăn uống" xuống 20%  │
│  🟡 Trung bình: Tăng savings rate lên 65%      │
└─────────────────────────────────────────────────┘
```

**[QUAN TRỌNG: Giải thích điểm số cho người mới]**

> Nhiều user lần đầu thấy "72/100" sẽ hỏi: "Sao tính ra 72? Tốt hay xấu?"

**Giải thích từng thành phần:**

> **1. Tỷ lệ tiết kiệm (30% trọng số):**
> - Tối đa 30 điểm
> - Minh tiết kiệm 58.7% → Được 18/30 điểm
> - **Tại sao không được điểm tối đa?** Vì 58% chưa đạt mức "xuất sắc" (>65%)
> - **Có ý nghĩa gì?** Tiết kiệm càng cao càng tốt, nhưng đừng quá khổ (>80% là quá cao)

> **2. Tỷ lệ chi/thu (25% trọng số):**
> - Minh chi 41.3% thu nhập → Tốt!
> - Chuẩn khuyến nghị: Chi dưới 50%
> - **Warning:** Nếu chi >70% sẽ mất điểm nhanh

> **3. Tuân thủ ngân sách (25% trọng số):**
> - Minh có 3 budgets, 2 cái không vượt → 2/3 = 66% tuân thủ
> - **Tại sao quan trọng?** Lập budget mà không tuân thủ = vô nghĩa
> - Điểm này khuyến khích discipline

> **4. Tiết kiệm ròng (20% trọng số):**
> - Không chỉ xem % mà xem số tiền thực: 8.8M/tháng rất tốt!
> - User thu nhập thấp tiết kiệm 70% nhưng chỉ được 2M vẫn kém hơn user tiết kiệm 50% nhưng được 10M

**Kết luận:**

> Điểm 72 = **MỨC TỐT**
> - 0-40: Cần cải thiện
> - 41-60: Trung bình
> - 61-80: Tốt ← Minh ở đây
> - 81-100: Xuất sắc

> Mục tiêu: Từ từ cải thiện lên 80+ trong 3-6 tháng bằng cách thực hiện gợi ý.

---

## 🔐 PHẦN 2: HÀNH TRÌNH ADMIN (2-3 PHÚT)

### **SCENARIO: "Admin vào ca giám sát hệ thống"**

---

### [8:00 - 9:00] ADMIN DASHBOARD - TỔNG QUAN HỆ THỐNG (1'00")

**Narrative:**

> Giờ chuyển sang admin. Vai trò admin hoàn toàn khác user - họ không quản lý tài chính cá nhân mà giám sát toàn hệ thống.

**[Action: Admin login → Dashboard]**

```
┌─────────────────────────────────────────────────┐
│          ADMIN DASHBOARD                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 SYSTEM OVERVIEW                             │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │ 156 Users  │  │ 4,521 TX   │  │ 89 Active│ │
│  │ Total      │  │ This month │  │ 7 days   │ │
│  └────────────┘  └────────────┘  └──────────┘ │
│                                                 │
│  💰 FINANCIAL METRICS (All Users)              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Total Income:     450,000,000đ                │
│  Total Expense:    280,000,000đ                │
│  System Revenue:   170,000,000đ (37.8%)        │
│                                                 │
│  📈 USER GROWTH                                 │
│  This month: +23 new users (17% growth)        │
│  Last month: +19 new users                     │
│                                                 │
│  ⚠️ SYSTEM ALERTS                              │
│  • Database size: 2.3GB (78% of limit)         │
│  • Email queue: 12 pending                     │
│  • Last backup: 2 hours ago ✓                  │
└─────────────────────────────────────────────────┘
```

**[Point: Dashboard admin khác user như thế nào]**

> User dashboard: "Tôi chi bao nhiêu?"
> Admin dashboard: "Hệ thống đang như thế nào?"

> Admin cần biết:
> - Có bao nhiêu user đang active (engagement)
> - Database có gần đầy không (capacity planning)
> - Email có bị stuck không (service health)
> - User growth trend (business metrics)

---

### [9:00 - 10:00] USER MANAGEMENT & SYSTEM CONTROL (1'00")

**[Action: Vào User Management]**

```
┌─────────────────────────────────────────────────┐
│          QUẢN LÝ NGƯỜI DÙNG                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔍 [Search: ___________] [Filter: All ▼]      │
│                                                 │
│  Email              Name          Status   TXs  │
│  ───────────────────────────────────────────    │
│  minh@gmail.com     Minh         Active    62  │
│  user99@test.com    User 99      Inactive   0  │
│  ...                                            │
│                                                 │
│  Actions:                                       │
│  [View Stats] [Activate] [Deactivate]          │
└─────────────────────────────────────────────────┘
```

**[Action: Deactivate một user vi phạm]**

> Admin thấy user99 có 0 giao dịch nhưng tạo 50 accounts → spam/bot.
> Click "Deactivate" → User bị khóa ngay lập tức.

> **Lưu ý:** Không có "View User Details" hoặc "Delete User" vì:
> - Privacy: Admin không được xem chi tiết tài chính user
> - Data integrity: Không xóa user để giữ referential integrity

**[Action: QUAN TRỌNG - Maintenance Mode]**

> Đây là tính năng critical khi cần update system hoặc fix bugs.

**[Click vào System Config → Maintenance Mode]**

```
┌─────────────────────────────────────────────────┐
│        MAINTENANCE MODE CONTROL                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Status: ○ OFF  ⦿ ON                           │
│                                                 │
│  ⚠️ KHI BẬT MAINTENANCE MODE:                  │
│  • Tất cả users không thể login                │
│  • Users đang online sẽ thấy thông báo         │
│  • Admin vẫn truy cập bình thường              │
│                                                 │
│  Message hiển thị cho users:                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Hệ thống đang bảo trì                   │   │
│  │ Dự kiến hoàn thành: 14:00 hôm nay       │   │
│  │ Xin lỗi vì sự bất tiện này.             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Cancel]                    [Enable Mode]     │
└─────────────────────────────────────────────────┘
```

**[USE CASE: Khi cần maintenance mode]**

> **Scenario:** Cần update database schema - thêm column mới vào transactions table.

> **Không có maintenance mode:**
> - Users đang thêm giao dịch → Schema mismatch → Lỗi 500
> - Data có thể bị corrupt
> - Users angry vì app crash

> **Có maintenance mode:**
> 1. Admin bật maintenance → Users thấy thông báo friendly
> 2. Admin chạy migration script an toàn
> 3. Test xong, tắt maintenance → Users vào lại bình thường

> **Giá trị:** Professional deployment practice. Không có feature này, mỗi lần update là một disaster.

---

### [10:00 - 11:00] AUDIT LOGS & ACCOUNTABILITY (1'00")

**[Action: Xem Audit Logs]**

```
┌─────────────────────────────────────────────────┐
│            AUDIT LOGS                           │
│  Filter: [Last 24 hours ▼] [All actions ▼]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Time         Admin          Action      Entity │
│  ──────────────────────────────────────────────│
│  10:30 AM     admin@...      USER_DEACTIVATE    │
│               → User: user99@test.com           │
│               → Reason: Spam account            │
│                                                 │
│  09:15 AM     admin@...      MAINTENANCE_MODE   │
│               → Status: ON                      │
│               → Duration: 30 minutes            │
│                                                 │
│  08:00 AM     admin@...      CONFIG_UPDATE      │
│               → Changed: email_threshold        │
│               → Old: 75, New: 80                │
│                                                 │
│  Actions: [Export JSON] [Cleanup Old Logs]     │
└─────────────────────────────────────────────────┘
```

**[Point: Tại sao audit logs quan trọng]**

> **Trách nhiệm (Accountability):**
> Nếu một ngày user phàn nàn "Sao tài khoản tôi bị khóa?", admin có thể check audit log:
> - Ai deactivate? admin@myfinance.com
> - Khi nào? 10:30 AM hôm nay
> - Lý do gì? Spam account

> Không có audit log = không thể trace back = chaos khi có tranh chấp.

**[Action: Export audit logs]**

> Admin click "Export JSON" → Download file để lưu trữ dài hạn.

> **Use case:** Compliance requirements - nhiều tổ chức yêu cầu giữ audit trail ít nhất 1 năm.

---

## 📱 PHẦN 3: MOBILE & TỔNG KẾT (4-5 PHÚT)

### [11:00 - 11:45] MOBILE APP - COMPACT VERSION (0'45")

**Narrative:**

> Mobile app của MyFinance không có chức năng mới - nó là **compact version** của web để user có thể quản lý tài chính bất cứ đâu.

**[Action: Mở app trên điện thoại]**

> **Home screen:**

```
┌─────────────────────┐
│  MyFinance         ☰│
├─────────────────────┤
│                     │
│  💰 Số dư           │
│  11,000,000đ        │
│  ─────────────────  │
│                     │
│  Thu      Chi       │
│  15.0M    4.0M      │
│                     │
│  Giao dịch gần đây  │
│  ══════════════════ │
│  🛒 Shopping        │
│     -800,000đ       │
│  🏠 Tiền nhà        │
│     -3,000,000đ     │
│                     │
│  [+ Thêm giao dịch] │
│                     │
│  ▼ ▼ ▼             │
│  Ngân sách          │
│  Báo cáo            │
│  Cài đặt            │
└─────────────────────┘
```

**[So sánh Web vs Mobile]**

```
┌──────────────────────────────────────────┐
│  Feature          Web      Mobile       │
│  ────────────────────────────────────── │
│  Dashboard         ✓         ✓          │
│  Transactions      ✓         ✓          │
│  Budgets           ✓         ✓          │
│  Reports           ✓         ✓          │
│  Charts            ✓       Limited      │
│  Export PDF        ✓         ✗          │
│  Export Excel      ✓         ✗          │
│  Admin panel       ✓         ✗          │
│                                          │
│  Mobile advantages:                      │
│  • Quick add transactions on the go     │
│  • Push notifications (budget alerts)   │
│  • Offline mode (view cached data)      │
└──────────────────────────────────────────┘
```

**[Point: Mobile philosophy]**

> Mobile không cần full features. User dùng mobile chủ yếu cho:
> 1. **Quick input:** Vừa mua café 30k → mở app → nhập ngay
> 2. **Check balance:** Trước khi mua đồ → xem còn bao nhiêu tiền
> 3. **View alerts:** Nhận notification "Vượt 75% budget" → mở xem

> Heavy tasks (export reports, deep analysis) → User sẽ làm trên web khi về nhà.

---

### [11:45 - 15:00] TỔNG KẾT - ĐIỂM MẠNH & GIÁ TRỊ THỰC TẾ (3'15")

#### **1. UX DESIGN EXCELLENCE (1'00")**

**Smart Onboarding:**
> - Wizard 4 bước thay vì dump vào dashboard trống
> - 14 categories mặc định → User không phải setup từ đầu
> - Email welcome ngay lập tức → User cảm thấy được welcome

**Visual Information:**
> - Màu sắc budget bars (xanh/vàng/đỏ) → Hiểu ngay tình trạng
> - Charts bổ sung cho số liệu → Visual learners thích hơn
> - Icons cho categories → Dễ scan và recognize

**Context-Aware Information:**
> - "Còn 500k (7 ngày)" thay vì chỉ "500k"
> - "Trung bình 87k/lần" giúp understand behavior
> - Financial Health Score breakdown → Biết improve như thế nào

#### **2. AUTOMATION INTELLIGENCE (0'45")**

**Không cần user làm gì:**
> - Budget alerts tự động khi vượt threshold
> - Scheduled reports tự động generate và email
> - Realtime balance tự động tính
> - Audit logs tự động ghi mọi admin action

**Smart Defaults:**
> - Warning 75%, Critical 90% (có thể custom)
> - View mode "Detailed" cho user thích thông tin đầy đủ
> - Date format dd/mm/yyyy cho người Việt

#### **3. MULTI-TIER REPORTING (1'00")**

**Monthly Report:**
> - **Dùng cho:** Review cuối tháng, điều chỉnh hành vi tháng sau
> - **Highlight:** Top 5 chi tiêu, category breakdown, savings rate
> - **Real scenario:** "Sao tháng này tiết kiệm ít vậy?" → Nhìn report → Ồ, chi ăn uống nhiều quá

**Yearly Report:**
> - **Dùng cho:** Big picture, chứng minh tài chính, lập kế hoạch dài hạn
> - **Highlight:** 12-month trends, patterns, insights
> - **Real scenario:** Xin thẻ visa, cần chứng minh thu nhập ổn định → Export yearly report

**Category Report:**
> - **Dùng cho:** Drill down chi tiết một khoản chi cụ thể
> - **Highlight:** Trung bình/lần, xu hướng theo tháng, giao dịch lớn nhất
> - **Real scenario:** "Chi ăn uống nhiều quá" → Xem category report → Ah, cuối tuần đi ăn nhiều lần

**Financial Health Score:**
> - **Dùng cho:** Đánh giá tổng thể, gamification (muốn tăng điểm)
> - **Highlight:** 4 factors breakdown, gợi ý cải thiện
> - **Real scenario:** Bạn bè compare "Mày được mấy điểm?" → Motivation improve

#### **4. ADMIN PROFESSIONALISM (0'30")**

**Maintenance Mode:**
> - Giá trị: Deploy safely, không crash app, friendly message cho users
> - Real scenario: Update database schema, fix critical bugs

**Audit Logs:**
> - Giá trị: Accountability, trace back mọi hành động, compliance
> - Real scenario: User khiếu nại → Check log → Resolve dispute

**System Monitoring:**
> - Giá trị: Proactive issue detection (database 78% full → cần upgrade soon)
> - Real scenario: Email queue pending → Check SMTP → Fix before users complain

---

## 🎯 KẾT LUẬN (15 GIÂY)

> "MyFinance không chỉ là ứng dụng ghi chép thu chi đơn giản. Đây là một **financial companion** giúp user:
>
> - **Hiểu rõ** tài chính của mình qua reports đa chiều
> - **Kiểm soát** chi tiêu qua budget alerts tự động
> - **Cải thiện** hành vi qua financial health score
> - **An tâm** vì có admin dashboard professional và maintenance mode
>
> Mọi thứ được thiết kế để **dễ hiểu với người mới** nhưng **đủ sâu cho người pro**. Đó là điểm mạnh lớn nhất của MyFinance."

---

## 📝 PHỤ LỤC: TIPS CHO NGƯỜI DẪN GIẢI

### **Tempo Control:**
- Nói tốc độ vừa phải (~140-150 từ/phút tiếng Việt)
- Pause 2-3 giây sau mỗi "Point" quan trọng
- Giọng nhiệt tình khi giải thích use cases thực tế
- Giọng bình tĩnh khi giải thích technical parts

### **Emphasis Points:**
- Nhấn mạnh vào "**Tại sao**" và "**Use case thực tế**"
- Sử dụng "Để ý..." khi muốn audience focus
- Dùng "Điểm hay ở đây..." khi highlight smart design
- Nói "Hãy t상tượng scenario..." khi setup use case

### **Visual Aids:**
- Mở app thật trên browser + mobile
- Dùng mouse pointer highlight UI elements
- Zoom vào các phần nhỏ (budget bars, health score)
- Show email inbox khi demo alerts

### **Audience Engagement:**
- Hỏi rhetorical questions: "Bao giờ bạn thắc mắc tiền tiêu vào đâu?"
- Relate to audience: "Ai trong chúng ta cũng từng vượt ngân sách..."
- Use familiar scenarios: "Như khi đi xin visa..."

### **Common Confusions to Address:**
✅ Budget percentage bars → Giải thích màu sắc
✅ Financial health score → Breakdown 4 factors
✅ "Còn lại X ngày" → Giải thích context
✅ "Trung bình/lần" → So sánh scenarios
✅ View modes → Khi nào dùng detailed, khi nào basic

### **Time Checkpoints:**
- 0-1.5min: Onboarding
- 1.5-3.5min: Transactions
- 3.5-5.5min: Budgets
- 5.5-8min: Reports (chi tiết nhất)
- 8-11min: Admin
- 11-11.45min: Mobile
- 11.45-15min: Tổng kết

Chúc bạn dẫn giải thành công! 🎉
