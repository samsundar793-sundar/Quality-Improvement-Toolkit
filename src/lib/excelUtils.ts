import ExcelJS from 'exceljs';

/**
 * Excel utilities using exceljs (secure replacement for xlsx/SheetJS)
 * Addresses: GHSA-4r6h-8v6p-xvw6 (Prototype Pollution) and GHSA-5pgg-2g8v-p4x9 (ReDoS)
 */

/**
 * Read an Excel file from ArrayBuffer and return parsed JSON data
 * Compatible with the xlsx library's sheet_to_json output format
 */
export async function readExcelFile(buffer: ArrayBuffer): Promise<{
  data: any[][];
  jsonData: any[];
  sheetName: string;
}> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheets found in the Excel file');
  }
  
  const data: any[][] = [];
  const jsonData: any[] = [];
  let headers: string[] = [];
  
  worksheet.eachRow((row, rowNumber) => {
    const rowData: any[] = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Handle different cell value types safely
      let value = cell.value;
      if (value && typeof value === 'object') {
        // Handle rich text, formulas, etc.
        if ('richText' in value) {
          value = (value as ExcelJS.CellRichTextValue).richText
            .map(rt => rt.text)
            .join('');
        } else if ('result' in value) {
          // Formula cell - use the result
          value = (value as ExcelJS.CellFormulaValue).result;
        } else if ('text' in value) {
          // Hyperlink cell
          value = (value as ExcelJS.CellHyperlinkValue).text;
        }
      }
      rowData[colNumber - 1] = value;
    });
    data.push(rowData);
    
    if (rowNumber === 1) {
      headers = rowData.map(h => String(h ?? ''));
    } else if (headers.length > 0) {
      const rowObj: any = {};
      headers.forEach((header, idx) => {
        if (header) {
          rowObj[header] = rowData[idx];
        }
      });
      jsonData.push(rowObj);
    }
  });
  
  return {
    data,
    jsonData,
    sheetName: worksheet.name
  };
}

/**
 * Read Excel file from binary string (legacy format)
 */
export async function readExcelFromBinaryString(binaryStr: string): Promise<{
  data: any[][];
  jsonData: any[];
  sheetName: string;
}> {
  // Convert binary string to ArrayBuffer
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return readExcelFile(bytes.buffer);
}

/**
 * Create and download an Excel template
 */
export async function downloadExcelTemplate(
  data: any[][],
  filename: string,
  sheetName: string = 'Template'
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  // Add data rows
  data.forEach((row, rowIndex) => {
    const excelRow = worksheet.addRow(row);
    
    // Style header row
    if (rowIndex === 0) {
      excelRow.font = { bold: true };
      excelRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    }
  });
  
  // Auto-fit columns (approximate)
  worksheet.columns.forEach((column, idx) => {
    let maxLength = 10;
    data.forEach(row => {
      const cellValue = row[idx];
      if (cellValue) {
        const length = String(cellValue).length;
        if (length > maxLength) {
          maxLength = Math.min(length, 50);
        }
      }
    });
    column.width = maxLength + 2;
  });
  
  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create an Excel workbook with data and return as buffer
 */
export async function createExcelBuffer(
  data: any[][],
  sheetName: string = 'Sheet1'
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  data.forEach((row, rowIndex) => {
    const excelRow = worksheet.addRow(row);
    if (rowIndex === 0) {
      excelRow.font = { bold: true };
    }
  });
  
  // Auto-fit columns
  worksheet.columns.forEach((column, idx) => {
    let maxLength = 10;
    data.forEach(row => {
      const cellValue = row[idx];
      if (cellValue) {
        const length = String(cellValue).length;
        if (length > maxLength) {
          maxLength = Math.min(length, 50);
        }
      }
    });
    column.width = maxLength + 2;
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}
