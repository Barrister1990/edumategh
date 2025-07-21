// @ts-nocheck
"use client";
import 'katex/dist/katex.min.css';
import { Calculator, Table, X } from 'lucide-react';
import { useState } from 'react';
import Latex from 'react-latex-next';

// Type definitions
interface MathSymbol {
  symbol: string;
  latex: string;
  name: string;
}

interface MathSymbolCategory {
  [key: string]: MathSymbol[];
}

interface EquationTemplate {
  name: string;
  latex: string;
  category: string;
}

interface TabCategory {
  key: string;
  label: string;
  icon: string;
}

interface MathToolbarProps {
  activeContentEditor?: any; // You can make this more specific based on your editor type
  insertMathSymbol: (latex: string, editor?: any) => void;
  onClose: () => void;
  isVisible?: boolean;
}

interface MathButtonProps {
  onClick: () => void;
  active?: boolean;
}

// Mathematical symbols and functions
const mathSymbols: MathSymbolCategory = {
  basic: [
    { symbol: '+', latex: '+', name: 'Plus' },
    { symbol: '−', latex: '-', name: 'Minus' },
    { symbol: '×', latex: '\\times', name: 'Times' },
    { symbol: '÷', latex: '\\div', name: 'Division' },
    { symbol: '=', latex: '=', name: 'Equals' },
    { symbol: '≠', latex: '\\neq', name: 'Not equal' },
    { symbol: '±', latex: '\\pm', name: 'Plus minus' },
    { symbol: '∓', latex: '\\mp', name: 'Minus plus' }
  ],
  comparison: [
    { symbol: '<', latex: '<', name: 'Less than' },
    { symbol: '>', latex: '>', name: 'Greater than' },
    { symbol: '≤', latex: '\\leq', name: 'Less than or equal' },
    { symbol: '≥', latex: '\\geq', name: 'Greater than or equal' },
    { symbol: '≈', latex: '\\approx', name: 'Approximately equal' },
    { symbol: '≡', latex: '\\equiv', name: 'Identical to' },
    { symbol: '∝', latex: '\\propto', name: 'Proportional to' },
    { symbol: '∼', latex: '\\sim', name: 'Similar to' }
  ],
  powers: [
    { symbol: 'x²', latex: 'x^2', name: 'Square' },
    { symbol: 'x³', latex: 'x^3', name: 'Cube' },
    { symbol: 'xⁿ', latex: 'x^n', name: 'Power' },
    { symbol: '√x', latex: '\\sqrt{x}', name: 'Square root' },
    { symbol: '∛x', latex: '\\sqrt[3]{x}', name: 'Cube root' },
    { symbol: 'ⁿ√x', latex: '\\sqrt[n]{x}', name: 'nth root' },
    { symbol: 'x₁', latex: 'x_1', name: 'Subscript' },
    { symbol: 'eˣ', latex: 'e^x', name: 'Exponential' }
  ],
  fractions: [
    { symbol: '½', latex: '\\frac{1}{2}', name: 'One half' },
    { symbol: '⅓', latex: '\\frac{1}{3}', name: 'One third' },
    { symbol: '¼', latex: '\\frac{1}{4}', name: 'One quarter' },
    { symbol: '¾', latex: '\\frac{3}{4}', name: 'Three quarters' },
    { symbol: 'a/b', latex: '\\frac{a}{b}', name: 'Fraction' },
    { symbol: 'a÷b', latex: '\\frac{a}{b}', name: 'Division fraction' }
  ],
  calculus: [
    { symbol: '∫', latex: '\\int', name: 'Integral' },
    { symbol: '∬', latex: '\\iint', name: 'Double integral' },
    { symbol: '∭', latex: '\\iiint', name: 'Triple integral' },
    { symbol: '∮', latex: '\\oint', name: 'Contour integral' },
    { symbol: '∂', latex: '\\partial', name: 'Partial derivative' },
    { symbol: '∇', latex: '\\nabla', name: 'Nabla/Del' },
    { symbol: '∆', latex: '\\Delta', name: 'Delta' },
    { symbol: 'dx', latex: 'dx', name: 'Differential x' },
    { symbol: 'dy', latex: 'dy', name: 'Differential y' },
    { symbol: 'dt', latex: 'dt', name: 'Differential t' },
    { symbol: 'lim', latex: '\\lim', name: 'Limit' },
    { symbol: 'd/dx', latex: '\\frac{d}{dx}', name: 'Derivative' },
    { symbol: 'd²/dx²', latex: '\\frac{d^2}{dx^2}', name: 'Second derivative' },
    { symbol: '∂/∂x', latex: '\\frac{\\partial}{\\partial x}', name: 'Partial derivative' }
  ],
  trigonometry: [
    { symbol: 'sin', latex: '\\sin', name: 'Sine' },
    { symbol: 'cos', latex: '\\cos', name: 'Cosine' },
    { symbol: 'tan', latex: '\\tan', name: 'Tangent' },
    { symbol: 'cot', latex: '\\cot', name: 'Cotangent' },
    { symbol: 'sec', latex: '\\sec', name: 'Secant' },
    { symbol: 'csc', latex: '\\csc', name: 'Cosecant' },
    { symbol: 'sin⁻¹', latex: '\\sin^{-1}', name: 'Arcsine' },
    { symbol: 'cos⁻¹', latex: '\\cos^{-1}', name: 'Arccosine' },
    { symbol: 'tan⁻¹', latex: '\\tan^{-1}', name: 'Arctangent' },
    { symbol: 'sinh', latex: '\\sinh', name: 'Hyperbolic sine' },
    { symbol: 'cosh', latex: '\\cosh', name: 'Hyperbolic cosine' },
    { symbol: 'tanh', latex: '\\tanh', name: 'Hyperbolic tangent' }
  ],
  logarithms: [
    { symbol: 'log', latex: '\\log', name: 'Logarithm' },
    { symbol: 'ln', latex: '\\ln', name: 'Natural logarithm' },
    { symbol: 'log₁₀', latex: '\\log_{10}', name: 'Base 10 logarithm' },
    { symbol: 'log₂', latex: '\\log_2', name: 'Base 2 logarithm' },
    { symbol: 'logₐ', latex: '\\log_a', name: 'Base a logarithm' },
    { symbol: 'lg', latex: '\\lg', name: 'Common logarithm' }
  ],
  greekLetters: [
    { symbol: 'α', latex: '\\alpha', name: 'Alpha' },
    { symbol: 'β', latex: '\\beta', name: 'Beta' },
    { symbol: 'γ', latex: '\\gamma', name: 'Gamma' },
    { symbol: 'Γ', latex: '\\Gamma', name: 'Gamma uppercase' },
    { symbol: 'δ', latex: '\\delta', name: 'Delta' },
    { symbol: 'Δ', latex: '\\Delta', name: 'Delta uppercase' },
    { symbol: 'ε', latex: '\\epsilon', name: 'Epsilon' },
    { symbol: 'ζ', latex: '\\zeta', name: 'Zeta' },
    { symbol: 'η', latex: '\\eta', name: 'Eta' },
    { symbol: 'θ', latex: '\\theta', name: 'Theta' },
    { symbol: 'Θ', latex: '\\Theta', name: 'Theta uppercase' },
    { symbol: 'ι', latex: '\\iota', name: 'Iota' },
    { symbol: 'κ', latex: '\\kappa', name: 'Kappa' },
    { symbol: 'λ', latex: '\\lambda', name: 'Lambda' },
    { symbol: 'Λ', latex: '\\Lambda', name: 'Lambda uppercase' },
    { symbol: 'μ', latex: '\\mu', name: 'Mu' },
    { symbol: 'ν', latex: '\\nu', name: 'Nu' },
    { symbol: 'ξ', latex: '\\xi', name: 'Xi' },
    { symbol: 'Ξ', latex: '\\Xi', name: 'Xi uppercase' },
    { symbol: 'π', latex: '\\pi', name: 'Pi' },
    { symbol: 'Π', latex: '\\Pi', name: 'Pi uppercase' },
    { symbol: 'ρ', latex: '\\rho', name: 'Rho' },
    { symbol: 'σ', latex: '\\sigma', name: 'Sigma' },
    { symbol: 'Σ', latex: '\\Sigma', name: 'Sigma uppercase' },
    { symbol: 'τ', latex: '\\tau', name: 'Tau' },
    { symbol: 'υ', latex: '\\upsilon', name: 'Upsilon' },
    { symbol: 'φ', latex: '\\phi', name: 'Phi' },
    { symbol: 'Φ', latex: '\\Phi', name: 'Phi uppercase' },
    { symbol: 'χ', latex: '\\chi', name: 'Chi' },
    { symbol: 'ψ', latex: '\\psi', name: 'Psi' },
    { symbol: 'Ψ', latex: '\\Psi', name: 'Psi uppercase' },
    { symbol: 'ω', latex: '\\omega', name: 'Omega' },
    { symbol: 'Ω', latex: '\\Omega', name: 'Omega uppercase' }
  ],
  sets: [
    { symbol: '∈', latex: '\\in', name: 'Element of' },
    { symbol: '∉', latex: '\\notin', name: 'Not element of' },
    { symbol: '⊂', latex: '\\subset', name: 'Subset of' },
    { symbol: '⊃', latex: '\\supset', name: 'Superset of' },
    { symbol: '⊆', latex: '\\subseteq', name: 'Subset or equal' },
    { symbol: '⊇', latex: '\\supseteq', name: 'Superset or equal' },
    { symbol: '∪', latex: '\\cup', name: 'Union' },
    { symbol: '∩', latex: '\\cap', name: 'Intersection' },
    { symbol: '∅', latex: '\\emptyset', name: 'Empty set' },
    { symbol: 'ℕ', latex: '\\mathbb{N}', name: 'Natural numbers' },
    { symbol: 'ℤ', latex: '\\mathbb{Z}', name: 'Integers' },
    { symbol: 'ℚ', latex: '\\mathbb{Q}', name: 'Rational numbers' },
    { symbol: 'ℝ', latex: '\\mathbb{R}', name: 'Real numbers' },
    { symbol: 'ℂ', latex: '\\mathbb{C}', name: 'Complex numbers' }
  ],
  special: [
    { symbol: '∞', latex: '\\infty', name: 'Infinity' },
    { symbol: '∑', latex: '\\sum', name: 'Summation' },
    { symbol: '∏', latex: '\\prod', name: 'Product' },
    { symbol: '!', latex: '!', name: 'Factorial' },
    { symbol: '‰', latex: '\\permil', name: 'Per mille' },
    { symbol: '%', latex: '\\%', name: 'Percent' },
    { symbol: '°', latex: '^\\circ', name: 'Degree' },
    { symbol: '′', latex: '^\\prime', name: 'Prime' },
    { symbol: '″', latex: '^{\\prime\\prime}', name: 'Double prime' },
    { symbol: 'ℏ', latex: '\\hbar', name: 'Reduced Planck constant' }
  ]
};

