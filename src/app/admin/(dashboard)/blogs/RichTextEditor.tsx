"use client";

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const btn = 'px-2.5 py-1 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors';
const btnActive = 'px-2.5 py-1 rounded-lg text-sm text-white bg-primary';

function Toolbar({ editor, onImage }: { editor: Editor; onImage: () => void }) {
  const b = (active: boolean) => (active ? btnActive : btn);
  return (
    <div className="flex flex-wrap items-center gap-1 border border-white/10 border-b-0 rounded-t-xl bg-white/5 p-2">
      <button type="button" className={b(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
      <button type="button" className={b(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button type="button" className={b(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={b(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={b(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" className={b(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" className={b(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      <button type="button" className={b(editor.isActive('link'))} onClick={() => {
        const prev = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Link URL', prev ?? 'https://');
        if (url === null) return;
        if (url === '') { editor.chain().focus().unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }}>Link</button>
      <button type="button" className={btn} onClick={onImage}>Image</button>
      <span className="flex-1" />
      <button type="button" className={btn} onClick={() => editor.chain().focus().undo().run()}>↶</button>
      <button type="button" className={btn} onClick={() => editor.chain().focus().redo().run()}>↷</button>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false, // required: avoid Next SSR hydration mismatch
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } } }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: { class: 'blog-content min-h-[300px] px-4 py-3 focus:outline-none' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  async function insertImage() {
    if (!editor) return;
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = 'image/*';
    inputEl.onchange = async () => {
      const file = inputEl.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) { window.alert('Image upload failed.'); return; }
        const { path } = await res.json();
        editor.chain().focus().setImage({ src: path }).run();
      } catch { window.alert('Image upload failed (network error).'); }
    };
    inputEl.click();
  }

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} onImage={insertImage} />
      <div className="border border-white/10 rounded-b-xl bg-white/5 text-white/90">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
