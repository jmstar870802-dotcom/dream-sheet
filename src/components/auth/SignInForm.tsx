"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";


export default function SignInForm() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  const errorModal = useModal();

  const formSchema = z.object({
    userName: z.string().min(1, "이름을 입력하세요."),
    birthday: z.string().regex(/^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/, {message: "생년월일 형식이 올바르지 않습니다.",}),
  });
  
  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // 유효성 검사 실패 시 실행될 함수 (선택 사항)
  const onInvalid = (errors: any) => {
    errorModal.openModal();
    setLoginError(errors.birthday.message);
  };

  const onLogin = async (data: FormValues) => { 

      const userName = data.userName;
      const birthday = data.birthday;

      const result = await signIn("credentials", 
             { userName: userName, birthday : birthday, redirect: false}
      )
      if (result?.error) {
          errorModal.openModal();

          if(result.status == 401){
              setLoginError(result.status +" : " + result.error);
          }else{
              setLoginError(result.status +" : 에러가 발생했습니다.");
          }
      } else {
        router.push("/");
        router.refresh(); // 세션 상태를 최신화하기 위해 권장
      }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
       
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="relative items-center justify-center flex z-1">
                <div className="block lg:hidden">
                  <Image
                      width={180}
                      height={60}
                      src="/images/logo/mokpo_dream.png"
                      alt="Logo"
                    />
                </div>
            </div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              로그인
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               성명과 생년월일을 입력하세요.
            </p>
          </div>
          <div>
            
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    성명 <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input {...register("userName")} placeholder="정확한 성명을 입력하세요." type="text" />
                </div>
                <div>
                  <Label>
                    생년월일 <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input  {...register("birthday")}
                      type={showPassword ? "text" : "password"}
                      placeholder="예시)870802"
                    
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon />
                      ) : (
                        <EyeCloseIcon/>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                     로그인 유지
                    </span>
                  </div>
                 
                </div>
                <div>
                  <Button className="w-full" size="sm" buttonType="button" onClick={handleSubmit(onLogin, onInvalid)}>
                      로그인
                  </Button>
                </div>
              </div>
            </form>

            {/* Error Modal */}
            <Modal
              isOpen={errorModal.isOpen}
              onClose={errorModal.closeModal}
              className="sm:max-w-[600px] max-w-[430px] p-5 lg:p-5"
            >
              <div className="text-center">
                <div className="relative flex items-center justify-center z-1 mb-7">
                  <svg
                    className="fill-error-50 dark:fill-error-500/15"
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                      fill=""
                      fillOpacity=""
                    />
                  </svg>

                  <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <svg
                      className="fill-error-600 dark:fill-error-500"
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>

                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                   시스템 접속 오류
                </h4>
                <p className="text-lg leading-6 text-gray-500 dark:text-gray-400">
                    {loginError}
                </p>

                <div className="flex items-center justify-center w-full gap-3 mt-7">
                  <button
                    type="button"
                    className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
                    onClick={() => errorModal.closeModal()}
                  >
                    확인
                  </button>
                </div>
              </div>
            </Modal>       

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