const equationTemplates: EquationTemplate[] = [
  { name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', category: 'algebra' },
  { name: 'Pythagorean Theorem', latex: 'a^2 + b^2 = c^2', category: 'geometry' },
  { name: 'Derivative', latex: '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}', category: 'calculus' },
  { name: 'Integral', latex: '\\int_a^b f(x) \\, dx = F(b) - F(a)', category: 'calculus' },
  { name: 'Chain Rule', latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)', category: 'calculus' },
  { name: 'Product Rule', latex: '\\frac{d}{dx}[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)', category: 'calculus' },
  { name: 'Quotient Rule', latex: '\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}', category: 'calculus' },
  { name: 'Sin Addition', latex: '\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B', category: 'trigonometry' },
  { name: 'Cos Addition', latex: '\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B', category: 'trigonometry' },
  { name: 'Tan Addition', latex: '\\tan(A + B) = \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}', category: 'trigonometry' },
  { name: 'Euler\'s Formula', latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta', category: 'complex' },
  { name: 'Binomial Theorem', latex: '(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k', category: 'algebra' },
  { name: 'Taylor Series', latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n', category: 'calculus' },
  { name: 'Matrix Multiplication', latex: '(AB)_{ij} = \\sum_{k=1}^{n} A_{ik}B_{kj}', category: 'linear-algebra' }
];

const MathToolbar: React.FC<MathToolbarProps> = ({ 
  activeContentEditor, 
  insertMathSymbol, 
  onClose, 
  isVisible = true 
}) => {
  const [currentTab, setCurrentTab] = useState<string>('basic');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [customEquation, setCustomEquation] = useState<string>('');
  
  // Table state
  const [tableRows, setTableRows] = useState<number>(3);
  const [tableCols, setTableCols] = useState<number>(3);
  const [tableHasBorders, setTableHasBorders] = useState<boolean>(true);
  const [tableHasHeader, setTableHasHeader] = useState<boolean>(true);

  if (!isVisible) return null;

  const tabCategories: TabCategory[] = [
    { key: 'basic', label: 'Basic', icon: '±' },
    { key: 'comparison', label: 'Compare', icon: '≤' },
    { key: 'powers', label: 'Powers', icon: 'x²' },
    { key: 'fractions', label: 'Fractions', icon: '½' },
    { key: 'calculus', label: 'Calculus', icon: '∫' },
    { key: 'trigonometry', label: 'Trig', icon: 'sin' },
    { key: 'logarithms', label: 'Log', icon: 'ln' },
    { key: 'greekLetters', label: 'Greek', icon: 'α' },
    { key: 'sets', label: 'Sets', icon: '∈' },
    { key: 'special', label: 'Special', icon: '∞' }
  ];

  const filteredSymbols = mathSymbols[currentTab]?.filter((symbol: MathSymbol) =>
    symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symbol.symbol.includes(searchTerm)
  ) || [];

  const filteredTemplates = equationTemplates.filter((template: EquationTemplate) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.includes(searchTerm.toLowerCase())
  );

  const insertTemplate = (latex: string): void => {
    insertMathSymbol(latex, activeContentEditor);
  };

  const insertCustomEquation = (): void => {
    if (customEquation.trim()) {
      insertMathSymbol(customEquation, activeContentEditor);
      setCustomEquation('');
    }
  };

  // Generate LaTeX table
  const generateTable = (): void => {
    const colAlignment = tableHasBorders ? '|c'.repeat(tableCols) + '|' : 'c'.repeat(tableCols);
    
    let latex = `\\begin{array}{${colAlignment}}\n`;
    
    if (tableHasBorders) {
      latex += '\\hline\n';
    }
    
    // Generate rows
    for (let row = 0; row < tableRows; row++) {
      const isHeaderRow = tableHasHeader && row === 0;
      let rowContent = '';
      
      for (let col = 0; col < tableCols; col++) {
        if (isHeaderRow) {
          rowContent += `\\text{Header ${col + 1}}`;
        } else {
          rowContent += `\\text{Cell ${row + 1},${col + 1}}`;
        }
        
        if (col < tableCols - 1) {
          rowContent += ' & ';
        }
      }
      
      latex += rowContent + ' \\\\\n';
      
      // Add horizontal line after header or if borders are enabled
      if ((isHeaderRow && tableHasHeader) || tableHasBorders) {
        latex += '\\hline\n';
      }
    }
    
    // Add final hline if borders enabled and no header (to close the table)
    if (tableHasBorders && !tableHasHeader && tableRows > 0) {
      // Remove the last hline since it's already added in the loop
    }
    
    latex += '\\end{array}';
    
    insertMathSymbol(latex, activeContentEditor);
  };

  // Generate predefined statistical table
  const generateStatisticalTable = (): void => {
    const statisticalTable = `\\begin{array}{|c|c|c|c|}
\\hline
\\text{Class} & f & \\text{Cumulative } f & \\text{Relative } f \\\\
\\hline
0-10 & 3 & 3 & \\frac{3}{25} \\\\
10-20 & 7 & 10 & \\frac{7}{25} \\\\
20-30 & 9 & 19 & \\frac{9}{25} \\\\
30-40 & 4 & 23 & \\frac{4}{25} \\\\
40-50 & 2 & 25 & \\frac{2}{25} \\\\
\\hline
\\end{array}`;
    
    insertMathSymbol(statisticalTable, activeContentEditor);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 mb-4 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Mathematical Equation Editor</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search symbols, functions, or templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
        {tabCategories.map((tab: TabCategory) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
              currentTab === tab.key
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setCurrentTab('templates')}
          className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
            currentTab === 'templates'
              ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          📐 Templates
        </button>
        <button
          onClick={() => setCurrentTab('tables')}
          className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
            currentTab === 'tables'
              ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Table className="w-3 h-3 inline mr-1" />
          Tables
        </button>
      </div>

      {/* Content Area */}
      <div className="max-h-64 overflow-y-auto">
        {currentTab === 'templates' ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-3">Common Equations & Formulas</h4>
            {filteredTemplates.map((template: EquationTemplate, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => insertTemplate(template.latex)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-800">{template.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                </div>
                <div className="mt-1 text-xs font-mono text-gray-600 bg-white p-2 rounded border">
                  <Latex>{`$${template.latex}$`}</Latex>
                </div>
              </div>
            ))}
          </div>
        ) : currentTab === 'tables' ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Table Generator</h4>
            
            {/* Quick Statistical Table */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 mb-2">Quick Insert: Statistical Table</h5>
              <p className="text-sm text-green-700 mb-3">Insert a pre-formatted frequency distribution table</p>
              <button
                onClick={generateStatisticalTable}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Insert Statistical Table
              </button>
            </div>

            {/* Custom Table Builder */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-800 mb-3">Custom Table Builder</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Rows
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Columns
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tableHasBorders}
                    onChange={(e) => setTableHasBorders(e.target.checked)}
                    className="mr-2 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Add borders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tableHasHeader}
                    onChange={(e) => setTableHasHeader(e.target.checked)}
                    className="mr-2 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">First row as header</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Preview: {tableRows} × {tableCols} table
                  {tableHasBorders && <span className=" ml-1">(with borders)</span>}
                  {tableHasHeader && <span className=" ml-1">(with header)</span>}
                </div>
                
                <button
                  onClick={generateTable}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate Table
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {filteredSymbols.map((item: MathSymbol, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertMathSymbol(item.latex, activeContentEditor)}
                className="p-3 text-center bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                title={item.name}
              >
                <div className="text-lg font-semibold text-gray-700 group-hover:text-blue-700">
                  <Latex>{`$${item.latex}$`}</Latex>
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Equation Builder */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Custom LaTeX Equation</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customEquation}
            onChange={(e) => setCustomEquation(e.target.value)}
            placeholder="Enter LaTeX equation (e.g., \\frac{x^2}{y^2})"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <button
            type="button"
            onClick={insertCustomEquation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Insert
          </button>
        </div>
        {customEquation && (
          <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
            <strong>Preview:</strong> <Latex>{`$${customEquation}$`}</Latex>
          </div>
        )}
      </div>
    </div>
  );
};

// Math Button Component for triggering the toolbar
export const MathButton: React.FC<MathButtonProps> = ({ onClick, active = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
      }`}
      title="Math Tools"
    >
      <Calculator className="w-4 h-4" />
    </button>
  );
};

export default MathToolbar;
