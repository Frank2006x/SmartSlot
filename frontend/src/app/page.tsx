import React from "react";

import Image from "next/image";


const main = () => {
  return (
    <>
    
    <div className=" bg-[#EEF3F7] text-[#2E2E2E] min-h-screen flex flex-col">
      <div className="w-full bg-[#F5F7F9] flex items-center justify-center gap-8 px-20 py-4 ">
        <p>
          If you have any questions or want to know more about our product,
          schedule a free call with us now!
        </p>
        <button className="bg-[#4FC08D] text-white hover:bg-[#3DAF7A] px-3 rounded-full">
          Book a Discovery Call
        </button>
      </div>

      <div className="w-full bg-white flex items-center justify-between px-28 py-1 h-23">
        <div className="flex items-center gap-2">
          <Image
              src="/lp_imgs/logo.png"
              alt="SmartSlot Logo"
              width={88}
              height={88}
              className="object-cover"
          />

          <span className="text-2xl font-bold font-serif text-[#2E2E2E]">
            SmartSlot
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[#2E2E2E] hover:text-[#4FC08D]">Home</button>
          <button className="text-[#2E2E2E] hover:text-[#4FC08D]">
            Features
          </button>
          <button className="text-[#2E2E2E] hover:text-[#4FC08D]">
            Pricing
          </button>
          <button className="text-[#2E2E2E] hover:text-[#4FC08D]">
            Contact
          </button>
          <button className="bg-[#4FC08D] text-white hover:bg-[#3DAF7A] px-4 py-1 rounded-full">
            Login
          </button>
        </div>
      </div>

      <div className="bg-[#EEF3F7] flex flex-col px-20 py-10 gap-10">
        <div className="flex">
          <div className="flex flex-col justify-center gap-4 pr-16 w-1/2">
            <h3 className="text-4xl font-bold mt-10 text-[#2E2E2E] text-left">
              Discover the easiest way to schedule appointments with the #1
              online booking system
            </h3>
            <p className="mt-4 text-lg text-[#2E2E2E] text-left">
              Save time spent on coordinating appointments over phone and email
              with an all-in-one appointment booking software. Accept online
              bookings 24x7, automate payments, business management, marketing,
              and more!
            </p>

            <button className="bg-[#4FC08D] text-white hover:bg-[#3DAF7A] px-12 py-4 rounded-full mt-4 text-xl ">
              Get Started Free!
            </button>
          </div>

          <div className="flex items-center justify-end w-1/2">
            <div className="relative w-full max-w-130 h-100">
              <Image
                src="/lp_imgs/sideimg1.png"
                alt="side1"
                fill
                className="object-contain"
              />
            </div>

            
          </div>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>

      <div className="flex flex-col item-start gap-8 bg-[#F5F7F9] w-full p-15">
        <h1 className="text-3xl font-bold text-[#2E2E2E] text-center self-center">
          Online appointment booking made simple with a 3-step <br />
          setup process
        </h1>
        <div className="flex flex-col">
          <div className="flex items-center gap-10">
            <div className="relative h-64 max-w-105 w-full">
              <Image
                src="/lp_imgs/sideimg2.png"
                alt="side2"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-[#4FC08D] h-8 w-8 text-center text-white font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <h2 className="text-xl text-[#2E2E2E] max-w-md text-left">
                  Set your availability. Booking rules <br />
                  make it simple and flexible
                </h2>
              </div>

              <p className="pl-11">
                Simply enter the available services and working <br></br>hours
                for you and your staff for your booking <br></br>page to be
                ready. Add buffers, block-times, or<br></br> irregular available
                hours to replicate your<br></br>
                real-life schedule. No double bookings!
              </p>
            </div>
          </div>

          <br></br>
          <br></br>
          <br></br>

          <div className="flex items-center gap-10 flex-row-reverse">
            <div className="relative h-64 max-w-105 w-full">
              <Image
                src="/lp_imgs/sideimage3.png"
                alt="side3"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-[#4FC08D] h-8 w-8 text-center text-white font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <h2 className="text-xl text-[#2E2E2E] max-w-md text-left">
                  Share your booking link with<br></br>your customers or embed
                  it
                </h2>
              </div>
              <p className="pl-11">
                Share your online appointment booking page<br></br> URL with
                your customers in emails, texts,<br></br> brochures, etc. Start
                accepting appointments<br></br> on your website by integrating
                Appointy’s<br></br> booking widget on it. Add ‘Book Now’
                <br></br> button on your Facebook, Instagram and
                <br></br> Google My Business pages
              </p>
            </div>
          </div>

          <br></br>
          <br></br>
          <br></br>

          <div className="flex items-center gap-10">
            <div className="relative h-64 max-w-105 w-full">
              <Image
                src="/lp_imgs/sideimg4.png"
                alt="side4"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-[#4FC08D] h-8 w-8 text-center text-white font-bold flex items-center justify-center mb-2">
                  3
                </div>
                <h2 className="text-xl text-[#2E2E2E] max-w-md text-left">
                  Accept online bookings hassle-free 24x7<br></br> (55% people
                  book outside business hours)!
                </h2>
              </div>

              <p className="pl-11">
                Give customers the convenience to self schedule,<br></br>{" "}
                cancel, reschedule and book recurring appointments<br></br>{" "}
                using Appointy’s 24×7 online booking software.<br></br> Send
                automated email and text reminders before<br></br> appointments
                and reduce no-shows
              </p>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <br></br>

      <div className="bg-[#EEF3F7] flex flex-col p-15">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-[#414A4D] text-center self-center">
            Appointy can serve almost any industry segment
          </h1>
          <p className="text-xl  text-[#707070] text-center self-center">
            Our appointment booking system is fit for all service-based local
            businesses, multi-location enterprises, franchises,<br></br> and
            more.
          </p>
        </div>

        <div className="flex flex-col gap-15 ">
          <div className="flex gap-19 items-center justify-center flex-wrap mt-10">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/salon.png"
                alt="Salon & Beauty"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">Salon & Beauty</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/barber.png"
                alt="Barber Shop"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">Barber Shop</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/spa.png"
                alt="Spa & Wellness"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">Spa & Wellness</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/fitness.png"
                alt="Fitness & Sports"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Fitness & Sports
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/healthcare.png"
                alt="Medical & Health"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">
                Medical & Health
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/lp_uses-icons/professional.png"
                alt="Professional Services"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Professional<br></br>Services
              </p>
            </div>
          </div>

          <div className="flex gap-19 items-center justify-center flex-wrap mt-10">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/retail.png"
                alt="Retail"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">Retail</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/automotive.png"
                alt="Automotive"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">Automotive</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/pet_service.png"
                alt="Pet Services"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">Pet Services</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/tutoring.png"
                alt="Tutoring & Education"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">
                Tutoring & Education
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/banking.png"
                alt="Banking & Finance"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Banking & Finance
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/real_estate.png"
                alt="Real Estate"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">Real Estate</p>
            </div>
          </div>

          <div className="flex gap-19 items-center justify-center flex-wrap mt-10">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/clinic.png"
                alt="Clinic & Hospitals"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Clinic & Hospitals
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/government.png"
                alt="Government & Public Services"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Government & <br></br>Public Services
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/home-services.png"
                alt="Home Services & Maintenance"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">
                Home Services & <br></br> Maintenance
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/business_opertions.png"
                alt="Business Operations"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">
                Business<br></br>Operations
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/education.png"
                alt="Education & Training"
                width={64}
                height={64}
                className="rounded-full"
              />

              <p className="text-lg font-medium text-center">
                Education & Training
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src="/lp_uses-icons/real_estate.png"
                alt="Real Estate"
                width={64}
                height={64}
                className="rounded-full"
              />
              <p className="text-lg font-medium text-center">Real Estate</p>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div className="bg-white flex flex-col p-15">
        <h1 className="text-3xl font-bold text-[#2E2E2E] text-center self-center">
          Flexible booking settings allow you to have complete<br></br> control
          over your schedule
        </h1>

        <br></br>
        <br></br>

        <div className="flex justify-center gap-16 flex-wrap mt-16">
          <div className="w-64 flex flex-col items-center text-center gap-3">
            <Image src="/lp_setting_icons/setting1.png" alt="Hour Settings" width={64} height={64} />
            <p className="text-lg font-medium">Business Hour Settings</p>
            <p className="text-sm text-[#707070]">
              You can control business hours at both the staff and service levels giving
              you the flexibility you need
            </p>
          </div>

          <div className="w-64 flex flex-col items-center text-center gap-3">
            <Image src="/lp_setting_icons/setting2.png" alt="Back to Back Bookings" width={64} height={64} />
            <p className="text-lg font-medium">Back to Back Bookings</p>
            <p className="text-sm text-[#707070]">
              Customers selecting multiple services will only be shown times where all
              chosen services can be availed together
            </p>
          </div>

          <div className="w-64 flex flex-col items-center text-center gap-3">
            <Image src="/lp_setting_icons/setting3.png" alt="Booking Restrictions" width={64} height={64} />
            <p className="text-lg font-medium">Booking Restrictions</p>
            <p className="text-sm text-[#707070]">
              Choose how much in advance members can book or cancel, limit bookings, and
              more
            </p>
          </div>

          <div className="w-64 flex flex-col items-center text-center gap-3">
            <Image src="/lp_setting_icons/setting4.png" alt="Group Scheduling" width={64} height={64} />
            <p className="text-lg font-medium">Group Scheduling</p>
            <p className="text-sm text-[#707070]">
              Allow customers to schedule and pay for appointments for a group in a
              single transaction
            </p>
          </div>
        </div>

        <br></br>
        <br></br>
      </div>

      <footer className="bg-[#EEF3F7] w-full mt-24">
        <div className="max-w-7xl mx-auto px-28 py-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-[#414A4D]">
            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4">
                PRODUCT
              </h3>
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
              <h3 className="text-sm font-semibold tracking-widest mb-4">
                FEATURES
              </h3>
              <ul className="space-y-2 text-sm">
                <li>Schedule online</li>
                <li>Increase productivity</li>
                <li>Attract customers</li>
                <li>Retain customers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4">
                SUPPORT
              </h3>
              <ul className="space-y-2 text-sm">
                <li>Help</li>
                <li>Screen sharing</li>
                <li>Affiliate Program</li>
              </ul>

              <h3 className="text-sm font-semibold tracking-widest mt-6 mb-3">
                CONNECT WITH US
              </h3>
              <div className="flex gap-4 text-xl">
                <span>
                  <Image
                    src="/lp_contact_icons/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />

                </span>
                <span>
                  <Image
                    src="/lp_contact_icons/twitter.png"
                    alt="Twitter"
                    width={24}
                    height={24}
                  />

                </span>
                <span>
                  <Image
                    src="/lp_contact_icons/linkedin.png"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />

                </span>
                <span>
                    <Image
                      src="/lp_contact_icons/instagram.png"
                      alt="Facebook"
                      width={24}
                      height={24}
                    />

                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-widest mb-4">
                CONTACT US
              </h3>
              <p className="text-sm font-semibold mb-2">
                SmartSlot Software Inc.
              </p>
              <p className="text-sm">
                VIT Chennai
                <br />
                Vandalur
                <br />
                Chennai
              </p>

              <p className="text-sm mt-3">contact@smartslot.com</p>

              <ul className="space-y-2 text-sm mt-4">
                <li>Privacy policy</li>
                <li>Terms of use</li>
                <li>GDPR</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default main;
