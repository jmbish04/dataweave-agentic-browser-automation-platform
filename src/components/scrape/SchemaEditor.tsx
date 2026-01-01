import React from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
interface SchemaEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}
export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
  const { isDark } = useTheme();
  return (
    <Card className="h-full overflow-hidden border-none rounded-none bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Output Schema (JSON)</span>
      </div>
      <Editor
        height="100%"
        defaultLanguage="json"
        theme={isDark ? "vs-dark" : "light"}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16 }
        }}
      />
    </Card>
  );
}