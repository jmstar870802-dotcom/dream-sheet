'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import TextArea from '../form/input/TextArea';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';

const AbcViewer = ({notationData} : {notationData : SheetData}) => {

  const formRef = useRef<HTMLFormElement>(null);  
  const editorRef = useRef<any>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<SheetData>(notationData);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
        
      setFormData((prev) => ({
          ...prev,         
          [name]: value,  
      }));
  };

  useEffect(() => {
    if (!paperRef.current) return;

    const width = window.innerWidth;

    // 기기별 scale 조정
    const scale =
      width < 640  ? 0.8 :   // 스마트폰
      width < 768  ? 0.9 :   // 스마트폰 대형
      width < 1024 ? 1.0 :   // 태블릿
                     1.1;    // 데스크탑 

    // 클라이언트에서만 동적 import
    import('abcjs').then((abcjs) => {
      const visualObj = abcjs.renderAbc(paperRef.current!, formData.notation, {
          responsive: 'resize',
          scale,
          visualTranspose : 0,
          format: {
              stafftopmargin : "10",
              wordsfont: "15",
              gchordfont: "bold 15",
          }
        });
      });
  }, []);


  return (
    <div>
      <div ref={paperRef} />
    </div>
  );
};

export default AbcViewer;