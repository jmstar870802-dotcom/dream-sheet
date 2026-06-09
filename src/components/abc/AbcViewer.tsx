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
  const [formData, setFormData] = useState<SheetData>(notationData);
  const [visualTranspose, setVisualTranspose] = useState<number>(0)

  const fnKeyUp = () => {
    setVisualTranspose(visualTranspose+1);
    const updatedData = {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

  const fnKeyDown = () => {
    setVisualTranspose(visualTranspose-1);
    const updatedData = {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

  const fnKeySet = () => {
    setVisualTranspose(0);
    const updatedData = {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (!paperRef.current) return;
    if (!formData.notation?.length) return;

    import('abcjs').then((abcjs) => {
      abcjs.renderAbc(paperRef.current!, formData.notation, {
        responsive: 'resize',
        visualTranspose : visualTranspose,
        add_classes: true,
        format: {
          stafftopmargin : "10",
          wordsfont: "15",
          gchordfont: "bold 16",
          vocalfont : "16"
        }
      });
    });
  }, [formData]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-2 justify-between p-2'>
        <div>
          <Button size="sm" variant="primary" className="p-1 mx-auto h-8 sm:h-10" buttonType="button" onClick={handleBack}>
            <ArrowBigLeft className='size-4 sm:size-5'/>
            <span className='hidden sm:inline'>Back</span>
          </Button>
        </div>
        {formData.notation?.length ? (
          <div className='flex gap-1'>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-8 sm:h-10 sm:w-30" buttonType="button" onClick={fnKeyDown}>
                <ArrowBigDownDash className='size-4 sm:size-5'/>
                <span className='hidden sm:inline'>키 다운</span>
              </Button>
            </div>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-8 sm:h-10 sm:w-25" buttonType="button" onClick={fnKeySet}>
                <IterationCcw className='size-4 sm:size-5'/>
                <span className='hidden sm:inline'>원키</span>
              </Button>
            </div>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-8 sm:h-10 sm:w-25" buttonType="button" onClick={fnKeyUp}>
                <ArrowBigUpDash className='size-4 sm:size-5'/>
                <span className='hidden sm:inline'>키업</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {formData.notation?.length ? (
        <div ref={paperRef} />
      ) : formData.img_url ? (
        <div className='flex-1 min-h-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={formData.img_url}
            alt={formData.title}
            className='w-full h-full object-contain object-left-top'
          />
        </div>
      ) : (
        <p className='flex items-center justify-center text-gray-400 p-10'>악보 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default AbcViewer;
