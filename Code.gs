/**
 * Misi Data — Google Apps Script
 * 1) Buat Google Sheet, salin ID dari URL.
 * 2) Isi SPREADSHEET_ID di bawah.
 * 3) Deploy > New deployment > Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 4) Salin URL /exec ke index.html pada Netlify.
 */
const SPREADSHEET_ID = "PASTE_SPREADSHEET_ID_DI_SINI";
const SHEET_NAME = "Nilai";

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error("Payload kosong");
    const data = JSON.parse(raw);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      "Waktu Kirim", "Nama", "Absen", "Kelas", "Nilai",
      "Jawaban Benar", "Jumlah Soal", "Durasi (detik)",
      "Pelanggaran Pindah Tab", "Alasan Selesai", "Rincian Jawaban JSON"
    ];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }
    const row = [
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.attendance || "",
      data.className || "",
      Number(data.score || 0),
      Number(data.correct || 0),
      Number(data.total || 30),
      Number(data.elapsedSeconds || 0),
      Number(data.violations || 0),
      data.endReason || "",
      JSON.stringify(data.answers || [])
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Jalankan fungsi ini secara manual di editor untuk menguji izin spreadsheet.
function testSheetAccess() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  Logger.log("Spreadsheet dapat diakses: " + ss.getName() + " / " + sheet.getName());
}
