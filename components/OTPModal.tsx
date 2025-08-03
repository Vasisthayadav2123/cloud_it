'use client';



import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";

//  all the imports for the modal and otp input components

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { useState } from "react";
import Image from "next/image";
import { verifySecret , sendEmailOTP } from "@/lib/actions/users.action";
import { useRouter } from "next/navigation";


const OtpModal = ({accountId , email  } :{accountId: string , email : string} ) => {

    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

      //  handleing submit

    const handlesubmit = async ( e:  React.MouseEvent<HTMLButtonElement> ) => {
        e.preventDefault();
        setIsLoading(true);


        

        try{
        // Simulate an API call
        const sessionId = await verifySecret({accountId, password});
        if (sessionId)router.push('/');


        }catch (error) {
            console.error("Error submitting OTP:", error);
        }


        setIsLoading(false);
    };


    const handleResendOtp = async() => {
        // recall API to resend OTP
        await sendEmailOTP({email});
        
    }

    return <AlertDialog open ={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader className="relative flex justify-center">
                <AlertDialogTitle className="h2 text-center">
                    Enter Your Otp
                    <Image src ="/assets/icons/close-dark.svg" 
                    alt ="close icon"
                    width={20} height={20} 
                    onClick = {() => setIsOpen(false)} className="otp-close-button" 
                    />
                    
                    </AlertDialogTitle>
                    <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                    Please enter the OTP sent to <span className=" pl-1 text-brand">{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <InputOTP maxLength={6} value={password} onChange = {setPassword}>
                <InputOTPGroup className="shad-otp">
                    <InputOTPSlot index={0} className="shad-otp-slot"/>
                    <InputOTPSlot index={1} className="shad-otp-slot"/>
                    <InputOTPSlot index={2} className="shad-otp-slot"/>          
                    <InputOTPSlot index={3} className="shad-otp-slot"/>
                    <InputOTPSlot index={4} className="shad-otp-slot"/>
                    <InputOTPSlot index={5} className="shad-otp-slot"/>
                </InputOTPGroup>
                </InputOTP>

            <AlertDialogFooter>
                <div className="flex w-full flex-col gap-4">
                    <AlertDialogCancel onClick={handlesubmit} className="shad-submit-btn h-12" type="button" >Submit
                        {isLoading &&<Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />}
                    </AlertDialogCancel>

                <div className="subtitle-2 mt-2 text-center text-light-100">
                    didn&apos;t receive the OTP?
                    <Button type="button" variant="link" className="pl-1 text-brand-100" onClick={handleResendOtp}>
                     click to resend </Button>
                </div>

                </div>

        </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>
};

export default OtpModal;
