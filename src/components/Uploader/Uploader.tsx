import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import styles from './Uploader.module.css';

interface UploaderProps {
  onProcess: (files: File[]) => void;
  title: string;
  multiple?: boolean;
  actionText?: string;
  isProcessing?: boolean;
  accept?: string;
}

export function Uploader({ onProcess, title, multiple = false, actionText = 'Process Files', isProcessing = false, accept = 'application/pdf' }: UploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      // In a real app we'd check mime type against 'accept', but for simplicity we accept all dropped files here
      // if they match the general criteria.
      if (multiple) {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles([newFiles[0]]);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (multiple) {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles([newFiles[0]]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    if (files.length > 0) {
      onProcess(files);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {files.length === 0 ? (
        <div 
          className={`${styles.uploader} ${dragActive ? styles.dragActive : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className={styles.icon} />
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>or drop PDFs here</p>
          <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            Select PDF files
          </button>
          <input 
            ref={inputRef}
            type="file" 
            className={styles.fileInput} 
            multiple={multiple} 
            accept={accept}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <File color="var(--primary)" size={24} />
                  <span className={styles.fileName}>{file.name}</span>
                </div>
                <button className={styles.removeBtn} onClick={() => removeFile(index)}>
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.actions}>
            <button 
              className="btn btn-outline" 
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
            >
              Add more files
            </button>
            <input 
              ref={inputRef}
              type="file" 
              className={styles.fileInput} 
              multiple={multiple} 
              accept={accept}
              onChange={handleChange}
            />
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : actionText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
