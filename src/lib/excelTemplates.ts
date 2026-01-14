import { downloadExcelTemplate } from './excelUtils';

/**
 * Excel Template Generation for DMAIC Tools
 * Provides pre-formatted templates for easy data upload
 * Uses exceljs for secure Excel generation
 */

export class ExcelTemplates {
  /**
   * Generate Gage R&R template
   */
  static generateGageRRTemplate(): void {
    const data = [
      ['Part', 'Appraiser', 'Trial', 'Measurement'],
      ['Part1', 'Appraiser1', '1', ''],
      ['Part1', 'Appraiser1', '2', ''],
      ['Part1', 'Appraiser1', '3', ''],
      ['Part1', 'Appraiser2', '1', ''],
      ['Part1', 'Appraiser2', '2', ''],
      ['Part1', 'Appraiser2', '3', ''],
      ['Part2', 'Appraiser1', '1', ''],
      ['Part2', 'Appraiser1', '2', ''],
      ['Part2', 'Appraiser1', '3', ''],
    ];

    this.downloadTemplate(data, 'GageRR_Template');
  }

  /**
   * Generate Histogram template
   */
  static generateHistogramTemplate(): void {
    const data = [
      ['Value', 'Category (Optional)'],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
    ];

    this.downloadTemplate(data, 'Histogram_Template');
  }

  /**
   * Generate Pareto Chart template
   */
  static generateParetoTemplate(): void {
    const data = [
      ['Category', 'Count'],
      ['Defect Type 1', ''],
      ['Defect Type 2', ''],
      ['Defect Type 3', ''],
      ['Defect Type 4', ''],
    ];

    this.downloadTemplate(data, 'Pareto_Template');
  }

  /**
   * Generate Control Chart template
   */
  static generateControlChartTemplate(): void {
    const data = [
      ['Sample', 'Value'],
      ['1', ''],
      ['2', ''],
      ['3', ''],
      ['4', ''],
      ['5', ''],
    ];

    this.downloadTemplate(data, 'ControlChart_Template');
  }

  /**
   * Generate Process Capability template
   */
  static generateProcessCapabilityTemplate(): void {
    const data = [
      ['Measurement'],
      [''],
      [''],
      [''],
      [''],
      [''],
    ];

    this.downloadTemplate(data, 'ProcessCapability_Template');
  }

  /**
   * Generate Scatter Plot template
   */
  static generateScatterPlotTemplate(): void {
    const data = [
      ['X Variable', 'Y Variable'],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
    ];

    this.downloadTemplate(data, 'ScatterPlot_Template');
  }

  /**
   * Generate Box Plot template
   */
  static generateBoxPlotTemplate(): void {
    const data = [
      ['Category', 'Value', 'Timestamp (Optional)'],
      ['Group1', '', ''],
      ['Group1', '', ''],
      ['Group2', '', ''],
      ['Group2', '', ''],
    ];

    this.downloadTemplate(data, 'BoxPlot_Template');
  }

  /**
   * Generate FMEA template
   */
  static generateFMEATemplate(): void {
    const data = [
      ['Process Step', 'Failure Mode', 'Effects', 'Causes', 'Severity', 'Occurrence', 'Detection', 'Current Controls', 'Actions'],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
    ];

    this.downloadTemplate(data, 'FMEA_Template');
  }

  /**
   * Generate DOE template
   */
  static generateDOETemplate(): void {
    const data = [
      ['Run', 'Factor A', 'Factor B', 'Response'],
      ['1', '', '', ''],
      ['2', '', '', ''],
      ['3', '', '', ''],
      ['4', '', '', ''],
    ];

    this.downloadTemplate(data, 'DOE_Template');
  }

  /**
   * Generate Regression Analysis template
   */
  static generateRegressionTemplate(): void {
    const data = [
      ['Independent Variable', 'Dependent Variable'],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
    ];

    this.downloadTemplate(data, 'Regression_Template');
  }

  /**
   * Generate Voice of Customer template
   */
  static generateVOCTemplate(): void {
    const data = [
      ['Customer Need', 'Importance (1-5)', 'Current Performance (1-5)', 'Category'],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ];

    this.downloadTemplate(data, 'VoiceOfCustomer_Template');
  }

  /**
   * Generate Check Sheet template
   */
  static generateCheckSheetTemplate(): void {
    const data = [
      ['Date', 'Category', 'Count'],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    this.downloadTemplate(data, 'CheckSheet_Template');
  }

  /**
   * Generate Audit Checklist template
   */
  static generateAuditTemplate(): void {
    const data = [
      ['Category', 'Item', 'Description', 'Compliance', 'Severity', 'Evidence', 'Corrective Action', 'Responsible', 'Due Date', 'Notes'],
      ['', '', '', 'Yes/No/Partial/NA', 'Critical/Major/Minor', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ];

    this.downloadTemplate(data, 'AuditChecklist_Template');
  }

  /**
   * Download template helper
   */
  private static downloadTemplate(data: any[][], filename: string): void {
    const dateStr = new Date().toISOString().split('T')[0];
    downloadExcelTemplate(data, `${filename}_${dateStr}.xlsx`, 'Template');
  }

  /**
   * Get all available templates
   */
  static getAllTemplates(): Array<{ name: string; description: string; generator: () => void }> {
    return [
      { name: 'Gage R&R', description: 'Measurement system analysis template', generator: this.generateGageRRTemplate.bind(this) },
      { name: 'Histogram', description: 'Distribution analysis template', generator: this.generateHistogramTemplate.bind(this) },
      { name: 'Pareto Chart', description: 'Defect prioritization template', generator: this.generateParetoTemplate.bind(this) },
      { name: 'Control Chart', description: 'Process monitoring template', generator: this.generateControlChartTemplate.bind(this) },
      { name: 'Process Capability', description: 'Capability analysis template', generator: this.generateProcessCapabilityTemplate.bind(this) },
      { name: 'Scatter Plot', description: 'Correlation analysis template', generator: this.generateScatterPlotTemplate.bind(this) },
      { name: 'Box Plot', description: 'Distribution comparison template', generator: this.generateBoxPlotTemplate.bind(this) },
      { name: 'FMEA', description: 'Failure mode analysis template', generator: this.generateFMEATemplate.bind(this) },
      { name: 'DOE', description: 'Design of experiments template', generator: this.generateDOETemplate.bind(this) },
      { name: 'Regression', description: 'Regression analysis template', generator: this.generateRegressionTemplate.bind(this) },
      { name: 'Voice of Customer', description: 'Customer feedback template', generator: this.generateVOCTemplate.bind(this) },
      { name: 'Check Sheet', description: 'Data collection template', generator: this.generateCheckSheetTemplate.bind(this) },
      { name: 'Audit Checklist', description: 'Audit management template', generator: this.generateAuditTemplate.bind(this) },
    ];
  }
}
