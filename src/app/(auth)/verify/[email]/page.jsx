"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Loader2 } from "lucide-react";

export const Page = () => {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verifyCode`, {
        email: params.email,
        verifyCode: data.verifyCode,
      });
      if(!response.data.success){
        toast.error(response.data.message)
        setIsSubmitting(false);
        return;
      }
      toast("Successfuly Verified, Please login to your account");
      router.replace("/");
    } catch (error) {
      console.error("Error in verification of user", error);
      toast("Verification failed");
    }
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
      <div
        className="w-full h-full min-h-screen bg-cover bg-center flex items-center justify-center py-10"
      >
        <div className="w-full max-w-lg p-8 bg-white bg-opacity-95 rounded-xl shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-200">
              Ski↑↑<span className="text-blue-500">Pay</span>
            </h1>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-600">
              Verify Your Account
            </h1>
            <p className="text-lg text-gray-600 mt-4 mb-4">
              Enter the 6-digit verification code sent to your email
            </p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="flex space-x-4">
              <div className="border border-blue-600 rounded-full px-4 py-2 flex items-center space-x-2 bg-blue-600 text-white">
                <span className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                  2
                </span>
                <span>Verify Account</span>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="verifyCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="124533"
                        {...field}
                        value={field.value || ""}
                        className="border-2 text-gray-900 border-blue-300 focus:border-blue-500 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
