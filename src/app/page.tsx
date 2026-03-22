"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SwatchBook } from "lucide-react";
import { motion } from "framer-motion";

const easeStandard = [0.22, 1, 0.36, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeStandard },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Main = () => {
  return (
    <div className="bg-[#EEF3F7] text-[#2E2E2E] min-h-screen flex flex-col overflow-hidden">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: easeStandard }}
        className="w-full bg-white flex flex-wrap items-center justify-between px-6 md:px-12 lg:px-28 py-4 fixed z-10 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <SwatchBook className="w-10 h-10 md:w-16 md:h-16 text-[#4FC08D]" />
          <span className="text-xl md:text-2xl font-bold text-[#2E2E2E]">
            SmartSlot
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-0">
          <a
            className="text-sm md:text-base text-[#2E2E2E] hover:text-[#4FC08D] transition-colors"
            href="#home"
          >
            Home
          </a>
          <a
            className="text-sm md:text-base text-[#2E2E2E] hover:text-[#4FC08D] transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm md:text-base text-[#2E2E2E] hover:text-[#4FC08D] transition-colors"
            href="#contact"
          >
            Contact
          </a>

          <Link
            href="/login"
            className="bg-[#4FC08D] text-white hover:bg-[#3DAF7A] text-sm md:text-base px-4 md:px-6 py-1.5 md:py-2 rounded-full transition-colors"
          >
            Login
          </Link>
        </div>
      </motion.div>

      <motion.div
        id="home"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="bg-[#EEF3F7] flex flex-col px-6 md:px-12 lg:px-20 py-24 md:py-32 gap-10 mt-16 md:mt-20"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center">
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col justify-center gap-4 lg:pr-16 w-full lg:w-1/2 mt-10 lg:mt-0 text-center lg:text-left"
          >
            <h3 className="text-3xl lg:text-5xl font-bold leading-tight">
              Discover the easiest way to schedule appointments with the #1
              online booking system
            </h3>

            <p className="mt-4 text-base lg:text-lg text-gray-700">
              Save time spent on coordinating appointments over phone and email
              with an all-in-one appointment booking software. Accept online
              bookings 24x7, business management and more!
            </p>

            <Link
              href="/login"
              className="bg-[#4FC08D] text-white hover:bg-[#3DAF7A] px-8 lg:px-12 py-3 lg:py-4 rounded-full mt-6 text-lg lg:text-xl w-full lg:w-fit mx-auto lg:mx-0 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started Free!
            </Link>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: easeStandard },
              },
            }}
            className="flex items-center justify-center lg:justify-end w-full lg:w-1/2"
          >
            <div className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/3]">
              <Image
                src="/lp_imgs/sideimg1.png"
                alt="Hero"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="flex flex-col items-center gap-12 lg:gap-16 bg-[#F5F7F9] w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28"
      >
        <motion.h1
          variants={fadeUpVariants}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2E2E2E] text-center"
        >
          Online appointment booking made simple with a 3-step{" "}
          <br className="hidden md:block" />
          setup process
        </motion.h1>

        <div className="flex flex-col gap-16 lg:gap-24 w-full max-w-6xl">
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
          >
            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-[4/3] max-w-md mx-auto">
              <Image
                src="/lp_imgs/sideimg2.png"
                alt="side2"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4FC08D] min-w-8 h-8 w-8 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2E2E2E]">
                  Set your availability. Booking rules{" "}
                  <br className="hidden md:block" />
                  make it simple and flexible
                </h2>
              </div>

              <p className="pl-12 text-base md:text-lg text-gray-700">
                Simply enter the available services and working hours for you
                and your staff for your booking page to be ready. Add buffers,
                block-times, or irregular available hours to replicate your
                real-life schedule. No double bookings!
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16"
          >
            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-[4/3] max-w-md mx-auto">
              <Image
                src="/lp_imgs/sideimage3.png"
                alt="side3"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4FC08D] min-w-8 h-8 w-8 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2E2E2E]">
                  Share your booking link with your customers or embed it
                </h2>
              </div>
              <p className="pl-12 text-base md:text-lg text-gray-700">
                Share your online appointment booking page URL with your
                customers in emails, texts, brochures, etc. Start accepting
                appointments on your website by integrating Appointy’s booking
                widget on it. Add ‘Book Now’ button on your Facebook, Instagram
                and Google My Business pages
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
          >
            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-[4/3] max-w-md mx-auto">
              <Image
                src="/lp_imgs/sideimg4.png"
                alt="side4"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4FC08D] min-w-8 h-8 w-8 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2E2E2E]">
                  Accept online bookings hassle-free 24x7 (55% people book
                  outside business hours)!
                </h2>
              </div>

              <p className="pl-12 text-base md:text-lg text-gray-700">
                Give customers the convenience to self schedule, cancel,
                reschedule and book recurring appointments using Appointy’s 24×7
                online booking software.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <br></br>
      <br></br>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="bg-[#EEF3F7] flex flex-col px-6 md:px-12 lg:px-20 py-20 lg:py-28"
      >
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col gap-6 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#414A4D] text-center">
            Appointy can serve almost any industry segment
          </h1>
          <p className="text-lg md:text-xl text-[#707070] text-center">
            Our appointment booking system is fit for all service-based local
            businesses, multi-location enterprises, franchises, and more.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-16 max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/salon.png"
                alt="Salon & Beauty"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Salon & Beauty
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/barber.png"
                alt="Barber Shop"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Barber Shop
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/spa.png"
                alt="Spa & Wellness"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Spa & Wellness
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/fitness.png"
                alt="Fitness & Sports"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Fitness & Sports
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/healthcare.png"
                alt="Medical & Health"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Medical & Health
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/professional.png"
                alt="Professional Services"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Professional Services
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/retail.png"
                alt="Retail"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Retail
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/automotive.png"
                alt="Automotive"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Automotive
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/pet_service.png"
                alt="Pet Services"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Pet Services
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/tutoring.png"
                alt="Tutoring & Education"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Tutoring & Education
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/banking.png"
                alt="Banking & Finance"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Banking & Finance
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/real_estate.png"
                alt="Real Estate"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Real Estate
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/clinic.png"
                alt="Clinic & Hospitals"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Clinic & Hospitals
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/government.png"
                alt="Government & Public Services"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Government & Public Services
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/home-services.png"
                alt="Home Services & Maintenance"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Home Services & Maintenance
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/business_opertions.png"
                alt="Business Operations"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Business Operations
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/education.png"
                alt="Education & Training"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Education & Training
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/lp_uses-icons/real_estate.png"
                alt="Real Estate"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg font-medium text-center">
              Real Estate
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        id="pricing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="bg-white flex flex-col px-6 md:px-12 lg:px-20 py-20 lg:py-28 mt-16 lg:mt-24"
      >
        <motion.h1
          variants={fadeUpVariants}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2E2E2E] text-center max-w-4xl mx-auto"
        >
          Flexible booking settings allow you to have complete control over your
          schedule
        </motion.h1>

        <motion.div
          variants={fadeUpVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mt-16 max-w-7xl mx-auto"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="/lp_setting_icons/setting1.png"
                alt="Hour Settings"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg md:text-xl font-medium">
              Business Hour Settings
            </p>
            <p className="text-sm md:text-base text-[#707070]">
              You can control business hours at both the staff and service
              levels giving you the flexibility you need
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="/lp_setting_icons/setting2.png"
                alt="Back to Back Bookings"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg md:text-xl font-medium">
              Back to Back Bookings
            </p>
            <p className="text-sm md:text-base text-[#707070]">
              Customers selecting multiple services will only be shown times
              where all chosen services can be availed together
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="/lp_setting_icons/setting3.png"
                alt="Booking Restrictions"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg md:text-xl font-medium">
              Booking Restrictions
            </p>
            <p className="text-sm md:text-base text-[#707070]">
              Choose how much in advance members can book or cancel, limit
              bookings, and more
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="/lp_setting_icons/setting4.png"
                alt="Group Scheduling"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg md:text-xl font-medium">Group Scheduling</p>
            <p className="text-sm md:text-base text-[#707070]">
              Allow customers to schedule and pay for appointments for a group
              in a single transaction
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.footer
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="bg-[#EEF3F7] w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-[#414A4D]">
            <div>
              <h3 className="text-sm font-semibold mb-4">PRODUCT</h3>
              <ul className="space-y-2 text-sm">
                <li>Home</li>
                <li>Customers</li>
                <li>Contact us</li>
                <li>Blog</li>
                <li>Pricing</li>
                <li>Sign Up</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">FEATURES</h3>
              <ul className="space-y-2 text-sm">
                <li>Schedule online</li>
                <li>Increase productivity</li>
                <li>Attract customers</li>
                <li>Retain customers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm">
                <li>Help</li>
                <li>Screen sharing</li>
                <li>Affiliate Program</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">CONTACT US</h3>
              <p className="text-sm font-semibold">SmartSlot Software Inc.</p>
              <p className="text-sm mt-2">
                VIT Chennai
                <br />
                Vandalur
                <br />
                Chennai
              </p>
              <p className="text-sm mt-3">contact@smartslot.com</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Main;
