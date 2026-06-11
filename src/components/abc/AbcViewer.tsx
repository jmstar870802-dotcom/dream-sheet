'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button/Button';
import { ArrowBigUpDash, ArrowBigDownDash, IterationCcw, ArrowBigLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AbcViewer = ({
  notationData,
  showBack = true,
  showKeyControls = true,
  visualTranspose: externalTranspose,
} : {
  notationData: SheetData;
  showBack?: boolean;
  showKeyControls?: boolean;
  visualTranspose?: number;
}) => {

  const router = useRouter();

  const paperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [formData, setFormData] = useState<SheetData>(notationData);
  const [internalTranspose, setInternalTranspose] = useState<number>(0);

  const visualTranspose = externalTranspose !== undefined ? externalTranspose : internalTranspose;

  const fnKeyUp = () => {
    setInternalTranspose(prev => prev + 1);
    setFormData({...notationData});
  };

  const fnKeyDown = () => {
    setInternalTranspose(prev => prev - 1);
    setFormData({...notationData});
  };

  const fnKeySet = () => {
    setInternalTranspose(0);
    setFormData({...notationData});
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const fitImageToScreen = useCallback(() => {
    if (!imgRef.current) return;
    imgRef.current.style.maxHeight = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!imgRef.current) return;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const top = imgRef.current.getBoundingClientRect().top;
        const available = viewportHeight - top;
        if (available > 0) {
          imgRef.current.style.maxHeight = `${available}px`;
        }
      });
    });
  }, []);

  // 악보 높이가 가용 화면보다 크면 transform scale로 축소
  const fitToScreen = useCallback(() => {
    if (!paperRef.current) return;

    paperRef.current.style.transform = '';
    paperRef.current.style.marginBottom = '';

    // double rAF: 첫 번째는 reset 반영 대기, 두 번째는 측정
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!paperRef.current) return;

        const svgList = paperRef.current.querySelectorAll('svg');
        if (svgList.length === 0) return;

        let totalHeight = 0;
        svgList.forEach((svg) => {
          totalHeight += svg.getBoundingClientRect().height;
        });
        if (!totalHeight) return;

        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const top = paperRef.current.getBoundingClientRect().top;
        const available = viewportHeight - top;

        if (totalHeight > available && available > 0) {
          const scale = available / totalHeight;
          paperRef.current.style.transformOrigin = 'top left';
          paperRef.current.style.transform = `scale(${scale})`;
          // transform은 레이아웃에 영향 없으므로 marginBottom으로 여백 상쇄
          paperRef.current.style.marginBottom = `-${totalHeight * (1 - scale)}px`;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!paperRef.current) return;
    if (!formData.notation?.length) return;

    import('abcjs').then((abcjs) => {
      abcjs.renderAbc(paperRef.current!, formData.notation, {
        responsive: 'resize',
        visualTranspose: visualTranspose,
        add_classes: true,
        format: {
          stafftopmargin: "10",
          wordsfont: "15",
          gchordfont: "bold 16",
          vocalfont: "16"
        }
      });

      requestAnimationFrame(fitToScreen);
    });
  }, [formData, fitToScreen, visualTranspose]);

  useEffect(() => {
    window.addEventListener('resize', fitToScreen);
    window.visualViewport?.addEventListener('resize', fitToScreen);
    return () => {
      window.removeEventListener('resize', fitToScreen);
      window.visualViewport?.removeEventListener('resize', fitToScreen);
    };
  }, [fitToScreen]);

  useEffect(() => {
    if (!formData.img_url) return;
    fitImageToScreen();
    window.addEventListener('resize', fitImageToScreen);
    window.visualViewport?.addEventListener('resize', fitImageToScreen);
    return () => {
      window.removeEventListener('resize', fitImageToScreen);
      window.visualViewport?.removeEventListener('resize', fitImageToScreen);
    };
  }, [formData.img_url, fitImageToScreen]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-2 justify-between p-2'>
        {showBack && (
          <div>
            <Button size="sm" variant="primary" className="p-1 mx-auto h-8 sm:h-10" buttonType="button" onClick={handleBack}>
              <ArrowBigLeft className='size-4 sm:size-5'/>
              <span className='hidden sm:inline'>Back</span>
            </Button>
          </div>
        )}
        {showKeyControls && formData.notation?.length ? (
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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={formData.img_url}
          alt={formData.title}
          style={{ width: 'auto', maxWidth: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'left top', display: 'block' }}
        />
      ) : (
        <p className='flex items-center justify-center text-gray-400 p-10'>악보 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default AbcViewer;
