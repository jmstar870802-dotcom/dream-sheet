'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  //원키
  const fnKeySet = () => {
    setVisualTranspose(0);
    const updatedData =  {...notationData, visualTranspose : visualTranspose}
    setFormData(updatedData)
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // SVG를 화면 높이에 맞게 스케일링
  const scaleSvgToHeight = useCallback(() => {
    if (!paperRef.current || !wrapperRef.current) return;

    const svgs = paperRef.current.querySelectorAll('svg');
    if (svgs.length === 0) return;

    // transform 초기화 후 자연 높이 측정
    paperRef.current.style.transform = 'none';

    requestAnimationFrame(() => {
      if (!paperRef.current || !wrapperRef.current) return;

      const naturalHeight = paperRef.current.getBoundingClientRect().height;
      // wrapper의 실제 top 위치로 버튼바 높이를 자동 반영
      const wrapperTop = wrapperRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - wrapperTop;

      if (!naturalHeight || !availableHeight) return;

      const scale = availableHeight / naturalHeight;

      paperRef.current.style.transform = `scale(${scale})`;
      paperRef.current.style.transformOrigin = 'top left';

      wrapperRef.current.style.height = `${availableHeight}px`;
      wrapperRef.current.style.overflow = 'hidden';
    });
  }, []);

  // notation 없을 때 wrapper 높이를 이미지가 채우도록 설정
  useEffect(() => {
    if (formData.notation?.length) return;
    if (!wrapperRef.current) return;

    const setImageHeight = () => {
      if (!wrapperRef.current) return;
      const top = wrapperRef.current.getBoundingClientRect().top;
      wrapperRef.current.style.height = `${window.innerHeight - top}px`;
    };

    setImageHeight();
    window.addEventListener('resize', setImageHeight);
    return () => window.removeEventListener('resize', setImageHeight);
  }, [formData.notation]);

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
          gchordfont: "bold 15",
        }
      });

      requestAnimationFrame(scaleSvgToHeight);
    });
  }, [formData, scaleSvgToHeight]);

  useEffect(() => {
    window.addEventListener('resize', scaleSvgToHeight);
    return () => window.removeEventListener('resize', scaleSvgToHeight);
  }, [scaleSvgToHeight]);

  // 이 페이지에서는 body 스크롤 완전 차단
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);


  return (
    <div className='flex flex-col h-screen overflow-hidden'>
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

      <div ref={wrapperRef} className='relative overflow-hidden'>
        {formData.notation?.length ? (
          <div ref={paperRef} />
        ) : formData.img_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={formData.img_url}
            alt={formData.title}
            className='w-full h-full object-contain object-left'
          />
        ) : (
          <p className='flex items-center justify-center h-full text-gray-400'>악보 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default AbcViewer;