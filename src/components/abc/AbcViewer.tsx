'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button/Button';
import { ArrowBigUpDash, ArrowBigDownDash, IterationCcw, ArrowBigLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AbcViewer = ({
  notationData,
  showBack = true,
} : {
  notationData: SheetData;
  showBack?: boolean;
}) => {

  const router = useRouter();

  const paperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [formData, setFormData] = useState<SheetData>(notationData);
  const [visualTranspose, setVisualTranspose] = useState<number>(0);

  const fnKeyUp = () => {
    setVisualTranspose(prev => prev + 1);
    setFormData({...notationData});
  };

  const fnKeyDown = () => {
    setVisualTranspose(prev => prev - 1);
    setFormData({...notationData});
  };

  const fnKeySet = () => {
    setVisualTranspose(0);
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

        // overflow:hidden 조상이 있으면 그 bottom을 경계로 사용 (분할 셀 대응)
        let clipBottom = viewportHeight;
        let el: HTMLElement | null = paperRef.current.parentElement;
        while (el && el !== document.body) {
          const cs = getComputedStyle(el);
          if (cs.overflow === 'hidden' || cs.overflowY === 'hidden') {
            clipBottom = Math.min(clipBottom, el.getBoundingClientRect().bottom);
            break;
          }
          el = el.parentElement;
        }
        const available = clipBottom - top;

        if (totalHeight > available && available > 0) {
          const scale = available / totalHeight;
          paperRef.current.style.transformOrigin = 'top left';
          paperRef.current.style.transform = `scale(${scale})`;
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
            <Button size="sm" variant="primary" className="p-1 mx-auto h-7 sm:h-8" buttonType="button" onClick={handleBack}>
              <ArrowBigLeft className='size-4 sm:size-5'/>
              <span className='hidden sm:inline'>Back</span>
            </Button>
          </div>
        )}
        {formData.notation?.length ? (
          <div className='flex gap-1'>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-7 sm:h-8 sm:w-26" buttonType="button" onClick={fnKeyDown}>
                <ArrowBigDownDash className='size-4 sm:size-5'/>
                <span className='hidden sm:inline'>키 다운</span>
              </Button>
            </div>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-7 sm:h-8 sm:w-23" buttonType="button" onClick={fnKeySet}>
                <IterationCcw className='size-4 sm:size-5'/>
                <span className='hidden sm:inline'>원키</span>
              </Button>
            </div>
            <div>
              <Button size="sm" variant="primary" className="mx-auto h-7 sm:h-8 sm:w-23" buttonType="button" onClick={fnKeyUp}>
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
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      ) : (
        <p className='flex items-center justify-center text-gray-400 p-10'>악보 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default AbcViewer;
