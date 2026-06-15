'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import 'abcjs/abcjs-audio.css';
import { SheetData } from '@/types/types';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button/Button';
import { ArrowBigUpDash, ArrowBigDownDash, IterationCcw, ArrowBigLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AbcViewer = ({
  notationData,
  showBack = true,
  enableModal = true,
} : {
  notationData: SheetData;
  showBack?: boolean;
  enableModal?: boolean;
}) => {

  const router = useRouter();

  const paperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [formData, setFormData] = useState<SheetData>(notationData);
  const [visualTranspose, setVisualTranspose] = useState<number>(0);
  const [imgModal, setImgModal] = useState(false);
  const [notationModal, setNotationModal] = useState(false);
  const modalPaperRef = useRef<HTMLDivElement>(null);

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
    imgRef.current.style.height = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!imgRef.current) return;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const top = imgRef.current.getBoundingClientRect().top;

        let clipBottom = viewportHeight;
        let el: HTMLElement | null = imgRef.current.parentElement;
        while (el && el !== document.body) {
          const cs = getComputedStyle(el);
          if (cs.overflow === 'hidden' || cs.overflowY === 'hidden') {
            clipBottom = Math.min(clipBottom, el.getBoundingClientRect().bottom);
            break;
          }
          el = el.parentElement;
        }

        const available = clipBottom - top;
        if (available > 0) {
          imgRef.current.style.height = `${available}px`;
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
    if (!notationModal || !modalPaperRef.current || !formData.notation?.length) return;
    import('abcjs').then((abcjs) => {
      abcjs.renderAbc(modalPaperRef.current!, formData.notation, {
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
    });
  }, [notationModal, formData.notation, visualTranspose]);

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
        <div
          ref={paperRef}
          onClick={() => enableModal && setNotationModal(true)}
          style={enableModal ? { cursor: 'zoom-in' } : undefined}
        />
      ) : formData.img_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={formData.img_url}
          alt={formData.title}
          onClick={() => enableModal && setImgModal(true)}
          style={{ width: 'auto', maxWidth: '100%', display: 'block', ...(enableModal ? { cursor: 'zoom-in' } : {}) }}
        />
      ) : (
        <p className='flex items-center justify-center text-gray-400 p-10'>악보 데이터가 없습니다.</p>
      )}

      {notationModal && (
        <div
          className='fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-20 overflow-y-auto'
          onClick={() => setNotationModal(false)}
        >
          <div className='relative w-full max-w-4xl mx-4' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex gap-1'>
                <Button size="sm" variant="primary" className="h-7 sm:h-8 sm:w-26" buttonType="button" onClick={fnKeyDown}>
                  <ArrowBigDownDash className='size-4 sm:size-5'/>
                  <span className='hidden sm:inline'>키 다운</span>
                </Button>
                <Button size="sm" variant="primary" className="h-7 sm:h-8 sm:w-23" buttonType="button" onClick={fnKeySet}>
                  <IterationCcw className='size-4 sm:size-5'/>
                  <span className='hidden sm:inline'>원키</span>
                </Button>
                <Button size="sm" variant="primary" className="h-7 sm:h-8 sm:w-23" buttonType="button" onClick={fnKeyUp}>
                  <ArrowBigUpDash className='size-4 sm:size-5'/>
                  <span className='hidden sm:inline'>키업</span>
                </Button>
              </div>
              <button
                className='z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1.5 transition-colors'
                onClick={() => setNotationModal(false)}
              >
                <X className='size-7' />
              </button>
            </div>
            <div ref={modalPaperRef} className='bg-white rounded-xl p-4' />
          </div>
        </div>
      )}

      {imgModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'
          onClick={() => setImgModal(false)}
        >
          <div className='relative' onClick={(e) => e.stopPropagation()}>
            <button
              className='absolute top-2 right-2 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-1.5 transition-colors'
              onClick={() => setImgModal(false)}
            >
              <X className='size-7' />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.img_url}
              alt={formData.title}
              style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AbcViewer;