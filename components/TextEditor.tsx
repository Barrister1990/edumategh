import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
  X
} from 'lucide-react';
import React, { useRef } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  contentId: number;
  isVisible: boolean;
  onClose: () => void;
  rows?: number;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content here...",
  contentId,
  isVisible,
  onClose,
  rows = 8
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = before + textToInsert + after;
    
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    onChange(newValue);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length);
      }
    }, 0);
  };

  const insertAtLine = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const value = textarea.value;
    
    // Find the start of the current line
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  };

  const formatButtons = [
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertAtLine('# '),
      category: 'heading'
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => insertAtLine('## '),
      category: 'heading'
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => insertAtLine('### '),
      category: 'heading'
    },
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertFormatting('**', '**', 'bold text'),
      category: 'format'
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertFormatting('*', '*', 'italic text'),
      category: 'format'
    },
    {
      icon: Underline,
      label: 'Underline',
      action: () => insertFormatting('<u>', '</u>', 'underlined text'),
      category: 'format'
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough',
      action: () => insertFormatting('~~', '~~', 'strikethrough text'),
      category: 'format'
    },
    {
      icon: Code,
      label: 'Inline Code',
      action: () => insertFormatting('`', '`', 'code'),
      category: 'format'
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertAtLine('- '),
      category: 'list'
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertAtLine('1. '),
      category: 'list'
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertAtLine('> '),
      category: 'format'
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertFormatting('[', '](url)', 'link text'),
      category: 'format'
    }
  ];

  const insertCodeBlock = () => {
    insertFormatting('\n```\n', '\n```\n', 'code block');
  };

  const insertTable = () => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = textarea.value.substring(0, start) + tableMarkdown + textarea.value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tableMarkdown.length, start + tableMarkdown.length);
    }, 0);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-4">
      {/* Toolbar Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-700">Text Formatting</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-1">
          {/* Headings */}
          <div className="flex items-center space-x-1 pr-2 mr-2 border-r border-gray-200">
            {formatButtons.filter(btn => btn.category === 'heading').map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 pr-2 mr-2 border-r border-gray-200">
            {formatButtons.filter(btn => btn.category === 'format' && !['Quote', 'Link'].includes(btn.label)).map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1 pr-2 mr-2 border-r border-gray-200">
            {formatButtons.filter(btn => btn.category === 'list').map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Special Elements */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => insertFormatting('> ', '', 'quote text')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('[', '](url)', 'link text')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={insertCodeBlock}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Code Block"
            >
              Code Block
            </button>
            <button
              onClick={insertTable}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Insert Table"
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Quick Help */}
       <div className="px-4 py-2 bg-blue-50 border-b border-gray-100">
      <div className="text-xs text-blue-700">
        <span className="font-medium">Quick tips:</span> Use $LaTeX$ for math equations, **bold**, *italic*, `code`, and {'>'}  for quotes
      </div>
    </div>

      {/* Text Area */}
      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
          rows={rows}
          placeholder={`${placeholder} Use the toolbar above for formatting or type markdown directly...`}
        />
      </div>

      {/* Preview Toggle Info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Switch to Preview Mode to see formatted output</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;