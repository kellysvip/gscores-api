import * as XLSX from 'xlsx';

/**
 * Read a file excel then export to json object
 *
 * @param {string} filePath   - the path to the file
 * @param {string} sheetName  - the sheet name
 *
 * @return {object} the excel file content
 */
export function readExcel(filePath: string, sheetName: string) {
  const workbook = XLSX.readFile(filePath);

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(
      `Sheet with name "${sheetName}" not found in the Excel file.`,
    );
  }

  if (!worksheet['!ref']) {
    throw new Error(`Sheet "${sheetName}" has no reference range ('!ref').`);
  }

  const range = XLSX.utils.decode_range(worksheet['!ref']);

  return XLSX.utils.sheet_to_json(worksheet, { range });
}
