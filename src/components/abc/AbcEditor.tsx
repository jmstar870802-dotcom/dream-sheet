'use client';

import React, { useEffect, useRef, useState, useActionState, useTransition } from 'react';
import TextArea from '../form/input/TextArea';
import Button from "@/components/ui/button/Button";
import 'abcjs/abcjs-audio.css';
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { createSheetAction } from '@/action/createSheet.action';
import { updateSheetAction } from '@/action/updateSheet.action';
import { deleteSheetAction } from '@/action/deleteSheet.action';
import { SheetData } from '@/types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ArrowBigLeft } from 'lucide-react';

const AbcEditor = ({notationData} : {notationData : SheetData}) => {

  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);
  const editorRef = useRef<any>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const isEditMode = !!notationData?.id;

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    startDeleteTransition(async () => {
      const result = await deleteSheetAction(formData.id);
      if (result.status) {
        toast.success('삭제되었습니다.', { position: 'bottom-center', autoClose: 1000 });
        setTimeout(() => router.push('/worship-update'), 1100);
      } else {
        alert(result.error);
      }
    });
  };

  const [formData, setFormData] = useState<SheetData>(notationData);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const action = isEditMode ? updateSheetAction : createSheetAction;

  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    import('abcjs').then((abcjs) => {
      editorRef.current = new abcjs.Editor('notation', {
        canvas_id: 'paper',
        warnings_id: 'warnings_id',
        indicate_changed: true,
        onchange: (editor: any) => {
          console.log('변경됨, dirty:', editor.isDirty());
        },
        abcjsParams: {
          responsive: 'resize',
          add_classes: true,
          visualTranspose: 0,
          format: {
            stafftopmargin: "5",
            wordsfont: "13",
            gchordfont: "bold 13",
          }
        },
        synth: {
          el: '#audio',
          options: {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: true,
          },
        },
      });
    });
  }, []);

  useEffect(() => {
    if (!state) return;

    if (!state.status && state.error) {
      alert(state.error);
    }

    if (state.status && state.data) {
      setFormData((prev) => ({
        ...prev,
        id: state.data.id,
        title: state.data.title,
        key: state.data.key,
        lyrics: state.data.lyrics,
        notation: state.data.notation,
        img_url: state.data.img_url,
      }));

      toast.success('저장이 완료되었습니다!', {
        position: "bottom-center",
        autoClose: 1500,
      });
    }
  }, [state]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2" style={{ padding: '10px' }}>
      <div className="space-y-3">
        {/* 상단 버튼 바 */}
        <div className="flex items-center justify-between">
          <Button size="sm" variant="primary" className="flex items-center gap-1 h-9" buttonType="button" onClick={() => router.back()}>
            <ArrowBigLeft className="size-4" />
            <span>뒤로가기</span>
          </Button>
          <div className="flex gap-1">
            <Button size="sm" variant="primary" className="w-16 h-9" buttonType="button" onClick={() => formRef.current?.requestSubmit()}>
              {isPending ? "..." : "저장"}
            </Button>
            {isEditMode && (
              <Button size="sm" variant="outline" className="w-16 h-9 text-red-600 border-red-400 hover:bg-red-50" buttonType="button" onClick={handleDelete}>
                {isDeleting ? "..." : "삭제"}
              </Button>
            )}
          </div>
        </div>
        <ToastContainer style={{ width: "600px" }} />

        <form ref={formRef} action={formAction}>
          {isEditMode && (
            <input type="hidden" name="id" value={formData?.id} />
          )}
          <div>
            <Label>제목</Label>
            <Input type="text" id="title" name="title" onChange={handleChange} defaultValue={formData?.title} />
          </div>
          <div>
            <Label>첫 소절</Label>
            <Input type="text" id="lyrics" name="lyrics" onChange={handleChange} defaultValue={formData?.lyrics} />
          </div>
          <div>
            <Label>원 키(key)</Label>
            <Input type="text" id="key" name="key" onChange={handleChange} defaultValue={formData?.key} />
          </div>
          <div>
            <Label>악보 원본 URL</Label>
            <Input type="text" id="img_url" name="img_url" onChange={handleChange} defaultValue={formData?.img_url} />
          </div>
          <div>
            <Label>악보 데이터(ABC notation)</Label>
            <TextArea
              id="notation"
              name="notation"
              rows={20}
              value={formData?.notation}
              onChange={handleChange}
            />
          </div>
        </form>
        <div id="warnings_id">
          No Error
        </div>
        <div id="audio" ref={audioRef} className='text-base' />
      </div>

      <div
        className="space-y-6"
        id="paper"
        ref={paperRef}
        style={{ padding: '10px', borderRadius: '8px' }}
      />
    </div>
  );
};

export default AbcEditor;
