import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options: initialOptions,
  onChange,
  placeholder = 'Seçiniz...',
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      if (!searchTerm.trim()) {
        e.preventDefault();
        setSelectedOptions(options);
      }
    }
    
    if (e.key === 'Backspace' && !searchTerm && selectedOptions.length > 0) {
      setSelectedOptions(prev => prev.slice(0, -1));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setOptions(initialOptions);
      return;
    }
  };

  const addNewOption = () => {
    if (searchTerm.trim() !== '') {
      const newOption: Option = {
        label: searchTerm,
        value: searchTerm.toLowerCase(),
      };
      setOptions((prev) => [...prev, newOption]);
      setSelectedOptions((prev) => [...prev, newOption]);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const toggleOption = (option: Option) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.value === option.value)
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option]
    );
    setSearchTerm('');
  };

  const removeOption = (optionToRemove: Option) => {
    setSelectedOptions((prev) =>
      prev.filter((option) => option.value !== optionToRemove.value)
    );
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="underline">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        className="w-full h-[40px] bg-white border border-[#e5e7eb] rounded flex items-center gap-2 px-3 cursor-text focus-within:border-blue-500 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1 bg-[#f3f4f6] px-2 py-1 rounded text-[14px] text-gray-700 whitespace-nowrap font-bold"
            >
              {option.label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[60px] outline-none text-[14px] placeholder-gray-400"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-[#e5e7eb] rounded shadow-sm">
          <div className="max-h-[240px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-[14px] cursor-pointer transition-colors ${
                    selectedOptions.some((item) => item.value === option.value)
                      ? 'bg-[#f3f4f6] text-gray-700 font-bold'
                      : 'text-gray-600 hover:bg-[#f9fafb]'
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  {highlightText(option.label, searchTerm)}
                </div>
              ))
            ) : searchTerm.trim() !== '' ? (
              <div 
                className="px-3 py-2 text-[14px] text-gray-600 cursor-pointer hover:bg-[#f9fafb] flex justify-between items-center" 
                onClick={addNewOption}
              >
                <span>"{searchTerm}"</span>
                <span>Ekle</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
