// Dán vào Google Sheet: Tiện ích mở rộng > Apps Script
const SHEET_NAME = "Lead";

function doPost(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActive().insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Thời gian", "Họ tên", "Số điện thoại", "Dịch vụ", "Giờ mong muốn", "utm_source", "utm_medium", "utm_campaign"]);
  }
  const d = JSON.parse(e.postData.contents);
  sh.appendRow([
    Utilities.formatDate(new Date(d.submittedAt), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm"),
    d.name, "'" + d.phone, d.service, d.time, d.utm_source, d.utm_medium, d.utm_campaign,
  ]);
  return ContentService.createTextOutput("ok");
}
