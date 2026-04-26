'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button/Button';
import { ArrowBigUpDash, ArrowBigDownDash, IterationCcw, ArrowBigLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AbcViewer = ({notationData} : {notationData : SheetData}) => {

  const router = useRouter();

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


  const handleBack = () => {
    // 히스토리가 있으면 뒤로, 없으면 홈으로
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };



  useEffect(() => {
    if (!paperRef.current) return;

    // 클라이언트에서만 동적 import
    import('abcjs').then((abcjs) => {
      abcjs.renderAbc(paperRef.current!, formData.notation, {
          responsive: 'resize',
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
      <div className='flex flex-row gap-2 justify-between'>
        <div>
            <Button size="sm" variant="primary" className="mx-auto w-30 h-10" buttonType="button" onClick={handleBack}>
                <ArrowBigLeft className='my-0 mx-0'/>Back
            </Button>
        </div>
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