'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button/Button';
import { ArrowBigUpDash, ArrowBigDownDash, IterationCcw } from 'lucide-react';

const AbcViewer = ({notationData} : {notationData : SheetData}) => {
  
  const paperRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SheetData>(notationData);


  const [visualTranspose, setVisualTranspose] = useState<number>(0)
    //키업   
  const fnKeyUp = () => {
    setVisualTranspose(visualTranspose+1);

    const updatedData =  {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

  //키 다운
  const fnKeyDown = () => {
    setVisualTranspose(visualTranspose-1);

    const updatedData =  {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

    //키 다운
  const fnKeySet = () => {
    setVisualTranspose(0);

    const updatedData =  {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
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
      abcjs.renderAbc(paperRef.current!, formData.notation, {
          responsive: 'resize',
          scale,
          visualTranspose : visualTranspose,
          format: {
              stafftopmargin : "10",
              wordsfont: "15",
              gchordfont: "bold 15",
          }
        });
      });
  }, [formData]);


  return (
    <div>
      <div>
        <div className='flex gap-1'>
          <div>
            <Button size="sm" variant="primary" className="mx-auto w-30 h-10" buttonType="button" onClick={fnKeyDown}>
                <ArrowBigDownDash className='my-0 mx-0'/>키 다운
            </Button>
          </div>
          <div>
            <Button size="sm" variant="primary" className="mx-auto w-25 h-10" buttonType="button" onClick={fnKeySet}>
                  <IterationCcw className='my-0 mx-0'/>원키
            </Button>
          </div>
          <div>
            <Button size="sm" variant="primary" className="mx-auto w-25 h-10" buttonType="button" onClick={fnKeyUp}>
              <ArrowBigUpDash className='my-0 mx-0'/>키업
            </Button>
          </div>
        </div>
      </div>

      <div ref={paperRef} />
    </div>
  );
};

export default AbcViewer;