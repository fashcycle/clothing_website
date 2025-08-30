"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { contactUsApi } from "@/app/api/api";
import { useState } from "react";
import { toast } from "sonner";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  userType: yup.string().required("Please select a user type"),
  message: yup.string().required("Please enter your query"),
});

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await contactUsApi({
        userType: data?.userType,
        email: data?.email,
        message: data?.message,
      });
      if (response.success) {
        toast.success(response.message);
        reset();
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container w-fit md:min-w-[100vh]  mx-auto px-4 py-12 lg:pt-24">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0 md:flex">
          {/* Left: Form Section */}
          <div className="w-full md:w-1/2 px-6 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Are you a Renter or Lender?
                </label>
                <select
                  {...register("userType")}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select...</option>
                  <option value="Renter">Renter</option>
                  <option value="Lender">Lender</option>
                </select>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tell us about your query
                </label>
                <textarea
                  {...register("message")}
                  className="w-full border rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include as much detail as possible to help us respond faster.
                </p>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-green-700 w-full transition disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="bg-white text-primary-foreground w-full md:w-1/2 bg-green-500 flex items-center justify-center px-6 py-10 text-white text-center">
            <Card className="shadow-lg p-8 bg-primary text-primary-foreground w-[400px] min-h-[400px] flex flex-col justify-center">
              {" "}
              <h1 className="text-lg italic underline mb-4">Need Help?</h1>
              <p className="font-medium mb-4">We'd love to hear from you!</p>
              <div className="mb-4">
                <span className="font-medium">Whatsapp us:</span>{" "}
                <div className="flex flex-col gap-1">
                  {" "}
                  <a
                    href="https://wa.me/+918226026868"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    +91 8226026868
                  </a>
                  <a
                    href="https://wa.me/+918085676103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    +91 8085676103
                  </a>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-medium">Email us:</span>{" "}
                <a href="support@fashcycle.com" className="underline">
                  support@fashcycle.com
                </a>
              </div>
              <h2 className="text-lg italic font-semibold mt-6">
                Support that feels like a hug.
              </h2>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
