import { useRef, useState, useEffect } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Moon, Sun, Download, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function TemplateBuilder() {
  const emailEditorRef = useRef<EditorRef>(null);
  const { theme, toggleTheme } = useTheme();
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    editor.setAppearance({
      theme: theme === "dark" ? "dark" : "light",
      panels: {
        tools: {
          dock: "left"
        }
      }
    });
  }, [theme]);

  const exportHtml = () => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    setIsExporting(true);

    editor.exportHtml((data) => {
      const { html } = data;
      
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setShowSuccessModal(true);
    });
  };

  const onReady: EmailEditorProps["onReady"] = () => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    editor.setAppearance({
      theme: theme === "dark" ? "dark" : "light",
      panels: {
        tools: {
          dock: "left"
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border h-16 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold text-foreground">
            EmailCraft
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-center border-0 border-b-2 border-transparent focus-visible:border-primary rounded-none bg-transparent px-4 py-2 text-base font-medium focus-visible:ring-0"
            placeholder="Untitled Template"
            data-testid="input-template-name"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full hover-elevate active-elevate-2"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            data-testid="button-theme-toggle"
          >
            <div className={`relative transition-transform duration-300 ${theme === "dark" ? "rotate-180" : "rotate-0"}`}>
              <Moon className={`h-5 w-5 transition-opacity duration-300 ${theme === "dark" ? "opacity-0 absolute" : "opacity-100"}`} />
              <Sun className={`h-5 w-5 transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0 absolute"}`} />
            </div>
          </Button>

          <Button
            onClick={exportHtml}
            disabled={isExporting}
            className="gap-2 px-6 py-2.5 hover-elevate active-elevate-2"
            aria-label={`Export ${templateName} as HTML`}
            data-testid="button-export"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export HTML</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </header>

      <main className="w-full" style={{ height: "calc(100vh - 4rem)" }}>
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          minHeight="calc(100vh - 4rem)"
          options={{
            appearance: {
              theme: theme === "dark" ? "dark" : "light",
            },
            features: {
              preview: true,
              imageEditor: true,
              undoRedo: true,
            },
            fonts: {
              showDefaultFonts: true,
            },
          }}
        />
      </main>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md rounded-xl p-8" data-testid="modal-export-success">
          <DialogHeader className="items-center">
            <div className="mb-4">
              <CheckCircle2 className="h-16 w-16 text-[#10b981]" />
            </div>
            <DialogTitle className="text-2xl">Template Exported!</DialogTitle>
            <DialogDescription className="text-center">
              Your HTML file has been downloaded successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowSuccessModal(false)}
              variant="ghost"
              className="text-accent"
              data-testid="button-close-modal"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
