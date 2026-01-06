import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpChat } from "./screens/HelpChat";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (file?: File) => void;
  helperText?: string;
  contextData?: any;
  stepInfo?: string;
  loading?: boolean;
}

export const FileUpload = ({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  onFileSelect,
  onUploadComplete,
  helperText,
  contextData,
  stepInfo,
  loading
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (loading) {
    return null;
  }

  if (isHelpOpen) {
    return <HelpChat isOpen={true} onToggle={() => setIsHelpOpen(false)} contextData={contextData} stepInfo={stepInfo} />;
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelection(file);
      }
    },
    [onFileSelect]
  );

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      onFileSelect?.(file);
      onUploadComplete?.(file);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setIsUploading(false);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {label && <label className="text-base font-medium text-foreground">{label}</label>}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-base font-medium text-foreground">
            Drag & drop your file here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            or click to browse
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isUploading ? "bg-muted" : "bg-success/10"
              )}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {isUploading
                  ? "Uploading..."
                  : `${(selectedFile.size / 1024).toFixed(1)} KB`}
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={clearFile}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      <HelpChat isOpen={false} onToggle={() => setIsHelpOpen(true)} contextData={contextData} stepInfo={stepInfo} />
    </div>
  );
};
