import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import styled, { css } from 'styled-components';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

// tiptap 툴바 컴포넌트
const MenuBar = ({ editor }) => {
  const [color, setColor] = useState('#000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) return null;

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString();
      if (base64) {
        editor.chain().focus().setImage({ src: base64 }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <MenuBarWrapper>
      {[
        {
          label: 'B',
          command: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive('bold'),
        },
        {
          label: 'I',
          command: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive('italic'),
        },
        {
          label: 'U',
          command: () => editor.chain().focus().toggleUnderline().run(),
          active: editor.isActive('underline'),
        },
        {
          label: 'H1',
          command: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          active: editor.isActive('heading', { level: 1 }),
        },
        {
          label: 'H2',
          command: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editor.isActive('heading', { level: 2 }),
        },
        {
          label: '• List',
          command: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive('bulletList'),
        },
        {
          label: '↤',
          command: () => editor.chain().focus().setTextAlign('left').run(),
        },
        {
          label: '↔',
          command: () => editor.chain().focus().setTextAlign('center').run(),
        },
        {
          label: '↦',
          command: () => editor.chain().focus().setTextAlign('right').run(),
        },
      ].map((btn, i) => (
        <MenuButton key={i} onClick={btn.command} active={btn.active}>
          {btn.label}
        </MenuButton>
      ))}

      <MenuButton as="label">
        🖼 업로드
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </MenuButton>

      <MenuButton onClick={() => setShowColorPicker(!showColorPicker)}>
        🎨
      </MenuButton>

      {showColorPicker && (
        <ColorPickerWrapper onClick={() => setShowColorPicker(false)}>
          <SketchPicker
            color={color}
            onChange={(updatedColor) => {
              setColor(updatedColor.hex);
              editor.chain().focus().setColor(updatedColor.hex).run();
            }}
          />
        </ColorPickerWrapper>
      )}

      <MenuButton
        onClick={() => {
          const url = prompt('Link URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        🔗
      </MenuButton>

      <MenuButton
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        ⟳
      </MenuButton>
    </MenuBarWrapper>
  );
};

// tiptap 에디터 메인 컴포넌트
export default function TiptapEditor({ value = '', onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link,
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  return (
    <EditorContainer>
      <EditorLabel>내용</EditorLabel>
      <EditorWrapper>
        <MenuBar editor={editor} />
        <StyledEditorContent editor={editor} />
      </EditorWrapper>
    </EditorContainer>
  );
}

const EditorContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
`;

const EditorLabel = styled.label`
  display: block;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
`;

const EditorWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  min-height: 300px;
`;

const MenuBarWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;

const activeStyle = css`
  background-color: #007bff;
  color: white;
`;

const MenuButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 32px; /* 고정 높이 설정 */
  padding: 0 10px; /* 위아래 패딩 제거 */

  font-size: 14px;
  line-height: 1;
  margin-right: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;

  ${(props) => props.active && activeStyle}

  &:hover {
    background: #e6f0ff;
  }

  label {
    all: unset; /* label 기본 스타일 제거 */
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    text-align: center;
    line-height: 1;
  }
`;

const StyledEditorContent = styled(EditorContent)`
  min-height: 200px;
  outline: none;
  padding: 10px 0 0 16px;

  p,
  h1,
  h2 {
    text-align: inherit;
  }

  p {
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 8px;
`;
