'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import abcjs from 'abcjs';
import TextArea from '../form/input/TextArea';
import Button from "@/components/ui/button/Button";
import 'abcjs/abcjs-audio.css';
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { createSheetAction } from '@/action/createSheet.action';
import { SheetData } from '@/types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AbcEditor = ({notationData} : {notationData : SheetData}) => {

  const formRef = useRef<HTMLFormElement>(null);  
  const editorRef = useRef<any>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const midiBufferRef = useRef<abcjs.SynthObjectController | null>(null);

  const [formData, setFormData] = useState<SheetData>(notationData);


  // const [formData, setFormData] = useState({
  //    id : 0,
  //    title : "",
  //    lyrics : "",
  //    key : "",
  //    img_url : "",
  //    notation : "",
  //    //visualTranspose : notationData?.visualTranspose
  // });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
        
      setFormData((prev) => ({
          ...prev,         
          [name]: value,  
      }));
  };

  const [state, formAction, isPending] = useActionState(
      createSheetAction,
      null
  );

  useEffect(() => {

      import('abcjs').then((abcjs) => {
        editorRef.current = new abcjs.Editor('notation', {
          canvas_id: 'paper',
          warnings_id: 'warnings_id',
          indicate_changed: true,   // dirty flag 활성화
          onchange: (editor: any) => {
            console.log('변경됨, dirty:', editor.isDirty());
          },
          abcjsParams: {
            responsive: 'resize',
            add_classes: true,
            visualTranspose : 0,

            // expandToWidest : true,
            // chordGrid : "noMusic",
            // germanAlphabet : true,
            // jazzchords: true,
            format: {
                stafftopmargin : "5",
                wordsfont: "13",
                gchordfont: "bold 13",
            }
          },   
          synth: {
            el: '#audio',       // 오디오 컨트롤 삽입 위치
            options: {
              displayLoop: true,
              displayRestart: true,
              displayPlay: true,
              displayProgress: true,
              displayWarp: true,    // 템포 조절 슬라이더
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
            id : state.data.id,
            title: state.data.title,
            key: state.data.key,
            lyrics: state.data.lyrics,
            notation: state.data.notation,
            img_url: state.data.img_url,
      }));  

          // 2. 저장 성공 후 알림 표시
      toast.success('저장이 완료되었습니다!', {
        position: "bottom-center",
        autoClose: 1500,
      });
    }
  }, [state]); 

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2" style={{ padding: '10px' }}>
       <div className="space-y-3">
         <form ref={formRef} action={formAction}>
          <div >
              <Label>제목</Label>
              <div className="grid grid-cols-[1fr_80px] gap-2">
                <Input type="text" className="w-150" id="title" name="title" onChange={handleChange} defaultValue={formData?.title}/>
                <Button size="sm" variant="primary" className="w-20" buttonType="submit">
                    {isPending ? "..." : "저장"}
                </Button>
                <ToastContainer style={{ width: "600px" }} />
              </div>
          </div>
          <div>
                <Label>첫 소절</Label>
                <Input type="text" id="lyrics" name="lyrics" onChange={handleChange} defaultValue={formData?.lyrics}/>
          </div>
          <div>
                <Label>원 키(key)</Label>
                <Input type="text" id="key" name="key" onChange={handleChange} defaultValue={formData?.key}/>
          </div>        
          <div>
                <Label>악보 원본 URL</Label>
                <Input type="text"  id="img_url" name="img_url" onChange={handleChange} defaultValue={formData?.img_url}/>
          </div>  
          <div>
            <Label>악보 데이터(ABC notation)</Label>
            <TextArea 
                    id="notation"
                    name="notation"
                    rows={20}
                    value={formData?.notation}
                    onChange={handleChange}
                    className='!text-black !text-base [word-spacing:0.3rem]'
            />
          </div>   
        </form>  
        <div id="warnings_id">
            No Error
        </div>
        <div id="audio" ref={audioRef} className='text-base' />
      </div>  

      <div className="space-y-6 "
        id="paper" 
        ref={paperRef} 
        style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}
      />
    </div>
  );
};

export default AbcEditor;