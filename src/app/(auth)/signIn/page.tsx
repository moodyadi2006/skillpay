"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      if (session.user?.role === "freelancer") {
        toast.success("Taking you to Freelancer dashboard");
        router.replace("/freelancer");
      } else if (session.user?.role === "employer") {
        toast.success("Taking you to Employer dashboard");
        router.replace("/employer");
      }
    }
  }, [session, router]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        setIsSubmitting(false);
        toast.error(result.error || "Incorrect username or password");
      }
    } catch (error) {
      console.error("Error in sign in of user", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
      <div className="w-full h-full bg-cover bg-center flex items-center justify-center">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white bg-opacity-95 rounded-xl shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-200">
              Ski↑↑<span className="text-blue-500">Pay</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Login to continue connecting with top talent and projects
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="border-2 border-blue-300 focus:border-blue-500 rounded-md text-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        className="border-2 border-blue-300 focus:border-blue-500 rounded-md text-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "LOG IN"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p className="text-gray-600">Don&apos;t have an account?</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link
                href="/signUpFreelancer"
                className="text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 rounded-lg px-4 py-2 transition-colors"
              >
                Sign Up as Freelancer
              </Link>
              <Link
                href="/signUpEmployer"
                className="text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 rounded-lg px-4 py-2 transition-colors"
              >
                Sign Up as Employer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
