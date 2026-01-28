interface Benefit {
  text: string;
}

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  benefits: Benefit[];
  isPopular?: boolean;
  isPremium?: boolean;
}

export default function PricingCard({
  plan,
  price,
  period,
  benefits,
  isPopular = false,
  isPremium = false,
}: PricingCardProps) {
  return (
    <div className="relative h-[334px] w-full max-w-[520px]">
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute left-6 md:left-9 top-0 z-10 inline-flex h-[34px] w-[133px] items-center justify-center gap-2.5 overflow-hidden rounded-t-[10px] bg-[#131313] px-3 py-2">
          <div className="text-center font-jakarta text-sm font-normal leading-normal text-white">
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className={`absolute left-0 h-[300px] w-full overflow-hidden rounded-3xl ${
          isPopular ? "top-[34px]" : "top-0"
        }`}
        style={{ backgroundColor: "rgba(250, 240, 241, 0.60)" }}
      >
        {/* Plan Badge */}
        <div className="absolute left-6 top-6 inline-flex h-[34px] items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#FFE6A1] px-4 py-2">
          <div className={`font-jakarta text-sm leading-normal text-[#131313] ${isPremium ? 'font-medium' : 'font-normal'}`}>
            {plan}
          </div>
        </div>

        {/* Select Plan Button */}
        <button
          className={`absolute bottom-6 left-6 flex h-[52px] w-[174px] items-center justify-center gap-2.5 overflow-hidden rounded-[80px] px-8 py-4 transition-colors ${
            isPremium
              ? "bg-white hover:bg-gray-50"
              : "bg-[#131313] hover:bg-black"
          }`}
        >
          <div
            className={`font-jakarta text-base font-medium leading-normal ${
              isPremium ? "text-[#131313]" : "text-white"
            }`}
          >
            Select Plan
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6819 14.6663 7.99998C14.6663 4.31808 11.6816 1.33331 7.99967 1.33331C4.31778 1.33331 1.33301 4.31808 1.33301 7.99998C1.33301 11.6819 4.31778 14.6666 7.99967 14.6666Z"
              stroke={isPremium ? "#131313" : "white"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.66699 8H9.66699"
              stroke={isPremium ? "#131313" : "white"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.33301 10L10.333 8L8.33301 6"
              stroke={isPremium ? "#131313" : "white"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Benefits Label */}
        <div className="absolute left-[244px] top-6 h-[23px] w-[79px] text-center font-jakarta text-lg font-semibold leading-normal text-[#131313]">
          Benefits:
        </div>

        {/* Price */}
        <div className="absolute left-6 top-[83px] flex h-[99px] w-[154px] flex-col items-start gap-0.5">
          <div className="font-jakarta text-[64px] font-medium leading-[74px] text-[#131313]">
            {price}
          </div>
          <div
            className={`text-center font-jakarta text-lg font-normal leading-normal ${
              isPremium ? "w-[161px] text-[#131313]/60" : "w-[167px] text-[#5A5A59]"
            }`}
          >
            {period}
          </div>
        </div>

        {/* Benefits List */}
        <div className="absolute left-[244px] top-16 flex h-[190px] w-[252px] flex-col items-start gap-3.5">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 7.17237L8.0202 9.33335L12.6667 4.66669"
                  stroke="#131313"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C8.65479 2 9.28509 2.10489 9.875 2.29878"
                  stroke="#131313"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="font-jakarta text-base font-normal leading-normal text-[#131313]/60">
                {benefit.text}
              </div>
            </div>
          ))}
        </div>

        {/* Vertical divider */}
        <div
          className="absolute left-[222px] top-6 h-0 w-[252px]"
          style={{
            borderTop: "1px solid rgba(19, 19, 19, 0.10)",
          }}
        />
      </div>
    </div>
  );
}
